var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var paystack = require('../services/kyc/paystack')

// RETURNS ALL THE USERS IN THE DATABASE
router.post('/', function (req, res) {
  paystack.resolveCard({cardNo:req.body.card_no}, function (err, cardDetails) {
    if (err) return res.status(500).send("There was a problem resolving the bvn.");
    res.status(200).send(cardDetails);
  });
});

module.exports = router;
