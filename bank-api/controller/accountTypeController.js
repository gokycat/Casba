var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var accountType = require('../services/data/accountType')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  accountType.find({}, function (err, accountTypes) {
    if (err) return res.status(500).send("There was a problem finding the account type.");
    res.status(200).send(accountTypes);
  });
});


module.exports = router;
