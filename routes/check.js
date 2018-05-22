var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/check', cors())
router.get('/check', cors(), function(req, res) {
  res.send("The API is UP");
  res.end();
});

module.exports = router;
