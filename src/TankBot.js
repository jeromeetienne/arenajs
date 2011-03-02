var WarBots	= require('./WarBots')

var Bot	= WarBots.Body.extend({
	tick	: function(){
		
	},
	front	: function(){
		this.position.x	+= this.position.x * Math.cos(this.rotation);
		this.position.y	+= this.position.y * Math.sin(this.rotation);
	},
	back	: function(){
		this.position.x	+= this.position.x * Math.cos(this.rotation);
		this.position.y	+= this.position.y * Math.sin(this.rotation);
	},
	turnLeft: function(){
		this.rotation	+= this.rotation+ 0.1*Math.PI;
	},
	turnRight: function(){
		this.rotation	-= this.rotation+ 0.1*Math.PI;
	},
	shoot	: function(){
		console.assert(false, "not yet implemented");
	}	
});


var Shoot	= WarBots.Body.extend({
	tick	: function(){
		
	}
});

// commonjs exports
exports.Bot	= Bot;
exports.Shoot	= Shoot;
