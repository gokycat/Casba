
var crypto = require('crypto');
var request = require('request');

var firstname = "Akinlabi"
console.log('firstname:' + firstname)
var lastname = "Ajelabi"
console.log('lastname:' + lastname)
var emailaddress = "akinlabiajelabi@me.com"
console.log('emailaddress:' + emailaddress)
var accountnumber = "0694450123"
var bank = "044"
var amount = "100"

// var clientid = "7007139194"
// var clientkey = "LA6ajmnBBjpSFs9jzQHEDS9Zln7ItV3P"
// var merchantcode = "700602X2HL"
// var terminalid = "7007139194"

var clientid = "testSystem"
var clientkey = "1234567890qwertyuiopasdfghjklzxcvbnmm1n2b3g4f5y6k7j8g9s0g1a2g3h4yk5"
var merchantcode = "652435374"
var terminalid = "0000000001"

var sessionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
console.log('sessionid:' + sessionid);
var transactionid = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10)
console.log('transactionid:' + transactionid);
var serviceid = "1513245811390"
var description = 'Test Payment'

// Initialise
var mac = crypto.createHash('sha256').update(sessionid+clientid+terminalid+transactionid+accountnumber+bank+serviceid+amount+description+merchantcode+clientkey, 'utf-8').digest("hex")
console.log('mac: '+ mac)
var param = JSON.stringify({"clientid": clientid, "action": "initialize", "sessionid":sessionid, "mac":mac, "terminalid":terminalid, "transactionid":transactionid, "bank":bank, "accountnumber":accountnumber, "serviceid":serviceid, "amount":amount, "description":description, "merchantcode":merchantcode})
// var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
request.post({
  uri
}, function(error, response, body){
  if(JSON.parse(response.body).status == "0"){
    if('accounts' in JSON.parse(response.body)){
      console.log(JSON.parse(response.body));
      console.log('Accounts found');
      var passcode = "123456" // dynamic collect from user
      var macString = sessionid+clientid+JSON.parse(response.body).accounts[0].id+passcode+clientkey
      console.log('macString: ' +macString)
      var mac = crypto.createHash('sha256').update(macString, 'utf-8').digest("hex")
      console.log('mac: '+ mac)
      var param = JSON.stringify({"action": "accountinfo", "requestid": JSON.parse(response.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "accountid":JSON.parse(response.body).accounts[0].id, "passcode":passcode})
      // var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
      var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
      request.post({
        uri
      }, function(error, response, body){
        if(JSON.parse(response.body).status == "0"){
          console.log(JSON.parse(response.body));
          console.log('Finalise Payment');
          var esacode = "56586185"
          var mac = crypto.createHash('sha256').update(sessionid+clientid+esacode+clientkey, 'utf-8').digest("hex")
          console.log('mac: '+ mac)
          var param = JSON.stringify({"action": "makepayment", "requestid": JSON.parse(response.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "esacode":esacode})
          // var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, response, body){
            if(JSON.parse(response.body).status == "0"){
              console.log(JSON.parse(response.body));
            } else {
              console.log('Finalise: ' + JSON.parse(response.body).status);
            }
          });
        } else {
          console.log('Send Account: ' + JSON.parse(response.body).status);
        }
      });
    } else {
      console.log(JSON.parse(response.body));
      console.log('Accounts not found');
      var passcode = "123456"// dynamic generate for user
      console.log('passcode: ' +  passcode);
      var macString = sessionid + clientid + firstname + lastname + emailaddress + passcode + clientkey
      console.log('macString: ' + macString)
      var mac = crypto.createHash('sha256').update(macString, 'utf-8').digest("hex")
      console.log('mac: '+ mac)
      var param = JSON.stringify({"action": "newaccountinfo", "requestid": JSON.parse(response.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "passcode":passcode, "firstname": firstname, "lastname": lastname, "emailaddress": emailaddress})
      // var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
      var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
      request.post({
        uri
      }, function(error, response, body){
        if(JSON.parse(response.body).status == "0"){
          console.log(JSON.parse(response.body));
          console.log('Finalise Payment');
          var esacode = "56586185"
          var mac = crypto.createHash('sha256').update(sessionid+clientid+esacode+clientkey, 'utf-8').digest("hex")
          console.log('mac: '+ mac)
          var param = JSON.stringify({"action": "makepayment", "requestid": JSON.parse(response.body).requestid, "clientid": clientid, "sessionid":sessionid, "mac":mac, "esacode":esacode})
          // var uri = "https://www.etranzact.net/bankIT/service_bankitapi?json="+param
          var uri = "http://demo.etranzact.com/bankIT/service_bankitapi?json="+param
          request.post({
            uri
          }, function(error, response, body){
            if(JSON.parse(response.body).status == "0"){
              console.log(JSON.parse(response.body));
            } else {
              console.log('Finalise: ' + JSON.parse(response.body).status);
            }
          });
        } else {
          console.log('Send Account: ' + JSON.parse(response.body).status);
        }
      });
    }
  } else {
    console.log('Initialise: ' + JSON.parse(response.body).status);
  }
});
