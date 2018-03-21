var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var card = require('../services/data/card')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  card.find({cardNo:req.headers.card_no}, function (err, cards) {
    if (err) return res.status(500).send("There was a problem finding the card.");
    res.status(200).send(cards);
  });
});

router.put('/', function (req, res) {
  console.log(req.body)
  card.update({key:req.body.key, value:req.body.value, cardNo:req.body.card_no}, function (err, cards) {
    if (err) return res.status(500).send("There was a problem finding the card.");
    res.status(200).send(cards);
  });
});

router.delete('/', function (req, res) {
  card.remove({cardNo:req.body.card_no}, function (err, cards) {
    if (err) return res.status(500).send("There was a problem finding the card.");
    res.status(200).send(cards);
  });
});

router.post('/', function (req, res) {
  card.create({cardNo:req.body.card_no, bvn: req.body.bvn, accountNo: req.body.account_no, cardBrand: req.body.card_brand, cardType: req.body.card_type, expiryMonth:req.body.expiry_month, expiryYear:req.body.expiry_year}, function (err, cards) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(cards);
  });
});

module.exports = router;
