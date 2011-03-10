require.module('./MyTankBot', function(module, exports, require) {
// start module: MyTankBot

/**
 * This is a definition of a user bot
 * aka this is to be written by user
*/

var TankBot	= require('./TankBot')
var util	= require('./util')

var bot	= TankBot.Bot.extend({
	tick	: function(){
		this.setSpeed(1+Math.random()*0.5+0.5);
		var rnd	= Math.random();
		if( rnd < 0.01 ){
			this.turn(util.deg2rad(-20*Math.random()));
		}else if( rnd > 1-0.01){
			this.turn(util.deg2rad(20*Math.random()));			
		}
		//this.turretTurn(util.deg2rad(1));
		this.turretToNearestBot();

		// TODO move this _super() at the begining of the function
		this._super();
	},
	/**
	 * Handle collision with a wall
	*/
	onHitWall	: function(){
		this.turn(util.deg2rad(180));
		//this.turn(180+20-40*Math.random());		
		//this.turn(180+20-40*Math.random());		
		//this.turn(40-80*Math.random());		
	},
	onHitBot	: function(){
		this.turn(util.deg2rad(40-80*Math.random()));
	}
});


// to mixin TankBotPlugin into bot
require('./TankBotPlugin').mixin(bot)

module.exports	= bot;


// end module: MyTankBot
});
