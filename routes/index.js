
/*
 * GET home page.
 */

exports.index = function(req, res){
    var book = require('../modules/schema.js').stitchedBook;
    console.log("This is the latest book!!!");
	console.dir(book);
    
	if(book){
        
		res.render('homePage', { title: "SexyHobogogogo", book:book});
	}
	else {
		res.render('homePage', { title: "SexyHobononono", book:null})
	}
};