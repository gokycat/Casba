var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var switchIT = require('../services/payment/switchIT')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  switchIT.balanceEnquiry({}, function (err, balance) {
    if (err) return res.status(500).send("There was a problem processing the transfer.");
    if((parseFloat(balance[1]) - 10000.00) > parseFloat(req.header.transfer_amount)) {
      res.status(200).send(balance);
    }
    else {
      res.status(200).send(balance[0]={response:'Not enough '});
    }
  });
});

router.post('/', function (req, res) {
  switchIT.fundTransfer({destination:req.body.destination, amount:req.body.amount, bankName:req.body.bank_name}, function (err, transfers) {
    if (err) return res.status(500).send("There was a problem processing the transfer.");
    res.status(200).send(transfers);
  });
});

module.exports = router;
