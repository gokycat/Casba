var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var bankIT = require('../services/payment/bankIT')

// RETURNS ALL THE USERS IN THE DATABASE
router.post('/', function (req, res) {
  bankIT.finalise({sessionid:req.body.session, requestid:req.body.request, esacode:req.body.esacode}, function (err, transfers) {
    if (err) return res.status(500).send("There was a problem processing the transfer.");
    res.status(200).send(transfers);
  });
});

module.exports = router;
