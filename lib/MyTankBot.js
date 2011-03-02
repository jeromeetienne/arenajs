var TankBot	= require('./TankBot')

/**
 * This is a definition of a user bot
 * aka this is to be written by user
*/
var bot	= TankBot.Bot.extend({
	init	: function(opts){
		this.name	= opts.name	|| console.assert(false);
		this._super();
	},
	tick	: function(){
		// go front in circle
		this.front();
		this.turnRight();
		console.log(this.name, "x", this.position.x, "y", this.position.y);
	},
	
	/**
	*/
	onCollisionWall	: function(){	
	},

	onCollisionBot	: function(){		
	}
});

module.exports	= bot;
