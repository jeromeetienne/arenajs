/**
 * This is a definition of a user bot
 * aka this is to be written by user
*/

var TankBot	= require('./TankBot')
var util	= require('./util')

var bot	= TankBot.Bot.extend({
	tick	: function(){
		this.setSpeed(1);
		this._super();
	},
	/**
	 * Handle collision with a wall
	*/
	onHitWall	: function(eventType, eventArgs){
		this.turn(util.deg2rad(180));
	},
	/**
	 * Handle collision with a bot
	*/
	onHitBot	: function(){
		this.turn(util.deg2rad(40-80*Math.random()));
	}
});

module.exports	= bot;
