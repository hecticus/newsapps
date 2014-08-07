var FILE_KEY_VERSION = "APPDATAVERSION";
var currentVersion = "0.9";

var FILE_KEY_ONLINE = "APPONLINE";

function initialSetup() {
	//revisamos como comienza la app
	checkConnection();
	//if(window.navigator.onLine){
	if(phonegapIsOnline()){
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
	//console.log("App resuming");
}

//Connection
function isOffline(){
	/*var online = window.localStorage.getItem(FILE_KEY_ONLINE);
	if(online!=null && online == "true"){
		printToLog("isOffline- "+online);
		return false;
	}else{
		printToLog("isOffline- "+online);
		return true;
	}*/
	printToLog("isOffline- "+!phonegapIsOnline());
	return !phonegapIsOnline();
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
function phonegapIsOnline(){
	var networkState = navigator.connection.type;
	if(networkState == Connection.NONE || networkState == Connection.UNKNOWN){
		return false;
	}else{
		return true;
	}
}

function isWIFIOnly(){
	var networkState = navigator.connection.type;
	if(networkState == Connection.WIFI){
		return true;
	}else{
		return false;
	}
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

function getCurrentTimeMillis(){
	return new Date().getTime();
}

function cleanExternalURL(url){
	return url.replace(/ /g,'%20');
}

//funcion para revisar si el texto tiene formato HTML y si no lo tiene agregarselo
function checkHTMLText(rawText){
	if(rawText.indexOf("<p>") > -1){
		//aparenta tener formato asi que lo retornamos tal cual
		return rawText;
	}else{
		//Agregamos los formatos de html basicos, reemplazar \n por </p><p>
		var text = rawText;
		text = text.replace(/\n/g,'</p><p>');
		text = "<p>"+text+"</p>";
		//console.log("TEXTO: "+text);
		return text;
	}
}

function getCorrectImageBySize(imageArray,find){
	for(var i=0;i<imageArray.length;i++){
		if(imageArray[i].indexOf(find)>0){
			return imageArray[i];
		}
	}
}

function getScreenWidth(){
	var devicePlatform = device.platform;
	//IOS
	if(devicePlatform == "iOS"){
		return window.innerWidth;
	}else{
		//ANDROID
		return window.outerWidth;
	}
	
}
function getScreenHeight(){
	var devicePlatform = device.platform;
	//IOS
	if(devicePlatform == "iOS"){
		return window.innerHeight;
	}else{
		//ANDROID
		return window.outerHeight;
	}
}

var PD_LOW = 0;
var PD_MID = 1;
var PD_HI = 2;
var PD_EXHI = 3;

function getPixelDensity(){
	/*var screenwidth = getScreenWidth();
	var screenheight = getScreenHeight();
	console.log("W: "+screenwidth+" H: "+screenheight);*/
	var pixelRatio = window.devicePixelRatio;
	if(pixelRatio >= 2) {
		// pixelratio 2 or above – Extra high DPI
		//console.log("EXTRA HIGH "+pixelRatio);
		return PD_EXHI;
	} else if (pixelRatio >= 1.5) {
		// Pixelratio 1.5 or above – High DPI
		//console.log("HIGH "+pixelRatio);
		return PD_HI;
	} else if (pixelRatio <= 0.75) {
		// Pixelratio 0.75 or less – Low DPI
		//console.log("LOW "+pixelRatio);
		return PD_LOW;
	} else {
		// Pixelratio 1 or undetected. – Medium DPI
		//console.log("MEDIUM "+pixelRatio);
		return PD_MID;
	}
}

var GET_IMAGE_LOW = 0;
var GET_IMAGE_MID = 1;
var GET_IMAGE_HI = 2;

function getImageSizeType(){
	var pd = getPixelDensity();
	var screenwidth = getScreenWidth();
	var screenheight = getScreenHeight();
	var devicePlatform = device.platform;
	//IOS
	if(devicePlatform == "iOS"){
		if( pd == PD_HI || pd == PD_EXHI ){
			if(screenwidth < 768){
				//return GET_IMAGE_MID;
				return GET_IMAGE_LOW;
			}else{
				return GET_IMAGE_MID;
				//return GET_IMAGE_HI;
			}
		}else{
			if(screenwidth < 768){
				return GET_IMAGE_LOW;
			}else{
				//return GET_IMAGE_MID;
				return GET_IMAGE_LOW;
			}
		}
	}else{
		//ANDROID
	}
}

//SORTING
function sortNumber(a,b) {
    return a - b;
}
//var numArray = [140000, 104, 99];
//numArray.sort(sortNumber);

//attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}

//DEBUG
function printToLog(element){
	//console.log(element);
}

function doNothing(){
	
}

//IOS STUFF
function getIfItsIpad(){
	return getScreenWidth() > 640;
}
function getPPI(){
	// create an empty element
	var div = document.createElement("div");
	// give it an absolute size of one inch
	div.style.width="1in";
	// append it to the body
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(div);
	// read the computed width
	var ppi = document.defaultView.getComputedStyle(div, null).getPropertyValue('width');
	// remove it again
	body.removeChild(div);
	// and return the value
	return parseFloat(ppi);
}


function _getJsonNews () {
	
	var _json = false;
	var _iIndex = $('main').data('index');
	var _sKey = 'newscategories_' + _jMenu[_iIndex].json.id_news_category;
	
	_oAjax = $.fGetAjaXJSON(_jMenu[_iIndex].stream,false,true,false);
	if (_oAjax) {
		_oAjax.done(function(_json) {
			if(typeof(window.localStorage) != 'undefined') {
				window.localStorage.setItem(_sKey, JSON.stringify(_json));				 
			}
		});
	}
	
	if (window.localStorage.getItem(_sKey)) {
		_json = JSON.parse(window.localStorage.getItem(_sKey));	
	}
	
	return _json;
	
	
	
};

	
	
	

	


