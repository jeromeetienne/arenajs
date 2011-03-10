require.module('./ng_jsbattle_core', function(module, exports, require) {
// start module: ng_jsbattle_core

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
		//var superBot	= this.requireText(script);
		// TODO dunno how to convert the script text in a class
		// - security issue
		// - see with webworker
	})
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
	var prefix	= "(function(module,exports, require){";
	var suffix	= "})(mod, mod.exports, req)";
	
}


module.exports	= jsbattleCore;

// end module: ng_jsbattle_core
});
