
var ArenajsCore		= require('./ArenajsCore')
var TankRenderer	= require('./TankRenderer')

//////////////////////////////////////////////////////////////////////////////////
//		Viewer ctor/dtor						//
//////////////////////////////////////////////////////////////////////////////////

var Viewer	= function(){
	this.windowMessageCtor();
		
	this.tankRenderer	= new TankRenderer({
		containerId	: "renderArea"
	})

	this.battle	= new ArenajsCore();
	
	this.battle.bind("tick", function(gameState){
		//console.log("battle tick", gameState);
		var world	= gameState.world;
		var tickEvents	= gameState.tickEvents;
		this.tankRenderer.renderWorld(world, tickEvents)
	}.bind(this));
	this.battle.bind("end", function(gameResult){
		console.log("battle end", gameResult);	
	}.bind(this));
}

Viewer.prototype.destroy	= function(){
	if( this.battle ){
		this.battle.destroy();
	}
}

//////////////////////////////////////////////////////////////////////////////////
//		windowMessage							//
//////////////////////////////////////////////////////////////////////////////////

Viewer.prototype.windowMessageCtor	= function(){
	window.addEventListener("message", function(event){
		// keep message IIF in a iframe
		if( window.parent === window )		return;
		// keep only message from the parent window
		if( event.source !== window.parent)	return;
		// parse the event
		var eventFull	= JSON.parse(event.data);
		var eventType	= eventFull.type;
		var eventData	= eventFull.data;
		var userdata	= eventFull.userdata;
		//console.log("eventFull", eventFull);
		//console.log("window message", event.data, event.origin);
		var methodName	= "on" + eventType.substr(0,1).toUpperCase() + eventType.substr(1);
		if( methodName in this ){
			try {
				var ret	= this[methodName](eventData);
				window.parent.postMessage(JSON.stringify({
					status	: "succeed",
					userdata: userdata,
					data	: ret
				}), "*");
			}catch(e){
				window.parent.postMessage(JSON.stringify({
					status	: "error",
					userdata: userdata,
					message	: e.toString()
				}), "*");				
			}
		}else{
			console.log("event ", eventType, "is unknown")
		}
	}.bind(this), false);
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

Viewer.prototype.onInitBot	= function(data){
	console.log("onInitBot", data.scriptId)
	var scriptId	= data.scriptId;
	var scriptData	= data.scriptData;
	this.battle.addScript( scriptId, scriptData );	
	return true;
}

Viewer.prototype.onGameStart	= function(){
	if( this.battle.isStarted() ){
		console.log("already started. do nothing")
		return 
	}
	this.battle.start();
	return true;
}
