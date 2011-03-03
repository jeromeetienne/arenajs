var WarBots	= require('./WarBots');

var TankBot	= WarBots.Body.extend({
	init	: function(){
		this._super();
		console.log("position", this.position);
	},
	stepFront	: function(amount){
		amount	= typeof amount === "undefined"	? 1 : amount;
		this.position.x	+= amount * Math.cos(this.rotation);
		this.position.y	+= amount * Math.sin(this.rotation);
	},
	stepBack	: function(amount){
		amount	= typeof amount === "undefined"	? 1 : amount;
		this.position.x	-= amount * Math.cos(this.rotation);
		this.position.y	-= amount * Math.sin(this.rotation);
	},
	turnLeft: function(degrees){
		degrees	= typeof degrees === "undefined"	? 1 : degrees;
		this.turn(+degrees);
		return this;
	},
	turnRight: function(degrees){
		degrees	= typeof degrees === "undefined"	? 1 : degrees;
		this.turn(-degrees);
		return this;
	},
	turn: function(degrees){
		degrees	= typeof degrees === "undefined"	? 1 : degrees;
		this.rotation	+= degrees/180*Math.PI;
		this.rotation	%= 2*Math.PI;
	},
	shoot	: function(){
		console.assert(false, "not yet implemented");
	}	
});


var TankShoot	= WarBots.Body.extend({
	tick	: function(){
		
	}
});

// commonjs exports
exports.Bot	= TankBot;
exports.Shoot	= TankShoot;
