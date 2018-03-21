'use strict';

const request = require('request');
const crypto = require('crypto');
const convert = require('xml-js');

require('dotenv').config({
  silent: true
});

const clientid = process.env.BANKIT_CLIENTID;
const clientkey = process.env.BANKIT_CLIENTKEY;
const serviceid = process.env.BANKIT_SERVICEID;

const merchantcode_transfer = process.env.BANKIT_TRANSFER_MERCHANTCODE;
const terminalid_transfer = process.env.BANKIT_TRANSFER_TERMINALID;

const merchantcode_airtime = process.env.BANKIT_AIRTIME_MERCHANTCODE;
const terminalid_airtime = process.env.BANKIT_AIRTIME_TERMINALID

const merchantcode_payment = process.env.BANKIT_PAYMENT_MERCHANTCODE;
const terminalid_payment = process.env.BANKIT_PAYMENT_TERMINALID;

const terminalId = process.env.SWITCHIT_TERMINALID;
const pin = process.env.SWITCHIT_PIN;

const getBankCode = function(bank_name){
  if('access' == bank_name) {
    return "044";
  } else if('zenith' == bank_name) {
    return "057";
  } else if('stanbic' == bank_name) {
    return "039";
  } else if('standard' == bank_name) {
    return "068";
  } else if('heritage' == bank_name) {
    return "030";
  } else if('diamond' == bank_name) {
    return "063";
  } else if('keystone' == bank_name) {
    return "082";
  } else if('union' == bank_name) {
    return "032";
  } else if('fidelity' == bank_name) {
    return "070";
  } else if('sterling' == bank_name) {
    return "232";
  } else if('unity' == bank_name) {
    return "215";
  } else if('fcmb' == bank_name) {
    return "214";
  } else if('enterprise' == bank_name) {
    return "084";
  } else if('skye' == bank_name) {
    return "076";
  } else if('gtb' == bank_name) {
    return "058";
  } else if('ecobank' == bank_name) {
    return "050";
  } else if('wema' == bank_name) {
    return "035";
  } else if('uba' == bank_name) {
    return "033";
  } else if('first' == bank_name) {
    return "011";
  } else {
    return 0;
  }
}

const getAccountBank= function(array, account_no){
  for (let i = 0; i < array.length; i++) {
    if (array[i].ACCOUNT_NO == account_no) {
      return array[i].BANK_NAME;
    }
  }
};

const pad_with_zeroes = function (number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}

const getBankitStatus = function(status) {
  if('0' == status) {
    return "Transaction Successful";
  } else if('Z' == status) {
    return "Pending";
  } else if('1' == status) {
    return "Destination Card Not Found";
  } else if('2' == status) {
    return "Card Number Not Found";
  } else if('3' == status) {
    return "Invalid Card PIN";
  } else if('4' == status) {
    return "Card Expiration Incorrect";
  } else if('5' == status) {
    return "Insufficient balance";
  } else if('6' == status) {
    return "Spending Limit Exceeded";
  } else if('7' == status) {
    return "Internal System Error Occurred, please contact the service provider";
  } else if('8' == status) {
    return "Financial Institution cannot authorize transaction, Please try later";
  } else if('9' == status) {
    return "PIN tries Exceeded";
  } else if('10' == status) {
    return "Card has been locked";
  } else if('11' == status) {
    return "Invalid Terminal Id";
  } else if('12' == status) {
    return "Payment Timeout";
  } else if('13' == status) {
    return "Destination card has been locked";
  } else if('14' == status) {
    return "Card has expired";
  } else if('15' == status) {
    return "PIN change required";
  } else if('16' == status) {
    return "Invalid Amount";
  } else if('17' == status) {
    return "Card has been disabled";
  } else if('18' == status) {
    return "Unable to credit this account immediately, credit will be done later";
  } else if('19' == status) {
    return "Transaction not permitted on terminal";
  } else if('20' == status) {
    return "Exceeds withdrawal frequency";
  } else if('21' == status) {
    return "Destination Card has expired";
  } else if('22' == status) {
    return "Destination Card Disabled";
  } else if('23' == status) {
    return "Source Card Disabled";
  } else if('24' == status) {
    return "Invalid Bank Account";
  } else if('25' == status) {
    return "Insufficient Balance";
  } else if('1002' == status) {
    return "CHECKSUM/FINAL_CHECKSUM error";
  } else if('100' == status) {
    return "Duplicate session id";
  } else if('200' == status) {
    return "Invalid client id";
  } else if('300' == status) {
    return "Invalid mac";
  } else if('400' == status) {
    return "Expired session";
  } else if('500' == status) {
    return "You have entered an account number that is not tied to your phone number with bank. Pls contact your bank for assistance.";
  } else if('600' == status) {
    return "Invalid account id";
  } else if('800' == status) {
    return "Invalid esa code";
  } else if('900' == status) {
    return "Transaction limit exceeded";
  } else {
    return "Sorry, Your transaction could not be completed";
  }
}

