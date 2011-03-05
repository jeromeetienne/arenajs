var jsbattle	= require('./jsbattle')

var TankRenderer	= jsbattle.Renderer.extend({
	init	: function(){
		
	}
});

var TankRendererCanvas	= TankRenderer.extend({
	init	: function(opts){
		this.containerId= opts.containerId	|| console.assert(false);
		// detect if the code is running in browser or not
		this.inBrowser	= typeof window === "object";
		// if not inBrowser, return now
		if( !this.inBrowser )	return;
		// init canvas context
		this.canvas	= document.getElementById(this.containerId);
		this.ctx	= this.canvas.getContext('2d');
		console.assert(this.ctx, 'bug in canvas support');
	},
	
	renderWorld	: function(tankWorld){
		// if not inBrowser, return now
		if( !this.inBrowser )	return;
		this.clearScreen();
		//console.log("render bodies", tankWorld.bodies.length);
		tankWorld.bodies.forEach(function(body){
			this._dispBody(body)
		}.bind(this));
		
		this._dispTank(tankWorld.bodies[0])
	},
	_dispTank	: function(body){
		var imgBody	= document.getElementById('imageBody');
		var imgRadar	= document.getElementById('imageRadar');
		var imgTurret	= document.getElementById('imageTurret');
		this.ctx.save();
		this.ctx.translate(body.position.x, body.position.y);
		this.ctx.rotate(body.rotation+Math.PI/2);

		this.ctx.drawImage(imgBody	, -imgBody.width/2	, -imgBody.height/2);
		this.ctx.drawImage(imgTurret	, -imgTurret.width/2	, -imgTurret.height/2);
		this.ctx.drawImage(imgRadar	, -imgRadar.width/2	, -imgRadar.height/2);
		this.ctx.restore();		
	},
	_dispBody	: function(body){
		var lifePercent	= (body.lifeTotal-body.lifeDamage) / body.lifeTotal;
		var ctx		= this.ctx;
		
		// display the circle
		ctx.beginPath();
		ctx.fillStyle = "rgb("+(50+lifePercent*200)+",0,0)";
		ctx.arc(body.position.x, body.position.y, body.radius, 0, Math.PI*2, true);
		ctx.fill();
		
		// display the rotation
		ctx.beginPath();
		ctx.moveTo(body.position.x, body.position.y);
		ctx.lineTo(body.position.x + Math.cos(body.rotation)*body.radius,
			   body.position.y + Math.sin(body.rotation)*body.radius);
		ctx.stroke();

		// display the name
		ctx.font	= '15px sans-serif';
		ctx.fillStyle	= "rgba(0,0,200, 0.5)";
		ctx.fillText(body.name, body.position.x, body.position.y);		
	},
	clearScreen	: function(){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	}
});

// commonjs exports
module.exports	= TankRendererCanvas;
