
/*
 * GET home page.
 */

exports.index = function(req, res){
	if(posts){
		res.render('homePage', { title: t, posts:posts});
	}
	else {
		res.render('homePage', { title: t, posts:null})
	}
};