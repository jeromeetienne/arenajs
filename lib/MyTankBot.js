/**
 * This is a definition of a user bot
 * aka this is to be written by user
*/

var TankBot	= require('./TankBot')

var bot	= TankBot.Bot.extend({
	tick	: function(){
		this.setSpeed(1+Math.random()*0.5+0.5);
		var rnd	= Math.random();
		if( rnd < 0.01 ){
			this.turn(-20*Math.random());
		}else if( rnd > 1-0.01){
			this.turn(20*Math.random());			
		}
		this.turretTurn(1);
		this._super();
	},
	/**
	 * Handle collision with a wall
	*/
	onHitWall	: function(){
		this.turn(180);
		//this.turn(180+20-40*Math.random());		
		//this.turn(180+20-40*Math.random());		
		//this.turn(40-80*Math.random());		
	},
	onHitBot	: function(){
		this.turn(40-80*Math.random());
	}
});

module.exports	= bot;
