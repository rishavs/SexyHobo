/*
 Once basic page is up, pick up logging and BDD/TDD
 after that new story add
 after that review code for aync possibilities
 after that admin page
 After that pick up comments UI
 after that user sessions
 
 function mySandwich(param1, param2, callback) {  
    alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);  
    if (callback && typeof(callback) === "function") {  
        callback();  
    }  
}  
  
mySandwich('ham', 'cheese', 'vegetables');  
 */

/**
 * Module dependencies.
 */

var context = {};
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var schema = require('./modules/schema.js');

var app = express();

// init schema stitcher
schema.stitchAllStories(function (reply) {
		console.log("Book has been stitched!\n\n");
		schema.stitchedBook = reply;
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/test', function(req, res, next) {
    res.contentType('application/json');
    res.send(schema.stitchedBook);  
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


