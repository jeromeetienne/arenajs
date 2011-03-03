var TankBot	= require('./TankBot')

/**
 * This is a definition of a user bot
 * aka this is to be written by user
*/
var bot	= TankBot.Bot.extend({
	init	: function(opts){
		this._super();
		this.name	= opts.name	|| console.assert(false);
		this.position	= opts.position	|| {x:20, y:20};
		this.rotation	= Math.floor(Math.random()*360)
		this.speed	= 0;
	},
	tick	: function(){
		this.setSpeed(1+Math.random()*0.5+0.5);
		var rnd	= Math.random();
		if( rnd < 0.35 ){
			this.turnRight(20*Math.random());
		}else if( rnd > 1-0.35){
			this.turnLeft(20*Math.random());			
		}
		this._super();
	},
	notify		: function(eventType, eventData){
		//console.log("notified of type", eventType, "eventData", eventData);
		if( eventType === "hitWall" ){
			this.turnLeft(140+80*Math.random());
			//this.turn(180)
		}else if( eventType == "hitBot" ){
			this.turnLeft(140+80*Math.random());		
		}else{
			console.assert(false, "unhandled eventType", eventType)
		}
	},
	
});

module.exports	= bot;