const getSwitchitStatus = function(status) {
  if('0' == status) {
    return "Transaction Successful";
  } else if('-1' == status) {
    return "Transaction timed out.";
  } else if('1' == status) {
    return "Destination Card Not Found";
  } else if('2' == status) {
    return "Card Number Not Found";
  } else if('3' == status) {
    return "Invalid Card PIN";
  } else if('4' == status) {
    return "Card Expiration Incorrect";
  } else if('5' == status) {
    return "Insufficient balance";
  } else if('6' == status) {
    return "Spending Limit Exceeded";
  } else if('7' == status) {
    return "Internal System Error Occurred, please contact the service provider";
  } else if('8' == status) {
    return "Financial Institution cannot authorize transaction, Please try later";
  } else if('9' == status) {
    return "PIN tries Exceeded";
  } else if('10' == status) {
    return "Card has been locked";
  } else if('11' == status) {
    return "Invalid Terminal Id";
  } else if('12' == status) {
    return "Payment Timeout";
  } else if('13' == status) {
    return "Destination card has been locked";
  } else if('14' == status) {
    return "Card has expired";
  } else if('15' == status) {
    return "PIN change required";
  } else if('16' == status) {
    return "Invalid Amount";
  } else if('17' == status) {
    return "Card has been disabled";
  } else if('18' == status) {
    return "Unable to credit this account immediately, credit will be done later";
  } else if('19' == status) {
    return "Transaction not permitted on terminal";
  } else if('20' == status) {
    return "Exceeds withdrawal frequency";
  } else if('21' == status) {
    return "Destination Card has expired";
  } else if('22' == status) {
    return "Destination Card Disabled";
  } else if('23' == status) {
    return "Source Card Disabled";
  } else if('24' == status) {
    return "Invalid Bank Account";
  } else if('25' == status) {
    return "Insufficient Balance";
  } else if('26' == status) {
    return "Request/Function not supported";
  } else if('27' == status) {
    return "No Route to Issuer/Bank";
  } else if('28' == status) {
    return "Bank TSS not Funded";
  } else if('29' == status) {
    return "Transaction with this amount, destination account has already been approved today.";
  } else if('31' == status) {
    return "Pending transaction, upon confirmation from bank.";
  } else if('32' == status) {
    return "Transaction status unknown, contact Josla after T+1 for status.";
  } else if('92' == status) {
    return "No Route to Issuer/Bank";
  } else if('99' == status) {
    return "Transaction Failed";
  } else if('1000' == status) {
    return "Invalid Session";
  } else if('1001' == status) {
    return "Invalid Caller";
  } else if('1002' == status) {
    return "Invalid Transaction Reference";
  } else if('1003' == status) {
    return "Duplicate Transaction Reference";
  } else if('1004' == status) {
    return "Invalid Information";
  } else if('1005' == status) {
    return "Invalid Date Format";
  } else if('1006' == status) {
    return "Invalid Source Information";
  } else if('1007' == status) {
    return "Invalid Payout Bank";
  } else {
    return "Sorry, Your transaction could not be completed";
  }
}

