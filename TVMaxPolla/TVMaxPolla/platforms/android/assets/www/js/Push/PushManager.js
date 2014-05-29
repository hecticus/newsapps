var pushNotification;

var regID = "";

function initPush(){
	try
	{ 
    	pushNotification = window.plugins.pushNotification;
    	if (device.platform == 'android' || device.platform == 'Android') {
			//console.log('<li>registering android</li>');
        	pushNotification.register(successPushHandler, errorPushHandler, {"senderID":"22536286221","ecb":"onNotificationGCM"});		// required!
		} else {
			//console.log('<li>registering iOS</li>');
        	pushNotification.register(tokenHandler, errorPushHandler, {"badge":"false","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
    	}
    }
	catch(err) 
	{ 
		txt="There was an error on this page.\n\n"; 
		txt+="Error description: " + err.message + "\n\n"; 
		//alert(txt); 
	}
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
    /*if (e.alert) {
         //$("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
         //console.log('push-notification: ' + e.alert);
         navigator.notification.alert(e.alert);
    }
        
    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successPushHandler, e.badge);
    }*/
	if(e["extra_params"] != null && e["extra_params"] != ""){
		executePushInit(e["extra_params"]);
	}
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
    //$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
    //console.log("EVENT -> RECEIVED:" + e.event);
    
    switch( e.event )
    {
        case 'registered':
		if ( e.regid.length > 0 )
		{
			//console.log('<li>REGISTERED -> REGID:' + e.regid + "</li>");
			// Your GCM push server needs to know the regID before it can push to this device
			// here is where you might want to send it the regID for later use.
			console.log("regID = " + e.regid);
			regID = e.regid;
			updateDeviceToServer();
		}
        break;
        
        case 'message':
        	// if this flag is set, this notification happened while we were in the foreground.
        	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
        	if (e.foreground)
        	{
				//console.log('<li>--INLINE NOTIFICATION--' + '</li>');
				
				// if the notification contains a soundname, play it.
				/*var my_media = new Media("/android_asset/www/"+e.soundname);
				my_media.play();*/
			}
			else
			{	// otherwise we were launched because the user touched a notification in the notification tray.
				if (e.coldstart){
					//console.log('<li>--COLDSTART NOTIFICATION--' + '</li>');
				}else{
					//console.log('<li>--BACKGROUND NOTIFICATION--' + '</li>');
				}
			}
        	//console.log('PUSHJS' + JSON.stringify(e.payload));
        	//window.setTimeout(app.errorNewsSave(),4000);
        	executePushInit(e.payload["extra_params"]);
			//console.log('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
			//console.log('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
        break;
        
        case 'error':
			console.log('<li>ERROR -> MSG:' + e.msg + '</li>');
        break;
        
        default:
			console.log('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
        break;
    }
}

function tokenHandler (result) {
    //console.log('<li>token: '+ result +'</li>');
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successPushHandler (result) {
    //console.log('<li>success:'+ result +'</li>');
}

function errorPushHandler (error) {
    //console.log('<li>error:'+ error +'</li>');
}

var FILE_KEY_CLIENT_REGID = "APPDATACLIENTREGID";

function saveRegID(regID) {
	try{
		window.localStorage.setItem(FILE_KEY_CLIENT_REGID,regID);
		return true;
	}catch(e){
		return false;
	}
}

function loadRegID() {
	return window.localStorage.getItem(FILE_KEY_CLIENT_REGID);
}


function updateDeviceToServer(){
	//console.log("revisando version");
	try {	
		if(regID != null && regID != ""){
			var currentRegID = loadRegID();
			if(currentRegID != null && currentRegID == regID){
				//same ID and already registered on server
				console.log("Registrado en el servidor ya no se vuelve a registrar");
				return;
			}
			//revisamos si tenemos cliente porque sino no podemos registrar nada
			var client = loadClientData();
			if(client == null){
				console.log("Aun no hay cliente para registrar el push id");
				return;
			}
			//var urlUpdate = "http://10.0.3.144:9000/KrakenSocialClients/v1/devices/add";
			var urlUpdate = "http://api.hecticus.com/KrakenSocialClients/v1/devices/add";
			var _data = {}
			_data.socialClientID = client.id_social_clients;
			_data.push_id = regID;
			var devicePlatform = device.platform;
			//IOS
			if(devicePlatform == "iOS"){
				_data.type = "ios";
			}else{
				//ANDROID
				_data.type = "droid";
			}
			if(currentRegID != null && currentRegID != ""){
				_data.old_push_id = currentRegID;
			}
			//console.log("DATA: "+JSON.stringify(_data));
		  	$.ajax({
				url : urlUpdate,
				data: JSON.stringify(_data),	
				type: 'POST',
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				timeout : 60000,
				success : function(data, status) {
					if(typeof data == "string"){
						data = JSON.parse(data);
					}
					var code = data.error;
					if(code == 0){
						//SAVE REGID
						saveRegID(regID);
					}else{
						console.log("Error guardando device: "+data.description);
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					console.log("error add device");
				}
			});
		}
		   
	} catch (e) {
	}
}
