'use strict';

module.exports = {

	// Get nearest parent element matching selector
	closest: function(el, selector) {
	    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

	    while (el) {
	        if (matchesSelector.call(el, selector)) {
	            break;
	        }
	        el = el.parentElement;
	    }
	    
	    return el;
	}

};
