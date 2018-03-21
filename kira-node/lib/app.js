'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

const _http = require('http');

const _http2 = _interopRequireDefault(_http);

const _express = require('express');

const _express2 = _interopRequireDefault(_express);

const _cors = require('cors');

const _cors2 = _interopRequireDefault(_cors);

const _socket = require('socket.io');

const _socket2 = _interopRequireDefault(_socket);

const _config = require('../config/config.json');

const _config2 = _interopRequireDefault(_config);

const _path = require('path');

const _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const session = require('express-session')({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true
});

const sharedsession = require('express-socket.io-session');
const watson = require('watson-developer-cloud');
const ibmdb = require('ibm_db');
const request = require('request');
const nodemailer = require('nodemailer');
const mail = require('./nodeMailerWithTemp');
const dataServices = require('../josla/dataServices');
const analytics = require('../josla/analytics');
const kycServices = require('../josla/kycServices');
const paymentServices = require('../josla/paymentServices');
const convert = require('xml-js');
const wait = require('wait.for');
const moment = require('moment');

require('dotenv').config({
  silent: true
});

// setup server
const app = (0, _express2.default)();
const server = _http2.default.createServer(app);

const socketIo = (0, _socket2.default)(server);


// Allow CORS
app.use((0, _cors2.default)());
app.use(session)


// Render a API index page
app.get('/', function (req, res) {
  res.sendFile(_path2.default.resolve('public/index.html'));
});

// setup watson service
const conversation = watson.conversation({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  version: 'v1',
  version_date: '2017-05-26'
});

const conversationWorkspaceID = process.env.WORKSPACE_ID

var tag = '...'
var context = {}
var responseText = ''


// setup database service
var cn = "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-lon02-01.services.eu-gb.bluemix.net;UID="+process.env.DASHDB_UID+";PWD="+process.env.DASHDB_PWD+";PORT=50000;PROTOCOL=TCPIP";
var username, password;
var user = []
var accounts = []
var transactions = []
var banks = []
var account_types = []
var cards = []
var beneficiaries = []
var start
var telcos = []
var vendors = []
var vendorPackages = []
var transfers = []
var topups = []
var payments = []
var amount = []
var timeString = []
var classification = {}
var budget = [{transfer:300, topup:700, payment:2000}]

var userProfile = []


// Paystack
var authKey = process.env.BVN_AUTHKEY

// eTranzact bankIT
var clientid = process.env.BANKIT_CLIENTID
var clientkey = process.env.BANKIT_CLIENTKEY
var merchantcode_transfer = process.env.BANKIT_TRANSFER_MERCHANTCODE
var terminalid_transfer = process.env.BANKIT_TRANSFER_TERMINALID
var merchantcode_airtime = process.env.BANKIT_AIRTIME_MERCHANTCODE
var terminalid_airtime = process.env.BANKIT_AIRTIME_TERMINALID
var merchantcode_payment = process.env.BANKIT_PAYMENT_MERCHANTCODE
var terminalid_payment = process.env.BANKIT_PAYMENT_TERMINALID

// eTranzact switchIT
var terminalId = process.env.SWITCHIT_TERMINALID
var pin = process.env.SWITCHIT_PIN

// Start listening
server.listen(_config2.default.port);
console.log('Started on port ' + _config2.default.port);


// Setup socket.io
socketIo.use(sharedsession(session, {
    autoSave:true
}));

