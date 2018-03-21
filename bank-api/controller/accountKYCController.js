var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var paystack = require('../services/kyc/paystack')

// RETURNS ALL THE USERS IN THE DATABASE
router.post('/', function (req, res) {
  paystack.resolveAccount({accountNo:req.body.account_no, bankName:req.body.bank_name}, function (err, accountDetails) {
    if (err) return res.status(500).send("There was a problem resolving the bvn.");
    res.status(200).send(accountDetails);
  });
});

module.exports = router;
