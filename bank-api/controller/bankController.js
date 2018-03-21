var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var bank = require('../services/data/bank')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  bank.find({}, function (err, banks) {
    if (err) return res.status(500).send("There was a problem finding the banks.");
    res.status(200).send(banks);
  });
});


module.exports = router;
