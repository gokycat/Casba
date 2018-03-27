var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var beneficiary = require('../services/data/beneficiary')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  beneficiary.findAccount({accountNo:req.headers.account_no}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
  });
});


module.exports = router;
