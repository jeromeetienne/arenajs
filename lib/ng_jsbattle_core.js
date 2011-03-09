/**
*/

var TankGame	= require('./TankGame');
var TankWorld	= require('./TankWorld');

/**
 * 
*/
var jsbattleCore	= function(opts){
	this.scripts	= opts.scripts	|| console.assert(false);
	
	var tankWorld	= new TankWorld();
	var tankGame	= new TankGame();
	tankGame.setWorld(tankWorld);

	Object.keys(this.scripts).forEach(function(script, scriptId){
		console.log("scriptid", scriptId, "script", script)
		// TODO dunno how to convert the script text in a class
		// - security issue
		// - see with webworker
	})
}

// inherit microevent
require('./microevent').mixin(jsbattleCore)


module.exports	= jsbattleCore;