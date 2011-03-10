require.module('./ng_index', function(module, exports, require) {
// start module: ng_index

/**
 * API Playground
*/

var jsbattleCore= require('./ng_jsbattle_core')

var scripts	= {
	"superid"	: "src of the bot. no url. no filename. pure text of the source"
};

var battle	= new jsbattleCore({
	scripts	: scripts
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
	
});

/**
 * what is the structure of gameResult
 * {
 *	"scriptid"	: score
 * }
*/
battle.bind("end", function(gameResult){
	
});

// end module: ng_index
});
