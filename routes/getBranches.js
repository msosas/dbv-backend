var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/get_branches', cors())
router.get('/get_branches', cors(), function(req, res) {
	if (!req.body) return res.sendStatus(400);
	dbv.getBranches(function(err,data) {
	  if(err) { console.log(err); return res.send(err); }
	  else { return res.send(data); }
	});
});

module.exports = router;
