module.exports = _Schema = (function() {

	var stitchedBook = {};
	
	var redis = require('redis'); 
	var config = require('../config');

    var connection = redis.createClient(config.db.port, config.db.host, {no_ready_check: true});
    connection.auth(config.db.authKey, function (err, reply) { 
        if (err) throw err;
        else console.log("AUTHENTICATING..." + reply);
    });

	connection.on('connect'     , log('CONNECTED........'));
	connection.on('ready'       , log('READY............'));
	connection.on('reconnecting', log('RECONNECTING.....'));
	connection.on('idle'        , log('IDLE.............'));
	connection.on('end'         , log('END..............\n'));
	connection.on('error'       , log('\n******ERROR******\n'));

	function log(type) {
		return function() {
			console.log(type, arguments);
		}
	};
    
	// Simplest stitched book. will return all the stories in the db. no input to function required
	var stitchAllStories = function(callback) {
		
		connection.smembers("storyIdSet", function (err, reply) {
			if (err) throw err;
			else {
				var storyList = reply;
				console.log(storyList);
				// start a separate multi command queue
				multi = connection.multi();
				for (var i=0; i<storyList.length; i++) {
					multi.hgetall('story/' + String(storyList[i]) + '/properties');
				};
				// drains multi queue and runs atomically
				multi.exec(function (err, replies) {
					stitchedBook = replies;
					// console.log(stitchedBook);
					callback(stitchedBook);
				});
			};
		});
    };
    
    var flushAllKeys = function(callback) {
        console.log ("********************");
        console.log ("FLUSHING ALL KEYS...");
        connection.flushall(function (err, reply) {
            if (err) throw err;
            else console.log("FlUSHED ALL KEYS - " + reply);
            });
        console.log ("********************");
    };


    var createDummyStories = function(num, callback) {
    // delete story index
        connection.del("story/index", function (err, reply) {
            console.log ("Deleting Story index...");
            if (err) throw err;
            else console.log("DELETED - " + reply);
            });
    // put these under multi commands
	// for loop to n
        for (var i=1; i<num+1; i++) {
            // recreate story index at 1
            connection.incr("story/index", function (err, reply) {
                console.log ("Incrementing Story index......");
                if (err) throw err;
                else console.log("INCREMENTED - " + reply);
                });
            // get story title
            // slugify title
            // initialize storySlugSet
            // check if slug exists in storySlugSet

			// add story id to storyIdSet. this is from where the stitcher gets its list of stories to make a book
			connection.sadd('storyIdSet', String(i), function (err, reply) {
                console.log ("Adding Story Id to storyIdSet....");
                if (err) throw err;
                else console.log("STORY ID INSERTED - " + reply);
                });

            // add story to storySlugSet
            connection.sadd('storySlugSet', utilities.sluggify('Sample Story ' + String(i)), function (err, reply) {
                console.log ("Adding Slug to storySlugSet....");
                if (err) throw err;
                else console.log("SLUG INSERTED - " + reply);
                });
            // insert slug/story/%id%
            // insert story:%id%:properties in hash (client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");)
            connection.hmset('story/' + String(i) + '/properties', {
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
        }
    };

//-------------------------------------------------

    return {
        connection : connection,
		stitchAllStories : stitchAllStories,
        createDummyStories : createDummyStories,
        flushAllKeys : flushAllKeys
		
	}
})();