const paymentServices = {
  transferBankIT: function (firstname, lastname, emailaddress, accountnumber, amount, accounts, callback) {
    let bankITResponse = []
    var sessionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    bankITResponse = sessionid
    var transactionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    var description = 'Test Payment'

    // Initialise
    console.log('Initialise Payment')
    var start = Date.now();
    var mac = crypto.createHash('sha256').update(sessionid+clientid+terminalid_transfer+transactionid+pad_with_zeroes(accountnumber, 10)+getBankCode(getAccountBank(accounts, accountnumber))+serviceid+amount+description+merchantcode_transfer+clientkey, 'utf-8').digest("hex")
    console.log('mac: '+ mac)
    var param = JSON.stringify({"clientid": clientid, "action": "initialize", "sessionid":sessionid, "mac":mac, "terminalid":terminalid_transfer, "transactionid":transactionid, "bank":getBankCode(getAccountBank(accounts, accountnumber)), "accountnumber":pad_with_zeroes(accountnumber, 10), "serviceid":serviceid, "amount":amount, "description":description, "merchantcode":merchantcode_transfer})
    var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
    // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
    request.post({
      uri
    }, function(error, responseBankIT, body){
      bankITResponse = JSON.parse(responseBankIT.body)
      if(JSON.parse(responseBankIT.body).status == "0"){
        console.log('Send Account')
        console.log('-------------0-0-0-0-0-0-0--0------------')
        console.log(bankITResponse)
        if('accounts' in JSON.parse(responseBankIT.body)){
          console.log(JSON.parse(responseBankIT.body));
          console.log('Accounts found');
          var passcode = "123456" // dynamic collect from user
          var mac = crypto.createHash('sha256').update(sessionid+clientid+JSON.parse(responseBankIT.body).accounts[0].id+passcode+clientkey, 'utf-8').digest("hex")
          console.log('mac: '+ mac)
          var param = JSON.stringify({"action": "accountinfo", "requestid": JSON.parse(responseBankIT.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "accountid":JSON.parse(responseBankIT.body).accounts[0].id, "passcode":passcode})
          var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, responseBankIT, body){
            if(JSON.parse(responseBankIT.body).status == "0"){
              bankITResponse = JSON.parse(responseBankIT.body)
            } else {
              console.log('Send Account: ' + JSON.parse(responseBankIT.body).status);
              bankITResponse = getBankitStatus(JSON.parse(responseBankIT.body).status)
            }
          });
        } else {
          console.log(JSON.parse(responseBankIT.body));
          console.log('Accounts not found');
          var passcode = "123456"// dynamic generate for user
          console.log('passcode: ' +  passcode);
          var macString = sessionid + clientid + firstname + lastname + emailaddress + passcode + clientkey
          console.log('macString: ' + macString)
          var mac = crypto.createHash('sha256').update(sessionid + clientid + firstname + lastname + emailaddress + passcode + clientkey, 'utf-8').digest("hex")
          console.log('mac: '+ mac)
          var param = JSON.stringify({"action": "newaccountinfo", "requestid": JSON.parse(responseBankIT.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "passcode":passcode, "firstname": firstname, "lastname": lastname, "emailaddress": emailaddress})
          var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, responseBankIT, body){
            if(JSON.parse(responseBankIT.body).status == "0"){
              bankITResponse = JSON.parse(responseBankIT.body)
            } else {
              console.log('Send Account: ' + JSON.parse(responseBankIT.body).status);
              bankITResponse = getBankitStatus(JSON.parse(responseBankIT.body).status)
            }
          });
        }
      } else {
        console.log('Initialise: ' + JSON.parse(responseBankIT.body).status);
        bankITResponse = getBankitStatus(JSON.parse(responseBankIT.body).status)
      }
      callback(null, bankITResponse);
    });
  },

  topupBankIT: function (firstname, lastname, emailaddress, accountnumber, amount, accounts, callback) {
    let bankITResponse = []
    var sessionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    bankITResponse = sessionid
    var transactionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    var description = 'Test Payment'

    // Initialise
    console.log('Initialise Payment')
    var start = Date.now();
    var mac = crypto.createHash('sha256').update(sessionid+clientid+terminalid_airtime+transactionid+pad_with_zeroes(accountnumber, 10)+getBankCode(getAccountBank(accounts, accountnumber))+serviceid+amount+description+merchantcode_airtime+clientkey, 'utf-8').digest("hex")
    console.log('mac: '+ mac)
    var param = JSON.stringify({"clientid": clientid, "action": "initialize", "sessionid":sessionid, "mac":mac, "terminalid":terminalid_airtime, "transactionid":transactionid, "bank":getBankCode(getAccountBank(accounts, accountnumber)), "accountnumber":pad_with_zeroes(accountnumber, 10), "serviceid":serviceid, "amount":amount, "description":description, "merchantcode":merchantcode_airtime})
    var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
    // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
    request.post({
      uri
    }, function(error, responseBankIT, body){
      bankITResponse = JSON.parse(responseBankIT.body)
      if(JSON.parse(responseBankIT.body).status == "0"){
        console.log('Send Account')
        console.log('-------------0-0-0-0-0-0-0--0------------')
        console.log(bankITResponse)
        if('accounts' in JSON.parse(responseBankIT.body)){
          console.log(JSON.parse(responseBankIT.body));
          console.log('Accounts found');
          var passcode = "123456" // dynamic collect from user
          var mac = crypto.createHash('sha256').update(sessionid+clientid+JSON.parse(responseBankIT.body).accounts[0].id+passcode+clientkey, 'utf-8').digest("hex")
          console.log('mac: '+ mac)
          var param = JSON.stringify({"action": "accountinfo", "requestid": JSON.parse(responseBankIT.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "accountid":JSON.parse(responseBankIT.body).accounts[0].id, "passcode":passcode})
          var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, responseBankIT, body){
            if(JSON.parse(responseBankIT.body).status == "0"){
              bankITResponse = JSON.parse(responseBankIT.body)
            } else {
              console.log('Send Account: ' + JSON.parse(responseBankIT.body).status);
              bankITResponse = getBankitStatus(JSON.parse(responseBankIT.body).status)
            }
          });
        } else {
          console.log(JSON.parse(responseBankIT.body));
          console.log('Accounts not found');
          var passcode = "123456"// dynamic generate for user
          console.log('passcode: ' +  passcode);
          var macString = sessionid + clientid + firstname + lastname + emailaddress + passcode + clientkey
          console.log('macString: ' + macString)
          var mac = crypto.createHash('sha256').update(sessionid + clientid + firstname + lastname + emailaddress + passcode + clientkey, 'utf-8').digest("hex")
          console.log('mac: '+ mac)
          var param = JSON.stringify({"action": "newaccountinfo", "requestid": JSON.parse(responseBankIT.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "passcode":passcode, "firstname": firstname, "lastname": lastname, "emailaddress": emailaddress})
          var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, responseBankIT, body){
            if(JSON.parse(responseBankIT.body).status == "0"){
              bankITResponse = JSON.parse(responseBankIT.body)
            } else {
              console.log('Send Account: ' + JSON.parse(responseBankIT.body).status);
              bankITResponse = getBankitStatus(JSON.parse(responseBankIT.body).status)
            }
          });
        }
      } else {
        console.log('Initialise: ' + JSON.parse(responseBankIT.body).status);
        bankITResponse = getBankitStatus(JSON.parse(responseBankIT.body).status)
      }
      callback(null, bankITResponse);
    });
  },

  balanceSwitchIT: function (callback) {
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
        console.log('Raw result', body);
        // parser.parseString(body, (err, result) => {
        //   console.log('JSON result', result);
        // });
        var result = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['error']['_text']
        if (result == "0"){
          switchITResponse[0] = result
          switchITResponse[1] = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['message']['_text']
        } else {
          switchITResponse = getSwitchitStatus(result)
        }
      } else {
        switchITResponse = getSwitchitStatus(response.statusCode)
      }
      callback(null, switchITResponse);
    });
  },

  finalBankIT: function (esacode, requestid, sessionid, callback) {
    let bankITResponse = []
    console.log('Finalise Payment');
    console.log(pad_with_zeroes(esacode, 8), requestid, sessionid)
    var mac = crypto.createHash('sha256').update(sessionid+clientid+esacode+clientkey, 'utf-8').digest("hex")
    console.log('mac: '+ mac)
    var param = JSON.stringify({"action": "makepayment", "requestid":requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "esacode":pad_with_zeroes(esacode, 8)})
    var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
    // var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
    request.post({
      uri
    }, function(error, responseBankIT, body){
      if(JSON.parse(responseBankIT.body).status == "0"){
        bankITResponse = JSON.parse(responseBankIT.body)
      } else {
        console.log('Finalise: ' + JSON.parse(responseBankIT.body).status);
        bankITResponse = getBankitStatus(JSON.parse(responseBankIT.body).status)
      }
      callback(null, bankITResponse);
    });
  },

  transferSwitchIT: function (destination, amount, accounts, callback) {
    let switchITResponse = []
    var reference = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
    var currency = "NGN"
    console.log(reference)
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
                   <bankCode>` + getBankCode(getAccountBank(accounts, destination)) + `</bankCode>
                   <currency>` + currency + `</currency>
                   <amount>` + amount + `</amount>
                   <destination>` + destination + `</destination>
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
        console.log('Raw result', body);
        // parser.parseString(body, (err, result) => {
        //   console.log('JSON result', result);
        // });
        var result = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['error']['_text']
        if (result == "0"){
          switchITResponse[0] = result
          switchITResponse[1] = JSON.parse(convert.xml2json(body, {compact: true, spaces: 4}))['S:Envelope']['S:Body']['ns2:processResponse']['response']['message']['_text']
          switchITResponse[2] = reference
        } else {
          switchITResponse = getSwitchitStatus(result)
        }
      } else {
        switchITResponse = getSwitchitStatus(response.statusCode)
      }
      callback(null, switchITResponse);
    });
  },
  topupSwitchIT: function (destination, amount, senderName, provider, callback) {
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
                   <bankCode>` + getBankCode(getAccountBank(accounts, destination)) + `</bankCode>
                   <provider>` + provider + `</provider>
                   <lineType>VTU</lineType>
                   <amount>` + amount + `</amount>
                   <destination>` + destination + `</destination>
                   <reference>` + reference +`</reference>
                   <senderName>` + senderName + `</senderName>
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
        } else {
          switchITResponse = getSwitchitStatus(result)
        }
      } else {
        switchITResponse = getSwitchitStatus(response.statusCode)
      }
      callback(null, switchITResponse);
    });
  }
};

module.exports = paymentServices;
