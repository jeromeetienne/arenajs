/**
*/

var TankGame	= require('./TankGame');
var TankWorld	= require('./TankWorld');

/**
 * 
*/
var jsbattleCore	= function(opts){
	this.scripts	= opts.scripts	|| console.assert(false);
	
	this.tankWorld	= new TankWorld();
	this.tankGame	= new TankGame();
	this.tankGame.setWorld(this.tankWorld);


	Object.keys(this.scripts).forEach(function(scriptId){
		var script	= this.scripts[scriptId];
		//console.log("scriptid", scriptId, "script", script)
		// require the bot
		// - security issue - the bot can do everything it want - cheating possible
		// - see with webworker... doesnt seem to work on nodejs
		var BotClass	= this.requireText(script)

		var botX	= Math.floor(Math.random()*this.tankWorld.width())	+ this.tankWorld.minPosition.x;
		var botY	= Math.floor(Math.random()*this.tankWorld.height())	+ this.tankWorld.minPosition.y;
		var bot	= new BotClass({
			game	: this.tankGame,
			name	: "bot-"+scriptId,
			position: {
				x:	botX,
				y:	botY
			}
		});
	}.bind(this))



	// start the game
	this.tankGame.start();
	
	this.tankGame.bind('tick', function(gameState){
		this.trigger('tick', gameState);
	}.bind(this));
	
	this.tankGame.bind('end', function(gameResult){
		this.trigger('end', gameResult);
	}.bind(this));
}

// inherit microevent
require('./microevent').mixin(jsbattleCore)

/**
 * Act as a commonjs require() with this text as file content
 *
 * - TODO experiment in another file
 * - based weppy good work on brequire
 * - http://boodigital.com/post/3424290434/sharing-javascript-between-client-and-server
*/
jsbattleCore.prototype.requireText	= function(text){
	var prefix	= "(function(){"				+
			"	var _module	= { exports: {} };"	+
			"	var _require	= function(moduleId){"	+
			"		return require(moduleId);"	+
			"	};"					+
			"	(function(module, exports, require){";
			// Here goes the javascript with commonjs modules
	var suffix	= "	})(_module, _module.exports, _require);"+
			"	return _module.exports;"		+
			"})();";
	return eval(prefix+text+suffix)
}


module.exports	= jsbattleCore;