/**
 *
 * - TODO convert all the variable value into radian/degree
 * - if rad => radian
 * - if deg => degree
*/

var util	= {
	rad2deg	: function(rad){
		return rad/Math.PI*180;
	},
	deg2rad	: function(deg){
		return deg/180*Math.PI;
	},
	/**
	 * Convert a radian value into ]Math.PI, +Math.PI]
	*/
	radCenter: function(val){
		val	= util.radClamp(val)
		if( val < Math.PI )	return val;
		return Math.PI-val;
	},
	/**
	 * Convert a degree value into ]-180, +180]
	*/
	degCenter: function(val){
		val	= util.degClamp(val)
		if( val < 180 )	return val;
		return 180-val;
	},
	/**
	 * clamp a value in degree in [0, Math.PI*2[
	*/
	radClamp	: function(val){
		return ( (val % (Math.PI*2) ) + (Math.PI*2) ) % (Math.PI*2);
	},
	/**
	 * clamp a value in degree in [0, 360[
	*/
	degClamp	: function(val){
		return ((val % 360) + 360) % 360;
	},
	/**
	 * Clamp a value between min and max
	*/
	clamp		: function(val, min, max){
		val	= Math.max(val, min);
		val	= Math.min(val, max);
		return val;
	}
};

module.exports	= util;