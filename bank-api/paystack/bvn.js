const request = require('request');

var bvn = 22205545300;

const options = {
    url: "https://api.paystack.co/bank/resolve_bvn/"+bvn,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        "Authorization": "Bearer sk_live_c7b264b3463b3c28c15d8ad7b16df776dec162ae",
        'Accept-Charset': 'utf-8',
        'User-Agent': 'my-reddit-client'
    }
};

request(options, function(err, res, body) {
    let json = JSON.parse(body);
    console.log(json);
});
