var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/change_branch', cors())
router.post('/change_branch', cors(), function(req, res) {
  var branch = req.body.branch;
  dbv.changeBranch(branch, function(err,data) {
    if (err) { console.log(err); res.send(err); }
    else return res.sendStatus(200); 
  });  
});

module.exports = router;
