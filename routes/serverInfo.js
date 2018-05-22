var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/server_info', cors())
router.get('/server_info', cors(), function(req, res) {
  dbv.serverInfo(function(err,data) {
      if (err) { console.log(err); res.sendStatus(400); }
      else return res.send(data);
    });
});

module.exports = router;
