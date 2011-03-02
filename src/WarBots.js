//////////////////////////////////////////////////////////////////////////////////
//		generic WarBots							//
//////////////////////////////////////////////////////////////////////////////////

var Class	= require('../vendor/class');

var Game	= Class.extend({
	/**
	 * Start the game
	*/
	start	: function(){
		
	}
});

/**
 * Not sure about this class is needed
*/
var Bot		= Class.extend({
});

/**
 * Implement the world
 *
 * - it contains a list of bodys
*/
var World	= Class.extend({
	minPosition	: {x: 0, y: 0},
	maxPosition	: {x: 100, y: 100},
	
	width	: function(){
		return this.maxPosition.x - this.minPosition.x;
	},
	height	: function(){
		return this.maxPosition.y - this.minPosition.y;
	}
});

/**
 * Define a single body in a World
*/
var Body	= Class.extend({
	position	: { x: 42, y: 42},	// position in the World
	rotation	: 0,			// the rotation of this Body
	extent		: 10,			// the max extent of this body

	/**
	 * Function run periodially
	*/
	tick		: function(){},
	/**
	 * @return {Boolean} true if this body collides with otherBody, false otherwise
	*/
	collideWith	: function(otherBody){
		var dx	= this.position.x - otherBody.position.x;
		var dy	= this.position.y - otherBody.position.y;
		var dist= Math.sqrt(dx*dx + dy*dy);
		return dist < this.extent + otherBody.extent;
	}
});

// commonjs exports
exports.Game	= Game;
exports.Bot	= Bot;
exports.World	= World;
exports.Body	= Body;