#!/usr/bin/env node


var TankGame	= require('./lib/TankGame')
var MyTankBot	= require('./lib/MyTankBot')

// instance of a game
var aliceTank	= new MyTankBot({
	name	: "alice"
});
var bobTank	= new MyTankBot({
	name	: "bob"
});


var tankGame	= new TankGame();
tankGame.addBot(aliceTank).addBot(bobTank);
tankGame.start();



