var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var switchIT = require('../services/payment/switchIT')

// RETURNS ALL THE USERS IN THE DATABASE
router.post('/', function (req, res) {
  switchIT.billPayment({destination:req.body.destination, amount:req.body.amount, senderName:req.body.sender_name, billerName:req.body.biller_name}, function (err, payments) {
    if (err) return res.status(500).send("There was a problem processing the transfer.");
    res.status(200).send(payments);
  });
});

module.exports = router;
