var exec =  require("child_process").exec; 
var mysql = require("mysql");

const QUOTE = "'";
const CONNECTION = "mysql -c -h" + DBSERVER + " -P" + DBPORT + " -uroot" +" -p" + PASSWORD;

module.exports = {
	serverInfo: function(callback) {
	  var serverInfo = [];
	  
	  if (REPOPATH != 'none') {
	    exec("git -C " + REPOPATH + " remote", function(err,data) {
	    if(err) { callback(err); }
	    else {
	      serverInfo = data.toString().split('\n');
	      serverInfo.unshift(DBPORT); 
	      serverInfo.unshift(DBSERVER);
	      serverInfo.pop();
	      serverInfo.unshift(REPOPATH);
	      callback(null, JSON.stringify(serverInfo));
	    }
	  }); 
	  }
	  else {
	    serverInfo.unshift(DBPORT); 
	    serverInfo.unshift(DBSERVER);
	    callback(null, JSON.stringify(serverInfo));
	  }
	},
	showSchemas: function(callback) {
	  const SYSDB = ["mysql", "performance_schema", "information_schema", "sys"];
	  var query = "SELECT SCHEMA_NAME from INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME NOT IN ('mysql','information_schema','performance_schema','sys');";
	  var dbs = [];
	  var connection = mysql.createConnection({
	    host     : DBSERVER,
	    port     : DBPORT,
	    user     : 'root',
	    password : PASSWORD,
	    database : DB
	  });
	  connection.query(query, function(error, results, fields) {
	    if(error) { callback(error); }
	    else { 
	      for (var i = 0; i < results.length; i++) {
	        dbs.push({ label: results[i].SCHEMA_NAME, value: results[i].SCHEMA_NAME });
	      }
	      callback(null,JSON.stringify(dbs));
	    }
	  });
	},
	statusRaw: function(callback) {
	  var gitStatus = [];
	  var response = [];
	  exec("git -C " + REPOPATH + " status --porcelain", function(err, data) {
	    if (err) { callback(err); }
	    else { 
	      gitStatus = data.toString().split('\n');
	      gitStatus.pop();
	      for (var i = 0; i < gitStatus.length; i++) {
	        response.push( { change: gitStatus[i].substring(2), type: gitStatus[i][1] })
	      }
	      response = JSON.stringify(response);
	      callback(null, response);
	    }
	  });  
	},
	generateStoredProcedures: function(callback) {
		var execSync = require("child_process").execSync;
	  var connection = mysql.createConnection({
	    host     : DBSERVER,
	    port     : DBPORT,
	    user     : 'root',
	    password : PASSWORD,
	    database : DB
	  });
	  var query = "SELECT specific_name FROM mysql.proc WHERE db=" + QUOTE + DB + QUOTE;
	  connection.query(query, function (error, results, fields) {
	    if (error || results.length < 1) {
	    	callback(error);
	    }
	    else {
	      var itemCounter = 0;
	      var arraySize = results.length;
	      results.forEach(function(element, index) {
	        var storedProcedure = element.specific_name;
	        var query = "SELECT type FROM mysql.proc WHERE db=" + QUOTE + DB + QUOTE + " AND name=" + QUOTE + storedProcedure + QUOTE;
	        connection.query(query, function(error, results, fields) {
	          if(error) callback(error);
	          else { 
	            var procType = results[0].type;
	            var query = "SHOW CREATE " + procType + " " + DB + "." + storedProcedure;
	            connection.query(query, function(error, results, fields) {
	              if(error) callback(error);
	              else {
	                var showCreate = [];
	                showCreate.push(results[0]["Create " + procType.toLocaleLowerCase().replace(/^.{1}/g, procType[0].toUpperCase())]);
	                showCreate.unshift("delimiter ;;");
	                showCreate.unshift("/*!50003 DROP " + procType + " IF EXISTS " + storedProcedure + "*/;");
	                showCreate.push(";;");
	                showCreate = showCreate.join('\n');
	                var spPath = REPOPATH + "/stored-procedures/" + storedProcedure + ".sql";
	                var fs = require('fs');
	                fs.writeFile(spPath, showCreate, function(err,data) {
	                	execSync('./removeDefiner' + ' ' + spPath + ' ' + spPath);
	                  itemCounter ++;
	                  if(err) {  var error = err; }
	                  else {
	                    if (itemCounter == arraySize) {
	                      if (error) {
	                        callback(error);
	                      }
	                      else {
	                        callback(null, "OK");
	                      } 
	                    }
	                  }                      
	                });
	              }
	            });
	          }
	        });
	      });
	    }
	  }); 
	},
	generateTables: function(callback) {/*
	  var connection = mysql.createConnection({
	    host     : DBSERVER,
	    port     : DBPORT,
	    user     : 'root',
	    password : PASSWORD,
	    database : DB
	  });

	  var query = "SELECT table_name FROM information_schema.tables WHERE table_schema = "+ QUOTE + DB + QUOTE;
	  connection.query(query, function (error, results, fields) {
	    if (error || results.length < 1) callback(error);
	    else { 
	      var itemCounter = 0;
	      var arraySize = results.length;
	      results.forEach(function(element, index) {
	        var tableName = element.table_name;
	        var query = "SHOW CREATE TABLE " + DB + "." + tableName;
	      
	        connection.query(query, function(error, results, fields) {
	          if (error) { callback(error); }
	          else { 
	            var showCreate = [];
	            showCreate.push(results[0]["Create Table"]);    

	            var showCreate = showCreate.join('\n');
	        
	            var tablePath = REPOPATH + "tables/" + tableName + ".sql";
	            var fs = require('fs');
	            fs.writeFile(tablePath, showCreate, function(err,data) {
	              itemCounter ++;
	              if(err) {  var error = err; }
	              else {
	                if (itemCounter == arraySize) {
	                  if (error) {
	                    callback(error);
	                  }
	                  else {
	                    callback(null, "OK");
	                  } 
	                }
	              }
	            });    
	          } 
	        });
	      });
	    }
	  }); 
	*/},
	commit: function(message, callback) {
	  exec("git -C " + REPOPATH + " status --porcelain", function(err, data) {
	    if (err) { callback(err); }
	    else { 
	      var gitStatus = data.toString().split('\n'); 
	      if(gitStatus.length > 1) {
	        var filesNames = [];
	        gitStatus.pop();
	        for (var i = 0; i < gitStatus.length; i++) {
	          if(gitStatus[i].search("sql$") !== -1) {
	            filesNames.push(gitStatus[i].replace(new RegExp("^..."),""));
	          }
	        }
	        var fs = require('fs');
	        fs.writeFile(REPOPATH + "filesToDeploy.txt", filesNames.toString(), function(err) {
	          if(err) { callback(err); }
	          exec("git -C " + REPOPATH + " add .", function(err, data) {
	            if (err) { callback(err); }
	            exec("git -C " + REPOPATH + " commit -m " + QUOTE + message + QUOTE + "", function(err, data) {
	              if (err) { callback(err);}
	              callback(null, "Changes commited!");
	            });
	          });       
	        }); 
	      }   
	      else {
	        callback("No changes to commit");
	      }
	    }
	  });    
	},
	rollback: function (callback) {
	  exec("git -C " + REPOPATH + " reset HEAD^", function(err, data) { 
	    if (err) { callback(err);}
	    else {
	      callback(null, "OK"); 
	    }
	  });
	},
	pull: function(branch, callback) {
	  exec("git -C " + REPOPATH + " status --porcelain", function(err, data) {  
	    if (err) { callback(err); }
	    else { 
	      var gitStatus = data.toString().split('\n'); 
	      if(gitStatus.length <= 1) {
	        exec("git -C " + REPOPATH + " pull --rebase upstream " + branch, function(err,data) {
	          if (err) { callback(err);}
	          else callback(null, data);
	        });
	      }
	      else {
	        callback("Changes uncommited");
	      } 
	    }
	  });
	},
	push: function(localBranch, callback) {     
	  exec("git -C " + REPOPATH + " push origin " + localBranch, function(err, data) {
	    if (err) { 
	    	console.log(err);
	    	callback(err); 
	    }
	    else { 
	    	callback(null, JSON.stringify(data)); 
	    }
	  });
	},
	getBranches: function(callback) {
	  exec("git -C " + REPOPATH + " branch", function(err, data) {
	    if (err) { callback(err); }
	    else {
	      var localBranches = data.toString().split('\n');
	      localBranches.pop();
	      callback(null, localBranches);
	    }
	  });    
	},
	checkout: function(callback) {
	  exec("git -C " + REPOPATH + " checkout .", function(err, data) {  
	    if (err) { callback(err); }
	    else {
	      callback(null,"OK");
	    }
	  });
	},
	updateSchema: function(callback) {
	  var mysql = require('mysql');
	  var connection = mysql.createConnection({
	    host     : DBSERVER,
	    port     : DBPORT,
	    user     : 'root',
	    password : PASSWORD,
	    database : DB
	  });
	  /*if (false > -1 ) {
	    callback("Can't update over development or production servers");
	  }
	  else*/ {
	    var execSync = require("child_process").execSync;
	    var fs = require('fs');
	    var spPath = REPOPATH + "/stored-procedures/";  //directory path
	    var files = [];
	    var error;
	    fs.readdir(spPath, function(err,list){
	      if(err) { callback(err); }
	      else {
	        files = list;
	        for (var i = 0; i<files.length; i++) {
	          /*fs.readFile(spPath + files[i], 'utf8', function(err, data){
	            if(err) callback(err); 
	            else {
	              var query = data.toString();
	              console.log(query);
	              connection2.query(query, function(error, results, fields) {
	                if (error) { callback(error); }
	                else {
	                  callback(null, "done");  
	                }
	              });
	            }             
	          });*/
	          execSync(CONNECTION + " " + DB +  "<" + spPath + files[i]);
	        }
	        callback(null, "done");
	      }       
	    });    
	  } 
	},
	differences: function(file, callback) {
	  exec("git -C " + REPOPATH + " diff -- " + file, function(err,data){
	    if (err) { 
	    	console.log(err);
	    	callback(err); 
	    }
	    else { 
	    	callback(null, JSON.stringify(data.toString().replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;").split("\n")));
	    }
	  });
	},
	changeBranch: function(branch, callback) {
		exec("git -C " + REPOPATH + " checkout " + branch, function(err,data) {
			if (err) { 
				console.log(err);
				callback(err); 
			}
			else {
				callback(null, "OK")
			}
		})
	}
}
