/**
 * Playground
*/

var TankGame	= require('./TankGame');
var TankWorld	= require('./TankWorld');
var TankRenderer= require('./TankRenderer');
var MyTankBot	= require('./MyTankBot');
var MyTankBotHuman	= require('./MyTankBotHuman');



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
for(var i = 0; i < 5; i++){
	var botTank	= new MyTankBot({
		game	: tankGame,
		name	: "bot-"+i,
		position: {
			x:	Math.floor(Math.random()*tankWorld.width())	+ tankWorld.minPosition.x,
			y:	Math.floor(Math.random()*tankWorld.height())	+ tankWorld.minPosition.y
		}
	});
}
if(false){
	var botTank	= new MyTankBotHuman({
		game	: tankGame,
		name	: "human-"+i,
		position: {
			x:	Math.floor(Math.random()*tankWorld.width())	+ tankWorld.minPosition.x,
			y:	Math.floor(Math.random()*tankWorld.height())	+ tankWorld.minPosition.y
		}
	});
}


// start the game
tankGame.start();

tankGame.bind('tick', function(world){
	tankRenderer.renderWorld(world)
});