//socketIo.on establish socket api for kira node is open for long polling
socketIo.on('connection', function (socket) {

  socket.handshake.session.userdata = user;
  socket.handshake.session.save();

  // verification
  socket.on('client:verify', function (url) {

    // query db and change user to active if token found
    if(url.url.split("?")[1] !== undefined){
      // update user password
      ibmdb.open(cn,function(err,conn){
        var stmt = conn.prepareSync("UPDATE USERS SET STATUS_ID = ? WHERE HASH = ?");

        //Bind and Execute the statment asynchronously
        var result = stmt.executeSync([2, url.url.split("?")[1]]);
        result.closeSync();
        stmt.closeSync();

        //Close the connection
        conn.close(function(err){});
      });
      console.log(url.url.split("?")[1]);
    }
  });

  // registration
  socket.on('client:register', function (newUser) {

    const options = {
        url: "https://api.paystack.co/bank/resolve_bvn/"+newUser.bvn ,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer "+authKey,
            'Accept-Charset': 'utf-8',
            'User-Agent': 'my-reddit-client'
        }
    };

    request(options, function(err, res, body) {
      // check if bvn exist
      ibmdb.open(cn,function(err,conn){
        var stmt = conn.prepareSync("SELECT * FROM USERS WHERE BVN = ?");

        //Bind and Execute the statment asynchronously
        stmt.execute([newUser.bvn], function (err, result) {
          if (err) {
            console.log('error:', err)
            // error handling
            tag="dbError"
            //emits the response message to front-end
            socket.emit('server:chatbot', {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user, accounts:accounts});
          } else {
            var user = result.fetchAllSync({fetchMode:3}); // Fetch data in Array mode.
            if (user.length == 0){
              if( JSON.parse(body).status.toString() == "true" ) {
                if( JSON.parse(body).data.first_name == newUser.firstName.toUpperCase() ) {
                  if( JSON.parse(body).data.last_name == newUser.lastName.toUpperCase() ) {
                    if( JSON.parse(body).data.mobile == newUser.phone.toUpperCase() )  {
                      // check if BVN already exist
                      ibmdb.open(cn,function(err,conn){
                        var stmt = conn.prepareSync("SELECT * FROM USERS WHERE BVN = ?");

                        //Bind and Execute the statment asynchronously
                        stmt.execute([newUser.bvn], function (err, result) {
                          if (err) {
                            console.log('error:', err)
                            // error handling
                            tag="dbError"
                            //emits the response message to front-end
                            socket.emit('server:chatbot', {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user, accounts:accounts});
                          } else {
                            var user = result.fetchAllSync({fetchMode:3}); // Fetch data in Array mode.
                            if (user.length == 0){
                              tag="false"
                              //email verification token
                              var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                              var token = '';
                              for (var i = 16; i > 0; --i) {
                                token += chars[Math.round(Math.random() * (chars.length - 1))];
                              }
                              // insert new user
                              ibmdb.open(cn,function(err,conn){
                                var stmt = conn.prepareSync("INSERT INTO USERS (BVN, EMAIL, PHONE, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, STATUS_ID, HASH, PASSWORD, TOC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

                                //Bind and Execute the statment asynchronously
                                var result = stmt.executeSync([Number(newUser.bvn), newUser.email, newUser.phone, newUser.firstName, newUser.lastName, JSON.parse(body).data.dob, 1, token, newUser.password, Date.now()]);
                                result.closeSync();
                                stmt.closeSync();
                                // Send notification for new registeration
                                mail.sendRegistration(newUser.email, newUser.firstName, newUser.firstName + ' ' + newUser.lastName, token);
                                // emits the response message to front-end App.js
                                socket.emit('server:registration', {username: 'Kira', message: 'Successfully registered. Please check email to verify your account.', tag:tag});
                                //Close the connection
                                conn.close(function(err){});
                              });
                            } else {
                              // error handling
                              tag="false"
                              //emits the response message to front-end App.js
                              socket.emit('server:registration', {username: 'Kira', message: 'User already exists', tag:tag});
                            }
                            result.closeSync();
                          }
                          stmt.closeSync();

                          //Close the connection
                          conn.close(function(err){});
                        });

                        //Close the connection
                        conn.close(function(err){});
                      });
                    } else {
                      // error handling
                      tag="false"
                      //emits the response message to front-end App.js
                      socket.emit('server:registration', {username: 'Kira', message: 'Phone number is not correct', tag:tag});
                    }
                  } else {
                    // error handling
                    tag="false"
                    //emits the response message to front-end App.js
                    socket.emit('server:registration', {username: 'Kira', message: 'Last name is not correct', tag:tag});
                  }
                } else {
                  // error handling
                  tag="false"
                  //emits the response message to front-end App.js
                  socket.emit('server:registration', {username: 'Kira', message: 'First name is not correct', tag:tag});
                }
              } else {
                // error handling
                tag="false"
                //emits the response message to front-end App.js
                socket.emit('server:registration', {username: 'Kira', message: 'System is down, please try again in 5 mins.', tag:tag});
              }
            } else {
              // error handling
              tag="false"
              //emits the response message to front-end App.js
              socket.emit('server:registration', {username: 'Kira', message: 'User already exists', tag:tag});
              console.log(tag);
            }
            result.closeSync();
          }
          stmt.closeSync();

          //Close the connection
          conn.close(function(err){});
        });

        //Close the connection
        conn.close(function(err){});
      });
    });
  });


  // reset password
  socket.on('client:resetPassword', function (changePassword) {
    // Check if user email exist
    ibmdb.open(cn,function(err,conn){
      var stmt = conn.prepareSync("SELECT * FROM USERS WHERE EMAIL = ?");

      //Bind and Execute the statment asynchronously
      stmt.execute([changePassword.email], function (err, result) {
        if (err) {
          console.log('error:', err)
          // error handling
          tag="dbError"
          //emits the response message to front-end
          socket.emit('server:chatbot', {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user, accounts:accounts});
        } else {
          var user = result.fetchAllSync({fetchMode:3}); // Fetch data in Array mode.
          if (user.length == 0){
            // error handling
            tag="false"
            //emits the response message to front-end App.js
            socket.emit('server:password', {username: 'Kira', message: 'User email does not exists', tag:tag});
          } else {
            // Generate random password
            var randomstring = Math.random().toString(36).slice(-8);
            // update user password
            ibmdb.open(cn,function(err,conn){
              var stmt = conn.prepareSync("UPDATE USERS SET PASSWORD = ? WHERE EMAIL = ?");

              //Bind and Execute the statment asynchronously
              var result = stmt.executeSync([randomstring, changePassword.email]);
              result.closeSync();
              stmt.closeSync();
              // Send notification for password update
              mail.sendPasswordReset(user[0].EMAIL, user[0].FIRST_NAME,user[0].FIRST_NAME + '' + user[0].LAST_NAME, randomstring);
              tag="false"
              //emits the response message to front-end App.js
              socket.emit('server:password', {username: 'Kira', message: 'New password generated for you. Please check your email.', tag:tag});
              //Close the connection
              conn.close(function(err){});
            });
          }
          result.closeSync();
        }
        stmt.closeSync();

        //Close the connection
        conn.close(function(err){});
      });

      //Close the connection
      conn.close(function(err){});
    });
  });

  // authentication
  socket.on('client:authenticate', function (data) {
    //authenticates the user
    ibmdb.open(cn,function(err,conn){
      // Check if user BVN or email or phone exist
      var stmt = conn.prepareSync("SELECT * FROM USERS LEFT JOIN STATUS ON USERS.STATUS_ID=STATUS.STATUS_ID WHERE PHONE = ?");
      var stmt2 = conn.prepareSync("UPDATE USERS SET LAST_SIGNIN = ? WHERE PHONE = ?");
      //Bind and Execute the statment asynchronously
      stmt.execute([data.username], function (err, result) {
        if (err) {
          console.log('error:', err)
          // error handling
          tag="false"
          //emits the response message to front-end
          socket.emit('server:authentication', {username: 'Kira', message: 'Sorry, please ensure your Log in details are properly inputed', tag:tag});
        } else {
          user = result.fetchAllSync();
          if (user.length == 0) {
            // error handling
            tag="false"
            //emits the response message to front-end
            socket.emit('server:authentication', {username: 'Kira', message: 'Sorry, you are not a registered user', tag:tag});
          } else {
            if(user[0].STATUS_ID == 2){
              if (data.password == user[0].PASSWORD) {
                tag="true"
                //emits the response message to front-end
                mail.sendLogin(user[0].EMAIL, user[0].FIRST_NAME, user[0].FIRST_NAME + '' + user[0].LAST_NAME, 'http://www.casba.com.ng');
                // update with latest signin time
                //Bind and Execute the statment asynchronously
                var result2 = stmt2.executeSync([Date.now(), data.username]);
                socket.emit('server:authentication', {username: 'Kira', message: 'Successfully logged in', tag:tag});
                result2.closeSync();
                stmt2.closeSync();
              } else {
                console.log("passwords dont match");
                // error handling
                tag="false"
                //emits the response message to front-end
                socket.emit('server:authentication', {username: 'Kira', message: 'Sorry, password is incorrect', tag:tag});
              }
            } else {
              console.log("User is not active");
              // error handling
              tag="false"
              //emits the response message to front-end
              socket.emit('server:authentication', {username: 'Kira', message: 'Please activate your account using link in email received at registration.', tag:tag});
            }
          }
          result.closeSync();
        }
        stmt.closeSync();

        //Close the connection
        conn.close(function(err){});
      });
    });//close db authenticate query
  });

  //chatbot
  socket.on('client:chat', function (data) {

    console.log(user[0].FIRST_NAME + ': ' + data.message);
    var username = data.username
    var inputText = data.message
    var namespace = 'server:chatbot'+'/'+socket.handshake.session.userdata[0].PHONE
    console.log(namespace)

    //preprocess

    //model
    conversation.message({
      workspace_id: conversationWorkspaceID,
      input: { 'text': data.message },
      context: context,
    },  function(err, response) {
      if (err) {
        console.log('error:', err);
        responseText = 'Sorry, Kira is unavaiable at the moment. Please refresh to wake her up!'
        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
      } else {
        if(response.output.text){
          if (response.intents && response.intents[0]) {
            var intent = response.intents[0];
            tag = intent.intent
            if (tag == "hello"){
              if (intent.confidence >= 0.75) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "Hello" + ' ' + user[0].FIRST_NAME + ' Welcome to CASBA! Oops!! Looks like you need to add an account'
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  } else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      console.log(transactions)
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if (tag == "userInfo"){
              if (intent.confidence >= 0.75) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "Hello" + ' ' + user[0].FIRST_NAME + ' Welcome to CASBA! Oops!! Looks like you need to add an account'
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  } else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      console.log('===accounts===');
                      console.log(accounts)
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if (tag == "viewAccount"){
              if (intent.confidence >= 0.75) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "Hello" + ' ' + user[0].FIRST_NAME + ' Welcome to CASBA! Oops!! Looks like you need to add an account'
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  } else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if (tag == "deleteAccount"){
              if (intent.confidence >= 0.69) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "Hello" + ' ' + user[0].FIRST_NAME + ' Welcome to CASBA! Oops!! Looks like you need to add an account'
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  } else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if (tag == "deleteCard"){
              if (intent.confidence >= 0.75) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "Hello" + ' ' + user[0].FIRST_NAME + ' Welcome to CASBA! Oops!! Looks like you need to add an account'
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  } else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if (tag == "addAccount"){
              if (intent.confidence >= 0.75) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'addAccount'
                    responseText = response.output.text
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  } else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if (tag == "addCard"){
              if (intent.confidence >= 0.75) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "Hello" + ' ' + user[0].FIRST_NAME + ' Welcome to CASBA! Oops!! Looks like you need to add an account'
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  } else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if (tag == "fundsTransfer"){
              if (intent.confidence >= 0.75) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "Hello" + ' ' + user[0].FIRST_NAME + ' Welcome to CASBA! Oops!! Looks like you need to add an account'
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  } else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if (tag == "airtimeTopup"){
              if (intent.confidence >= 0.75) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "You do not have an account. Please add one to use my services..."
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              }
              else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
              else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if (tag == "budget"){
              tag='myBudget';
              if (intent.confidence >= 0.75) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "Hello" + ' ' + user[0].FIRST_NAME + ' Welcome to CASBA! Oops!! Looks like you need to add an account'
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  } else {
                    analytics.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      console.log('My Budget');
                      console.log(response.input.text);
                      timeString = analytics.getTimeString(transactions, 100,'days', 'Do');
                      amount = analytics.getAmount(transactions, 100, 'days');
                      classification = analytics.getClassified(transactions);

                      console.log('====Timestring=======');
                      console.log(timeString);
                      console.log('====Amount=======');
                      console.log(amount);
                      console.log('====classification=======');
                      console.log(classification);

                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, timeString:timeString, amount:amount, classification:classification});
                    });
                  }
                });
              } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else {
              if (intent.confidence >= 0.75) {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else if (intent.confidence >= 0.5) {
                responseText = 'I think your intent was ' + intent.intent + '. Please explicitly type in what you need to get done';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              } else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                console.log(JSON.stringify(response, null, 2));
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
          }
          else if (response.entities && response.entities[0]) {
            var entity = response.entities[0];
            var node = response.output.nodes_visited[0]
            if(entity.entity == 'sys-number'){
              if (node == 'slot_15_1512736644141') {
                tag = 'accountInfo';
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountNo(context.accountNo, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "You do not have an account. Please add one to use my services..."
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  else {
                    dataServices.getTransactionBVN(context.accountNo, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              }
              else if (node == 'slot_65_1512741991094') {
                tag = "deleteAccountConfirm";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountNo(context.accountNo, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "You do not have an account. Please add one to use my services..."
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  else {
                    dataServices.getTransactionBVN(context.accountNo, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              }
              else if (node == 'slot_76_1512742701987') {
                tag = "deleteCardConfirm";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountNo(context.accountNo, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "You do not have an account. Please add one to use my services..."
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  else {
                    dataServices.getTransactionBVN(context.accountNo, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              }
              else if (node == 'slot_9_1513159178495') {
                tag = "accountBank";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getBanks(function(err, banks){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                  }
                  dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                    }
                    if(accounts.length == 0){
                      dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                        }
                        responseText = response.output.text;
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                      });
                    }
                    else {
                      dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                        }
                        responseText = response.output.text;
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                      });
                    }
                  });
                });
              }
              else if (node == 'slot_44_1512739536738') {
                tag = "cardNumber";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "You do not have an account. Please add one to use my services..."
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              }
              else if (node == 'slot_47_1512740079248') {
                tag = "expiryMonth";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                console.log(context.cardNo)
                kycServices.resolveCard(context.cardNo, function(err, cardDetails){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(cardDetails.status.toString() == 'true'){
                    dataServices.getAccountNo(context.accountNo, function(err, accounts){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      if(cardDetails.data.bank == accounts[0].FULL_NAME){
                        dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                          }
                          context["cardBrand"] = cardDetails.data.brand
                          context["cardType"] = cardDetails.data.card_type
                          dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                            if(err) {
                              responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                            }
                            responseText = response.output.text;
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          });
                        });
                      }
                      else {
                        tag = 'cardNotResolved'
                        var conv_id = response.context.conversation_id;
                        response.context.clear;
                        response.context = {conv_id};
                        context = response.context;
                        responseText = "It seems this card does not belonng to you."
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                    })
                  }
                  else {
                    tag = 'cardNotResolved'
                    var conv_id = response.context.conversation_id;
                    response.context.clear;
                    response.context = {conv_id};
                    context = response.context;
                    responseText = "Sorry, something went wrong with the account resolution"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                });
              }
              else if (node == 'slot_6_1513171646227') {
                tag = "addCardConfirm";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "You do not have an account. Please add one to use my services..."
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  else {
                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      responseText = response.output.text;
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    });
                  }
                });
              }
              else if (node == 'slot_106_1512391553012') {
                tag = "recipientBank";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getBanks(function(err, banks){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                  }
                  dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                    }
                    if(accounts.length == 0){
                      tag = 'noAccount'
                      responseText = "You do not have an account. Please add one to use my services..."
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                    }
                    else {
                      dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                        }
                        responseText = response.output.text;
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, banks:banks});
                      });
                    }
                  });
                });
              }
              else if (node == 'slot_3_1518767220139') {
                tag = "topupTelco";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getTelcos(function(err, telcos){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, telcos:telcos});
                  }
                  dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, telcos:telcos});
                    }
                    if(accounts.length == 0){
                      tag = 'noAccount'
                      responseText = "You do not have an account. Please add one to use my services..."
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, telcos:telcos});
                    }
                    else {
                      dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, telcos:telcos});
                        }
                        responseText = response.output.text;
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, telcos:telcos});
                      });
                    }
                  });
                });
              }
              else if (node == 'slot_112_1512392084478') {
                tag = "transferAmount";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                kycServices.resolveAccount(context.recipientAccount, context.recipientBank, function(err, accountDetails){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accountDetails.status.toString() == 'true'){
                    context.recipientName = accountDetails.data.account_name
                    dataServices.getBeneficiary(context.recipientAccount, context.accountNo, function(err, beneficiaries){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      if(beneficiaries.length == 0){
                        dataServices.addBeneficiary(context.recipientAccount, context.recipientName, context.recipientBank, context.accountNo, function(err, beneficiaries){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          }
                          dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                            if(err) {
                              responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                            }
                            dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                              if(err) {
                                responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                              }
                              responseText = 'I have added ' + context.recipientName + ' as a beneficiary.' + response.output.text;
                              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                            });
                          });
                        });
                      }
                      else {
                        dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                          }
                          dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                            if(err) {
                              responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                            }
                            responseText = 'You want make a transfer to ' + context.recipientName + '. ' + response.output.text;
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          });
                        });
                      }
                    });
                  }
                  else {
                    tag = 'accountNotResolved'
                    var conv_id = response.context.conversation_id;
                    response.context.clear;
                    response.context = {conv_id};
                    context = response.context;
                    responseText = "Sorry, something went wrong with the account resolution"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                });
              }
              else if (node == 'slot_118_1512392222714') {
                tag = "OTPTransfer";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  }
                  paymentServices.transferBankIT(user[0].FIRST_NAME, user[0].LAST_NAME, user[0].EMAIL, context.accountNo, context.transferAmount, accounts, function(err, bankITResponse){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                    }
                    if(bankITResponse.status == '0'){
                      context.bankIT = bankITResponse
                      dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        }
                        responseText = response.output.text
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      });
                    }
                    else {
                      tag="transferNotResolved"
                      //clear context on login
                      var conv_id = response.context.conversation_id;
                      response.context.clear;
                      response.context = {conv_id};
                      context = response.context;
                      responseText = bankITResponse
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                    }
                  });
                });
              }
              else if (node == 'slot_14_1518767604056') {
                tag = "OTPTopup";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  }
                  paymentServices.topupBankIT(user[0].FIRST_NAME, user[0].LAST_NAME, user[0].EMAIL, context.accountNo, context.topupAmount, accounts, function (err, bankITResponse){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                    }
                    if(bankITResponse.status == '0'){
                      context.bankIT = bankITResponse
                      dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        }
                        responseText = response.output.text
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      });
                    }
                    else {
                      tag="topupNotResolved"
                      //clear context on login
                      var conv_id = response.context.conversation_id;
                      response.context.clear;
                      response.context = {conv_id};
                      context = response.context;
                      responseText = bankITResponse
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                    }
                  });
                });
              }
              else if (node == 'slot_124_1512392787024') {
                tag = "transferConfirm";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                paymentServices.balanceSwitchIT(function(err, switchITResponse){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(switchITResponse.length > 1){
                    if((parseFloat(switchITResponse[1]) - 10000.00) > parseFloat(context.transferAmount)) {
                      dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        }
                        dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          }

                          responseText = response.output.text;
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        });
                      });
                    }
                    else {
                      tag="transferNotResolved"
                      //clear context on login
                      var conv_id = response.context.conversation_id;
                      response.context.clear;
                      response.context = {conv_id};
                      context = response.context;
                      responseText = 'Sorry, Kira can nnot process transaction at this time.'
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    }
                  }
                  else {
                    tag="transferNotResolved"
                    //clear context on login
                    var conv_id = response.context.conversation_id;
                    response.context.clear;
                    response.context = {conv_id};
                    context = response.context;
                    responseText = switchITResponse
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                });
              }
              else if (node == 'slot_17_1518767683964') {
                tag = "topupConfirm";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                paymentServices.balanceSwitchIT(function(err, switchITResponse){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(switchITResponse.length > 1){
                    if((parseFloat(switchITResponse[1]) - 10000.00) > parseFloat(context.topupAmount)) {
                      dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        }
                        dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          }

                          responseText = response.output.text;
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        });
                      });
                    }
                    else {
                      tag="topupNotResolved"
                      //clear context on login
                      var conv_id = response.context.conversation_id;
                      response.context.clear;
                      response.context = {conv_id};
                      context = response.context;
                      responseText = 'Sorry, Kira can nnot process transaction at this time.'
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    }
                  }
                  else {
                    tag="topupNotResolved"
                    //clear context on login
                    var conv_id = response.context.conversation_id;
                    response.context.clear;
                    response.context = {conv_id};
                    context = response.context;
                    responseText = switchITResponse
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                });
              }
              else if (node == 'slot_11_1518767521877') {
                tag = "topupAmount";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    }
                    responseText = response.output.text;
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  });
                });
              }
              else {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if(entity.entity == 'boolean'){
              if (node == 'slot_68_1512742079627') {
                tag="deleteAccountConfirmed";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                if(context.deleteAccount && context.deleteAccount.split(":")[1] == 'yes'){
                  dataServices.deleteAccountNo(context.accountNo, function(err, accounts){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    }
                    dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      if(accounts.length == 0){
                        tag = 'noAccount'
                        responseText = "You do not have an account. Please add one to use my services..."
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      else {
                        var conv_id = response.context.conversation_id;
                        response.context.clear;
                        response.context = {conv_id};
                        context = response.context;
                        dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          }
                          responseText = response.output.text
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        });
                      }
                    });
                  });
                }
                else {
                  tag="deleteAccountDeclined";
                  var conv_id = response.context.conversation_id;
                  response.context.clear;
                  response.context = {conv_id};
                  context = response.context;
                  responseText = response.output.text;
                  //emits the response message to front-end
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                }
              }
              else if (node == 'slot_79_1512742780539') {
                tag="deleteCardConfirmed";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                if(context.deleteCard && context.deleteCard.split(":")[1] == 'yes'){
                  dataServices.deleteCardNo(context.accountNo, function(err, accounts){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    }
                    dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      if(accounts.length == 0){
                        tag = 'noAccount'
                        responseText = "You do not have an account. Please add one to use my services..."
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      else {
                        var conv_id = response.context.conversation_id;
                        response.context.clear;
                        response.context = {conv_id};
                        context = response.context;
                        dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          }
                          responseText = response.output.text
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        });
                      }
                    });
                  });
                }
                else {
                  tag="deleteCardDeclined";
                  var conv_id = response.context.conversation_id;
                  response.context.clear;
                  response.context = {conv_id};
                  context = response.context;
                  responseText = response.output.text;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                }
              }
              else if (node == 'slot_20_1516504525926') {
                tag="addAccountConfirmed";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                if(context.addAccount && context.addAccount.split(":")[1] == 'yes'){
                  dataServices.addAccountNo(context.accountNo, context.bankName, user[0].BVN, context.accountType, function(err, accounts){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    }
                    dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      if(accounts.length == 0){
                        tag = 'noAccount'
                        responseText = "You do not have an account. Please add one to use my services..."
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      else {
                        var conv_id = response.context.conversation_id;
                        response.context.clear;
                        response.context = {conv_id};
                        context = response.context;
                        dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          }
                          responseText = response.output.text
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        });
                      }
                    });
                  });
                }
                else {
                  tag="addAccountDeclined";
                  var conv_id = response.context.conversation_id;
                  response.context.clear;
                  response.context = {conv_id};
                  context = response.context;
                  responseText = response.output.text;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                }
              }
              else if (node == 'slot_25_1517317664919') {
                tag="addCardConfirmed";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                if(context.addCard && context.addCard.split(":")[1] == 'yes'){
                  console.log(context.cardBrand)
                  dataServices.addCardNo(context.cardNo, user[0].BVN, context.accountNo, context.cardBrand, context.cardType, context.expiryMonth, context.expiryYear, function(err, accounts){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    }
                    dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                      if(err) {
                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      if(accounts.length == 0){
                        tag = 'noAccount'
                        responseText = "You do not have an account. Please add one to use my services..."
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                      }
                      else {
                        var conv_id = response.context.conversation_id;
                        response.context.clear;
                        response.context = {conv_id};
                        context = response.context;
                        dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          }
                          responseText = response.output.text
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        });
                      }
                    });
                  });
                }
                else {
                  tag="addCardDeclined";
                  var conv_id = response.context.conversation_id;
                  response.context.clear;
                  response.context = {conv_id};
                  context = response.context;
                  responseText = response.output.text;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                }
              }
              else if (node == 'slot_42_1517395273138') {
                tag="transferConfirmed";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                if(context.transferFund && context.transferFund.split(":")[1] == 'yes'){
                  paymentServices.finalBankIT(context.esaCode, context.bankIT.requestid, context.bankIT.sessionid, function (err, bankITResponse){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    }
                    if(bankITResponse.status){
                      context.bankIT = bankITResponse
                      dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        }
                        paymentServices.transferSwitchIT(context.recipientAccount, context.transferAmount, accounts, function(err, switchITResponse) {
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          }
                          context.switchIT = switchITResponse
                          if(switchITResponse.length > 1){
                            dataServices.getAccountNo(context.accountNo, function(err, accounts){
                              if(err) {
                                responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                              }
                              dataServices.updateSpend(context.accountNo, accounts[0].SPEND, context.transferAmount, function(err, accounts){
                                if(err) {
                                  responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                                }
                                dataServices.addFundTransfer(user[0].BVN, context.accountNo, context.recipientAccount, context.transferAmount, context.bankIT.sessionid, context.switchIT[2], context.esaCode, context.bankIT.status, context.switchIT[0], function(err, receipt) {
                                  if(err) {
                                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                                  }
                                  dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                                    if(err) {
                                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                    }
                                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                                      if(err) {
                                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                      }
                                      receipt = {'account':context.accountNo,'recipientNo':context.recipientAccount, 'recipientName':context.recipientName, 'recipientBank':context.recipientBank, 'amount':context.transferAmount,'status':context.bankIT.sessionid}
                                      console.log('================receipt============');
                                      console.log(receipt);
                                      console.log('================context============');
                                      console.log(context);
                                      responseText = response.output.text;

                                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                    });
                                  });
                                })
                              })
                            })
                          }
                          else {
                            dataServices.addFundTransfer(user[0].BVN, context.accountNo, context.recipientAccount, context.transferAmount, context.bankIT.sessionid, context.switchIT[2], context.esaCode, context.bankIT.status, context.switchIT[0], function(err, receipt) {
                              if(err) {
                                responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                              }
                              dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                                if(err) {
                                  responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                }
                                dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                                  if(err) {
                                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                  }
                                  tag="transferDeclined";
                                  var conv_id = response.context.conversation_id;
                                  response.context.clear;
                                  response.context = {conv_id};
                                  context = response.context;
                                  responseText = switchITResponse;
                                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                });
                              });
                            })
                          }
                        });
                      });
                    }
                    else {
                      dataServices.addFundTransfer(user[0].BVN, context.accountNo, context.recipientAccount, context.transferAmount, context.bankIT.sessionid, context.switchIT[2], context.esaCode, context.bankIT.status, context.switchIT[0], function(err, receipt) {
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        }
                        dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                          }
                          dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                            if(err) {
                              responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                            }
                            tag="transferDeclined";
                            var conv_id = response.context.conversation_id;
                            response.context.clear;
                            response.context = {conv_id};
                            context = response.context;
                            responseText = bankITResponse;
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                          });
                        });
                      })
                    }
                  });
                }
                else {
                  tag="transferDeclined";
                  var conv_id = response.context.conversation_id;
                  response.context.clear;
                  response.context = {conv_id};
                  context = response.context;
                  responseText = response.output.text;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                }
              }
              else if (node == 'slot_20_1518767730864') {
                tag="topupConfirmed";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                if (context.topupAirtime && context.topupAirtime.split(":")[1] == 'yes') {
                  paymentServices.finalBankIT(context.esaCode, context.bankIT.requestid, context.bankIT.sessionid, function (err, bankITResponse) {
                    if (err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    }
                    console.log('BANKIT RESPONSE')
                    console.log(bankITResponse)
                    console.log(bankITResponse.status)
                    if (bankITResponse.status) {
                      context.bankIT = bankITResponse
                      dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                        if (err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        }
                        paymentServices.topupSwitchIT(context.topupPhone, context.topupAmount, user[0].FIRST_NAME, context.telcoName, function(err, switchITResponse) {
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                          }
                          context.switchIT = switchITResponse
                          if(switchITResponse.length > 1){
                            dataServices.getAccountNo(context.accountNo, function(err, accounts){
                              if(err) {
                                responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                              }
                              dataServices.updateSpend(context.accountNo, accounts[0].SPEND, context.transferAmount, function(err, accounts){
                                if(err) {
                                  responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                                }
                                dataServices.addAirtimeTopup(user[0].BVN, context.accountNo, context.telcoName, context.transferAmount, context.bankIT.sessionid, context.switchIT[2], context.esaCode, context.bankIT.status, context.switchIT[0], function(err, receipt) {
                                  if(err) {
                                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                                  }
                                  dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                                    if(err) {
                                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                    }
                                    dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                                      if(err) {
                                        responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                      }
                                      console.log('================transactions============');
                                      console.log(transactions);
                                      responseText = response.output.text;
                                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                    });
                                  });
                                })
                              })
                            })
                          }
                          else {
                            dataServices.addAirtimeTopup(user[0].BVN, context.accountNo, context.telcoName, context.transferAmount, context.bankIT.sessionid, context.switchIT[2], context.esaCode, context.bankIT.status, context.switchIT[0], function(err, receipt) {
                              if(err) {
                                responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                              }
                              dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                                if(err) {
                                  responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                }
                                dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                                  if(err) {
                                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                  }
                                  tag="topupDeclined";
                                  var conv_id = response.context.conversation_id;
                                  response.context.clear;
                                  response.context = {conv_id};
                                  context = response.context;
                                  responseText = switchITResponse;
                                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                                });
                              });
                            })
                          }
                        });
                      });
                    }
                    else {
                      dataServices.addAirtimeTopup(user[0].BVN, context.accountNo, context.telcoName, context.transferAmount, context.bankIT.sessionid, context.switchIT[2], context.esaCode, context.bankIT.status, context.switchIT[0], function(err, receipt) {
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        }
                        dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                          }
                          dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                            if(err) {
                              responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                            }
                            tag="topupDeclined";
                            var conv_id = response.context.conversation_id;
                            response.context.clear;
                            response.context = {conv_id};
                            context = response.context;
                            responseText = bankITResponse;
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                          });
                        });
                      })
                    }
                  });
                }
                else {
                  tag="topupDeclined";
                  var conv_id = response.context.conversation_id;
                  response.context.clear;
                  response.context = {conv_id};
                  context = response.context;
                  responseText = response.output.text;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                }
              }
              else {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if(entity.entity == 'bankName'){
              if (node == 'slot_59_1513161461083') {
                tag="accountType";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                kycServices.resolveAccount(context.accountNo, context.bankName, function(err, accountDetails){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                  if(accountDetails.status.toString() == 'true'){
                    if(((accountDetails.data.account_name.split(' ')[0] == user[0].FIRST_NAME.toUpperCase()) || (accountDetails.data.account_name.split(' ')[0] == user[0].LAST_NAME.toUpperCase())) && ((accountDetails.data.account_name.split(' ')[2] == user[0].FIRST_NAME.toUpperCase()) || (accountDetails.data.account_name.split(' ')[2] == user[0].LAST_NAME.toUpperCase()))){
                      dataServices.updateUser(accountDetails.data.account_name.split(' ')[1], user[0].FIRST_NAME,function(err, users){
                        if(err) {
                          responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        }
                        dataServices.getAccountTypes(function(err, account_types){
                          if(err) {
                            responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                          }
                          console.log('========userBVN==========');
                          console.log(user)
                          console.log(user[0].BVN);
                          dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                            if(err) {
                              responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                            }
                            dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                              if(err) {
                                responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                              }
                              responseText = response.output.text;
                              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                            });
                          });
                        });
                      });
                    }
                    else {
                      tag = 'accountNotResolved'
                      var conv_id = response.context.conversation_id;
                      response.context.clear;
                      response.context = {conv_id};
                      context = response.context;
                      responseText = "It seems this account does not belonng to you."
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                    }
                  }
                  else {
                    tag = 'accountNotResolved'
                    var conv_id = response.context.conversation_id;
                    response.context.clear;
                    response.context = {conv_id};
                    context = response.context;
                    responseText = "Sorry, something went wrong with the account resolution"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  }
                });
              }
              else if (node == 'slot_109_1512391635867') {
                tag="recipientAccount";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  }
                  dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                    }
                    responseText = response.output.text;
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  });
                });
              }
              else {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if(entity.entity == 'accountType'){
              if (node == 'slot_1_1513161801118') {
                tag="addAccountConfirm";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  }
                  dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                    }
                    responseText = response.output.text;
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  });
                });
              }
              else {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if(entity.entity == 'telcoName'){
              if (node == 'slot_8_1518767273396') {
                tag="topupPhone";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  }
                  dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                    }
                    responseText = response.output.text;
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  });
                });
              }
              else {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if(entity.entity == 'month'){
              if (node == 'slot_50_1512740180862') {
                tag="expiryYear";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  }
                  dataServices.getTransactionBVN(user[0].BVN, function(err, transactions){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                    }
                    responseText = response.output.text;
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  });
                });
              }
              else {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else if(entity.entity == 'budget'){
              if (node == 'slot_2_1521036739901') {
                tag="viewBudget";
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                dataServices.getAccountBVN(user[0].BVN, function(err, accounts){
                  if(err) {
                    responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types});
                  }
                  analytics.getTransactionBVN(user[0].BVN, function(err, transactions){
                    if(err) {
                      responseText = "Sorry, something went wrong! Please can you try and refresh your device"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, receipt:receipt});
                    }
                    console.log('View Budget');
                    console.log(response.input.text);

                    responseText = response.output.text;
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions, account_types:account_types, timeString:timeString, amount:amount, classification:classification});
                  });
                });
              }
              else {
                console.log(JSON.stringify(response, null, 2));
                context = response.context;
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
              }
            }
            else {
              console.log(JSON.stringify(response, null, 2));
              context = response.context;
              responseText = response.output.text
              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
            }
          }
          else {
            console.log(JSON.stringify(response, null, 2));
            context = response.context;
            responseText = response.output.text
            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
          }
        }
        else {
          responseText = 'Sorry, Kira is unavaiable at the moment. Please refresh to wake her up!'
          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
        }
      }
    });
    // message received from client, now broadcast it to everyone else
    //socket.emit('server:message', data);
  });

  //disconnect socketIo
  socket.on('disconnect', function () {
    console.log(username + ' disconnected');
  });
});


exports.default = app;
