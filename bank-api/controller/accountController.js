var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var account = require('../services/data/account')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  account.find({accountNo:req.headers.account_no}, function (err, accounts) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(accounts);
  });
});

router.put('/', function (req, res) {
  account.update({key:req.body.key, value:req.body.value, accountNo:req.body.account_no}, function (err, accounts) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(accounts);
  });
});

router.delete('/', function (req, res) {
  account.remove({accountNo:req.body.account_no}, function (err, accounts) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(accounts);
  });
});

router.post('/', function (req, res) {
  account.create({accountNo:req.body.account_no, bankName: req.body.bank_name, bvn: req.body.bvn, accountType:req.body.account_type}, function (err, accounts) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(accounts);
  });
});

module.exports = router;
