/**
 * Render a game in a <canvas>
*/

var jsbattle	= require('./jsbattle')
var TankBot	= require('./TankBot')

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
			if( body instanceof TankBot.Bot )	this._dispTank(body)
			if( body instanceof TankBot.Shoot )	this._dispShoot(body)
		}.bind(this));
	},
	_dispTank	: function(body){
		var imgBody	= document.getElementById('imageBody');
		var imgRadar	= document.getElementById('imageRadar');
		var imgTurret	= document.getElementById('imageTurret');
		var ctx		= this.ctx;
		
		ctx.save();
		ctx.translate(body.position.x, body.position.y);

		// compute the scale based on body.radius and imgBody.width		
		var scale	= Math.sqrt(body.radius*body.radius/2) / (imgBody.width/2)
		ctx.scale(scale, scale)

		// display the tank
		ctx.save();
		ctx.rotate(body.rotation+Math.PI/2);
		ctx.drawImage(imgBody	, -imgBody.width/2	, -imgBody.height/2);
		ctx.drawImage(imgRadar	, -imgRadar.width/2	, -imgRadar.height/2);
		ctx.restore();

		// display the turret
		ctx.save();
		ctx.rotate(body.rotation+Math.PI/2+body.turretAngle);
		ctx.drawImage(imgTurret	, -imgTurret.width/2	, -imgTurret.height/2);
		ctx.restore();

		// display the radar
		ctx.save();
		ctx.rotate(body.rotation+Math.PI/2+body.radarAngle);
		ctx.drawImage(imgRadar	, -imgRadar.width/2	, -imgRadar.height/2);
		ctx.restore();

		// display the name
		ctx.font	= '15px sans-serif bold';
		ctx.fillStyle	= "rgba(0,0,0, 0.5)";
		ctx.fillText(body.name, 0, 0);		

		ctx.restore();		
	},
	_dispShoot	: function(body){
		var imgBullet	= document.getElementById('imageBullet');
		var ctx		= this.ctx;
		
		ctx.save();
		ctx.translate(body.position.x, body.position.y);

		// compute the scale based on body.radius and imgBody.width		
		var scale	= Math.sqrt(body.radius*body.radius/2) / (imgBullet.width/2)
		ctx.scale(scale, scale)

		ctx.rotate(body.rotation+Math.PI/2);
		ctx.drawImage(imgBullet	, -imgBullet.width/2	, -imgBullet.height/2);
		ctx.restore();
	},
	_dispBody	: function(body){
		var lifePercent	= (body.lifeTotal-body.lifeDamage) / body.lifeTotal;
		var ctx		= this.ctx;
		
		// display the circle
		ctx.beginPath();
		ctx.fillStyle = "rgba("+(50+lifePercent*200)+",0,0, 0.4)";
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
		this.ctx.fillStyle	= "rgb(0,150,0)";
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	}
});

// commonjs exports
module.exports	= TankRendererCanvas;
