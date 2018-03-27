const request = require('request');

// setup service
var cardNo = '465859';

// Resolve card
const options = {
    url: "https://api.paystack.co/decision/bin/" + cardNo,
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
