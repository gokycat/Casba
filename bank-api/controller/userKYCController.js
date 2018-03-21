var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var paystack = require('../services/kyc/paystack')

// RETURNS ALL THE USERS IN THE DATABASE
router.post('/', function (req, res) {
  paystack.resolveBVN({bvn:req.body.bvn}, function (err, userDetails) {
    if (err) return res.status(500).send("There was a problem resolving the bvn.");
    res.status(200).send(userDetails);
  });
});

module.exports = router;
