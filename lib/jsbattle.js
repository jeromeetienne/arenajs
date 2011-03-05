//////////////////////////////////////////////////////////////////////////////////
//		generic jsbattle							//
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
	maxPosition	: {x: 400, y: 400},
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
	delBody	: function(body){
		console.assert( this.bodies.indexOf(body) != -1 )
		this.bodies.splice( this.bodies.indexOf(body), 1)
	}
});

/**
 * Define a single body in a World
*/
var Body	= Class.extend({
	position	: null,			// position in the World
	rotation	: 0,			// the rotation of this Body
	speed		: 1,			// the speed of the body
	radius		: 10,			// the max radius of this body
						// TODO renamed this radius

	init		: function(){
		this.position	= { x: 200, y: 200};
	},
	/**
	 * Function run periodially
	*/
	tick		: function(){
		this.position.x	+= this.speed * Math.cos(this.rotation);
		this.position.y	+= this.speed * Math.sin(this.rotation);
	},
		
	/**
	 * Get set for the speed
	*/
	setSpeed	: function(speed){
		this.speed	= speed;
		return this;
	},
	getSpeed	: function(){
		return this.speed;
	},


	notify		: function(eventType, eventData){
		console.log("basic fallback notify function", eventType, eventData)
	},
	/**
	 * @return {Boolean} true if this body collides with otherBody, false otherwise
	*/
	collideWith	: function(otherBody){
		console.assert(otherBody instanceof Body);
		var dx	= this.position.x - otherBody.position.x;
		var dy	= this.position.y - otherBody.position.y;
		var dist= Math.sqrt(dx*dx + dy*dy);
		return dist < this.radius + otherBody.radius;
	},
	bounceAgainst	: function(otherBody){
		console.assert(otherBody instanceof Body, "type error");
		console.assert(this.collideWith(otherBody), "bounce should be used only on colliding bodies");
		// compute the delta vector between this and otherBody
		var deltaX	= otherBody.position.x - this.position.x;
		var deltaY	= otherBody.position.y - this.position.y;
		// compute current distance between them
		var dist	= Math.sqrt(deltaX*deltaX + deltaY*deltaY);
		// compute unit vector
		var unitX	= deltaX/dist;
		var unitY	= deltaY/dist;
		// just a little increase to prevent floatingpoint error
		unitX	*= 1.01;
		unitY	*= 1.01;
		// compute contact point after the bounce
		var midX	= this.position.x + deltaX/2
		var midY	= this.position.y + deltaY/2
		// recompute this body position
		this.position.x	= midX - unitX * this.radius;
		this.position.y	= midY - unitY * this.radius;
		// recompute otherBody position
		otherBody.position.x	= midX + unitX * otherBody.radius;
		otherBody.position.y	= midY + unitY * otherBody.radius;
		// sanity check - MUST NOT collide after a bounce
		console.assert(!this.collideWith(otherBody), "still colliding after bounce");
	}
});


// commonjs exports
exports.Game	= Game;
exports.Body	= Body;
exports.Renderer= Renderer;
exports.World	= World;
