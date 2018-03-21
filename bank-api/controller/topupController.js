var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var topup = require('../services/data/topup')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  topup.find({session:req.headers.session}, function (err, topups) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(topups);
  });
});

router.put('/', function (req, res) {
  topup.update({key:req.body.key, value:req.body.value, session:req.body.session}, function (err, topups) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(topups);
  });
});

router.delete('/', function (req, res) {
  topup.remove({session:req.body.session}, function (err, topups) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(topups);
  });
});

router.post('/', function (req, res) {
  topup.create({bvn:req.body.bvn, accountNo:req.body.account_no, telcoName: req.body.telco_name, amount:req.body.amount, session:req.body.session, reference:req.body.reference, esacode:req.body.esacode, bankIT:req.body.bank_it, switchIT:req.body.switch_it}, function (err, topups) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(topups);
  });
});

module.exports = router;
