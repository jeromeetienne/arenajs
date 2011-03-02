var WarBots	= require('./WarBots')

var TankGame	= WarBots.Game.extend({
	maxBots	: 4,

	world	: new WarBots.World(),
	bots	: [],

	addBot	: function(bot){
		console.assert(this.bots.length < this.maxBots)
		this.bots.push(bot)
		this.world.addBody(bot)
		return this;
	},
	
	start	: function(){
		setInterval(this.tick.bind(this), 0.5*1000);
	},
	
	tick	: function(){
		this.bots.forEach(function(bot){
			bot.tick();
		})
	}
});


// commonjs exports
module.exports	= TankGame;
