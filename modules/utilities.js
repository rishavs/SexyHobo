module.exports = _Utilities = (function() {
    var sluggify = function(inString) {
        // create error. handle it better later
        if (!inString.length) { err = true;}
        else { err = false;}
        
        // Remove accents, swap ס for n, etc
        var from = "אבהגטיכךלםןמעףצפשתüûסח·/,:;";
        var to   = "aaaaeeeeiiiioooouuuunc_____";
        for (var i=0, l=from.length ; i<l ; i++) {
            inString = inString.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
        // Everything not a letter or number becomes a dash
        inString = inString.replace(/[^A-Za-z0-9]/g, '_');
        // Leading dashes go away
        inString = inString.replace(/^\_/, '');
        // Trailing dashes go away
        inString = inString.replace(/\_$/, '');
        // Consecutive dashes become one dash
        inString = inString.replace(/\_+/g, '_');
        
        return inString.toLowerCase();
    };
    
    return {
		sluggify: sluggify
	}
})();