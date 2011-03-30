require.module('./ArenajsCore', function(module, exports, require) {
// start module: ArenajsCore

/**
*/

var TankGame	= require('./TankGame');
var TankWorld	= require('./TankWorld');

//////////////////////////////////////////////////////////////////////////////////
//		ctor/dtor							//
//////////////////////////////////////////////////////////////////////////////////

var ArenajsCore	= function(){
	this.tankWorld	= new TankWorld();

	this.tankGame	= new TankGame();
	this.tankGame.setWorld(this.tankWorld);

	this.scripts	= {};
}

ArenajsCore.prototype.destroy	= function(){
}


// inherit microevent
require('./microevent').mixin(ArenajsCore)

//////////////////////////////////////////////////////////////////////////////////
//		addScript							//
//////////////////////////////////////////////////////////////////////////////////

ArenajsCore.prototype.addScript	= function(scriptId, scriptData){
	this.scripts[scriptId]	= scriptData;
}

//////////////////////////////////////////////////////////////////////////////////
//		addScript							//
//////////////////////////////////////////////////////////////////////////////////

ArenajsCore.prototype.start	= function(){
	console.assert(Object.keys(this.scripts).length > 0)
	console.log("starting jsbattle")

	// sanity check - it MUST NOT be already started
	console.assert(this.isStarted() === false, "game already started");

	Object.keys(this.scripts).forEach(function(scriptId){
		var script	= this.scripts[scriptId];
		//console.log("scriptid", scriptId, "script", script)
		// require the bot
		// - security issue - the bot can do everything it want - cheating possible
		// - see with webworker... doesnt seem to work on nodejs
		var BotClass	= this._requireText(script)

		var botX	= Math.floor(Math.random()*this.tankWorld.width())	+ this.tankWorld.minPosition.x;
		var botY	= Math.floor(Math.random()*this.tankWorld.height())	+ this.tankWorld.minPosition.y;
		var bot	= new BotClass({
			game	: this.tankGame,
			name	: scriptId,
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

/**
 * @returns {Boolean} true if the game isStarted(), false otherwise
*/
ArenajsCore.prototype.isStarted	= function(){
	return this.tankGame.isStarted() ? true : false;
}

//////////////////////////////////////////////////////////////////////////////////
//		wtf is this function TODO					//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Act as a commonjs require() with this text as file content
 *
 * - TODO experiment in another file
 * - based weppy good work on brequire
 * - http://boodigital.com/post/3424290434/sharing-javascript-between-client-and-server
*/
ArenajsCore.prototype._requireText	= function(text){
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


module.exports	= ArenajsCore;

// end module: ArenajsCore
});
