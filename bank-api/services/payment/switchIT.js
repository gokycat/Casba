'use strict';

const util = require('../util')
const request = require('request');
const convert = require('xml-js');
require('dotenv').config({
  silent: true
});

var authKey = process.env.BVN_AUTHKEY

const terminalId = process.env.SWITCHIT_TERMINALID;
const pin = process.env.SWITCHIT_PIN;

const switchIT = {
  balanceEnquiry: function (data, callback) {
    let switchITResponse = []
    var reference = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    console.log(reference)
    let xml =
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.fundgate.etranzact.com/">
       <soapenv:Header/>
       <soapenv:Body>
          <ws:process>
             <request>
                <!--Optional:-->
                <direction>request</direction>
                <action>BE</action>
                <id>?</id>
                <!--Optional:-->
                <terminalId>` + terminalId + `</terminalId>
                <!--Optional:-->
                <terminalCard>?</terminalCard>
                <transaction>
                   <pin>` + pin + `</pin>
                   <reference>` + reference + `</reference>
                </transaction>
             </request>
          </ws:process>
       </soapenv:Body>
    </soapenv:Envelope>`

    var options = {
      url: 'https://www.etranzact.net/FGate/ws?wsdl',
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type':'text/xml;charset=utf-8',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length':xml.length,
        'SOAPAction':""
      }
    };

    request(options, function(error, response, body){
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['error']['_text']
        if (result == "0"){
          switchITResponse[0] = result
          switchITResponse[1] = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['message']['_text']
          callback(null, switchITResponse);
        } else {
          switchITResponse[0] = 'error'
          switchITResponse = util.getSwitchitStatus(result)
          callback(null, switchITResponse);
        }
      } else {
        switchITResponse[0] = 'error'
        switchITResponse = util.getSwitchitStatus(response.statusCode)
        callback(null, switchITResponse);
      }
    });
  },

  fundTransfer: function (data, callback) {
    let switchITResponse = []
    var reference = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    var currency = "NGN"
    let xml =
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.fundgate.etranzact.com/">
       <soapenv:Header/>
       <soapenv:Body>
          <ws:process>
             <request>
                <!--Optional:-->
                <direction>request</direction>
                <action>FT</action>
                <!--Optional:-->
                <terminalId>` + terminalId + `</terminalId>
                <transaction>
                   <pin>` + pin + `</pin>
                   <bankCode>` + util.getBankCode2(data.bankName) + `</bankCode>
                   <currency>` + currency + `</currency>
                   <amount>` + data.amount + `</amount>
                   <destination>` + util.pad_with_zeroes(data.destination, 10) + `</destination>
                   <reference>` + reference +`</reference>
                   <endPoint>A</endPoint>
                </transaction>
             </request>
          </ws:process>
       </soapenv:Body>
    </soapenv:Envelope>`

    var options = {
      url: 'https://www.etranzact.net/FGate/ws?wsdl',
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type':'text/xml;charset=utf-8',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length':xml.length,
        'SOAPAction':""
      }
    };

    request(options, function(error, response, body){
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['error']['_text']
        if (result == "0"){
          switchITResponse[0] = result
          switchITResponse[1] = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['message']['_text']
          switchITResponse[2] = reference
          callback(null, switchITResponse);
        } else {
          switchITResponse[0] = 'error'
          switchITResponse[1] = util.getSwitchitStatus(result)
          callback(null, switchITResponse);
        }
      } else {
        switchITResponse[0] = 'error'
        switchITResponse[1] = util.getSwitchitStatus(response.statusCode)
        callback(null, switchITResponse);
      }
    });
  },

  airtimeTopup: function(data, callback) {
    let switchITResponse = []
    var reference = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    console.log(reference)
    let xml =
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.fundgate.etranzact.com/">
       <soapenv:Header/>
       <soapenv:Body>
          <ws:process>
             <request>
                <!--Optional:-->
                <direction>request</direction>
                <action>VT</action>
                <!--Optional:-->
                <terminalId>` + terminalId + `</terminalId>
                <transaction>
                   <pin>` + pin + `</pin>
                   <provider>` + data.telcoName + `</provider>
                   <lineType>VTU</lineType>
                   <amount>` + data.amount + `</amount>
                   <destination>` + util.pad_with_zeroes(data.destination, 11) + `</destination>
                   <reference>` + reference +`</reference>
                   <senderName>` + data.senderName + `</senderName>
                   <address>Victoria Island, Lagos</address>
                   <endPoint>0</endPoint>
                   <terminalCard>false</terminalCard>
                </transaction>
             </request>
          </ws:process>
       </soapenv:Body>
    </soapenv:Envelope>`

    var options = {
      url: 'https://www.etranzact.net/FGate/ws?wsdl',
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type':'text/xml;charset=utf-8',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length':xml.length,
        'SOAPAction':""
      }
    };

    request(options, function(error, response, body){
      if (!error && response.statusCode == 200) {
        console.log('Raw result', body);
        // parser.parseString(body, (err, result) => {
        //   console.log('JSON result', result);
        // });
        var result = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['error']['_text']
        if (result == "0"){
          switchITResponse[0] = result
          switchITResponse[1] = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['message']['_text']
          switchITResponse[2] = reference
          callback(null, switchITResponse);
        } else {
          switchITResponse[0] = 'error'
          switchITResponse[1] = util.getSwitchitStatus(result)
          callback(null, switchITResponse);
        }
      } else {
        switchITResponse[0] = 'error'
        switchITResponse[1] = util.getSwitchitStatus(response.statusCode)
        callback(null, switchITResponse);
      }
    });
  },

  billPayment: function(data, callback) {
    let switchITResponse = []
    var reference = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    console.log(reference)
    let xml =
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.fundgate.etranzact.com/">
       <soapenv:Header/>
       <soapenv:Body>
          <ws:process>
             <request>
                <!--Optional:-->
                <direction>request</direction>
                <action>PB</action>
                <!--Optional:-->
                <terminalId>` + terminalId + `</terminalId>
                <transaction>
                   <id>2</id>
                   <pin>` + pin + `</pin>
                   <lineType>` + data.billerName + `</lineType>
                   <amount>` + data.amount + `</amount>
                   <destination>` + data.destination + `</destination>
                   <reference>` + reference +`</reference>
                   <senderName>` + data.senderName + `</senderName>
                   <address>Victoria Island, Lagos</address>
                   <endPoint>0</endPoint>
                   <terminalCard>false</terminalCard>
                </transaction>
             </request>
          </ws:process>
       </soapenv:Body>
    </soapenv:Envelope>`

    var options = {
      url: 'https://www.etranzact.net/FGate/ws?wsdl',
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type':'text/xml;charset=utf-8',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length':xml.length,
        'SOAPAction':""
      }
    };

    request(options, function(error, response, body){
      if (!error && response.statusCode == 200) {
        console.log('Raw result', body);
        // parser.parseString(body, (err, result) => {
        //   console.log('JSON result', result);
        // });
        var result = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['error']['_text']
        if (result == "0"){
          switchITResponse[0] = result
          switchITResponse[1] = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['message']['_text']
          switchITResponse[2] = reference
          callback(null, switchITResponse);
        } else {
          switchITResponse[0] = 'error'
          switchITResponse[1] = util.getSwitchitStatus(result)
          callback(null, switchITResponse);
        }
      } else {
        switchITResponse[0] = 'error'
        switchITResponse[1] = util.getSwitchitStatus(response.statusCode)
        callback(null, switchITResponse);
      }
    });
  }

}

module.exports = switchIT;
