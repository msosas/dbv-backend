var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/commit', cors())
router.post('/commit', cors(), function(req, res) {
	if (!req.body) return res.sendStatus(400);
  var message = req.body.message;
  dbv.commit(message, function(err,data) {
    if (err) { console.log(err); res.send(err); }
    else return res.sendStatus(200); 
  });  
});

module.exports = router;
