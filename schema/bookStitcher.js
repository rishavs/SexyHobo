/* Y Hobo tailor?
----------------------------------------
I have used Redis and redis is a simple key-value store. There is no concept of schema.
So the concept of schema stitching, as I have impemented is to pull data from redis and make up JSON objects out of it, based on the schema that I will define here,
which can be then used in the app.

The book stitcher is the story collection generator. it will give output as a json object containg all the stories and their properties that need to be rendered.
Here we will also stitch various books based on user preferences like tags, search results etc.
----------------------------------------

Story Schema = 
{
        id: '{{index}}',
        title: '{{lorem(5, 10)}}',
        thumbnail: 'http://placehold.it/200x200',
        link: 'www.google.com',
        author: '{{email}}',
        authorName: '{{firstName}} {{lastName}}',
        time: '{{date(ddMMYY:hhmmss:TZ)}}',
        text: '{{lorem(10,100)}}',
		tags: [
            '{{repeat(5)}}','#{{lorem(1,1)}}'
        	],
        comments: [
            '{{repeat(10)}}',
            {
                id: '{{index}}',
                parent: 'id',
                author: '{{email}}',
                authorName: '{{firstName}} {{lastName}}',
                time: '{{date(ddMMYY:hhmmss:TZ)}}',
                text: '{{lorem(10,100)}}'
            }
        ]
    }
----------------------------------------
 */
 
 //start implementing try catch
module.exports = _BookStitcher = (function() {
	
	var db = require('../modules/db');
	
	// Simplest stitched book. will return all the stories in the db. no input to function required
	var stitchAllStories = function(callback) {
		var stitchedBook = {};
		var storyList = [];
		var storyTemp ={};
		
		// get list of all stories
		db.getAllStoriesSet(function(err, reply) {
			if (err) throw err;
			else {
				storyList = reply;
				console.log("storylist inner: " + storyList);
			};
		});
		console.log("storylist outer: " + storyList);
		console.log("length is: " + storyList.length);
		// loop through the storyList and get properties for each story. add to stitchedBook
		for (var i=0; i<storyList.length; i++) {
			// get story properties
			db.getStoryProperties(storyList[i], function(err, reply) {
				if (err) throw err;
				else {
					console.log('--------------------');
					console.log(reply);  
					storyTemp = reply;
				};
			});
			// add properties to stitched story

			var storyKeyTemp = 'story/' + String(storyList[i]);
			stitchedBook[storyKeyTemp] = storyTemp;
		};
		
		console.log(stitchedBook);
		if (callback) {
			callback(stitchedBook);
		};
	};

        

    
//-------------------------------------------------

    return {
		stitchAllStories: stitchAllStories
		
	}
})();