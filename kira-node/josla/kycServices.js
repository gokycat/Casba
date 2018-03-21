'use strict';

const request = require('request');

require('dotenv').config({
  silent: true
});

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

const pad_with_zeroes = function (number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}

const kycServices = {
  resolveAccount: function (accountNo, bankName, callback) {
    // Resolve account
    const options = {
        url: "https://api.paystack.co/bank/resolve?account_number=" + pad_with_zeroes(accountNo, 10) + "&bank_code=" + getBankCode(bankName),
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'my-reddit-client'
        }
    };
    request(options, function(err, res, body) {
        let accountDetails = JSON.parse(body);
        callback(null, accountDetails);
    });
  },

  resolveCard: function (cardNo, callback) {
    // Resolve card
    const options = {
        url: "https://api.paystack.co/decision/bin/" + String(cardNo).substring(0,6),
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'my-reddit-client'
        }
    };
    request(options, function(err, res, body) {
        let cardDetails = JSON.parse(body);
        callback(null, cardDetails);
    });
  }
};

module.exports = kycServices;
