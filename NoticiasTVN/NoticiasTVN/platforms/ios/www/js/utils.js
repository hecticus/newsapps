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
		if(meridian == "p.m." || meridian == "p.m" || meridian == "pm" || meridian == "PM"){
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
	if ( MM < 10 && MM.length == 1) MM = '0' + MM;

	//console.log("Date: "+ds+" -- "+YYYY+MM+DD+hh+mm+ss);
	return ""+YYYY+MM+DD+hh+mm+ss;
};

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

//sacamos las imagenes tanto del tag de hecticus si existe como de los tags de ellos
/**
 * hecticus_img:{
"originalimage":"url",
"resizedimage":["url_low","url_med","url_high"],
"extraimages":["url1","url2",...]
}
 */
function getBigImagesArrayForNews(news){
	var imageArray = [];
	try{
		var imageFile;
		if(news["hecticus_img"] != null && 
				news["hecticus_img"]["originalimage"] != null && news["hecticus_img"]["originalimage"] != "null" ){
			//console.log("NEWIMG ALL");
			//tenemos imagenes de hecticus
			imageFile = cleanExternalURL(news["hecticus_img"]["originalimage"]);
			imageArray.push(imageFile);
			if(news["hecticus_img"]["extraimages"] != null){
				for(var i=0;i<news["hecticus_img"]["extraimages"].length;i++){
					imageFile = cleanExternalURL(news["hecticus_img"]["extraimages"][i]);
					imageArray.push(imageFile);
				}
			}
			
		}else{
			//console.log("OLDIMG ALL");
			if(news["PortalImage"] != null && news["PortalImage"] != "null"){
				imageFile = "http://tvn-2.com"+news["PortalImage"];
			}else{
				imageFile = "http://tvn-2.com"+news["Image"];
			}
			imageFile = cleanExternalURL(imageFile);
			imageArray.push(imageFile);
			if(news["Image2"] != null && news["Image2"] != "null"){
				imageFile = "http://tvn-2.com"+news["Image2"];
				imageFile = cleanExternalURL(imageFile);
				imageArray.push(imageFile);
			}
			if(news["Image3"] != null && news["Image3"] != "null"){
				imageFile = "http://tvn-2.com"+news["Image3"];
				imageFile = cleanExternalURL(imageFile);
				imageArray.push(imageFile);
			}
			if(news["Image4"] != null && news["Image4"] != "null"){
				imageFile = "http://tvn-2.com"+news["Image4"];
				imageFile = cleanExternalURL(imageFile);
				imageArray.push(imageFile);
			}
			if(news["Image5"] != null && news["Image5"] != "null"){
				imageFile = "http://tvn-2.com"+news["Image5"];
				imageFile = cleanExternalURL(imageFile);
				imageArray.push(imageFile);
			}
		}
	}catch(e){
		
	}
	return imageArray;
}

function getListImageForNews(news, isMainImage){
	var imageFile = "";
	var imageTypeName;
	if(imageTypeNews == GET_IMAGE_MID){
		imageTypeName = "_med.";
		//console.log("IMAGE MED");
	}else if(imageTypeNews == GET_IMAGE_HI){
		imageTypeName = "_high.";
		//console.log("IMAGE HIGH");
	}else{
		imageTypeName = "_low.";
		//console.log("IMAGE LOW");
	}
	try{
		//console.log("NEWS: "+JSON.stringify(news));
		if(news["hecticus_img"] != null && 
				news["hecticus_img"]["originalimage"] != null && news["hecticus_img"]["originalimage"] != "null" ){
			//console.log("NEWIMG");
			//tenemos imagenes de hecticus
			if(isMainImage){
				imageFile = cleanExternalURL(news["hecticus_img"]["originalimage"]);
				//console.log("ORIGINAL "+imageFile);
			}else{
				//GET THE CORRECT IMAGE
				imageFile = getCorrectImageBySize(news["hecticus_img"]["resizedimage"],imageTypeName);
			}
		}else{
			//console.log("OLDIMG");
			if(news["PortalImage"] != null && news["PortalImage"] != "null"){
				imageFile = "http://tvn-2.com"+news["PortalImage"];
			}else{
				imageFile = "http://tvn-2.com"+news["Image"];
			}
			imageFile = cleanExternalURL(imageFile);
		}
	}catch(e){
		
	}
	return imageFile;
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
	}
}

var imageTypeNews;

//DEBUG
function printToLog(element){
	//console.log(element);
}
