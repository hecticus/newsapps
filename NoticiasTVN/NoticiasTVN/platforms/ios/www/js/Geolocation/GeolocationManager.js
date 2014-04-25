//geolocation
var watchID = null;

function initGeolocation(){
	//console.log("initGeolocation");
	var options = { enableHighAccuracy: true };
	//var options = { enableHighAccuracy: false };
	watchID = navigator.geolocation.watchPosition(onSuccessGeo, onErrorGeo, options);
	//navigator.geolocation.getCurrentPosition(onSuccessGeo,onErrorGeo,options);
	//console.log("initGeolocation end");
}

// onSuccess Geolocation
//
function onSuccessGeo(position) {
	//console.log("actualizando");
	var element = document.getElementById('geolocation');
	//console.log('Latitude: '  + position.coords.latitude      + '<br />' + 'Longitude: ' + position.coords.longitude     + '<br />' +'<hr />');
}

// clear the watch that was started earlier
//
function clearWatch() {
	if (watchID != null) {
		navigator.geolocation.clearWatch(watchID);
		watchID = null;
		//console.log("clear watch");
		setTimeout(function(){initGeolocation();},1000);
	}
}

// onError Callback receives a PositionError object
//
function onErrorGeo(error) {
	console.log('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}
