
//////////////////////////////////////////////////////////////////////////////////
//		Viewer ctor/dtor						//
//////////////////////////////////////////////////////////////////////////////////

var Viewer	= function(){
	this.windowMessageCtor();
}

Viewer.prototype.destroy	= function(){
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
	console.log("onInitBot")
	return "loaded"
}

Viewer.prototype.onGameStart	= function(){
	console.log("onGameStart")
	return true;
}
