'use strict';

const request = require('request');
var querystring = require('querystring');
var md5 = require('md5');

var terminalid = "0000000001"
var responseurl = "http://casba.com.ng"
var transactionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
var amount = "100"
var description = "Test Payment"
var email = "akinlabiajelabi@me.com"
var currency = "NGN"
var firstname = "Akinlabi"
var lastname = "Ajelabi"
var phone = "08083718137"
var echodata = "<customerinfo><firstname>" + firstname + "</firstname><lastname>" + lastname + "</lastname><phoneno>" + phone + "</phoneno><email>" + email + "</email><address></address><city></city><state></state><zipcode></zipcode><postalcode></postcode><country></country><otherdetails></otherdetails></customerinfo>"
console.log(echodata)
var secretkey = "DEMO_KEY"
var checksum = md5(amount+terminalid+transactionid+responseurl+secretkey)
console.log(checksum)

var form = {
  TERMINAL_ID: terminalid,
  RESPONSE_URL: responseurl,
  TRANSACTION_ID: transactionid,
  AMOUNT: amount,
  DESCRIPTION: description,
  EMAIL: email,
  CURRENCY_CODE: currency,
  ECHODATA: echodata,
  CARD_TYPE: 0,
  LOGO_URL: "http://casba.com.ng/images/Logo.png"
};

console.log(form)

var formData = querystring.stringify(form);
var contentLength = formData.length;

const options = {
  url: 'http://demo.etranzact.com/WebConnectPlus/caller.jsp',
  headers: {
    'Content-Length': contentLength,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: formData,
  method: 'POST'
};
request(options, function(err, res, body) {
  console.log(body)
});
