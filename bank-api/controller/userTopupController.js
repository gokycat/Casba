var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var topup = require('../services/data/topup')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  topup.findBVN({bvn:req.headers.bvn}, function (err, topups) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(topups);
  });
});

module.exports = router;
