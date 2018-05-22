var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var params = require('./params');

global.DBSERVER = params.server.dbServer;
global.DBPORT = params.server.dbPort;
global.PASSWORD = params.server.password;
global.selectedDB = ''
global.REPOPATH = '';
global.DB = 'mysql';

// LOCAL REQUIREMENTS
var serverInfo = require('./routes/serverInfo');
var check = require('./routes/check');
var setDb = require('./routes/setDb');
var getDb = require('./routes/getDb');
var showSchemas = require('./routes/showSchemas');
var statusRaw = require('./routes/statusRaw');
var generateFiles = require('./routes/generateFiles');
var commit = require('./routes/commit');
var rollback = require('./routes/rollback');
var pull = require('./routes/pull');
var push = require('./routes/push');
var getBranches = require('./routes/getBranches');
var checkout = require('./routes/checkout');
var updateSchema = require('./routes/updateSchema')
var differences = require('./routes/differences')
/*var saveFile = require('./routes/save_file')
var setRemote = require('./routes/set_remote')
var compareDev = require('./routes/compare_with_dev')
var compareMaster = require('./routes/compare_with_master')
var runRevision = require('./routes/run_revision')
var getUser = require('./routes/getUser')*/

// START EXPRESS

var app = express();

// APP USE 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', serverInfo);
app.use('/', check);
app.use('/', setDb)
app.use('/', getDb);
app.use('/', showSchemas);
app.use('/', statusRaw);
app.use('/', generateFiles);
app.use('/', commit);
app.use('/', rollback);
app.use('/', pull);
app.use('/', push);
app.use('/', getBranches);
app.use('/', checkout);
app.use('/', updateSchema);
app.use('/', differences);
/*
app.use('/', saveFile);
app.use('/', setRemote);
app.use('/', compareDev);
app.use('/', compareMaster);
app.use('/', runRevision);
app.use('/', getUser);*/

// ERROR HANDLERS

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept", 'Usuario', 'Password');
  next();
});

app.listen(4001, function () {
    console.log("Application started...")
});

module.exports = app;
