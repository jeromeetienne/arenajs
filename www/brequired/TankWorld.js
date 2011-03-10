require.module('./TankWorld', function(module, exports, require) {
// start module: TankWorld

/**
 * to handle the world of tanks
*/

var jsbattle	= require('./jsbattle')

var TankWorld	= jsbattle.World.extend({
});


// commonjs exports
module.exports	= TankWorld;


// end module: TankWorld
});
