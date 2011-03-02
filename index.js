#!/usr/bin/env node

var MyTankBot	= require('./MyTankBot.js')

// instance of a game
var aliceTank	= new MyTankBot({
	name	: "alice"
});
var bobTank	= new MyTankBot({
	name	: "bob"
});


