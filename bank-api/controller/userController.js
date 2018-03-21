var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var user = require('../services/data/user')

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
  user.find({phone:req.headers.phone}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
  });
});

router.put('/', function (req, res) {
  user.update({key:req.body.key, value:req.body.value, phone:req.body.phone}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
  });
});

router.delete('/', function (req, res) {
  user.remove({bvn:req.body.bvn}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
  });
});

router.post('/', function (req, res) {
  user.create({bvn:req.body.bvn, email: req.body.email, phone: req.body.phone, first_name:req.body.first_name, middle_name: req.body.middle_name, last_name: req.body.last_name, dob:req.body.dob, status: req.body.status, password: req.body.password, hash: req.body.hash}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
  });
});

module.exports = router;
