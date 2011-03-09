/**
 * Tank turret Plugin
*/

var TankBot	= require('./TankBot')
var util	= require('./util')

var TurretPlugin	= function(){};
TurretPlugin.prototype	= {
	/**
	 * point the turret front
	*/
	turretFront	: function(tankbot){
		console.assert(tankbot instanceof TankBot.Bot);
		var current	= util.radCenter(tankbot.turretTurn());
		if( current < 0 )	tankbot.turretTurn(Math.min(-current, tankbot.turretMaxAngle));
		if( current > 0 )	tankbot.turretTurn(Math.max(-current, tankbot.turretMinAngle));
	},
	/**
	 * point the radar front
	*/
	radarFront	: function(tankbot){
		console.assert(tankbot instanceof TankBot.Bot);
		var current	= util.radCenter(tankbot.radarTurn());
		if( current < 0 )	tankbot.radarTurn(Math.min(-current, tankbot.radarMaxAngle));
		if( current > 0 )	tankbot.radarTurn(Math.max(-current, tankbot.radarMinAngle));
	},
	
	allBotsButMe	: function(tankbot){
		return tankbot.world.bodies.filter(function(body){
			// keep only TankBot.Bot
			if( body instanceof TankBot.Bot === false )	return false;
			// keep only if not this one
			if( tankbot.name === body.name )		return false;
			// if all tests passed, return true
			return true;
		});
	},
	
	bodyToNearestBot	: function(){
		var allBots	= this.allBotsButMe();
		var nearestBody	= this.nearestBody( allBots );
		if( !nearestBody )	return;
		var absAngle	= this.angleWith(nearestBody);
		var turnAngle	= -1 * util.radCenter(this.turn() - absAngle);
		if( Math.abs(turnAngle) < util.deg2rad(15) )	turnAngle = 0;
		this.turn(turnAngle);
	},

	turretNearestBot	: function(){
		var allBots	= this.allBotsButMe();
		var nearestBody	= this.nearestBody( allBots );
		if( !nearestBody )	return;
		var absAngle	= this.angleWith(nearestBody);
		var turnAngle	= -1 * util.radCenter( (this.turn()+this.turretTurn()) - absAngle);
		if( Math.abs(turnAngle) < util.deg2rad(15) )	turnAngle = 0;
		this.turretTurn(turnAngle);
	}

};

/**
 * - TODO put this in a tankPlugin factory
 * - TODO may be more eleguant with forEach()
*/
TurretPlugin.mixin	= function(destObject){
	var props	= Object.keys(TurretPlugin.prototype);
	for(var i = 0; i < props.length; i ++){
		(function(prop){
			destObject.prototype[prop]	= function(){
				var args	= [this, Array.prototype.slice.call(arguments, 1)]
				return TurretPlugin.prototype[prop](this);
			}
		})(props[i]);
	}
}

module.exports	= TurretPlugin;