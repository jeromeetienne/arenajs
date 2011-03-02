var TankBot	= require('./TankBot')

/**
 * This is a definition of a user bot
 * aka this is to be written by user
*/
var bot	= TankBot.Bot.extend({
	init	: function(opts){
		this.name	= opts.name	|| console.assert(false);
	},
	run	: function(){
		// go front in circle
		this.front();
		this.turnRight();
	},
	
	/**
	*/
	onCollisionWall	: function(){	
	},

	onCollisionBot	: function(){		
	}
});

module.exports	= bot;
