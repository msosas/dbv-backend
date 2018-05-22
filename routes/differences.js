var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/differences', cors())
router.get('/differences', cors(), function(req, res) {
	var fileName = req.query.file;
	  dbv.differences(fileName, function(err,data){
	    if (err) { console.log(err); res.sendStatus(400);}
	    else return res.send(data);
	  });
});

module.exports = router;
