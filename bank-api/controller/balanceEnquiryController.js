var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var switchIT = require('../services/payment/switchIT')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  switchIT.balanceEnquiry({}, function (err, balance) {
    if (err) return res.status(500).send("There was a problem processing the transfer.");
    if((balance[0] == "0") && ((parseFloat(balance[1]) - 5000) > parseFloat(req.headers.amount))) {
      res.status(200).send(balance);
    }
    else {
      balance[0] = "-1"
      balance[1] = "Insufficient Balance"
      res.status(200).send(balance);
    }
  });
});

module.exports = router;
