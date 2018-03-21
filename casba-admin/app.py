# Copyright 2015 Josla Ltd. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
from flask import Flask, flash, render_template, url_for, request, redirect, session
import ibm_db
import datetime
from flask_mail import Mail, Message
from flask_bootstrap import Bootstrap
from flask_login import login_required, current_user, LoginManager
import json
import pandas
import numpy as np
import ibm_db_dbi
from balance_enquiry import *
from random import randint

app = Flask(__name__)
app.config.from_object(__name__)
app.config['SECRET_KEY'] = 'hippogriffs'

# Mail setup
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'casba@josla.com.ng'
app.config['MAIL_PASSWORD'] = 'casba-dinosaurs'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)
bootstrap = Bootstrap(app)
login_manager = LoginManager(app)

# DashDB
#Enter the values for you database connection
dsn_driver = "IBM DB2 ODBC DRIVER"
dsn_database = "BLUDB"
dsn_hostname = "dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net"
dsn_port = "50000"
dsn_protocol = "TCPIP"
dsn_uid = "dash12913"
dsn_pwd = "cLrD_b4D7c_E"


dsn = (
    "DRIVER={{IBM DB2 ODBC DRIVER}};"
    "DATABASE={0};"
    "HOSTNAME={1};"
    "PORT={2};"
    "PROTOCOL=TCPIP;"
    "UID={3};"
    "PWD={4};").format(dsn_database, dsn_hostname, dsn_port, dsn_uid, dsn_pwd)

conn = ibm_db.connect(dsn, "", "")
pconn = ibm_db_dbi.Connection(conn)


# Data Models
def random_with_N_digits(n):
    range_start = 10**(n-1)
    range_end = (10 ** n) - 1
    return randint(range_start, range_end)

def getUsers():
    sql = "".join("SELECT * FROM USERS ORDER BY BVN")
    stmt = ibm_db.exec_immediate(conn, sql)
    userDF = pandas.read_sql(sql, pconn)
    sql = "".join("SELECT * FROM STATUS")
    stmt = ibm_db.exec_immediate(conn, sql)
    statusDF = pandas.read_sql(sql, pconn)
    userDF = pandas.merge(userDF, statusDF, on='STATUS_ID', how='left')

    # Summary
    summary = {}
    summary['count'] = len(userDF.index)
    summary['success'] = userDF['CATEGORY'].value_counts()[0]
    summary['failure'] = summary['count'] - summary['success']
    return userDF.to_json(orient='split'), summary

def getAccounts():
    sql = "".join("SELECT * FROM ACCOUNTS ORDER BY BVN")
    stmt = ibm_db.exec_immediate(conn, sql)
    accountsDF = pandas.read_sql(sql, pconn)
    sql = "".join("SELECT * FROM BANKS")
    stmt = ibm_db.exec_immediate(conn, sql)
    bankDF = pandas.read_sql(sql, pconn)
    accountsDF = pandas.merge(accountsDF, bankDF, on='BANK_ID', how='left')
    sql = "".join("SELECT * FROM ACCOUNT_TYPE")
    stmt = ibm_db.exec_immediate(conn, sql)
    typeDF = pandas.read_sql(sql, pconn)
    accountsDF = pandas.merge(accountsDF, typeDF, on='TYPE_ID', how='left')

    sql = "".join("SELECT * FROM CARDS ORDER BY BVN")
    stmt = ibm_db.exec_immediate(conn, sql)
    cardsDF = pandas.read_sql(sql, pconn)
    sql = "".join("SELECT * FROM ISSUERS")
    stmt = ibm_db.exec_immediate(conn, sql)
    issuerDF = pandas.read_sql(sql, pconn)
    cardsDF = pandas.merge(cardsDF, issuerDF, on='ISSUER_ID', how='left')
    stmt = ibm_db.exec_immediate(conn, sql)
    typeDF = pandas.read_sql(sql, pconn)
    cardsDF = pandas.merge(cardsDF, typeDF, on='TYPE_ID', how='left')

    accountsDF = pandas.merge(accountsDF, cardsDF, on='ACCOUNT_NO', how='left')

    # Summary
    summary = {}
    summary['count'] = len(accountsDF.index)
    summary['success'] = accountsDF['CATEGORY'].value_counts()[0]
    summary['failure'] = summary['count'] - summary['success']
    return accountsDF.to_json(orient='split'), summary

