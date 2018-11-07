var express = require('express');
var router = express.Router();
var cors = require('cors');
var dbv = require('../models/dbv')

/* GET home page. */
router.options('/generate_files', cors())
router.get('/generate_files', cors(), function(req, res) {
	//if (!req.body) return res.sendStatus(400);
  dbv.generateStoredProcedures(function(err,data) {
    if (err) { console.log(err);   }
    else {
      dbv.generateTables(function(err,data){
        if (err) { console.log(err); }
        else { 
          return res.sendStatus(200); 
        }
      });
      //return res.sendStatus(200)
    }
  });
});

module.exports = router;
