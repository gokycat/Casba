'use strict';

const util = require('../util')
const request = require('request');
require('dotenv').config({
  silent: true
});

var authKey = process.env.PHONE_AUTHKEY

const numverify = {
  resolvePhone: function (data, callback) {
    let phoneDetails = []
    const options = {
        url: "http://apilayer.net/api/validate?access_key=" + authKey + "&number=" + data.phone + "&country_code=NG",
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8',
            'User-Agent': 'my-reddit-client'
        }
    };

    request(options, function(err, res, body) {
        let phoneDetails = JSON.parse(body);
        callback(null, phoneDetails);
    });
  }

}

module.exports = numverify;
