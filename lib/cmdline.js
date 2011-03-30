/**
 * API Playground
*/


var botArgs		= process.argv.slice(2);

var ArenajsCore		= require('./ArenajsCore');

var TankRenderer	= require('./TankRendererConsole');
var tankRenderer	= new TankRenderer();

var loadScript	= function(filename){
	var loadNode	= function(filename){
		return require('fs').readFileSync(filename)
	};
	var loadBrowser	= function(filename){
		var req = new XMLHttpRequest();
		req.open('GET', '../lib/'+filename, false);
		req.send(null);
		if(req.status != 200)	throw new Error(req)
		return req.responseText;
	}
	if( typeof process !== "undefined" ){
		var isUrl	= ['http:', 'https:'].indexOf(require('url').parse(filename).protocol) != -1
		console.assert( !isUrl, "only local filename are allowed. "+filename+" is invalid" )
		return loadNode(filename)
	}else{
		return loadBrowser(filename)
	}
}

var arena	= new ArenajsCore();
/**
 * what is the structure of gameState
 * 
 * - in fact viewer should be based on this. not custom thing
 * - position of all players
 * - health pct
 * - position of all shoots
 * - thus viewer can display bots+shoot
 * - possible events like collision or death
 *   - thus viewer can make  visual/sound effects based on those event
*/
arena.bind("tick", function(gameState){
	//console.log("tick", gameState)
	var world	= gameState.world;
	var tickEvents	= gameState.tickEvents;
	tankRenderer.renderWorld(world, tickEvents)
});

/**
 * what is the structure of gameResult
 * {
 *	"scriptid"	: score
 * }
*/
arena.bind("end", function(gameResult){
	console.log("arena end", gameResult);
	arena.destroy();
	process.exit(0)
});


botArgs.forEach(function(botArg){
	var matches	= botArg.match(/^([^@]+)@(.*)$/);
	var scriptId	= matches[1];
	var scriptAddr	= matches[2];
	arena.addScript(scriptId, loadScript(scriptAddr))
});


// start the arena
arena.start();
