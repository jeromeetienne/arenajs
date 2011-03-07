/**
 * This is a definition of a user bot
 * aka this is to be written by user
*/
var TankBot	= require('./TankBot')

var bot	= TankBot.Bot.extend({
	tick	: function(){
		if( keydown.left )	this.turn(-10);
		if( keydown.right )	this.turn(+10);			
		if( keydown.w )		this.turretTurn(-5);
		if( keydown.x )		this.turretTurn(+5);
		if( keydown.q )		this.radarTurn(-5);
		if( keydown.s )		this.radarTurn(+5);
		if( keydown.right )	this.turn(+10);			
		if( keydown.up )	this.setSpeed(+5);
		else if( keydown.down )	this.setSpeed(-5);
		else			this.setSpeed(0);
		if( keydown.space ){
			keydown.space	= false;
			this.shoot();
		}		
		this._super();
	}
});

module.exports	= bot;
