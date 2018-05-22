var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/rollback', cors())
router.post('/rollback', cors(), function(req, res) {
	if (!req.body) return res.sendStatus(400);
	dbv.rollback(function(err,data) {
	  if (err) { console.log(err); res.send(err); }
	  else return res.sendStatus(200); 
	});
});

module.exports = router;
