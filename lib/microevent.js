var microevent	= function(){}
microevent.prototype	= {
	fcts	: {},
	bind	: function(event, fct){
		this.fcts[event]	= this.fcts[event]	|| [];
		this.fcts[event].push(fct);
		return this;
	},
	unbind	: function(event, fct){
		var arr	= this.fcts[event];
		if( typeof arr !== 'undefined' )	return this;
		arr.splice(arr.indexOf(fct), 1);
		return this;
	},
	trigger	: function(event /* , args... */){
		var arr	= this.fcts[event];
		if( typeof arr === 'undefined' )	return this;
		for(var i = 0; i < arr.length; i++){
			arr[i].apply(this, Array.prototype.slice.call(arguments, 1))
		}
		return this;
	}
};

/**
 * mixin will delegate all microevent.js function in the destination object
 *
 * - require('microevent').mixin(Foobar) will make Foobar able to use microevent
 *
 * @param {Object} the object which will support microevent
*/
microevent.mixin	= function(destObject){
	var props	= ['fcts', 'bind', 'unbind', 'trigger'];
	for(var i = 0; i < props.length; i ++){
		destObject.prototype[props[i]]	= microevent.prototype[props[i]];
	}
}

// export in common js
if( typeof module !== "undefined"){
	module.exports	= microevent
}
