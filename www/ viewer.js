/**
 * Constructor
*/
var Viewer	= function(){
	// get options from ctor
	this.editorCss	= ctor_opts.editorCss	|| false;

	
	if( this.editorCss ){
		this.editor	= new Viewer.editor({
			editorCss	: this.editorCss
		})
	}

	// init this.state
	this.state	= Viewer.state.none;

	var scriptsData	= {};
	_.each(scriptsUrl, function(scriptUrl, scriptId){
		jQuery.get(scriptUrl, function(scriptData){
			console.log("scriptUrl", scriptUrl, scriptId);
			scriptsData[scriptId]	= scriptData;
			if( _.keys(scriptsData).length == _.keys(scriptsUrl).length ){
				console.log("prout", scriptsData)
				//allLoaded()
			}
		}, 'html');
	});
}

/**
 * Destructor
*/
Viewer.prototype.destroy	= function(){
	this.editor && this.editor.destroy();
}

//////////////////////////////////////////////////////////////////////////////////
//		Viewer.Editor							//
//////////////////////////////////////////////////////////////////////////////////

// microevent mixing Viewer
microevent.mixin(Viewer)

Viewer.prototype.start		= function(){
}
Viewer.prototype.pause		= function(){
}
Viewer.prototype.stop		= function(){	
}

//////////////////////////////////////////////////////////////////////////////////
//		PageState							//
//////////////////////////////////////////////////////////////////////////////////

Viewer.prototype.pageStateSet	= function(state){
	jQuery.bbq.pushState(state);
}
Viewer.prototype.pageStateGet	= function(){
	return jQuery.bbq.getState();
}

//////////////////////////////////////////////////////////////////////////////////
//		Viewer.Editor							//
//////////////////////////////////////////////////////////////////////////////////

Viewer.state		= {};
Viewer.state.none	= "none";
Viewer.state.init	= "init";
Viewer.state.running	= "running";
Viewer.state.paused	= "paused";
Viewer.state.completed	= "completed";

//////////////////////////////////////////////////////////////////////////////////
//		Viewer.Editor							//
//////////////////////////////////////////////////////////////////////////////////

Viewer.editor	= function(ctor){
	var editorCss	= ctos.editorCss	|| console.assert(false);
	this.acewidget	= jQuery(this.editorCss).acewidget();
	
}
Viewer.editor.destroy	= function(){
	this.acewidget.destroy();
}
Viewer.editor.get	= function(callback){
	this.acewidget.getValue(function(result){
		console.assert(result.status === "sucess")
		callback(result.data.data)
	})
}
Viewer.editor.put	= function(callback){
	this.acewidget.setValue(text, function(result){
		console.assert(result.status === "sucess")
		if(callback)	callback()
	})
}

