import datetime
from collections import OrderedDict
from hashlib import md5

import pytz
from flask import current_app
from sqlalchemy import or_
from werkzeug.security import generate_password_hash, check_password_hash

from flask_login import UserMixin

from itsdangerous import URLSafeTimedSerializer, \
    TimedJSONWebSignatureSerializer
    
try:
    from urlparse import urljoin
except ImportError:
    from urllib.parse import urljoin


from flask import request


def safe_next_url(target):
    """
    Ensure a relative URL path is on the same domain as this host.
    This protects against the 'Open redirect vulnerability'.

    :param target: Relative url (typically supplied by Flask-Login)
    :type target: str
    :return: str
    """
    return urljoin(request.host_url, target)


def encrypt_password(cls, plaintext_password):
    """
    Hash a plaintext string using PBKDF2. This is good enough according
    to the NIST (National Institute of Standards and Technology).

    In other words while bcrypt might be superior in practice, if you use
    PBKDF2 properly (which we are), then your passwords are safe.

    :param plaintext_password: Password in plain text
    :type plaintext_password: str
    :return: str
    """
    if plaintext_password:
        return generate_password_hash(plaintext_password)

    return None

def deserialize_token(cls, token):
    """
    Obtain a user from de-serializing a signed token.

    :param token: Signed token.
    :type token: str
    :return: User instance or None
    """
    private_key = TimedJSONWebSignatureSerializer(
        current_app.config['SECRET_KEY'])
    try:
        decoded_payload = private_key.loads(token)

        return User.find_by_identity(decoded_payload.get('user_email'))
    except Exception:
        return None

def initialize_password_reset(cls, identity):
    """
    Generate a token to reset the password for a specific user.

    :param identity: User e-mail address or username
    :type identity: str
    :return: User instance
    """
    u = User.find_by_identity(identity)
    reset_token = u.serialize_token()

    # This prevents circular imports.
    from quest.blueprints.user.tasks import (
        deliver_password_reset_email)
    deliver_password_reset_email.delay(u.id, reset_token)

    return u

def search(cls, query):
    """
    Search a resource by 1 or more fields.

    :param query: Search query
    :type query: str
    :return: SQLAlchemy filter
    """
    if not query:
        return ''

    search_query = '%{0}%'.format(query)
    search_chain = (User.email.ilike(search_query),
                    User.username.ilike(search_query))

    return or_(*search_chain)


def is_active(self):
    """
    Return whether or not the user account is active, this satisfies
    Flask-Login by overwriting the default value.

    :return: bool
    """
    return self.active

def get_auth_token(self):
    """
    Return the user's auth token. Use their password as part of the token
    because if the user changes their password we will want to invalidate
    all of their logins across devices. It is completely fine to use
    md5 here as nothing leaks.

    This satisfies Flask-Login by providing a means to create a token.

    :return: str
    """
    private_key = current_app.config['SECRET_KEY']

    serializer = URLSafeTimedSerializer(private_key)
    data = [str(self.id), md5(self.password.encode('utf-8')).hexdigest()]

    return serializer.dumps(data)

def authenticated(self, with_password=True, password=''):
    """
    Ensure a user is authenticated, and optionally check their password.

    :param with_password: Optionally check their password
    :type with_password: bool
    :param password: Optionally verify this as their password
    :type password: str
    :return: bool
    """
    if with_password:
        return check_password_hash(self.password, password)

    return True

def serialize_token(self, expiration=3600):
    """
    Sign and create a token that can be used for things such as resetting
    a password or other tasks that involve a one off token.

    :param expiration: Seconds until it expires, defaults to 1 hour
    :type expiration: int
    :return: JSON
    """
    private_key = current_app.config['SECRET_KEY']

    serializer = TimedJSONWebSignatureSerializer(private_key, expiration)
    return serializer.dumps({'user_email': self.email}).decode('utf-8')
