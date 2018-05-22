var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/show_schemas', cors())
router.get('/show_schemas', cors(), function(req, res) {
	dbv.showSchemas(function(err,data) {
	  if (err) { 
	  	console.log(err);	
	  	res.sendStatus(400); 
	  }
	  else {
	    res.send(data);
	  }
	})
});

module.exports = router;
