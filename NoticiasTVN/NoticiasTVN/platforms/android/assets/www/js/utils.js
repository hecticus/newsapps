var FILE_KEY_VERSION = "APPDATAVERSION";
var currentVersion = "0.9";

var FILE_KEY_ONLINE = "APPONLINE";

function initialSetup() {
	//revisamos como comienza la app
	checkConnection();
	if(window.navigator.onLine){
		onlineCallback();
	}else{
		offlineCallback()
	}
	
	document.addEventListener("offline", offlineCallback, false);
	document.addEventListener("online", onlineCallback, false);
	document.addEventListener("resume", onResumeApp, false);
	
	window.localStorage.setItem(FILE_KEY_VERSION,currentVersion);
}

//resume app
function onResumeApp(){
	reloadApp();
	console.log("App resuming");
}

//Connection
function isOffline(){
	var online = window.localStorage.getItem(FILE_KEY_ONLINE);
	if(online!=null && online == "true"){
		printToLog("isOffline- "+online);
		return false;
	}else{
		printToLog("isOffline- "+online);
		return true;
	}
}
function offlineCallback(){
	printToLog("OFFLINE!!!!");
	window.localStorage.removeItem(FILE_KEY_ONLINE);
}
function onlineCallback(){
	printToLog("ONLINE!!!!");
	window.localStorage.setItem(FILE_KEY_ONLINE,"true");
	ImgCache.clearCache();
}
function checkConnection() {
    var networkState = navigator.connection.type;
    //printToLog("networkState "+networkState);
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    
    //printToLog("STATUS!!!! "+states[networkState]);

    //alert('Connection type: ' + states[networkState]);
}

function formatDateStringForSorting(ds) {
	var YYYY,MM,DD;
	var hh="00";
	var mm="00";
	var ss="00";
	var dateString = ""+ds;
	var parts = dateString.split(" ");
	var DMY = parts[0].split("/");
	DD = DMY[0];
	MM = DMY[1];
	YYYY = DMY[2];
	if(parts.length > 1){
		
		var HMS = parts[1].split(":");
		var meridian = parts[2];
		var intH = parseInt(HMS[0]);
		if(meridian == "p.m." || meridian == "p.m" || meridian == "pm"){
			if(intH < 12){
				intH = intH+12;
			}
		}
		if ( intH < 10 ){
			hh = '0' + intH;
		}else{
			hh = intH;
		}
		mm = HMS[1];
		
	}
	if ( MM < 10 ) MM = '0' + MM;

	//console.log("Date: "+ds+" -- "+YYYY+MM+DD+hh+mm+ss);
	return ""+YYYY+MM+DD+hh+mm+ss;
};

function cleanExternalURL(url){
	return url.replace(/ /g,'%20');
}

//DEBUG
function printToLog(element){
	//console.log(element);
}
