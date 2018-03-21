'use strict';

const util = require('../util')
const request = require('request');
require('dotenv').config({
  silent: true
});

var authKey = process.env.BVN_AUTHKEY

const paystack = {
  resolveBVN: function (data, callback) {
    let userDetails = []
    const options = {
        url: "https://api.paystack.co/bank/resolve_bvn/" + data.bvn,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer "+authKey,
            'Accept-Charset': 'utf-8',
            'User-Agent': 'my-reddit-client'
        }
    };

    request(options, function(err, res, body) {
        let userDetails = JSON.parse(body);
        callback(null, userDetails);
    });
  },

  resolveAccount: function (data, callback) {
    let accountDetails = []
    const options = {
        url: "https://api.paystack.co/bank/resolve?account_number=" + util.pad_with_zeroes(data.accountNo, 10) + "&bank_code=" + util.getBankCode(data.bankName),
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

  resolveCard: function (data, callback) {
    let cardDetails = []
    const options = {
      url: "https://api.paystack.co/decision/bin/" + String(data.cardNo).substring(0,6),
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

}

module.exports = paystack;
