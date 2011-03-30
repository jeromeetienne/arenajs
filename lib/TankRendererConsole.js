/**
 * Render a game in a <canvas>
*/

var jsbattle	= require('./jsbattle')
var TankBot	= require('./TankBot')

var TankRendererConsole	= jsbattle.Renderer.extend({
	init	: function(){
	},
	/**
	 * render the world
	*/
	renderWorld	: function(tankWorld, tickEvents){
	}
});

// commonjs exports
module.exports	= TankRendererConsole;
