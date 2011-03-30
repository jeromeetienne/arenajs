require.module('./MyTankBotStill', function(module, exports, require) {
// start module: MyTankBotStill

var TankBot	= require('./TankBot')

/**
 * The simplest bot
*/
var botStill	= TankBot.Bot.extend({
});

module.exports	= bot;


// end module: MyTankBotStill
});