def getTransactions():
    # fund transfer
    sql = "".join("SELECT * FROM FUND_TRANSFER ORDER BY BVN")
    stmt = ibm_db.exec_immediate(conn, sql)
    fundTransferDF = pandas.read_sql(sql, pconn)
    # sql = sql = "".join("SELECT * FROM BENEFICIARIES")
    # stmt = ibm_db.exec_immediate(conn, sql)
    # beneficiariesDF = pandas.read_sql(sql, pconn)
    # fundTransferDF = pandas.merge(fundTransferDF, beneficiariesDF, on='ACCOUNT_NO', how='left')
    fundTransferDF['TYPE'] = 'transfer'

    # airtime topup
    sql = "".join("SELECT * FROM AIRTIME_TOPUP ORDER BY BVN")
    stmt = ibm_db.exec_immediate(conn, sql)
    airtimeTopupDF = pandas.read_sql(sql, pconn)
    sql = "".join("SELECT * FROM TELCOS")
    stmt = ibm_db.exec_immediate(conn, sql)
    telcosDF = pandas.read_sql(sql, pconn)
    airtimeTopupDF = pandas.merge(airtimeTopupDF, telcosDF, on='TELCO_NAME', how='left')
    airtimeTopupDF['TYPE'] = 'topup'

    # bill payment
    sql = "".join("SELECT * FROM BILL_PAYMENT ORDER BY BVN")
    stmt = ibm_db.exec_immediate(conn, sql)
    billPaymentDF = pandas.read_sql(sql, pconn)
    sql = "".join("SELECT * FROM BILLERS")
    stmt = ibm_db.exec_immediate(conn, sql)
    billersDF = pandas.read_sql(sql, pconn)
    billPaymentDF = pandas.merge(billPaymentDF, billersDF, on='BILLER_NAME', how='left')
    sql = "".join("SELECT * FROM DSTV_PACKAGES")
    stmt = ibm_db.exec_immediate(conn, sql)
    packagesDF = pandas.read_sql(sql, pconn)
    billPaymentDF = pandas.merge(billPaymentDF, packagesDF, on='PACKAGE_NAME', how='left')
    sql = "".join("SELECT * FROM SMILE_PACKAGES")
    stmt = ibm_db.exec_immediate(conn, sql)
    packagesDF = pandas.read_sql(sql, pconn)
    billPaymentDF = pandas.merge(billPaymentDF, packagesDF, on='PACKAGE_NAME', how='left')
    billPaymentDF['TYPE'] = 'payment'


    # full join transfer and topup
    transactionsDF = pandas.merge(fundTransferDF, airtimeTopupDF, on=['ID', 'TOC', 'SESSION', 'REFERENCE', 'ESACODE', 'AMOUNT', 'BVN', 'ACCOUNT_NO', 'BANKIT', 'SWITCHIT', 'STATUS', 'TYPE', 'PASSCODE'], how='outer')
    # full join transaction and payment
    transactionsDF = pandas.merge(transactionsDF, billPaymentDF, on=['ID', 'TOC', 'SESSION', 'REFERENCE', 'ESACODE', 'AMOUNT', 'BVN', 'ACCOUNT_NO', 'BANKIT', 'SWITCHIT', 'STATUS', 'TYPE', 'PASSCODE'], how='outer')
    transactionsDF['STATUS'] = np.where(((transactionsDF['BANKIT']=='0') | (transactionsDF['BANKIT']=='Z')) & ((transactionsDF['SWITCHIT']=='0') | (transactionsDF['SWITCHIT']=='200')), '1', '0')

    # Summary
    summary = {}
    summary['count'] = len(transactionsDF.index)
    summary['success'] = transactionsDF['STATUS'].value_counts()[0]
    summary['failure'] = summary['count'] - summary['success']
    return transactionsDF.to_json(orient='split'), summary

