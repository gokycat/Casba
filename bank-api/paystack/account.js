const request = require('request');

// setup service
var accountNo = '0694450123';
var bankName = '044';

// Resolve account
const options = {
    url: "https://api.paystack.co/bank/resolve?account_number=" + accountNo + "&bank_code=" +bankName,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'my-reddit-client'
    }
};

request(options, function(err, res, body) {
    let json = JSON.parse(body);
    console.log(json);
});
