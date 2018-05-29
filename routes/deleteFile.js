var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/delete_file', cors())
router.delete('/delete_file', cors(), function(req, res) {
  var file = req.body.file;
  dbv.deleteFile(file, function(err,data) {
    if (err) {
      console.log(err);
      res.sendStatus(400); 
  }
    else {
      return res.sendStatus(200);
    } 
  });  
});

module.exports = router;