# Views  -----------------------------------------------------------------------
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', error=str(e)), 404

@app.errorhandler(400)
def page_not_found(e):
    return render_template('400.html', error=str(e)), 400

@app.errorhandler(500)
def page_not_found(e):
    return render_template('500.html', error=str(e)), 500

@app.errorhandler(403)
def page_not_found(e):
    return render_template('403.html', error=str(e)), 403

@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == "POST":
        if 'email' in request.form:
            sql = "SELECT * FROM ADMIN WHERE EMAIL = ?"
            stmt = ibm_db.prepare(conn, sql)
            param = request.form["email"],
            ibm_db.execute(stmt, param)
            # Check if customer does not exist
            if ibm_db.fetch_row(stmt) != False:
                if request.form["password"] == ibm_db.result(stmt, "PASSWORD"):
                    session['logged_in'] = True
                    # Email notification for new user pre-registration
                    msg = Message('CASBA: ADMIN', sender = 'casba@josla.com.ng', recipients = ['ksquare267@gmail.com'])
                    msg.body = render_template("signup.html")
                    msg.html = render_template("signup.html")
                    msg.txt = 'ADMIN LOGGED IN'
                    mail.send(msg)
                    flash('You were successfully Loggedin!')
                    return redirect(url_for('dashboard'))
                else:
                    flash('Invalid Login Credentials!')
                    return redirect(url_for('index'))
            else:
                flash('Invalid Login Credentials!')
                return redirect(url_for('index'))
    else:
        return render_template('index.html')

# Log out control  -----------------------------------------------------------------------
@app.route("/logout")
def logout():
    session['logged_in'] = False
    return render_template('index.html')

# Dashboard -----------------------------------------------------------------------
@app.route("/dashboard", methods=['GET', 'POST'])
def dashboard():
    # check if user is logged in
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        reference = str(random_with_N_digits(16))
        return render_template('dashboard.html', balance=getBalance(reference), transactions=getTransactions()[1], users=getUsers()[1])

# Users -----------------------------------------------------------------------
@app.route('/users', defaults={'page': 1})
@app.route('/users/page/<int:page>')
def users(page):
    # check if user is logged in
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        reference = str(random_with_N_digits(16))
        return render_template('users.html', balance=getBalance(reference), transactions=getTransactions()[1],  usersData=getUsers()[0], usersSummary=getUsers()[1])

@app.route('/user/<int:id>')
def user(id):
    # check if user is logged in
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        sql = "".join(["SELECT * FROM USERS WHERE BVN = ", str(id)])
        stmt = ibm_db.exec_immediate(conn, sql)
        userDF = pandas.read_sql(sql, pconn)
        # Check if customer does not exist
        if userDF.empty:
            return render_template('404.html')
        else:
            userDF = userDF.to_json(orient='records')
            print userDF
            return render_template('user.html', user=userDF)

# Transactions -----------------------------------------------------------------------
@app.route('/transactions', defaults={'page': 1})
@app.route('/transactions/page/<int:page>')
def transactions(page):
    # check if user is logged in
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        reference = str(random_with_N_digits(16))
        return render_template('transactions.html', balance=getBalance(reference), transactions=getTransactions()[1], transactionsData=getTransactions()[0], transactionsSummary=getTransactions()[1])

@app.route('/transaction/<int:id>')
def transaction(id):
    # check if user is logged in
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        sql = "".join(["SELECT * FROM TRANSACTION WHERE ID = ", str(id)])
        stmt = ibm_db.exec_immediate(conn, sql)
        transactionDF = pandas.read_sql(sql, pconn)
        # Check if customer does not exist
        if transactionDF.empty:
            return render_template('404.html')
        else:
            transactionDF = transactionDF.to_json(orient='records')
            return render_template('transaction.html', user=userDF)

# Conversations -----------------------------------------------------------------------
@app.route("/conversations", methods=['GET', 'POST'])
def conversations():
    # check if user is logged in
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        return render_template('conversations.html')


port = os.getenv('PORT', '5000')
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(port), debug=True)
