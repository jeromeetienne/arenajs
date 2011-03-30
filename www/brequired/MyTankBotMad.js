require.module('./MyTankBotMad', function(module, exports, require) {
// start module: MyTankBotMad

/**
 * This is a definition of a user bot
 * aka this is to be written by user
*/

var TankBot	= require('./TankBot')
var util	= require('./util')

var bot	= TankBot.Bot.extend({
	tick	: function(){
		if( Math.random() < 0.02) this.setSpeed(Math.random()*3-1.5);
		if( Math.random() < 0.02) this.turn(Math.PI);
		this._super();
	},
});

module.exports	= bot;


// end module: MyTankBotMad
});
