import http from 'http';
import express from 'express';
import cors from 'cors';
import io from 'socket.io';
import config from '../config/config.json';
import path from 'path';

// setup server
const app = express();
const server = http.createServer(app);

const socketIo = io(server);

// setup environment variables
require('dotenv').config({
  silent: true
});
var username = ''

// setup session handlers
const session = require('express-session')({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true
});
const sharedsession = require('express-socket.io-session');


// setup watson service
const watson = require('watson-developer-cloud');
const kira = watson.conversation({
  username: process.env.ASSISTANT_USERNAME,
  password: process.env.ASSISTANT_PASSWORD,
  version: 'v1',
  version_date: '2018-02-16'
});
const WorkspaceID = process.env.WORKSPACE_ID

var tag = '...'
var context = {}
var responseText = ''

// setup banking services
const request = require('request');
var querystring = require('querystring');
var bank = 'http://localhost:5500'
var user, accounts, transactions = []

// Allow CORS
app.use(cors());
app.use(session);

// Render a API index page
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// Start listening
server.listen(process.env.PORT || config.port);
console.log(`Started on port ${config.port}`);

// Setup socket.io
socketIo.use(sharedsession(session, {
    autoSave:true
}));

socketIo.on('connection', socket => {

  // session
  socket.handshake.session.userdata = user;
  socket.handshake.session.save();

  // registration
  socket.on('client:register', data => {

    // ===== Resolve new user BVN =====
    var form = {
      bvn: data.bvn
    };

    var formData = querystring.stringify(form);
    var contentLength = formData.length;

    const options = {
      url: bank+"/kyc/user",
      headers: {
        'Content-Length': contentLength,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData,
      method: 'POST'
    };
    request(options, function(err, res, newUser) {
      if (err) {
        console.log('error:', err)
        // error handling
        tag="false"
        socket.emit('server:registration', {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag});
      }
      var newUser = JSON.parse(newUser)
      if( newUser.status.toString() == "true" ) {
        // ===== Check if new user already exist in DB =====
        const options = {
            url: bank+"/user",
            method: 'GET',
            headers: {
                'phone': data.phone
            }
        };
        request(options, function(err, res, User) {
          if (err) {
            console.log('error:', err)
            // error handling
            tag="false"
            socket.emit('server:registration', {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag});
          }
          user = JSON.parse(User)
          if (user.length == 0){
            // ===== Validate new user info ======
            if( newUser.data.first_name == data.firstName.toUpperCase() ) {
              if( newUser.data.last_name == data.lastName.toUpperCase() ) {
                if( newUser.data.mobile == data.phone.toUpperCase() ) {
                  // ===== Generate unique HASH for new user ======
                  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                  var token = '';
                  for (var i = 16; i > 0; --i) {
                    token += chars[Math.round(Math.random() * (chars.length - 1))];
                  }
                  // ===== Store new user info in DB ======
                  var form = {
                    bvn: newUser.data.bvn,
                    email: data.email.toUpperCase(),
                    phone: newUser.data.mobile,
                    first_name: newUser.data.first_name,
                    middle_name: '',
                    last_name: newUser.data.last_name,
                    dob: newUser.data.dob,
                    status: 'Inactive',
                    password: data.password,
                    hash: token
                  };

                  var formData = querystring.stringify(form);
                  var contentLength = formData.length;

                  const options = {
                    url: bank+"/user",
                    headers: {
                      'Content-Length': contentLength,
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData,
                    method: 'POST'
                  };
                  request(options, function(err, res, register) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit('server:registration', {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag});
                    }
                    var register = JSON.parse(register)
                    if (register[0].status == "Success"){
                      tag="false"
                      // TO-Do: send email notification
                      socket.emit('server:registration', {username: 'Kira', message: 'Successfully registered. Please check email to verify your account.', tag:tag});
                    }
                    else {
                      tag="false"
                      socket.emit('server:authentication', {username: 'Kira', message: 'Sorry, something went wrong! Please try again in 5 mins.', tag:tag});
                    }
                  });
                }
                else {
                  // error handling
                  tag="false"
                  socket.emit('server:registration', {username: 'Kira', message: 'Mobile phone number is not correct', tag:tag});
                }
              }
              else {
                // error handling
                tag="false"
                socket.emit('server:registration', {username: 'Kira', message: 'Last name is not correct', tag:tag});
              }
            }
            else {
              // error handling
              tag="false"
              socket.emit('server:registration', {username: 'Kira', message: 'First name is not correct', tag:tag});
            }
          }
          else {
            // error handling
            tag="false"
            //emits the response message to front-end App.js
            socket.emit('server:registration', {username: 'Kira', message: 'User already exists', tag:tag});
          }
        });
      }
      else {
        // error handling
        tag="false"
        socket.emit('server:registration', {username: 'Kira', message: 'Sorry, your BVN was unabbled to be validated! Please be sure your information is correct and try again.', tag:tag});
      }
    });

  });

  // verification
  socket.on('client:verify', function (url) {

    // ==== Get token from URL =====
    if(url.url.split("?")[1] !== undefined){
      // ====== update user status =====
      var form = {
        key: STATUS_ID,
        value: 2,
        hash: url.url.split("?")[1]
      };

      var formData = querystring.stringify(form);
      var contentLength = formData.length;

      const options = {
        url: bank+"/kyc/user",
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData,
        method: 'PUT'
      };
      request(options, function(err, res, User) {
        if (err) {
          console.log('error:', err)
          // error handling
          tag="false"
          socket.emit('server:registration', {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag});
        }
      });
    }
  });

  // authentication
  socket.on('client:authenticate', data => {

    username = data.username

    // ====== Get user info ====
    const options = {
        url: bank+"/user",
        method: 'GET',
        headers: {
            'phone': username
        }
    };
    request(options, function(err, res, User) {
      if (err) {
        console.log('error:', err)
        // error handling
        tag="false"
        //emits the response message to front-end
        socket.emit('server:authentication', {username: 'Kira', message: 'Sorry, please ensure your Log in details are properly inputed', tag:tag});
      }
      user = JSON.parse(User)
      if (user.length == 0) {
        // error handling
        tag="false"
        socket.emit('server:authentication', {username: 'Kira', message: 'Sorry, you are not a registered user', tag:tag});
      }
      else {
        if(user[0].STATUS_ID == 2){
          if (data.password == user[0].PASSWORD) {
            // ====== Update with latest signin time ====
            var form = {
              key: 'LAST_SIGNIN',
              value: Date.now(),
              phone: username
            };

            var formData = querystring.stringify(form);
            var contentLength = formData.length;

            const options = {
              url: bank+"/user",
              headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: formData,
              method: 'PUT'
            };
            request(options, function(err, res, signin) {
              if (err) {
                console.log('error:', err)
                // error handling
                tag="false"
                socket.emit('server:authentication', {username: 'Kira', message: 'Sorry, please ensure your Log in details are properly inputed', tag:tag});
              }
              signin = JSON.parse(signin)
              if (signin[0].status == "Success"){
                tag="true"
                //TO-DO: send email notification
                socket.emit('server:authentication', {username: 'Kira', message: 'Successfully logged in', tag:tag});
              }
              else {
                tag="false"
                socket.emit('server:authentication', {username: 'Kira', message: 'Sorry, something went wrong! Please try again in 5 mins.', tag:tag});
              }
            });
          }
          else {
            console.log("passwords dont match");
            // error handling
            tag="false"
            socket.emit('server:authentication', {username: 'Kira', message: 'Sorry, password is incorrect', tag:tag});
          }
        }
        else {
          console.log("User is not active");
          // error handling
          tag="false"
          //emits the response message to front-end
          socket.emit('server:authentication', {username: 'Kira', message: 'Please activate your account using link in email received at registration.', tag:tag});
        }
      }
    });
  });

  // reset password
  socket.on('client:resetPassword', function (data) {

    // ===== Check if new user already exist in DB =====
    const options = {
        url: bank+"/user",
        method: 'GET',
        headers: {
            'phone': data.phone
        }
    };
    request(options, function(err, res, User) {
      if (err) {
        console.log('error:', err)
        // error handling
        tag="false"
        socket.emit('server:password', {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag});
      }
      user = JSON.parse(User)
      if (user.length == 0){
        // error handling
        tag="false"
        socket.emit('server:password', {username: 'Kira', message: 'User phone does not exists', tag:tag});
      }
      else {
        // Generate random password
        var randomstring = Math.random().toString(36).slice(-8);
        // ====== update user status =====
        var form = {
          key: PASSWORD,
          value: randomstring,
          phone: data.phone
        };

        var formData = querystring.stringify(form);
        var contentLength = formData.length;

        const options = {
          url: bank+"/kyc/user",
          headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData,
          method: 'PUT'
        };
        request(options, function(err, res, User) {
          if (err) {
            console.log('error:', err)
            // error handling
            tag="false"
            socket.emit('server:password', {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag});
          }
          //TO-DO: Send Email Notification
          tag="false"
          socket.emit('server:password', {username: 'Kira', message: 'New password generated for you. Please check your email.', tag:tag});
        });
      }
    });
  });

  //chatbot
  socket.on('client:chat', data => {

    console.log(user[0].FIRST_NAME + ': ' + data.message);
    var username = data.username
    var inputText = data.message
    var namespace = 'server:chatbot'+'/'+socket.handshake.session.userdata[0].PHONE

    //preprocess
    // if (tag == "viewAccount") {
    //   console.log(typeof(data.message))
    // }

    //model
    kira.message({
      workspace_id: WorkspaceID,
      input: { 'text': data.message },
      context: context,
    },  function (err, response) {
      if (err) {
        console.log('error:', err);
        responseText = 'Sorry, Kira is unavaiable at the moment. Please refresh to wake her up!'
        socket.emit(namespace, {username: 'Kira', message: responseText, user:user});
      }
      else {
        if(response.output.text){
          console.log(JSON.stringify(response, null, 2));
          if (response.intents && response.intents[0]) {
            var intent = response.intents[0];
            tag = intent.intent
            if (tag == "hello"){
              if (intent.confidence >= 0.5) {
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  if (accounts.length == 0){
                    tag = 'noAccount'
                    responseText = "Hello" + ' ' + user[0].FIRST_NAME + ' Welcome to CASBA! Oops!! Looks like you need to add an account'
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                  }
                  else {
                    responseText = response.output.text
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                  }
                });
              }
              else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (tag == "capabilities"){
              if (intent.confidence >= 0.5) {
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  responseText = response.output.text
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              }
              else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (tag == "userInfo"){
              if (intent.confidence >= 0.5) {
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  const options = {
                      url: bank+"/user/transaction",
                      method: 'GET',
                      headers: {
                          'bvn': user[0].BVN
                      }
                  };
                  request(options, function(err, res, Transactions) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user, accounts:accounts});
                    }
                    transactions = JSON.parse(Transactions)
                    responseText = response.output.text
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  });
                });
              }
              else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (tag == "viewAccount"){
              if (intent.confidence >= 0.5) {
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              }
              else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (tag == "addAccount"){
              if (intent.confidence >= 0.5) {
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              }
              else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (tag == "addCard"){
              if (intent.confidence >= 0.5) {
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              }
              else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (tag == "deleteCard"){
              if (intent.confidence >= 0.5) {
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              }
              else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (tag == "deleteAccount"){
              if (intent.confidence >= 0.5) {
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              }
              else {
                responseText = 'I did not understand your intent. Please can type in your request again.';
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else {
              responseText = response.output.text
              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
            }
          }
          else if (response.entities && response.entities[0]) {
            var entity = response.entities[0];
            if(entity.entity == 'sys-number'){
              var node = response.output.nodes_visited[0]
              if (node == 'slot_15_1512736644141') {
                tag = 'accountInfo'
                const options = {
                    url: bank+"/account",
                    method: 'GET',
                    headers: {
                        'account_no': response.context.accountNo
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  const options = {
                      url: bank+"/account/transaction",
                      method: 'GET',
                      headers: {
                          'account_no': response.context.accountNo
                      }
                  };
                  request(options, function(err, res, Transactions) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user, accounts:accounts});
                    }
                    transactions = JSON.parse(Transactions)
                    responseText = response.output.text
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                  });
                });
              }
              else if (node == 'slot_9_1513159178495') {
                tag = 'accountBank'
                const options = {
                    url: bank+"/bank",
                    method: 'GET'
                };
                request(options, function(err, res, Banks) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  var banks = JSON.parse(Banks)
                  const options = {
                      url: bank+"/user/account",
                      method: 'GET',
                      headers: {
                          'bvn': user[0].BVN
                      }
                  };
                  request(options, function(err, res, Accounts) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                    }
                    accounts = JSON.parse(Accounts)
                    responseText = response.output.text
                    context = response.context;
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, banks:banks});
                  });
                });
              }
              else if (node == 'slot_44_1512739536738') {
                tag = 'cardNumber'
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              }
              else if (node == 'slot_47_1512740079248') {
                tag = 'expiryMonth'
                var form = {
                  card_no: response.context.cardNo
                };

                var formData = querystring.stringify(form);
                var contentLength = formData.length;

                const options = {
                  url: bank+"/kyc/card",
                  headers: {
                    'Content-Length': contentLength,
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: formData,
                  method: 'POST'
                };
                request(options, function(err, res, CardDetails) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  var cardDetails = JSON.parse(CardDetails)
                  if(cardDetails.status.toString() == 'true'){
                    const options = {
                        url: bank+"/account",
                        method: 'GET',
                        headers: {
                            'account_no': response.context.accountNo
                        }
                    };
                    request(options, function(err, res, Accounts) {
                      if (err) {
                        console.log('error:', err)
                        // error handling
                        tag="false"
                        socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                      }
                      accounts = JSON.parse(Accounts)
                      if (cardDetails.data.bank == accounts[0].FULL_NAME) {
                        const options = {
                            url: bank+"/user/account",
                            method: 'GET',
                            headers: {
                                'bvn': user[0].BVN
                            }
                        };
                        request(options, function(err, res, Accounts) {
                          if (err) {
                            console.log('error:', err)
                            // error handling
                            tag="false"
                            socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                          }
                          accounts = JSON.parse(Accounts)
                          responseText = response.output.text
                          response.context["cardBrand"] = cardDetails.data.brand
                          response.context["cardType"] = cardDetails.data.card_type
                          context = response.context;
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                        });
                      }
                      else {
                        const options = {
                            url: bank+"/user/account",
                            method: 'GET',
                            headers: {
                                'bvn': user[0].BVN
                            }
                        };
                        request(options, function(err, res, Accounts) {
                          if (err) {
                            console.log('error:', err)
                            // error handling
                            tag="false"
                            socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                          }
                          tag = 'accountNotResolved'
                          responseText = "It seems the card does not link to the account selected. Please try to add the card again"
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                        });
                      }
                    });
                  }
                  else {
                    const options = {
                        url: bank+"/user/account",
                        method: 'GET',
                        headers: {
                            'bvn': user[0].BVN
                        }
                    };
                    request(options, function(err, res, Accounts) {
                      if (err) {
                        console.log('error:', err)
                        // error handling
                        tag="false"
                        socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                      }
                      tag = 'accountNotResolved'
                      responseText = "Sorry, something went wrong with the card resolution"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                    });
                  }
                });
              }
              else if (node == 'slot_6_1513171646227') {
                tag = 'addCardConfirm'
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              }
              else if (node == 'slot_76_1512742701987') {
                tag = 'deleteCardConfirm'
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              }
              else if (node == 'slot_65_1512741991094') {
                tag = 'deleteAccountConfirm'
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              }
              else {
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (entity.entity == 'bankName') {
              var node = response.output.nodes_visited[0]
              if (node == 'slot_59_1513161461083') {
                tag = 'accountType'
                var form = {
                  account_no: response.context.accountNo,
                  bank_name: response.context.bankName
                };

                var formData = querystring.stringify(form);
                var contentLength = formData.length;

                const options = {
                  url: bank+"/kyc/account",
                  headers: {
                    'Content-Length': contentLength,
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: formData,
                  method: 'POST'
                };
                request(options, function(err, res, AccountDetails) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  var accountDetails = JSON.parse(AccountDetails)
                  if(accountDetails.status.toString() == 'true'){
                    if(((accountDetails.data.account_name.split(' ')[0] == user[0].FIRST_NAME.toUpperCase()) || (accountDetails.data.account_name.split(' ')[0] == user[0].LAST_NAME.toUpperCase())) && ((accountDetails.data.account_name.split(' ')[2] == user[0].FIRST_NAME.toUpperCase()) || (accountDetails.data.account_name.split(' ')[2] == user[0].LAST_NAME.toUpperCase()))){
                      const options = {
                          url: bank+"/account/type",
                          method: 'GET'
                      };
                      request(options, function(err, res, AccountTypes) {
                        if (err) {
                          console.log('error:', err)
                          // error handling
                          tag="false"
                          socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                        }
                        var account_types = JSON.parse(AccountTypes)
                        const options = {
                            url: bank+"/user/account",
                            method: 'GET',
                            headers: {
                                'bvn': user[0].BVN
                            }
                        };
                        request(options, function(err, res, Accounts) {
                          if (err) {
                            console.log('error:', err)
                            // error handling
                            tag="false"
                            socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                          }
                          accounts = JSON.parse(Accounts)
                          responseText = response.output.text
                          context = response.context;
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, account_types:account_types});
                        });
                      });
                    }
                    else {
                      const options = {
                          url: bank+"/user/account",
                          method: 'GET',
                          headers: {
                              'bvn': user[0].BVN
                          }
                      };
                      request(options, function(err, res, Accounts) {
                        if (err) {
                          console.log('error:', err)
                          // error handling
                          tag="false"
                          socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                        }
                        tag = 'accountNotResolved'
                        responseText = "Sorry, something went wrong with the account resolution"
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                      });
                    }
                  }
                  else {
                    const options = {
                        url: bank+"/user/account",
                        method: 'GET',
                        headers: {
                            'bvn': user[0].BVN
                        }
                    };
                    request(options, function(err, res, Accounts) {
                      if (err) {
                        console.log('error:', err)
                        // error handling
                        tag="false"
                        socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                      }
                      tag = 'accountNotResolved'
                      responseText = "Sorry, something went wrong with the account resolution"
                      socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                    });
                  }
                });
              } else {
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (entity.entity == 'accountType') {
              var node = response.output.nodes_visited[0]
              if (node == 'slot_1_1513161801118') {
                tag = 'addAccountConfirm'
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              } else {
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (entity.entity == 'month') {
              var node = response.output.nodes_visited[0]
              if (node == 'slot_50_1512740180862') {
                tag = 'expiryYear'
                const options = {
                    url: bank+"/user/account",
                    method: 'GET',
                    headers: {
                        'bvn': user[0].BVN
                    }
                };
                request(options, function(err, res, Accounts) {
                  if (err) {
                    console.log('error:', err)
                    // error handling
                    tag="false"
                    socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                  }
                  accounts = JSON.parse(Accounts)
                  responseText = response.output.text
                  context = response.context;
                  socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                });
              } else {
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else if (entity.entity == 'boolean') {
              var node = response.output.nodes_visited[0]
              if (node == 'slot_20_1516504525926') {
                if (response.context.addAccount && response.context.addAccount.split(":")[1] == 'yes') {
                  tag = 'addAccountConfirmed'
                  var form = {
                    account_no: response.context.accountNo,
                    bank_name: response.context.bankName,
                    account_type: response.context.accountType,
                    bvn: user[0].BVN
                  };

                  var formData = querystring.stringify(form);
                  var contentLength = formData.length;

                  const options = {
                    url: bank+"/account",
                    headers: {
                      'Content-Length': contentLength,
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData,
                    method: 'POST'
                  };
                  request(options, function(err, res, AddAccountStatus) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                    }
                    var addAccountStatus = JSON.parse(AddAccountStatus)
                    if (addAccountStatus[0].status != "Error"){
                      const options = {
                          url: bank+"/user/account",
                          method: 'GET',
                          headers: {
                              'bvn': user[0].BVN
                          }
                      };
                      request(options, function(err, res, Accounts) {
                        if (err) {
                          console.log('error:', err)
                          // error handling
                          tag="false"
                          socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                        }
                        accounts = JSON.parse(Accounts)
                        const options = {
                            url: bank+"/user/transaction",
                            method: 'GET',
                            headers: {
                                'bvn': user[0].BVN
                            }
                        };
                        request(options, function(err, res, Transactions) {
                          if (err) {
                            console.log('error:', err)
                            // error handling
                            tag="false"
                            socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user, accounts:accounts});
                          }
                          transactions = JSON.parse(Transactions)
                          responseText = response.output.text
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        });
                      });
                    } else {
                      const options = {
                          url: bank+"/user/account",
                          method: 'GET',
                          headers: {
                              'bvn': user[0].BVN
                          }
                      };
                      request(options, function(err, res, Accounts) {
                        if (err) {
                          console.log('error:', err)
                          // error handling
                          tag="false"
                          socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                        }
                        accounts = JSON.parse(Accounts)
                        responseText = user[0].FIRST_NAME + ' You already have this account in our record!'
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                      });
                    }
                  });
                }
                else {
                  tag = 'addAccountDeclined'
                  const options = {
                      url: bank+"/user/account",
                      method: 'GET',
                      headers: {
                          'bvn': user[0].BVN
                      }
                  };
                  request(options, function(err, res, Accounts) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                    }
                    accounts = JSON.parse(Accounts)
                    responseText = response.output.text
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                  });
                }
              }
              else if (node == 'slot_25_1517317664919') {
                if (response.context.addCard && response.context.addCard.split(":")[1] == 'yes') {
                  tag = 'addCardConfirmed'
                  var form = {
                    card_no: response.context.cardNo,
                    card_brand: response.context.cardBrand,
                    card_type: response.context.cardType,
                    expiry_month: response.context.expiryMonth,
                    expiry_year: response.context.expiryYear,
                    account_no: response.context.accountNo,
                    bvn: user[0].BVN
                  };

                  var formData = querystring.stringify(form);
                  var contentLength = formData.length;

                  const options = {
                    url: bank+"/card",
                    headers: {
                      'Content-Length': contentLength,
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData,
                    method: 'POST'
                  };
                  request(options, function(err, res, AddCardStatus) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                    }
                    var addCardStatus = JSON.parse(AddCardStatus)
                    if (addCardStatus[0].status != "Error"){
                      const options = {
                          url: bank+"/user/account",
                          method: 'GET',
                          headers: {
                              'bvn': user[0].BVN
                          }
                      };
                      request(options, function(err, res, Accounts) {
                        if (err) {
                          console.log('error:', err)
                          // error handling
                          tag="false"
                          socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                        }
                        accounts = JSON.parse(Accounts)
                        const options = {
                            url: bank+"/user/transaction",
                            method: 'GET',
                            headers: {
                                'bvn': user[0].BVN
                            }
                        };
                        request(options, function(err, res, Transactions) {
                          if (err) {
                            console.log('error:', err)
                            // error handling
                            tag="false"
                            socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user, accounts:accounts});
                          }
                          transactions = JSON.parse(Transactions)
                          responseText = response.output.text
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        });
                      });
                    } else {
                      const options = {
                          url: bank+"/user/account",
                          method: 'GET',
                          headers: {
                              'bvn': user[0].BVN
                          }
                      };
                      request(options, function(err, res, Accounts) {
                        if (err) {
                          console.log('error:', err)
                          // error handling
                          tag="false"
                          socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                        }
                        accounts = JSON.parse(Accounts)
                        responseText = user[0].FIRST_NAME + ' You already have this card in our record!'
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                      });
                    }
                  });
                }
                else {
                  tag = 'addCardDeclined'
                  const options = {
                      url: bank+"/user/account",
                      method: 'GET',
                      headers: {
                          'bvn': user[0].BVN
                      }
                  };
                  request(options, function(err, res, Accounts) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                    }
                    accounts = JSON.parse(Accounts)
                    responseText = response.output.text
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                  });
                }
              }
              else if (node == 'slot_79_1512742780539') {
                if (response.context.deleteCard && response.context.deleteCard.split(":")[1] == 'yes') {
                  tag = 'deleteCardConfirmed'
                  var form = {
                    account_no: response.context.accountNo,
                    bvn: user[0].BVN
                  };

                  var formData = querystring.stringify(form);
                  var contentLength = formData.length;

                  const options = {
                    url: bank+"/account/card",
                    headers: {
                      'Content-Length': contentLength,
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData,
                    method: 'DELETE'
                  };
                  request(options, function(err, res, DeleteCardStatus) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                    }
                    var deleteCardStatus = JSON.parse(DeleteCardStatus)
                    if (deleteCardStatus[0].status != "Error"){
                      const options = {
                          url: bank+"/user/account",
                          method: 'GET',
                          headers: {
                              'bvn': user[0].BVN
                          }
                      };
                      request(options, function(err, res, Accounts) {
                        if (err) {
                          console.log('error:', err)
                          // error handling
                          tag="false"
                          socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                        }
                        accounts = JSON.parse(Accounts)
                        const options = {
                            url: bank+"/user/transaction",
                            method: 'GET',
                            headers: {
                                'bvn': user[0].BVN
                            }
                        };
                        request(options, function(err, res, Transactions) {
                          if (err) {
                            console.log('error:', err)
                            // error handling
                            tag="false"
                            socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user, accounts:accounts});
                          }
                          transactions = JSON.parse(Transactions)
                          responseText = response.output.text
                          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                        });
                      });
                    } else {
                      const options = {
                          url: bank+"/user/account",
                          method: 'GET',
                          headers: {
                              'bvn': user[0].BVN
                          }
                      };
                      request(options, function(err, res, Accounts) {
                        if (err) {
                          console.log('error:', err)
                          // error handling
                          tag="false"
                          socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                        }
                        accounts = JSON.parse(Accounts)
                        responseText = user[0].FIRST_NAME + ' There is no card attached to this account!'
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                      });
                    }
                  });
                }
                else {
                  tag = 'deleteCardDeclined'
                  const options = {
                      url: bank+"/user/account",
                      method: 'GET',
                      headers: {
                          'bvn': user[0].BVN
                      }
                  };
                  request(options, function(err, res, Accounts) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                    }
                    accounts = JSON.parse(Accounts)
                    responseText = response.output.text
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                  });
                }
              }
              else if (node == 'slot_68_1512742079627') {
                if (response.context.deleteAccount && response.context.deleteAccount.split(":")[1] == 'yes') {
                  tag = 'deleteAccountConfirmed'
                  var form = {
                    account_no: response.context.accountNo,
                    bvn: user[0].BVN
                  };

                  var formData = querystring.stringify(form);
                  var contentLength = formData.length;

                  const options = {
                    url: bank+"/account",
                    headers: {
                      'Content-Length': contentLength,
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formData,
                    method: 'DELETE'
                  };
                  request(options, function(err, res, DeleteAccountStatus) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                    }
                    var deleteAccountStatus = JSON.parse(DeleteAccountStatus)
                    if (deleteAccountStatus[0].status != "Error"){
                      var form = {
                        account_no: response.context.accountNo,
                        bvn: user[0].BVN
                      };

                      var formData = querystring.stringify(form);
                      var contentLength = formData.length;

                      const options = {
                        url: bank+"/account/card",
                        headers: {
                          'Content-Length': contentLength,
                          'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: formData,
                        method: 'DELETE'
                      };
                      request(options, function(err, res, DeleteCardStatus) {
                        if (err) {
                          console.log('error:', err)
                          // error handling
                          tag="false"
                          socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                        }
                        var deleteCardStatus = JSON.parse(DeleteCardStatus)
                        if (deleteCardStatus[0].status != "Error"){
                          const options = {
                              url: bank+"/user/account",
                              method: 'GET',
                              headers: {
                                  'bvn': user[0].BVN
                              }
                          };
                          request(options, function(err, res, Accounts) {
                            if (err) {
                              console.log('error:', err)
                              // error handling
                              tag="false"
                              socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                            }
                            accounts = JSON.parse(Accounts)
                            const options = {
                                url: bank+"/user/transaction",
                                method: 'GET',
                                headers: {
                                    'bvn': user[0].BVN
                                }
                            };
                            request(options, function(err, res, Transactions) {
                              if (err) {
                                console.log('error:', err)
                                // error handling
                                tag="false"
                                socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user, accounts:accounts});
                              }
                              transactions = JSON.parse(Transactions)
                              responseText = response.output.text
                              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts, transactions:transactions});
                            });
                          });
                        } else {
                          const options = {
                              url: bank+"/user/account",
                              method: 'GET',
                              headers: {
                                  'bvn': user[0].BVN
                              }
                          };
                          request(options, function(err, res, Accounts) {
                            if (err) {
                              console.log('error:', err)
                              // error handling
                              tag="false"
                              socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                            }
                            accounts = JSON.parse(Accounts)
                            responseText = user[0].FIRST_NAME + ' There is no card attached to this account!'
                            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                          });
                        }
                      });
                    } else {
                      const options = {
                          url: bank+"/user/account",
                          method: 'GET',
                          headers: {
                              'bvn': user[0].BVN
                          }
                      };
                      request(options, function(err, res, Accounts) {
                        if (err) {
                          console.log('error:', err)
                          // error handling
                          tag="false"
                          socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                        }
                        accounts = JSON.parse(Accounts)
                        responseText = user[0].FIRST_NAME + ' There is no card attached to this account!'
                        socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                      });
                    }
                  });
                }
                else {
                  tag = 'deleteAccountDeclined'
                  const options = {
                      url: bank+"/user/account",
                      method: 'GET',
                      headers: {
                          'bvn': user[0].BVN
                      }
                  };
                  request(options, function(err, res, Accounts) {
                    if (err) {
                      console.log('error:', err)
                      // error handling
                      tag="false"
                      socket.emit(namespace, {username: 'Kira', message: 'System error, please try again in 5 mins', tag:tag, user:user});
                    }
                    accounts = JSON.parse(Accounts)
                    responseText = response.output.text
                    socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user, accounts:accounts});
                  });
                }
              }
              else {
                responseText = response.output.text
                socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
              }
            }
            else {
              responseText = response.output.text
              socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
            }
          }
          else {
            responseText = response.output.text
            socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
          }
        } else {
          responseText = 'Sorry, I did not understand you. Please refresh to ensure everything is working fine!'
          socket.emit(namespace, {username: 'Kira', message: responseText, tag:tag, user:user});
        }
      }
    });
  });

  socket.on('disconnect', () => {
    console.log(`user disconnected`);
  });
});

export default app;
