require.module('./MyTankBotStill', function(module, exports, require) {
// start module: MyTankBotStill

/**
 * This is a definition of a user bot
 * aka this is to be written by user
*/

var TankBot	= require('./TankBot')

var bot	= TankBot.Bot.extend({
	tick	: function(){
		// TODO move this _super() at the begining of the function
		this._super();
	}
});

// to mixin TankBotPlugin into bot
require('./TankBotPlugin').mixin(bot)

module.exports	= bot;


// end module: MyTankBotStill
});
