var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/status_raw', cors())
router.get('/status_raw', cors(), function(req, res) {
	if (!req.body) return res.sendStatus(400);
	    dbv.statusRaw(function(err,data) {
	      if (err) { console.log(err); res.sendStatus(400); }
	      else { return res.send(data); }
	    });
});

module.exports = router;
