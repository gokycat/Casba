var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var bankIT = require('../services/payment/bankIT')

// RETURNS ALL THE USERS IN THE DATABASE
router.post('/', function (req, res) {
  bankIT.initiateTransfer({firstName:req.body.first_name, lastName:req.body.last_name, emailAddress:req.body.email, accountNo:req.body.account_no, bankName:req.body.bank_name, amount:req.body.amount, description:req.body.description}, function (err, transfers) {
    if (err) return res.status(500).send("There was a problem processing the transfer.");
    res.status(200).send(transfers);
  });
});

module.exports = router;
