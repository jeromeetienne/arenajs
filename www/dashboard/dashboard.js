
//////////////////////////////////////////////////////////////////////////////////
//		Viewer ctor/dtor						//
//////////////////////////////////////////////////////////////////////////////////

var Dashboard	= function(){
	this.editorCtor();
	this.viewerCtor();
	this.scriptsListUiCtor();
}

Dashboard.prototype.destroy	= function(){
	this.scriptsListUiDtor();
	this.viewerDtor();
	this.editorDtor();
}


//////////////////////////////////////////////////////////////////////////////////
//		acewidget stuff							//
//////////////////////////////////////////////////////////////////////////////////

Dashboard.prototype.editorCtor	= function()
{
	//this.$onEditorMessage	= this.$onEditorMessage	|| this.onEditorMessage.bind(this);
	window.addEventListener("message", function(event){
		//console.log("event.data", event.data);
		var data	= JSON.parse(event.data)
		// notify the callback if specified
		if( 'userdata' in data && 'callback' in data.userdata ){
			//console.log("notify callback to", data.userdata.callback, "with", data)
			window[data.userdata.callback](data);
			window[data.userdata.callback]	= undefined;
		}
	});
}

Dashboard.prototype.editorDtor	= function()
{
}

Dashboard.prototype.editorCall	= function(event, callback)
{
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

//////////////////////////////////////////////////////////////////////////////////
//		viewer stuff							//
//////////////////////////////////////////////////////////////////////////////////

Dashboard.prototype.viewerCtor	= function(){
	jQuery('#viewerContainer .menu input[value=start]').click(function(){
		this.viewerStart();
	}.bind(this));
}
Dashboard.prototype.viewerDtor	= function(){
}


Dashboard.prototype.viewerCall	= function(event, callback){
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

Dashboard.prototype.viewerStart	= function(){
	var scripts	= this.scriptsListCollect();

	var scriptsData	= {}
	jQuery.each(scripts, function(scriptId, scriptUrl){
		jQuery.get(scriptUrl, function(scriptData){
			scriptsData[scriptId]	= scriptData;
			if( Object.keys(scriptsData).length == Object.keys(scripts).length ){
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
			//console.log("push", scriptId)
			this.viewerCall({
				type	: "initBot",
				data	: {
					scriptId	: scriptId,
					scriptData	: scriptData
				}
			}, function(result){
				console.assert(result.status === 'succeed' )
				//console.log("scriptid", scriptId, JSON.stringify(data, null, '\t'));
				//console.log("toLoad.length", toLoad.length)
				if( toLoad.length > 0 ){
					loadOne();					
				}else{
					allPushed();
				}
			});		
		}.bind(this);
		loadOne();
	}.bind(this);
	
	var allPushed	= function(){
		console.log("all scripts pushed")
		this.viewerCall({
			type	: "gameStart",
			data	: null
		}, function(result){
			console.assert(result.status === 'succeed' )
			console.log("game started");
		}.bind(this));		
	}.bind(this);
	
	
	
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


//////////////////////////////////////////////////////////////////////////////////
//		Script List Ui							//
//////////////////////////////////////////////////////////////////////////////////

Dashboard.prototype.scriptsListUiCtor	= function()
{
	jQuery('#ScriptListMenu input[value=insert]').live('click', function(){
		this.scriptsListUiAppendItem();
	}.bind(this));

	jQuery('#ScriptList input[type=button][value=edit]').live('click', function(event){
		var target	= event.currentTarget;
		var item	= jQuery().parent('div.item');
		
		console.log("nb line", jQuery('#ScriptList .item').length);
		
		//this.scriptsListCollect();
		this.scriptsListIdConflict();
	}.bind(this));

	jQuery('#ScriptList input[type=button][value=remove]').live('click', function(event){
		var target	= event.currentTarget;
		var item	= jQuery(target).parent('div.item');
		if( this.scriptsListUiNbItems() == 1 )	return;
		item.remove();
	}.bind(this));

	jQuery('#ScriptList .item input[type=text]').live('change', function(event){
		console.log("changed", event)
		this.scriptsListPutLocation();
	}.bind(this));
	

	// initialisation of the item in ScriptsList	
	var scripts	= this.scriptsListGetLocation();
	console.log("scripts", scripts)
	if( scripts ){
		this.scriptsListUiClear();
		Object.keys(scripts).forEach(function(scriptId){
			var scriptUrl	= scripts[scriptId];
			this.scriptsListUiAppendItem(scriptId, scriptUrl)
		}.bind(this))
	}else{
		this.scriptsListUiAppendItem();
	}
}

Dashboard.prototype.scriptsListUiDtor	= function()
{
}

Dashboard.prototype.scriptsListUiNbItems	= function()
{
	return jQuery('#ScriptList div.item').length;
}

Dashboard.prototype.scriptsListUiClear	= function()
{
	jQuery('#ScriptList div.item').remove();
}

Dashboard.prototype.scriptsListUiAppendItem	= function(scriptId, scriptUrl)
{
	// TODO to honor scriptId, scriptUrl
	var element	= jQuery('#ScriptListItemSample div.item').clone();
	if( scriptId )	jQuery("input[name=scriptId]", element).val(scriptId)
	if( scriptUrl )	jQuery("input[name=scriptUrl]", element).val(scriptUrl)
	element.appendTo('#ScriptList');
}

/**
 * collect the data in the scriptsList
*/
Dashboard.prototype.scriptsListCollect	= function()
{
	var scripts	= {};
	jQuery('#ScriptList div.item').each(function(){
		var scriptId	= jQuery("input[name=scriptId]", this).val();
		var scriptUrl	= jQuery("input[name=scriptUrl]", this).val();
		if( scriptId.length === 0 || scriptUrl.length === 0 )	return;
		scripts[scriptId]	= scriptUrl;
	});
	return scripts;
}

Dashboard.prototype.scriptsListIdConflict	= function()
{
	var scripts	= this.scriptsListCollect();
	var nbUiItems	= jQuery('#ScriptList div.item').length;
	var conflicting	= Object.keys(scripts).length != nbUiItems;
	return conflicting;
}

Dashboard.prototype.scriptsListGetLocation	= function()
{
	if( !window.location.hash )	return null;
	var hash	= window.location.hash.substr(1);
	var scripts	= JSON.parse(hash);
	if( Object.keys(scripts).length === 0 )	return null;
	return scripts;
}

Dashboard.prototype.scriptsListPutLocation	= function()
{
	var scripts	= this.scriptsListCollect();
	var str		= ''
	if( Object.keys(scripts).length > 0 )	str	= JSON.stringify(scripts)
	window.location.hash	= '#'+str;
}





