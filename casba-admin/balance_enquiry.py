#!/usr/bin/env python2
# -*- coding: utf-8 -*-
import requests
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

terminalid = "7017010004"
pin = "lHm5HGfHwfeawMayR6DIoQ=="


def getBalance(reference):
    xml = """<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.fundgate.etranzact.com/">
       <soapenv:Header/>
       <soapenv:Body>
          <ws:process>
             <request>
                <!--Optional:-->
                <direction>request</direction>
                <action>BE</action>
                <id>?</id>
                <!--Optional:-->
                <terminalId>""" + terminalid + """</terminalId>
                <!--Optional:-->
                <terminalCard>?</terminalCard>
                <transaction>
                   <pin>""" + pin + """</pin>
                   <reference>""" + reference + """</reference>
                </transaction>
             </request>
          </ws:process>
       </soapenv:Body>
    </soapenv:Envelope>"""

    headers = {
      'Content-Type':'text/xml;charset=utf-8',
      'Accept-Encoding': 'gzip,deflate',
      'SOAPAction':""
    } # set what your server accepts

    response = requests.post('https://www.etranzact.net/FGate/ws?wsdl', data=xml, headers=headers).text
    response = xmltodict.parse(response)["S:Envelope"]['S:Body']['ns2:processResponse']['response']['message']
    return float(response)
