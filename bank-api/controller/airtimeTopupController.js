var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var switchIT = require('../services/payment/switchIT')

// RETURNS ALL THE USERS IN THE DATABASE
router.post('/', function (req, res) {
  switchIT.airtimeTopup({senderName:req.body.sender_name, destination:req.body.destination, amount:req.body.amount, telcoName:req.body.telco_name}, function (err, transfer) {
    if (err) return res.status(500).send("There was a problem processing the transfer.");
    res.status(200).send(transfer);
  });
});

module.exports = router;
