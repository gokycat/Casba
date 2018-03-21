var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var account = require('../services/data/account')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  account.findBVN({bvn:req.headers.bvn}, function (err, accounts) {
    if (err) return res.status(500).send("There was a problem finding the account.");
    res.status(200).send(accounts);
  });
});

module.exports = router;
