var clientID = "";
var clientMSISDN = "";

function initClientManager(callback, errorCallback){
	try
	{ 
		loadClientID();
		console.log("INIT CLIENT: "+clientID+" msisdn:"+clientMSISDN);
		if(clientID != null && clientID != ""){
			//tenemos client ID asi que solo hacemos get
			getClientStatus(callback, errorCallback);
		}else{
			//tratamos de crear un cliente generico u obtener uno viejo que desinstalo la aplicacion
			//callback(false);
			//createOrUpdateClient(null, null, false, callback, errorCallback);
			
			//NEW: no creamos un cliente generico, esperamos a que se cree con msisdn por lo menos
			callback(false, 2); //periodo de pruebas mientras pone su informacion
		}
    }
	catch(err) 
	{ 
		txt="There was an error on this page.\n\n"; 
		txt+="Error description: " + err.message + "\n\n"; 
		console.log(txt);
		errorCallback();
		//alert(txt); 
	}
}

var FILE_KEY_CLIENT_ID = "APPDATACLIENTID";
var FILE_KEY_CLIENT_MSISDN = "APPDATACLIENTMSISDN";

function saveClientID(_clientID) {
	try{
		clientID = _clientID;
		window.localStorage.setItem(FILE_KEY_CLIENT_ID,""+clientID);
		return true;
	}catch(err){
		return false;
	}
}
function loadClientID() {
	clientID = window.localStorage.getItem(FILE_KEY_CLIENT_ID);
}

function saveClientMSISDN(_clientMSISDN) {
	try{
		if(_clientMSISDN.length < 8 && _clientMSISDN.length > 11){
			return false; //el numero esta mal formado
		}
		for(var i=0;i<_clientMSISDN.length;++i){
			parseInt(_clientMSISDN[i],10);
		}
		if(_clientMSISDN.indexOf("55") != 0){
			_clientMSISDN = "55"+_clientMSISDN;
		}
		clientMSISDN = _clientMSISDN;
		console.log("MSISDN FINAL: "+clientMSISDN);
		window.localStorage.setItem(FILE_KEY_CLIENT_MSISDN,""+clientMSISDN);
		return true;
	}catch(err){
		console.log("ERROR Not a number: "+err);
		return false;
	}
}
function loadClientMSISDN() {
	clientMSISDN = window.localStorage.getItem(FILE_KEY_CLIENT_MSISDN);
}


