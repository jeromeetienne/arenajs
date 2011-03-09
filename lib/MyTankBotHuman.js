/**
 * This is a definition of a user bot
 * aka this is to be written by user
*/
var TankBot	= require('./TankBot')
var util	= require('./util')

var bot	= TankBot.Bot.extend({
	tick	: function(){
		if( keydown.left )	this.turn(util.deg2rad(-10));
		if( keydown.right )	this.turn(util.deg2rad(+10));
		
		if( keydown.w )		this.turretTurn(util.deg2rad(-5));
		if( keydown.c )		this.turretTurn(util.deg2rad(+5));
		// one way to make plugin
		if( keydown.x )		this.turretFront();
		
		
		if( keydown.q )		this.radarTurn(util.deg2rad(-5));
		if( keydown.d )		this.radarTurn(util.deg2rad(+5));
		// another way to make pluging without mixin
		if( keydown.s )		turretPlugin.radarFront(this);
		

		if( keydown.up )	this.setSpeed(+5);
		else if( keydown.down )	this.setSpeed(-5);
		else			this.setSpeed(0);
		
		if( keydown.space ){
			keydown.space	= false;
			this.shoot();
		}
		
		//this.turretToNearestBot();
		//this.bodyToNearestBot();
		this._super();
	},
	
});

// to mixin TankBotPlugin into bot
require('./TankBotPlugin').mixin(bot)

// another way to include it
// TODO i dont like the .prototype... this is too internal for exposed API
var turretPlugin	= require('./TankBotPlugin').prototype;

module.exports	= bot;
