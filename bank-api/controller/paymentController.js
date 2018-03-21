var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var payment = require('../services/data/payment')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  payment.find({session:req.headers.session}, function (err, payments) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(payments);
  });
});

router.put('/', function (req, res) {
  payment.update({key:req.body.key, value:req.body.value, session:req.body.session}, function (err, payments) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(payments);
  });
});

router.delete('/', function (req, res) {
  payment.remove({session:req.body.session}, function (err, payments) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(payments);
  });
});

router.post('/', function (req, res) {
  payment.create({bvn:req.body.bvn, accountNo:req.body.account_no, billerName: req.body.biller_name, packageName: req.body.package_name, amount:req.body.amount, session:req.body.session, reference:req.body.reference, esacode:req.body.esacode, bankIT:req.body.bank_it, switchIT:req.body.switch_it}, function (err, payments) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(payments);
  });
});

module.exports = router;
