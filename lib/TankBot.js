/**
 * Parent of userTankBot
*/

var jsbattle	= require('./jsbattle');
var util	= require('./util')


/**
 * To handle a Shoot
*/
var TankShoot	= jsbattle.Body.extend({
	aLive	: true,
	fromBot	: null,

	init	: function(opts){
		this._super();
		// init normal body stuff
		this.position	= opts.position	|| console.assert(false);
		this.rotation	= opts.rotation	|| console.assert(false);
		this.speed	= 5;
		this.radius	= 15;
		// specific to TankShoot
		this.fromBot	= opts.fromBot	|| console.assert(false);		
	},
	isAlive	: function(){
		return this.aLive;
	},
	isFrom	: function(bot){
		console.assert( bot instanceof TankBot );
		return bot.name === this.fromBot;		
	},
	notify		: function(eventType, eventData){
		this._super();
		if( eventType == 'hitWall' )	this.aLive	= false;
		if( eventType == 'hitBot' )	this.aLive	= false;
	}
});

/**
 * To handle a Bot
*/
var TankBot	= jsbattle.Body.extend({
	bodyMinAngle	: util.deg2rad(-3),
	bodyMaxAngle	: util.deg2rad(3),
	turretMinAngle	: util.deg2rad(-10),
	turretMaxAngle	: util.deg2rad(10),
	radarMinAngle	: util.deg2rad(-10),
	radarMaxAngle	: util.deg2rad(10),
	
	init	: function(opts){
		this._super();

		this.tankGame	= opts.game	|| console.assert(false);
		this.tankGame.addBody(this);
		this.world	= this.tankGame.world;

		// init normal body stuff
		this.position	= opts.position	|| {x:20, y:20};
		this.rotation	= Math.floor(Math.random()*360)
		this.speed	= 0;

		// init specific to TankBot
		// TODO i should define that as property above
		this.name	= opts.name	|| console.assert(false);
		this.lifeTotal	= 200;
		this.lifeDamage	= 0;
		this.radarAngle	= 0;
		this.turretAngle= 0;
	},
	turn	: function(rad){
		if( typeof rad === "undefined" )	return this.rotation;
		rad		= util.clamp(rad, this.bodyMinAngle, this.bodyMaxAngle)
		this.rotation	= util.radClamp(this.rotation+rad);
		return this;
	},
	radarTurn	: function(rad){
		if( typeof rad === "undefined" )	return this.radarAngle;
		rad		= util.clamp(rad, this.radarMinAngle, this.radarMaxAngle);
		this.radarAngle	= util.radClamp(this.radarAngle+rad);
		return this;
	},
	turretTurn	: function(rad){
		if( typeof rad === "undefined" )	return this.turretAngle;
		rad		= util.clamp(rad, this.turretMinAngle, this.turretMaxAngle);
		this.turretAngle= util.radClamp(this.turretAngle+rad);
		return this;
	},
	shoot	: function(){
		var rotation	= this.rotation+this.turretAngle;
		var tankShoot	= new TankShoot({
			rotation	: rotation,
			fromBot		: this.name,
			position	: {
				x	: this.position.x + Math.cos(rotation)*this.radius,
				y	: this.position.y + Math.sin(rotation)*this.radius
			}
		});
		this.tankGame.addBody(tankShoot);
	},


	isAlive	: function(){
		return this.lifeDamage < this.lifeTotal;
	},
		
	notify		: function(eventType, eventData){
		this._super.apply(this, arguments);
		// handle dammage
		// - TODO find a nicer way to handle the event in this class
		if( eventType == 'hitWall' )	this.lifeDamage	+= 2;
		if( eventType == 'hitBot' )	this.lifeDamage	-= 3;
		if( eventType == 'hitShoot' )	this.lifeDamage	+= 30;
		//this.lifeDamage	= Math.min(this.lifeDamage, this.lifeTotal)
		this.lifeDamage	= Math.max(this.lifeDamage, 0)

		// forward to the on{EventType}() function on the children object
		var methodName	= "on" + eventType.substr(0,1).toUpperCase() + eventType.substr(1);
		if( methodName in this )	this[methodName](eventType, eventData);
	}
});

// commonjs exports
exports.Bot	= TankBot;
exports.Shoot	= TankShoot;
