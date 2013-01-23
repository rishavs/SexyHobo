/*
 Once basic page is up, pick up logging and BDD/TDD
 after that new story add
 after that review code for aync possibilities
 after that admin page
 After that pick up comments UI
 after that user sessions
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , redis = require('redis');
  
var db = require('./modules/db');
var utilities = require('./modules/utilities');
var bookStitcher = require('./schema/bookStitcher');

var app = express();

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

app.get('/json', function(req, res, next) {
    res.contentType('application/json');
    db.getValue(function(err, reply) {
        if (err) return next(err);
        res.send(reply);  
    });
});

// db.flushAllKeys();
// db.createDummyStories(10);

bookStitcher.stitchAllStories(function(reply) {
	console.log(reply);  
});
// console.log(bookStitcher.stitchAllStories());

// db.getAllStoriesSet(function(err, reply) {
	// if (err) return next(err);
	// console.log('--------------------');
	// console.log(reply);
	// console.log('--------------------');	
// });

// db.getStoryProperties(5, function(err, reply) {
	// if (err) return next(err);
	// console.log('--------------------');
	// console.log(reply);  
// });

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
