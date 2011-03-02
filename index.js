#!/usr/bin/env node

var Class	= require('./vendor/class.js')

var Game	= Class.extend({
	init	: function(){
	}
})

var Player	= Class.extend({
	init	: function(opts){
		this.scriptUrl	= opts.scriptUrl	|| console.assert(false);
	}
})

var ParentBot	= Class.extend({
	init	: function(opts){
		this.scriptUrl	= opts.scriptUrl	|| console.assert(false);
	}
})

var Bot		= Parent.extend({
})


var p = new Person(true);
console.log("Person", p.dance()); // => true

var n = new Ninja();
console.log("ninja dance", n.dance()); // => false
console.log("swingSword", n.swingSword()); // => true
  
console.log("super")
console.dir(Class)