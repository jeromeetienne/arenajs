//////////////////////////////////////////////////////////////////////////////////
//		generic WarBots							//
//////////////////////////////////////////////////////////////////////////////////

var Class	= require('./class');

var Game	= Class.extend({
	/**
	 * Start the game
	*/
	start	: function(){
		
	}
});

/**
 * to render a world
*/
var Renderer	= Class.extend({
});

/**
 * Implement the world
 *
 * - it contains a list of bodys
*/
var World	= Class.extend({
	minPosition	: {x: 0, y: 0},
	maxPosition	: {x: 100, y: 100},
	bodies		: [],
	width	: function(){
		return this.maxPosition.x - this.minPosition.x;
	},
	height	: function(){
		return this.maxPosition.y - this.minPosition.y;
	},
	addBody	: function(body){
		console.assert(body instanceof Body);
		this.bodies.push(body);
	},
});

/**
 * Define a single body in a World
*/
var Body	= Class.extend({
	position	: { x: 42, y: 42},	// position in the World
	rotation	: 0,			// the rotation of this Body
	speed		: 1,			// the speed of the body
	extent		: 10,			// the max extent of this body

	init		: function(){
		
	},
	/**
	 * Function run periodially
	*/
	tick		: function(){},
	
	
	move	: function(){
		this.position.x	+= speed * Math.cos(this.rotation);
		this.position.y	+= speed * Math.sin(this.rotation);
	},	

	/**
	 * @return {Boolean} true if this body collides with otherBody, false otherwise
	*/
	collideWith	: function(otherBody){
		console.assert(body instanceof Body);
		var dx	= this.position.x - otherBody.position.x;
		var dy	= this.position.y - otherBody.position.y;
		var dist= Math.sqrt(dx*dx + dy*dy);
		return dist < this.extent + otherBody.extent;
	}
});


// commonjs exports
exports.Game	= Game;
exports.Body	= Body;
exports.Renderer= Renderer;
exports.World	= World;
