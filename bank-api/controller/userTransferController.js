var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var transfer = require('../services/data/transfer')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  transfer.findBVN({bvn:req.headers.bvn}, function (err, transfers) {
    if (err) return res.status(500).send("There was a problem finding the transfer.");
    res.status(200).send(transfers);
  });
});

module.exports = router;