//CLIENT MANAGER OPERATIONS
function createOrUpdateClient(msisdn, password, subscribe, callback, errorCallback){
	try{
		//cargamos el id de cliente si existe
		loadClientID();
		
		//traemos el Client por WS si existe, sino con el RegID creamos uno temporal que actualizaremos de nuevo
		var jData = {};
		//TODO: cambiar este ID cableado? por ahora no hay pantalla de seleccion de pais
		var country = 3;
		var device_id = 0;
		var upstreamChannel = "";
		//IOS
		if(getDevice() == "iOS"){
			device_id = 2;
			upstreamChannel = "IOS";
		}else{
			//ANDROID
			device_id = 1;
			upstreamChannel = "Android";
		}
		
		var login = msisdn;

		//Cargamos info de devices (se necesita pasar el ID y no el nombre por el WS de play, quizas esto no sea una buena idea si se migra la BD)
		var devices = [];
		var device = {};
		if(regID != null && regID != ""){
			device.device_id = device_id;
			device.registration_id = regID;
			devices.push(device);
		}else{
			//TODO: llamar a funcion de error
			errorCallback();
			return;
		}
		
		//formamos la data a enviar
		jData.country = country;
		if(login != null && login != "")
			jData.login = login;
		if(password != null && password != "")
			jData.password = password;
		jData.upstreamChannel = upstreamChannel;
		
		//Dependiendo del caso hacemos create o update
		if(clientID != null && clientID != ""){
			//agregamos el device
			jData.add_devices = devices;
			
			//si viene para suscribir pasamos el flag
			if(subscribe){
				jData.subscribe = true;
			}
			
			//hacemos update
			var urlUpdateClients = _url+"/garotas/v1/clients/update";
			urlUpdateClients = urlUpdateClients+"/"+clientID;
			
			$.ajax({
				url : urlUpdateClients,
				data: JSON.stringify(jData),	
				type: 'POST',
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				timeout : 60000,
				success : function(data, status) {
					try{
						if(typeof data == "string"){
							data = JSON.parse(data);
						}
						var code = data.error;
						if(code == 0){
							var response = data.response;
							if(response != null){
								//revisamos el status del cliente para saber si podemos seguir o no
								var isActive = false;
								if(checkClientStatus(response.status)){
									isActive = true;
								}
								//SAVE WOMAN LIST
								initWomenManager(response.women);
								//SAVE Client ID
								if(saveClientID(response.id_client)){
									callback(isActive,response.status);
								}else{
									errorCallback();
								}
							}else{
								errorCallback();
							}
						}else{
							console.log("Error guardando cliente: "+data.description);
							errorCallback();
						}
					}catch(e){
						errorCallback();
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					console.log("error add client");
					errorCallback();
				}
			});
		}else{
			//agregamos el device al json
			jData.devices = devices;
			
			//creamos un client usando el msisdn y el regID que tenemos
			var urlCreateClients = _url+"/garotas/v1/clients/create";
			$.ajax({
				url : urlCreateClients,
				data: JSON.stringify(jData),	
				type: 'POST',
				contentType: "application/json; charset=utf-8",
				dataType: 'json',
				timeout : 60000,
				success : function(data, status) {
					try{
						if(typeof data == "string"){
							data = JSON.parse(data);
						}
						var code = data.error;
						if(code == 0){
							var response = data.response;
							if(response != null){
								//revisamos el status del cliente para saber si podemos seguir o no
								var isActive = false;
								if(checkClientStatus(response.status)){
									isActive = true;
								}
								//SAVE WOMAN LIST
								initWomenManager(response.women);
								//SAVE Client ID
								if(saveClientID(response.id_client)){
									callback(isActive,response.status);
								}else{
									errorCallback();
								}
							}else{
								errorCallback();
							}
						}else{
							console.log("Error guardando cliente: "+data.description);
							errorCallback();
						}
					}catch(e){
						errorCallback();
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					console.log("error add client");
					errorCallback();
				}
			});
		}

		return true;
	}catch(err){
		console.log("Ocurrio un error al crear u obtener el cliente: "+err.message);
		errorCallback();
		return false;
	}
}

function getClientStatus(callback, errorCallback){
	var upstreamChannel = "";
	//IOS
	if(getDevice() == "iOS"){
		upstreamChannel = "IOS";
	}else{
		//ANDROID
		upstreamChannel = "Android";
	}
	
	//hacemos get
	var urlGetClients = _url+"/garotas/v1/clients/get";
	urlGetClients = urlGetClients+"/"+clientID;
	urlGetClients = urlGetClients+"/"+upstreamChannel;
	
	$.ajax({
		url : urlGetClients,
		type: 'GET',
		contentType: "application/json; charset=utf-8",
		cache: false,
		timeout : 60000,
		success : function(data, status) {
			try{
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				var code = data.error;
				if(code == 0){
					var response = data.response;
					if(response != null){
						//revisamos el status del cliente para saber si podemos seguir o no
						var isActive = false;
						if(checkClientStatus(response.status)){
							isActive = true;
						}
						//SAVE WOMAN LIST
						initWomenManager(response.women);
						//SAVE Client ID
						if(saveClientID(response.id_client)){
							callback(isActive,response.status);
						}else{
							errorCallback();
						}
					}else{
						errorCallback();
					}
				}else{
					//TODO: que hacer en este caso, borrar el registro para que empiece de cero?
					console.log("Error guardando cliente: "+data.description);
					errorCallback();
				}
			}catch(e){
				errorCallback();
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			console.log("error add client");
			errorCallback();
		}
	});
}

//funciones privadas
function checkClientStatus(status){
	if(status > 0 && status != 2){
		return true;
	}else{
		return false;
	}
}
