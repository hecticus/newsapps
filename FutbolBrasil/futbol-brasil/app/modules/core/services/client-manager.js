'use strict';

/**
 * @ngdoc service
 * @name core.Services.ClientManager
 * @description ClientManager Factory
 */
angular
    .module('core')
    .factory('ClientManager',['CordovaDevice', 'Domain',
        function(CordovaDevice, Domain) {
            return {
                clientID : "",
                clientMSISDN : "",
                clientDataSafe : false,
                clientPassword : "",
                clientOBJ : {},
                FILE_KEY_CLIENT_ID : "APPDATACLIENTID",
                FILE_KEY_CLIENT_MSISDN : "APPDATACLIENTMSISDN",
                FILE_KEY_CLIENT_DATASAFE : "APPDATACLIENTDATASAFE",
                _url : 'http://brazil.footballmanager.hecticus.com',

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#method1
                 * @methodOf core.Services.ClientManager
                 * @return {boolean} Returns a boolean value
                 */
                method1 : function() {
                    return true;
                },

                initClientManager : function (callback, errorCallback){
                    try
                    {
                        this.loadClientID();
                        console.log("INIT CLIENT: "+clientID+" msisdn:"+clientMSISDN);
                        if(clientID != null && clientID != ""){
                            //tenemos client ID asi que solo hacemos get
                            getClientStatus(callback, errorCallback);
                        }else{
                            //no creamos un cliente generico, esperamos a que se cree con msisdn por lo menos
                            callback(false, 2); //periodo de pruebas mientras pone su informacion
                        }
                    } catch(err) {
                        console.log('There was an error on this page.\n\nError description: " + err.message + "\n\n');
                        errorCallback();
                    }
                },

                //Si ya tenemos el cliente creado entonces enviamos la info del regID, sino, esperamos que lo haga cuando se suscriba y ya
                updateRegistrationID : function (){
                    try
                    {
                        loadClientID();
                        if(clientID != null && clientID != ""){
                            if(hasToUpdateRegID()){
                                loadClientMSISDN();
                                //solo actualizamos el regID, lo demas lo dejamos como esta
                                createOrUpdateClient(clientMSISDN,null,false,doNothing,doNothing);
                            }
                        }
                    }
                    catch(err)
                    {

                    }
                },

                saveClientID : function (response, password) {
                    try{
                        //tenemos todo el objeto
                        clientOBJ.id_client = response.id_client;
                        clientOBJ.user_id = response.user_id;
                        clientOBJ.login = response.login;
                        if(password != null && password != ""){ clientOBJ.password = password; }

                        clientID = clientOBJ.id_client;
                        //TODO utilizar ngStorage
                        window.localStorage.setItem(this.FILE_KEY_CLIENT_ID,JSON.stringify(clientOBJ));
                        //mandamos a guardar tambien el reg ID
                        saveRegID(regID);
                        return true;
                    }catch(err){
                        return false;
                    }
                },

                loadClientID : function () {
                    //TODO utilizar ngStorage
                    this.clientDataSafe = window.localStorage.getItem(FILE_KEY_CLIENT_DATASAFE);
                    if(clientDataSafe == null || clientDataSafe != "true"){
                        //TODO utilizar ngStorage
                        window.localStorage.removeItem(FILE_KEY_CLIENT_ID);
                        //TODO utilizar ngStorage
                        window.localStorage.removeItem(FILE_KEY_CLIENT_MSISDN);
                    }else{
                        //TODO utilizar ngStorage
                        var clientString = window.localStorage.getItem(FILE_KEY_CLIENT_ID);
                        if(clientString != null && clientString != ""){
                            try{
                                this.clientOBJ = JSON.parse(clientString);
                                this.clientID = this.clientOBJ.id_client;
                            }catch(e){

                            }
                        }
                    }
                },

                saveClientMSISDN : function (_clientMSISDN) {
                    try{
                        if(_clientMSISDN.length < 8 || _clientMSISDN.length > 11){
                            return false; //el numero esta mal formado
                        }
                        for(var i=0;i<_clientMSISDN.length;++i){
                            parseInt(_clientMSISDN[i],10);
                        }

                        this.clientMSISDN = _clientMSISDN;
                        //console.log("MSISDN FINAL: "+clientMSISDN);
                        //TODO utilizar ngStorage
                        window.localStorage.setItem(this.FILE_KEY_CLIENT_MSISDN,""+this.clientMSISDN);
                        return true;
                    }catch(err){
                        console.log("ERROR Not a number: "+err);
                        return false;
                    }
                },

                loadClientMSISDN : function () {
                    this.clientMSISDN = window.localStorage.getItem(this.FILE_KEY_CLIENT_MSISDN);
                },

                markClientAsOK : function () {
                    try{
                        clientDataSafe = true;
                        window.localStorage.setItem(FILE_KEY_CLIENT_DATASAFE,"true");
                        return true;
                    }catch(err){
                        return false;
                    }
                },

                //CLIENT MANAGER OPERATIONS
                createOrUpdateClient : function (msisdn, password, subscribe, callback, errorCallback){
                    try{
                        this.clientPassword = password;
                        //cargamos el id de cliente si existe
                        this.loadClientID();
                        //traemos el Client por WS si existe, sino con el RegID creamos uno temporal que
                        // actualizaremos de nuevo
                        var jData = {};
                        //TODO: cambiar este ID cableado? por ahora no hay pantalla de seleccion de pais
                        var country = 3;
                        var device_id = 0;
                        var upstreamChannel = "";
                        //IOS
                        if(this.CordovaDevice.getDevice() == "iOS"){
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
                            //Si no tenemos informacion del push no hacemos nada diferente, seguimos y esperamos que cuando llege se mande a actualizar
                        }

                        //formamos la data a enviar
                        jData.country = country;
                        if(login != null && login != "")
                            jData.login = login;
                        if(clientPassword != null && clientPassword != "")
                            jData.password = clientPassword;
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
                            var urlUpdateClients = _url+"/futbolbrasil/v1/clients/update";
                            urlUpdateClients = urlUpdateClients+"/"+clientID;

                            $.ajax({
                                url : urlUpdateClients,
                                data: JSON.stringify(jData),
                                type: 'POST',
                                headers: getHeaders(),
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
                                                //SAVE TEAM LIST
                                                initTeamManager(response.push_alerts);
                                                //SAVE Client ID
                                                if(saveClientID(response, password)){
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
                                    console.log("error add client1 "+thrownError);
                                    errorCallback();
                                }
                            });
                        }else{
                            //agregamos el device al json
                            jData.devices = devices;

                            console.log("ENVIO: "+JSON.stringify(jData));

                            //creamos un client usando el msisdn y el regID que tenemos
                            var urlCreateClients = _url+"/futbolbrasil/v1/clients/create";
                            $.ajax({
                                url : urlCreateClients,
                                data: JSON.stringify(jData),
                                type: 'POST',
                                headers: getHeaders(),
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
                                                //SAVE TEAM LIST
                                                initTeamManager(response.push_alerts);
                                                //SAVE Client ID
                                                if(saveClientID(response, password)){
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
                                    console.log("error add client2 "+thrownError);
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
                },

                getClientStatus : function (callback, errorCallback){
                    var upstreamChannel = "";
                    if(CordovaDevice.getDevice() == "iOS"){
                        upstreamChannel = "IOS";
                    }else{
                        upstreamChannel = "Android";
                    }

                    //TODO migrar a constants
                    var urlGetClients = _url+"/futbolbrasil/v1/clients/get";
                    urlGetClients = urlGetClients+"/"+clientID;
                    urlGetClients = urlGetClients+"/"+upstreamChannel;

                    $.ajax({
                        url : urlGetClients,
                        type: 'GET',
                        headers: getHeaders(),
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
                                        //SAVE TEAM LIST
                                        initTeamManager(response.push_alerts);
                                        //SAVE Client ID
                                        if(saveClientID(response, null)){
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
                            console.log("error get status client "+thrownError);
                            errorCallback();
                        }
                    });
                },

                //funciones privadas
                checkClientStatus : function (status){
                    if(status > 0 && status != 2){
                        return true;
                    }else{
                        return false;
                    }
                },

                //REMOVE OLD DATA
                FILE_KEY_STOREDVERSION : "APPSTOREDVERSION",
                currentVersion : 0,
                checkStoredData : function (){
                    var storedVersion = loadStoredVersion();
                    if(storedVersion != null && storedVersion != ""){
                        var storedInt = parseInt(storedVersion);
                        if(currentVersion > storedVersion){
                            //borramos todas las configuraciones
                            eraseAllConfigs();
                        }
                    }else{
                        //borramos todas las configs
                        eraseAllConfigs();
                    }
                    saveStoredVersion();
                },

                eraseAllConfigs : function (){
                    window.localStorage.removeItem(FILE_KEY_CLIENT_ID);
                    window.localStorage.removeItem(FILE_KEY_CLIENT_MSISDN);
                    window.localStorage.removeItem(FILE_KEY_CLIENT_REGID);
                    window.localStorage.removeItem(FILE_KEY_CLIENT_DATASAFE);
                },

                saveStoredVersion : function () {
                    try{
                        window.localStorage.setItem(FILE_KEY_STOREDVERSION,""+currentVersion);
                        return true;
                    }catch(err){
                        return false;
                    }
                },

                loadStoredVersion : function () {
                    return window.localStorage.getItem(FILE_KEY_STOREDVERSION);
                }


            };
        }
    ]);
