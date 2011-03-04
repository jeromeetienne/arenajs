var WarBots	= require('./WarBots');

var TankBot	= WarBots.Body.extend({

	init	: function(opts){
		this._super();

		this.name	= opts.name	|| console.assert(false);
		this.position	= opts.position	|| {x:20, y:20};
		this.rotation	= Math.floor(Math.random()*360)
		this.speed	= 0;
		this.lifeTotal	= 100;
		this.lifeDamage	= 0;
	},
	step	: function(amount){
		this.position.x	+= amount * Math.cos(this.rotation);
		this.position.y	+= amount * Math.sin(this.rotation);
		return this;
	},
	turn: function(degrees){
		degrees	= typeof degrees === "undefined"	? 1 : degrees;
		this.rotation	+= degrees/180*Math.PI;
		this.rotation	%= 2*Math.PI;
		return this;
	},
	shoot	: function(){
		console.assert(false, "not yet implemented");
	},
	
	isAlive	: function(){
		return this.lifeDamage < this.lifeTotal;
	},
	
	notify		: function(eventType, eventData){
		// handle dammage
		// TODO find a nicer way to handle the event in this class
		if( eventType == 'hitWall' )	this.lifeDamage	+= 2;
		if( eventType == 'hitBot' )	this.lifeDamage	-= 3;
		//this.lifeDamage	= Math.min(this.lifeDamage, this.lifeTotal)
		this.lifeDamage	= Math.max(this.lifeDamage, 0)

		// forward to the on{EventType}() function on the children object
		var methodName	= "on" + eventType.substr(0,1).toUpperCase() + eventType.substr(1);
		if( methodName in this )	this[methodName](eventType, eventData);
	}
});


var TankShoot	= WarBots.Body.extend({
	tick	: function(){
		
	}
});

// commonjs exports
exports.Bot	= TankBot;
exports.Shoot	= TankShoot;
