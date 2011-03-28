//////////////////////////////////////////////////////////////////////////////////
//		acewidget stuff							//
//////////////////////////////////////////////////////////////////////////////////

var editorCall	= function(event, callback){
	var iframeWin	= document.getElementById("editor").contentWindow;
	// if a callback is present, install it now
	if( callback ){
		event.userdata	= event.userdata	|| {}
		event.userdata.callback	= "editorCall-"+Math.floor(Math.random()*99999).toString(36);
		window[event.userdata.callback]	= function(data){
			callback(data)
		};
	}
	// post the message
	iframeWin.postMessage(JSON.stringify(event), "*");
}
window.addEventListener("message", function(event){
	console.log("event.data", event.data);
	var data	= JSON.parse(event.data)
	// notify the callback if specified
	if( 'userdata' in data && 'callback' in data.userdata ){
		console.log("notify callback to", data.userdata.callback, "with", data)
		window[data.userdata.callback](data);
		window[data.userdata.callback]	= undefined;
	}
});

//////////////////////////////////////////////////////////////////////////////////
//		viewer stuff							//
//////////////////////////////////////////////////////////////////////////////////

var viewerCall	= function(event, callback){
	var iframeWin	= document.getElementById("viewer").contentWindow;
	// if a callback is present, install it now
	if( callback ){
		event.userdata	= event.userdata	|| {}
		event.userdata.callback	= "editorCall-"+Math.floor(Math.random()*99999).toString(36);
		window[event.userdata.callback]	= function(data){
			callback(data)
		};
	}
	// post the message
	iframeWin.postMessage(JSON.stringify(event), "*");
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

jQuery(function(){

	var scriptsUrl	= {
		"bot-1"	: "http://localhost/~jerome/webwork/jsbattle/lib/MyTankBot.js",
		"bot-2"	: "http://localhost/~jerome/webwork/jsbattle/lib/MyTankBotHuman.js"
	};
	//
	//editorCall({
	//	type	: "setValue",
	//	data	: {
	//		text: "not yet implemented"
	//	}
	//});
})

var doViewerStart	= function(){
	var scriptsUrl	= {
		"bot-1"	: "http://localhost/~jerome/webwork/jsbattle/lib/MyTankBot.js",
		"bot-2"	: "http://localhost/~jerome/webwork/jsbattle/lib/MyTankBotHuman.js"
	};

	var scriptsData	= {}
	jQuery.each(scriptsUrl, function(scriptId, scriptUrl){
		jQuery.get(scriptUrl, function(scriptData){
			scriptsData[scriptId]	= scriptData;
			if( Object.keys(scriptsData).length == Object.keys(scriptsUrl).length ){
				allLoaded()
			}
		}, 'html');
	});

	var allLoaded	= function(){
		console.log("all script have been loaded")
		var toLoad	= Object.keys(scriptsData);
		var loadOne	= function(){
			var scriptId	= toLoad.pop();
			var scriptData	= scriptsData[scriptId];
			console.log("push", scriptId)
			viewerCall({
				type	: "initBot",
				data	: {
					scriptId	: scriptId,
					scriptData	: scriptData
				}
			}, function(data){
				console.log("scriptid", scriptId, JSON.stringify(data, null, '\t'));
				console.log("toLoad.length", toLoad.length)
				if( toLoad.length > 0 ){
					loadOne();					
				}else{
					allPushed();
				}
			});		
		};
		loadOne();
	}
	
	var allPushed	= function(){
		console.log("all pushed")		
	}
	
	
	
	/**
	 * Game init
	 * - reinit the widget
	 *   - reload the iframe ?
	 * - push all the bots
	 * - send start
	 * 
	 * Game run
	 * - viewer send states
	 *   - i grab them and display them on the screen
	 * - possibly update from the editor ?
	 *   - currently no live update
	 *
	 * End game
	*/
}