/**
 * API Playground
*/

var jsbattleCore= require('./jsbattle_core')

var TankRenderer	= require('./TankRenderer')
var tankRenderer	= new TankRenderer({
	containerId	: "renderArea"
})

var loadScript	= function(filename){
	var loadNode	= function(filename){
		return require('fs').readFileSync(__dirname+"/MyTankBot.js")
	};
	var loadBrowser	= function(filename){
		var req = new XMLHttpRequest();
		req.open('GET', '../lib/'+filename, false);
		req.send(null);
		if(req.status != 200)	throw new Error(req)
		return req.responseText;
	}
	if( typeof process !== "undefined" ){
		return loadNode(filename)
	}else{
		return loadBrowser(filename)
	}
}

var battle	= new jsbattleCore({
	scripts	: {
		"bot1"		: loadScript("MyTankBot.js"),
		"bot2"		: loadScript("MyTankBotHuman.js")
	}
});

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
battle.bind("tick", function(gameState){
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
battle.bind("end", function(gameResult){
	
});

