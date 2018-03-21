import sys
import os
import time
import hashlib
import requests
import json
from random import randint
from suds.sudsobject import asdict
from suds.client import Client
import xmltodict



def recursive_dict(d):
    out = {}
    for k, v in asdict(d).iteritems():
        if hasattr(v, '__keylist__'):
            out[k] = recursive_dict(v)
        elif isinstance(v, list):
            out[k] = []
            for item in v:
                if hasattr(item, '__keylist__'):
                    out[k].append(recursive_dict(item))
                else:
                    out[k].append(item)
        else:
            out[k] = v
    return out



def random_with_N_digits(n):
    range_start = 10**(n-1)
    range_end = (10 ** n) - 1
    return randint(range_start, range_end)

# url = 'file:/Users/kennethodumah/Documents/Project/casba-web/test/doc-4.wsdl'

# file = os.path.abspath("doc.wsdl")
# print file
# path = ("file:", "")
url = 'https://www.etranzact.net/FGate/ws?wsdl'




# It doesn't work with Python 3! Read on for the solution!
def convert(xml_file, xml_attribs=True):
    with open(xml_file) as f:
        d = xmltodict.parse(f, xml_attribs=xml_attribs)
        return d
