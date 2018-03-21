var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var payment = require('../services/data/payment')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  payment.findCard({cardNo:req.headers.card_no}, function (err, payments) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(payments);
  });
});

module.exports = router;
