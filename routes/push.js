var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/push', cors())
router.post('/push', cors(), function(req, res) {
	if (!req.body) return res.sendStatus(400);
	  var localBranch = req.body.localBranch;
	  dbv.push(localBranch, function(err,data) {
	    if(err) { console.log(err); return res.send(err); }
	    else return res.send(data);
	  });
});

module.exports = router;
