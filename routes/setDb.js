var express = require('express');
var router = express.Router();
var cors = require('cors');
var params = require('../params');

/* GET home page. */
router.options('/set_db', cors())
router.post('/set_db', cors(), function(req, res) {
	selectedDb = req.body.db.toString();
	REPOPATH = params[selectedDb].repoPath;
	DB = params[selectedDb].dbName;
	return res.sendStatus(200);	
});

module.exports = router;
