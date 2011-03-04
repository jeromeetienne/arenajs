var WarBots	= require('./WarBots')
var TankWorld	= require('./TankWorld')

var TankGame	= WarBots.Game.extend({
	maxBots	: 400,
	maxTurns: 60*60*10,
	world	: null,
	bots	: [],
	
	destroy	: function(){
		clearTimeout(this.timeoutId)
		this.timeoutId	= null;
	},

	setWorld: function(world){
		this.world	= world;
		return this;
	},

	addBot	: function(bot){
		console.assert(this.bots.length < this.maxBots, "nb bots added >= maxbots")
		this.bots.push(bot)
		this.world.addBody(bot);
		return this;
	},
	delBot	: function(bot){
		console.assert( this.bots.indexOf(bot) != -1 )		
		this.bots.splice( this.bots.indexOf(bot), 1)
		this.world.delBody(bot);
		return this;
	},
	
	start	: function(opts){
		var renderCb	= opts.renderCb	|| function(tankWorld){};
		this.turnIdx	= 0;
		// detect if the code is running in browser or not
		var inBrowser	= typeof window === "object";
		var loopDelay	= inBrowser ? 1/60 * 1000 : 0;

		var callback	= function(){
			this.tick();

			renderCb.call(this);

			this.turnIdx++;
			if( this.turnIdx == this.maxTurns ){
				console.log("end game")
			}else{
				this.timeoutId	= setTimeout(callback.bind(this), loopDelay);				
			}
		}
		this.timeoutId	= setTimeout(callback.bind(this), 0);
	},
	
	tick	: function(){
		// tick all this.bots
		this.bots.forEach(function(bot){
			bot.tick();
		})
		// handle collision with walls
		this.bots.forEach(function(bot){
			var collided	= false;
			var minX	= this.world.minPosition.x + bot.radius;
			var minY	= this.world.minPosition.y + bot.radius;
			var maxX	= this.world.maxPosition.x - bot.radius;
			var maxY	= this.world.maxPosition.y - bot.radius;
			if( bot.position.x < minX ){
				bot.position.x	= minX;
				collided	= true;
			}
			if( bot.position.y < minY ){
				bot.position.y	= minY;
				collided	= true;
			}
			if( bot.position.x > maxX ){
				bot.position.x	= maxX;
				collided	= true;
			}
			if( bot.position.y > maxY ){
				bot.position.y	= maxY;
				collided	= true;
			}
			// notify the bots
			if( collided ) bot.notify('hitWall')
		}.bind(this))

		// handle collision between bots
		for(var i = 0; i < this.bots.length; i++){
			var aBot	= this.bots[i];
			for(var j = i+1; j < this.bots.length; j++){
				var otherBot	= this.bots[j];
				if(aBot.collideWith(otherBot)){
					aBot.bounceAgainst(otherBot);
					// notify the bots they hit each other
					aBot.notify('hitBot'	, {otherBot: otherBot})
					otherBot.notify('hitBot', {otherBot: aBot})
				}
			}
		}

		// tick all this.bots
		this.bots.forEach(function(bot){
			if( bot.isAlive() === false ){
				this.delBot(bot)
				bot.notify('death')				
			}
		}.bind(this));
	}
});


// commonjs exports
module.exports	= TankGame;
