var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var card = require('../services/data/card')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  card.findAccount({accountNo:req.headers.account_no}, function (err, cards) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(cards);
  });
});

router.delete('/', function (req, res) {
  card.removeAccount({accountNo:req.body.account_no}, function (err, cards) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(cards);
  });
});

module.exports = router;
