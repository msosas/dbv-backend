var express = require('express');
var router = express.Router();
var cors = require('cors');

/* GET home page. */
router.options('/get_db', cors())
router.get('/get_db', cors(), function(req, res) {
	var db = {
		name: DB
	}
	return res.send(JSON.stringify(db));	
});

module.exports = router;
