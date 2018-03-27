var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var numverify = require('../services/kyc/numverify')

// RETURNS ALL THE USERS IN THE DATABASE
router.post('/', function (req, res) {
  numverify.resolvePhone({phone:req.body.phone}, function (err, phoneDetails) {
    if (err) return res.status(500).send("There was a problem resolving the bvn.");
    res.status(200).send(phoneDetails);
  });
});

module.exports = router;
