var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var transaction = require('../services/data/transaction')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  transaction.findAccount({accountNo:req.headers.account_no}, function (err, transactions) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(transactions);
  });
});

module.exports = router;
