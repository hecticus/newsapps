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
		try{
			executePushInit(JSON.parse(e["extra_params"]));
		}catch(e){
			console.log("Error: "+e);
		}
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
			//console.log("regID = " + e.regid);
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
    console.log('<li>token: '+ result +'</li>');
	regID = result;
	updateDeviceToServer();
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successPushHandler (result) {
    //console.log('<li>success:'+ result +'</li>');
}

function errorPushHandler (error) {
    //console.log('<li>error:'+ error +'</li>');
}

var FILE_KEY_CLIENT_REGID = "APPDATACLIENTREGID_V2";

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

//Ahora tratamos de obtener el cliente con el device id para que si no existe se cree y luego vamos al proceso normal
function updateDeviceToServer(){
	//console.log("revisando version");
	try {			
		if(regID != null && regID != ""){
			syncClientAndRegID();
			var currentRegID = loadRegID();
			if(currentRegID != null && currentRegID == regID){
				//same ID and already registered on server
				//console.log("Registrado en el servidor ya no se vuelve a registrar");
				return;
			}
			//revisamos si tenemos cliente porque sino no podemos registrar nada
			var client = loadClientData();
			if(client == null){
				//lo registramos como un cliente generico
				_jData.push_id = regID;
				var devicePlatform = device.platform;
				//IOS
				if(devicePlatform == "iOS"){
					_jData.type = "ios";
				}else{
					//ANDROID
					_jData.type = "droid";
				}
				//console.log("DATA TO SEND "+JSON.stringify(_jData));
				//var _oAjaxCreate = $.fPostAjaXJSONSimple('http://10.0.3.142:9000/KrakenSocialClients/v1/client/create/generic',_jData);
				var _oAjaxCreate = $.fPostAjaXJSONSimple('http://api.hecticus.com/KrakenSocialClients/v1/client/create/generic',_jData);	
				if (_oAjaxCreate) {

					_oAjaxCreate.done(function(_json) {
						//console.log("Respuesta ");
						//console.log("JSON "+JSON.stringify(_json));
						if (_json.response.length == 0) {
							//alert('No existe');
							//navigator.notification.alert("Error login", doNothing, "Ingresar", "OK");
						} else {
							//Actualizamos tambien las categorias de push
							getClientPushOptions(doNothing,doNothing,false);
							
							saveClientData(_json.response[0]);						
							//SAVE REGID
							saveRegID(regID);					
						}			   
					});
					
					_oAjaxCreate.fail(function() {
						
					});	
					
				}
			}else{
				//Actualizamos tambien las categorias de push
				getClientPushOptions(doNothing,doNothing,false);
				
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
		}
		   
	} catch (e) {
	}
}

function syncClientAndRegID(){
	//dconsole.log("syncClientAndRegID ");
	if(regID != null && regID != ""){
		_jData.push_id = regID;
		var devicePlatform = device.platform;
		//IOS
		if(devicePlatform == "iOS"){
			_jData.type = "ios";
		}else{
			//ANDROID
			_jData.type = "droid";
		}
		var _oAjaxSyncClient = $.fPostAjaXJSONSimple('http://api.hecticus.com/KrakenSocialClients/v1/client/getByPush',_jData);
		if (_oAjaxSyncClient) {
		
			_oAjaxSyncClient.done(function(_json) {
				if(_json.response != null){
					//console.log("CLIENT "+JSON.stringify(_json));
					if (_json.response.length == 0) {
					} else {
						var oldObj = loadClientData();
						if(oldObj == null){
							var clientOBJ = {id_social_clients:_json.response[0]};
							saveClientData(clientOBJ);
						}else{
							if(oldObj.id_social_clients != _json.response[0]){
								var clientOBJ = {id_social_clients:_json.response[0]};
								saveClientData(clientOBJ);
							}
						}
					}
				}
			});
		
			_oAjaxSyncClient.fail(function() {
						  
			});
		
		}
	}
}

setInterval(function(){
	syncClientAndRegID();
}, 600000);
