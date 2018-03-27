var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var beneficiary = require('../services/data/beneficiary')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  beneficiary.find({accountNo:req.headers.account_no}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
  });
});

router.put('/', function (req, res) {
  beneficiary.update({key:req.body.key, value:req.body.value, accountNo:req.body.account_no}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
  });
});

router.delete('/', function (req, res) {
  beneficiary.remove({accountNo:req.body.account_no}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
  });
});

router.post('/', function (req, res) {
  beneficiary.create({recipientNo:req.body.recipient_no, fullName: req.body.full_name, bankName: req.body.bank_name, accountNo:req.body.account_no}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
  });
});

module.exports = router;
