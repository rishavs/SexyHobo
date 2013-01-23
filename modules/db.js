/* Db Schema
----------------------------------------

storyCount : int'{{index}}'

storyIdSet : set'{{index}}'

story:%id%:properties : hash{
	title: '{{lorem(5, 10)}}',
	thumbnail: 'http://placehold.it/200x200',
	link: 'www.google.com',
	author: '{{email}}',
	authorName: '{{firstName}} {{lastName}}',
	time: '{{date(ddMMYY:hhmmss:TZ)}}',
	description: '{{lorem(10,100)}}',
    deleted: '{{bool}}',
    archived: '{{bool}}',
	}

slug:story:%id% : '{{lorem(5, 20)}}'

story:%id%:tags: list['#{{lorem(1,1)}}']

story:%id%:comments: [
            'comments:%id%',
			
comments : hash{
	id: '{{index}}',
	parent: '%id%',
	author: '{{email}}',
	authorName: '{{firstName}} {{lastName}}',
	time: '{{date(ddMMYY:hhmmss:TZ)}}',
	text: '{{lorem(10,100)}}'
	}

user : hash{
	id: '{{index}}',
	email: '{{email}}',
	name: '{{firstName}} {{lastName}}',
	password: '{{encrypted - lorem(5, 10)}}'
	}



----------------------------------------
 */
 
 //start implementing try catch
module.exports = _redisDb = (function() {
	
	var redis = require('redis'); 
	var config = require('../config');
    var utilities = require('../modules/utilities');
    
	var dbConnection = redis.createClient(config.db.port, config.db.host, {no_ready_check: true});
    dbConnection.auth(config.db.authKey, function (err, reply) { 
        if (err) throw err;
        else console.log("AUTHENTICATING..." + reply);
        });

	dbConnection.on('connect'     , log('CONNECTED........'));
	dbConnection.on('ready'       , log('READY............'));
	dbConnection.on('reconnecting', log('RECONNECTING.....'));
	dbConnection.on('idle'        , log('IDLE.............'));
	dbConnection.on('end'         , log('END..............\n'));
	dbConnection.on('error'       , log('\n******ERROR******\n'));

	function log(type) {
		return function() {
			console.log(type, arguments);
		}
	}

	var getValue = function(callback) {
        dbConnection.get("hello", function (err, reply) {
            var val = reply ? reply.toString() : null;
            callback(err, val);
        });
    };
    
    var flushAllKeys = function(callback) {
        console.log ("********************");
        console.log ("FLUSHING ALL KEYS...");
        dbConnection.flushall(function (err, reply) {
            if (err) throw err;
            else console.log("FlUSHED ALL KEYS - " + reply);
            });
        console.log ("********************");
    };
	

    var createDummyStories = function(num, callback) {
    // delete story index
        dbConnection.del("story/index", function (err, reply) {
            console.log ("Deleting Story index...");
            if (err) throw err;
            else console.log("DELETED - " + reply);
            });
    // put these under multi commands
	// for loop to n
        for (var i=1; i<num+1; i++) {
        
            // recreate story index at 1
            dbConnection.incr("story/index", function (err, reply) {
                console.log ("Incrementing Story index......");
                if (err) throw err;
                else console.log("INCREMENTED - " + reply);
                });
            // get story title
            // slugify title
            // initialize storySlugSet
            // check if slug exists in storySlugSet
            // add story to storySlugSet
            dbConnection.sadd('storySlugSet', utilities.sluggify('Sample Story ' + String(i)), function (err, reply) {
                console.log ("Adding Slug to storySlugSet....");
                if (err) throw err;
                else console.log("SLUG INSERTED - " + reply);
                });
            // insert slug/story/%id%
            // insert story:%id%:properties in hash (client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");)
            dbConnection.hmset('story/' + String(i) + '/properties', {
                'title': 'Sample Story ' + String(i),// NOTE: the key and value must both be strings
                'thumbnail': 'http://placehold.it/200x200',
                'link': 'www.google.com',
                'authorName': 'Sample User ' + String(i),
                'time': '{{date(ddMMYY:hhmmss:TZ)}}', //format:YYYYMMddhhmmssTZ
                'description': 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
                'deleted': 'false',
                'archived': 'false',
            });
        // insertstory:%id%:tags in list
        // thumbup and thumbdown
        
        console.log("----------------------------------\n");
        }
    };
        

    
//-------------------------------------------------

    return {
		getValue: getValue,
        flushAllKeys : flushAllKeys,
        createDummyStories : createDummyStories
	}
})();