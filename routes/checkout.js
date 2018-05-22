var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/checkout', cors())
router.get('/checkout', cors(), function(req, res) {
	if (!req.body) return res.sendStatus(400);
	  dbv.checkout(function(err,data){
	    if(err) { console.log(err); return res.send(err); }
	    else return res.sendStatus(200);
	  }); 
});

module.exports = router;
