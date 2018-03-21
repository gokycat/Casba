var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var transfer = require('../services/data/transfer')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  transfer.find({session:req.headers.session}, function (err, transfers) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(transfers);
  });
});

router.put('/', function (req, res) {
  transfer.update({key:req.body.key, value:req.body.value, session:req.body.session}, function (err, transfers) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(transfers);
  });
});

router.delete('/', function (req, res) {
  transfer.remove({session:req.body.session}, function (err, transfers) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(transfers);
  });
});

router.post('/', function (req, res) {
  transfer.create({bvn:req.body.bvn, accountNo:req.body.account_no, recipientNo: req.body.recipient_no, amount:req.body.amount, session:req.body.session, reference:req.body.reference, esacode:req.body.esacode, bankIT:req.body.bank_it, switchIT:req.body.switch_it}, function (err, transfers) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(transfers);
  });
});

module.exports = router;
