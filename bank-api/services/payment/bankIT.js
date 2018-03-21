'use strict';

const util = require('../util')
const request = require('request');
const crypto = require('crypto');
require('dotenv').config({
  silent: true
});

var authKey = process.env.BVN_AUTHKEY

const clientid = process.env.BANKIT_CLIENTID;
const clientkey = process.env.BANKIT_CLIENTKEY;
const serviceid = process.env.BANKIT_SERVICEID;

const merchantcode_transfer = process.env.BANKIT_TRANSFER_MERCHANTCODE;
const terminalid_transfer = process.env.BANKIT_TRANSFER_TERMINALID;

const merchantcode_topup = process.env.BANKIT_TOPUP_MERCHANTCODE;
const terminalid_topup = process.env.BANKIT_TOPUP_TERMINALID

const merchantcode_payment = process.env.BANKIT_PAYMENT_MERCHANTCODE;
const terminalid_payment = process.env.BANKIT_PAYMENT_TERMINALID;

const bankIT = {
  initiateTransfer: function (data, callback) {
    let bankITResponse = []
    var sessionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    var transactionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    var description = 'Test Payment'
    var mac = crypto.createHash('sha256').update(sessionid+clientid+terminalid_transfer+transactionid+util.pad_with_zeroes(data.accountNo, 10)+util.getBankCode(data.bankName)+serviceid+data.amount+description+merchantcode_transfer+clientkey, 'utf-8').digest("hex")
    var param = JSON.stringify({"clientid": clientid, "action": "initialize", "sessionid":sessionid, "mac":mac, "terminalid":terminalid_transfer, "transactionid":transactionid, "bank":util.getBankCode(data.bankName), "accountnumber":util.pad_with_zeroes(data.accountNo, 10), "serviceid":serviceid, "amount":data.amount, "description":description, "merchantcode":merchantcode_transfer})
    var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
    // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
    request.post({
      uri
    }, function(error, responseBankIT, body){
      if(JSON.parse(responseBankIT.body).status == "0"){
        console.log('Send Account')
        if('accounts' in JSON.parse(responseBankIT.body)){
          console.log('Accounts found');
          var passcode = "123456" // dynamic collect from user
          var mac = crypto.createHash('sha256').update(sessionid+clientid+JSON.parse(responseBankIT.body).accounts[0].id+passcode+clientkey, 'utf-8').digest("hex")
          var param = JSON.stringify({"action": "accountinfo", "requestid": JSON.parse(responseBankIT.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "accountid":JSON.parse(responseBankIT.body).accounts[0].id, "passcode":passcode})
          var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, responseBankIT, body){
            if(JSON.parse(responseBankIT.body).status == "0"){
              bankITResponse[1] = JSON.parse(responseBankIT.body)
              bankITResponse[0] = {status: 'Success'}
              callback(null, bankITResponse);
            } else {
              console.log('Send Account: ' + JSON.parse(responseBankIT.body).status);
              bankITResponse[1] = {response: util.getBankitStatus(JSON.parse(responseBankIT.body).status)}
              bankITResponse[0] = {status: 'Error'}
              callback(null, bankITResponse);
            }
          });
        } else {
          console.log('Accounts not found');
          var passcode = "123456"// dynamic generate for user
          var mac = crypto.createHash('sha256').update(sessionid + clientid + data.firstName + data.lastName + data.emailAddress + passcode + clientkey, 'utf-8').digest("hex")
          var param = JSON.stringify({"action": "newaccountinfo", "requestid": JSON.parse(responseBankIT.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "passcode":passcode, "firstname": data.firstName, "lastname": data.lastName, "emailaddress": data.emailAddress})
          var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, responseBankIT, body){
            if(JSON.parse(responseBankIT.body).status == "0"){
              bankITResponse[1] = JSON.parse(responseBankIT.body)
              bankITResponse[0] = {status: 'Success'}
              callback(null, bankITResponse);
            } else {
              console.log('Send Account: ' + JSON.parse(responseBankIT.body).status);
              bankITResponse = {response: util.getBankitStatus(JSON.parse(responseBankIT.body).status)}
              bankITResponse[0] = {status: 'Error'}
              callback(null, bankITResponse);
            }
          });
        }
      } else {
        console.log('Initialise: ' + JSON.parse(responseBankIT.body).status);
        bankITResponse[1] = {response: util.getBankitStatus(JSON.parse(responseBankIT.body).status)}
        bankITResponse[0] = {status: 'Error'}
        callback(null, bankITResponse);
      }
    });
  },

  initiateTopup: function (data, callback) {
    let bankITResponse = []
    var sessionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    var transactionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    var description = 'Test Payment'
    var mac = crypto.createHash('sha256').update(sessionid+clientid+terminalid_topup+transactionid+util.pad_with_zeroes(data.accountNo, 10)+util.getBankCode(data.bankName)+serviceid+data.amount+description+merchantcode_topup+clientkey, 'utf-8').digest("hex")
    var param = JSON.stringify({"clientid": clientid, "action": "initialize", "sessionid":sessionid, "mac":mac, "terminalid":terminalid_topup, "transactionid":transactionid, "bank":util.getBankCode(data.bankName), "accountnumber":util.pad_with_zeroes(data.accountNo, 10), "serviceid":serviceid, "amount":data.amount, "description":description, "merchantcode":merchantcode_topup})
    var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
    // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
    request.post({
      uri
    }, function(error, responseBankIT, body){
      if(JSON.parse(responseBankIT.body).status == "0"){
        console.log('Send Account')
        if('accounts' in JSON.parse(responseBankIT.body)){
          console.log('Accounts found');
          var passcode = "123456" // dynamic collect from user
          var mac = crypto.createHash('sha256').update(sessionid+clientid+JSON.parse(responseBankIT.body).accounts[0].id+passcode+clientkey, 'utf-8').digest("hex")
          var param = JSON.stringify({"action": "accountinfo", "requestid": JSON.parse(responseBankIT.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "accountid":JSON.parse(responseBankIT.body).accounts[0].id, "passcode":passcode})
          var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, responseBankIT, body){
            if(JSON.parse(responseBankIT.body).status == "0"){
              bankITResponse[1] = JSON.parse(responseBankIT.body)
              bankITResponse[0] = {status: 'Success'}
              callback(null, bankITResponse);
            } else {
              console.log('Send Account: ' + JSON.parse(responseBankIT.body).status);
              bankITResponse[1] = {response: util.getBankitStatus(JSON.parse(responseBankIT.body).status)}
              bankITResponse[0] = {status: 'Error'}
              callback(null, bankITResponse);
            }
          });
        } else {
          console.log('Accounts not found');
          var passcode = "123456"// dynamic generate for user
          var mac = crypto.createHash('sha256').update(sessionid + clientid + data.firstName + data.lastName + data.emailAddress + passcode + clientkey, 'utf-8').digest("hex")
          var param = JSON.stringify({"action": "newaccountinfo", "requestid": JSON.parse(responseBankIT.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "passcode":passcode, "firstname": data.firstName, "lastname": data.lastName, "emailaddress": data.emailAddress})
          var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, responseBankIT, body){
            if(JSON.parse(responseBankIT.body).status == "0"){
              bankITResponse[1] = JSON.parse(responseBankIT.body)
              bankITResponse[0] = {status: 'Success'}
              callback(null, bankITResponse);
            } else {
              console.log('Send Account: ' + JSON.parse(responseBankIT.body).status);
              bankITResponse = {response: util.getBankitStatus(JSON.parse(responseBankIT.body).status)}
              bankITResponse[0] = {status: 'Error'}
              callback(null, bankITResponse);
            }
          });
        }
      } else {
        console.log('Initialise: ' + JSON.parse(responseBankIT.body).status);
        bankITResponse[1] = {response: util.getBankitStatus(JSON.parse(responseBankIT.body).status)}
        bankITResponse[0] = {status: 'Error'}
        callback(null, bankITResponse);
      }
    });
  },

  initiatePayment: function (data, callback) {
    let bankITResponse = []
    var sessionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    var transactionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    var description = 'Test Payment'
    var mac = crypto.createHash('sha256').update(sessionid+clientid+terminalid_payment+transactionid+util.pad_with_zeroes(data.accountNo, 10)+util.getBankCode(data.bankName)+serviceid+data.amount+description+merchantcode_payment+clientkey, 'utf-8').digest("hex")
    var param = JSON.stringify({"clientid": clientid, "action": "initialize", "sessionid":sessionid, "mac":mac, "terminalid":terminalid_payment, "transactionid":transactionid, "bank":util.getBankCode(data.bankName), "accountnumber":util.pad_with_zeroes(data.accountNo, 10), "serviceid":serviceid, "amount":data.amount, "description":description, "merchantcode":merchantcode_payment})
    var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
    // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
    request.post({
      uri
    }, function(error, responseBankIT, body){
      if(JSON.parse(responseBankIT.body).status == "0"){
        console.log('Send Account')
        if('accounts' in JSON.parse(responseBankIT.body)){
          console.log('Accounts found');
          var passcode = "123456" // dynamic collect from user
          var mac = crypto.createHash('sha256').update(sessionid+clientid+JSON.parse(responseBankIT.body).accounts[0].id+passcode+clientkey, 'utf-8').digest("hex")
          var param = JSON.stringify({"action": "accountinfo", "requestid": JSON.parse(responseBankIT.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "accountid":JSON.parse(responseBankIT.body).accounts[0].id, "passcode":passcode})
          var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, responseBankIT, body){
            if(JSON.parse(responseBankIT.body).status == "0"){
              bankITResponse[1] = JSON.parse(responseBankIT.body)
              bankITResponse[0] = {status: 'Success'}
              callback(null, bankITResponse);
            } else {
              console.log('Send Account: ' + JSON.parse(responseBankIT.body).status);
              bankITResponse[1] = {response: util.getBankitStatus(JSON.parse(responseBankIT.body).status)}
              bankITResponse[0] = {status: 'Error'}
              callback(null, bankITResponse);
            }
          });
        } else {
          console.log('Accounts not found');
          var passcode = "123456"// dynamic generate for user
          var mac = crypto.createHash('sha256').update(sessionid + clientid + data.firstName + data.lastName + data.emailAddress + passcode + clientkey, 'utf-8').digest("hex")
          var param = JSON.stringify({"action": "newaccountinfo", "requestid": JSON.parse(responseBankIT.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "passcode":passcode, "firstname": data.firstName, "lastname": data.lastName, "emailaddress": data.emailAddress})
          var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, responseBankIT, body){
            if(JSON.parse(responseBankIT.body).status == "0"){
              bankITResponse[1] = JSON.parse(responseBankIT.body)
              bankITResponse[0] = {status: 'Success'}
              callback(null, bankITResponse);
            } else {
              console.log('Send Account: ' + JSON.parse(responseBankIT.body).status);
              bankITResponse = {response: util.getBankitStatus(JSON.parse(responseBankIT.body).status)}
              bankITResponse[0] = {status: 'Error'}
              callback(null, bankITResponse);
            }
          });
        }
      } else {
        console.log('Initialise: ' + JSON.parse(responseBankIT.body).status);
        bankITResponse[1] = {response: util.getBankitStatus(JSON.parse(responseBankIT.body).status)}
        bankITResponse[0] = {status: 'Error'}
        callback(null, bankITResponse);
      }
    });
  },

  finalise: function (data, callback) {
    let bankITResponse = []
    console.log('Finalise Payment');
    var mac = crypto.createHash('sha256').update(data.sessionid+clientid+util.pad_with_zeroes(data.esacode, 8)+clientkey, 'utf-8').digest("hex")
    var param = JSON.stringify({"action": "makepayment", "requestid":data.requestid, "clientid": clientid, "sessionid":data.sessionid, "mac":mac, "esacode":util.pad_with_zeroes(data.esacode, 8)})
    var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
    // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
    request.post({
      uri
    }, function(error, responseBankIT, body){
      if(JSON.parse(responseBankIT.body).status == "0"){
        bankITResponse[1] = JSON.parse(responseBankIT.body)
        bankITResponse[0] = {status: 'Success'}
        callback(null, bankITResponse);
      } else {
        console.log('Finalise: ' + JSON.parse(responseBankIT.body).status);
        bankITResponse[1] = {response: util.getBankitStatus(JSON.parse(responseBankIT.body).status)}
        bankITResponse[0] = {status: 'Error'}
        callback(null, bankITResponse);
      }
    });
  }

}

module.exports = bankIT;
