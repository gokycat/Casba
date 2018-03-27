var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var topup = require('../services/data/topup')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  topup.findAccount({accountNo:req.headers.account_no}, function (err, topups) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(topups);
  });
});

module.exports = router;