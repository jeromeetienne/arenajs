#!/usr/bin/env node

var MyTankBot	= require('./src/MyTankBot')

// instance of a game
var aliceTank	= new MyTankBot({
	name	: "alice"
});
var bobTank	= new MyTankBot({
	name	: "bob"
});


