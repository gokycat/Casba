var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var card = require('../services/data/card')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  card.findBVN({bvn:req.headers.bvn}, function (err, cards) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(cards);
  });
});

module.exports = router;
