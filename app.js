
/**
 * Module dependencies.
 
 Once basic page is up, pick up logging and BDD/TDD
 after that new story add
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
    db.getValue(function(err, val) {
        if (err) return next(err);
        res.send(val);  
    });
});

// db.flushAllKeys();
// db.createDummyStories(100);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
