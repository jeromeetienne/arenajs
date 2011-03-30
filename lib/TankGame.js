/**
 * - TankGame is the center
 * - it contains all the bots, all the shoots and the world
 *
 * - the difference between games and world is unclear
*/

var jsbattle	= require('./jsbattle')
var TankWorld	= require('./TankWorld')
var TankBot	= require('./TankBot')

var TankGame	= jsbattle.Game.extend({
	maxBots		: 400,
	maxTurns	: 60*60*10,
	world		: null,
	bots		: [],
	shoots		: [],
	tickEvents	: [],
	deathOrder	: [],
	
	destroy	: function(){
		clearTimeout(this.timeoutId)
		this.timeoutId	= null;
	},

	setWorld: function(world){
		this.world	= world;
		return this;
	},

	/**
	 * Add a body in the game
	 *
	 * - it may be a TankBot.Bot or a TankBot.Shoot
	*/
	addBody	: function(body){
		if( body instanceof TankBot.Bot ){
			console.assert(this.bots.length < this.maxBots, "nb bots added >= maxbots")
			console.assert( this.bots.indexOf(body) === -1 )		
			this.bots.push(body)
		}else if( body instanceof TankBot.Shoot){
			console.assert( this.shoots.indexOf(body) === -1 )		
			this.shoots.push(body)
		}else{
			console.assert(false)
		}
		this.world.addBody(body);
		
		// for body, bind 'notified'
		// - create the bind callback if needed
		this.$bodyBindNotified	= this.$bodyBindNotified || function(event){
			this.tickEvents.push(event);
			//console.log("event", event)
		}.bind(this);
		body.bind("notified", this.$bodyBindNotified);
		
		// return this for chained api
		return this;
	},
	/**
	 * delete a body from the game
	 *
	 * - it may be a TankBot.Bot or a TankBot.Shoot
	*/
	delBody	: function(body){
		if( body instanceof TankBot.Bot ){
			console.assert( this.bots.indexOf(body) != -1 )		
			this.bots.splice( this.bots.indexOf(body), 1)
		}else if( body instanceof TankBot.Shoot){
			console.assert( this.shoots.indexOf(body) != -1 )		
			this.shoots.splice( this.shoots.indexOf(body), 1)
		}else{
			console.assert(false)
		}
		this.world.delBody(body);			
		// for body, unbind 'notified'
		body.unbind("notified", this.$bodyBindNotified);
		// return this for chained api
		return this;
	},
	
	start	: function(opts){
		this.turnIdx	= 0;
		// detect if the code is running in browser or not
		var inBrowser	= typeof window === "object";
		var loopDelay	= inBrowser ? 1/60 * 1000 : 0;
		
		// sanity check - it MUST NOT be already started
		console.assert(this.isStarted() === false, "game already started");

		// this is the game loop
		var callback	= function(){
			
			// sanity check the
			//console.dir(this.tickEvents)
			console.assert(this.tickEvents.length === 0);
			
			// do the local tick
			this.tick();

			// emit the 'tick' event
			this.trigger('tick', {
				turnIdx		: this.turnIdx,
				world		: this.world,
				tickEvents	: this.tickEvents
			});
			this.tickEvents	= [];

			// if last tick triggered endGame, dont loop anymore
			if( !this.isStarted() ){
				return;
			}

			// count the turns
			this.turnIdx++;
			if( this.turnIdx == this.maxTurns ){
				// emit the 'end' event
				this._endGame();
			}else{
				this.timeoutId	= setTimeout(callback.bind(this), loopDelay);				
			}
		}
		this.timeoutId	= setTimeout(callback.bind(this), 0);
	},
	stop	: function(){
		if( this.timeoutId ){
			clearTimeout(this.timeoutId)
			this.timeoutId	= null;			
		}		
	},
	/**
	 * @returns {Boolean} true if the game isStarted(), false otherwise
	*/
	isStarted	: function(){
		return this.timeoutId ? true : false;
	},

	tick	: function(){
		// tick all this.bots
		this.bots.forEach(function(bot){
			bot.tick(this.world);
		}.bind(this))
		// tick all this.shoots
		this.shoots.forEach(function(shoot){
			shoot.tick(this.world);
		}.bind(this))
		// handle collision with walls
		this._collisionBodyWall();
		// handle collision between bots
		this._collisionBotBot();
		// handle collision between bots
		this._collisionBotShoot();
		// notify all body of death
		this._notify_death();
	},
	_endGame	: function(){
		this.stop();
		this.trigger('end', this._buildGameResult())
	},
	_collisionBodyWall	: function(){
		this.world.bodies.forEach(function(body){
			// compute the min/max
			var minX	= this.world.minPosition.x + body.radius;
			var minY	= this.world.minPosition.y + body.radius;
			var maxX	= this.world.maxPosition.x - body.radius;
			var maxY	= this.world.maxPosition.y - body.radius;
			// define if there is a collision
			var impacts	= [];
			if( body.position.x < minX )	impacts.push("west");
			if( body.position.y < minY )	impacts.push("north");
			if( body.position.x > maxX )	impacts.push("east")
			if( body.position.y > maxY )	impacts.push("south")
			// clamp body position
			body.position.x	= Math.max(body.position.x, minX);
			body.position.x	= Math.min(body.position.x, maxX);
			body.position.y	= Math.max(body.position.y, minY);
			body.position.y	= Math.min(body.position.y, maxY);
			// notify the bodys
			if( impacts.length ) body.notify('hitWall', impacts)
		}.bind(this))		
	},
	_collisionBotBot	: function(){
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
	},
	_collisionBotShoot	: function(){
		for(var i = 0; i < this.bots.length; i++){
			var aBot	= this.bots[i];
			for(var j = 0; j < this.shoots.length; j++){
				var aShoot	= this.shoots[j];
				// a player cant receive its own shoot
				if( aShoot.isFrom(aBot) )	continue;
				if(aBot.collideWith(aShoot)){
					//aBot.bounceAgainst(otherBot);
					// notify the bots they hit each other
					aBot.notify('hitShoot'	, {otherShoot: aShoot})
					aShoot.notify('hitBot'	, {otherBot: aBot})
				}
			}
		}		
	},
	_notify_death	: function(){
		this.world.bodies.forEach(function(body){
			if( body.isAlive() === false ){
				if( body instanceof TankBot.Bot ){
					console.log("arena.js: death of", body.name, "at turn", this.turnIdx)
					this.deathOrder.push(body.name);
				}
				this.delBody(body)
				body.notify('death')				
			}
		}.bind(this));
		if( this.world.bodies.length === 0 ){
			this._endGame();
		}
	},
	_buildGameResult	: function(){
		return {
			turnIdx		: this.turnIdx,
			deathOrder	: this.deathOrder
		};
	}
});

// inherit microevent
require('./microevent').mixin(TankGame)

// commonjs exports
module.exports	= TankGame;
