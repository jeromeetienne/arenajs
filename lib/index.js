var TankGame	= require('./TankGame');
var TankWorld	= require('./TankWorld');
var TankRenderer= require('./TankRenderer');
var MyTankBot	= require('./MyTankBot');



/**
 * Init a work renderer
*/
var tankRenderer= new TankRenderer({
	containerId	: "renderArea"
})


/**
 * Init TankGame
*/
var tankWorld	= new TankWorld();
var tankGame	= new TankGame();
tankGame.setWorld(tankWorld);

// instance of a game
for(var i = 0; i < 10; i++){
	var botTank	= new MyTankBot({
		name	: "bot-"+i,
		position: {
			x:	Math.floor(Math.random()*tankWorld.width())	+ tankWorld.minPosition.x,
			y:	Math.floor(Math.random()*tankWorld.height())	+ tankWorld.minPosition.y
		}
	});	
	tankGame.addBot(botTank);
}


// start the game
tankGame.start({
	renderCb	: function(){
		tankRenderer.renderWorld(this.world)
	}
});


//aliceTank.stepFront();
//console.log("pos alice", aliceTank.position);
//console.log("pos bob", bobTank.position);
//

