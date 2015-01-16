'use strict';

/**
 * @ngdoc service
 * @name core.Services.ClientManager
 * @description ClientManager Factory
 */
angular
    .module('core')
    .factory('ClientManager',['CordovaDevice', 'PushManager', 'WebManager', 'TeamsManager'
        , 'Domain', 'Utilities',
        function(CordovaDevice, PushManager, WebManager, TeamsManager, Domain, Utilities) {
            return {
                clientID : "",
                clientMSISDN : "",
                clientDataSafe : false,
                clientPassword : "",
                clientOBJ : {},
                FILE_KEY_CLIENT_ID : "APPDATACLIENTID",
                FILE_KEY_CLIENT_MSISDN : "APPDATACLIENTMSISDN",
                FILE_KEY_CLIENT_DATASAFE : "APPDATACLIENTDATASAFE",

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#method1
                 * @methodOf core.Services.ClientManager
                 * @return {boolean} Returns a boolean value
                 */
                method1 : function() {
                    return true;
                },

                init : function (callback, errorCallback){
                    try
                    {
                        this.loadClientID();
                        console.log("INIT CLIENT: " + this.clientID + " msisdn:" + this.clientMSISDN);
                        if(this.clientID != null && this.clientID != ""){
                            //tenemos client ID asi que solo hacemos get
                            this.getClientStatus(callback, errorCallback);
                        }else{
                            //no creamos un cliente generico, esperamos a que se cree con msisdn
                            // por lo menos
                            callback(false, 2); //periodo de pruebas mientras pone su informacion
                        }
                    } catch(err) {
                        console.log('There was an error on this page.\n\nError description: '
                            + err.message + '\n\n');
                        errorCallback();
                    }
                },

                //Si ya tenemos el cliente creado entonces enviamos la info del regID, sino, esperamos que
                // lo haga cuando se suscriba y ya
                updateRegistrationID : function (){
                    try {
                        this.loadClientID();
                        if(this.clientID != null && this.clientID != ""){
                            if(PushManager.hasToUpdateRegID()){
                                this.loadClientMSISDN();
                                //solo actualizamos el regID, lo demas lo dejamos como esta
                                this.createOrUpdateClient(this.clientMSISDN, null, false
                                    , Utilities.doNothing
                                    , Utilities.doNothing);
                            }
                        }
                    } catch(err) {

                    }
                },

                saveClientID : function (response, password) {
                    try {
                        //tenemos todo el objeto
                        this.clientOBJ.id_client = response.id_client;
                        this.clientOBJ.user_id = response.user_id;
                        this.clientOBJ.login = response.login;
                        if(password != null && password != ""){
                            this.clientOBJ.password = password;
                        }

                        this.clientID = this.clientOBJ.id_client;
                        //TODO utilizar ngStorage
                        window.localStorage.setItem(this.FILE_KEY_CLIENT_ID
                            ,JSON.stringify(this.clientOBJ));
                        //mandamos a guardar tambien el reg ID
                        Pushmanager.saveRegID(regID);
                        return true;
                    } catch(err){
                        return false;
                    }
                },

                loadClientID : function () {
                    //TODO utilizar ngStorage
                    this.clientDataSafe = window.localStorage.getItem(this.FILE_KEY_CLIENT_DATASAFE);
                    if(this.clientDataSafe == null || this.clientDataSafe != "true"){
                        //TODO utilizar ngStorage
                        window.localStorage.removeItem(this.FILE_KEY_CLIENT_ID);
                        //TODO utilizar ngStorage
                        window.localStorage.removeItem(this.FILE_KEY_CLIENT_MSISDN);
                    }else{
                        //TODO utilizar ngStorage
                        var clientString = window.localStorage.getItem(this.FILE_KEY_CLIENT_ID);
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
                        //TODO utilizar ngStorage
                        window.localStorage.setItem(this.FILE_KEY_CLIENT_MSISDN,""+this.clientMSISDN);
                        return true;
                    } catch(err){
                        console.log("ERROR Not a number: "+err);
                        return false;
                    }
                },

                loadClientMSISDN : function () {
                    this.clientMSISDN = window.localStorage.getItem(this.FILE_KEY_CLIENT_MSISDN);
                },

                markClientAsOK : function () {
                    try{
                        this.clientDataSafe = true;
                        window.localStorage.setItem(this.FILE_KEY_CLIENT_DATASAFE,"true");
                        return true;
                    } catch(err){
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
                        if(CordovaDevice.getDevice() == "iOS"){
                            device_id = 2;
                            upstreamChannel = "IOS";
                        }else{
                            //ANDROID
                            device_id = 1;
                            upstreamChannel = "Android";
                        }

                        var login = msisdn;

                        //Cargamos info de devices (se necesita pasar el ID y no el nombre
                        // por el WS de play, quizas esto no sea una buena idea si se migra la BD)
                        var devices = [];
                        var device = {};
                        if(regID != null && regID != ""){
                            device.device_id = device_id;
                            device.registration_id = regID;
                            devices.push(device);
                        }else{
                            //Si no tenemos informacion del push no hacemos nada diferente, seguimos y
                            // esperamos que cuando llege se mande a actualizar
                        }

                        //formamos la data a enviar
                        jData.country = country;
                        if(login != null && login != "")
                            jData.login = login;
                        if(this.clientPassword != null && this.clientPassword != "")
                            jData.password = this.clientPassword;
                        jData.upstreamChannel = upstreamChannel;

                        //Dependiendo del caso hacemos create o update
                        if(this.clientID != null && this.clientID != ""){
                            //agregamos el device
                            jData.add_devices = devices;

                            //si viene para suscribir pasamos el flag
                            if(subscribe){
                                jData.subscribe = true;
                            }

                            //hacemos update
                            $.ajax({
                                url : Domain.clients.update(this.clientId),
                                data: JSON.stringify(jData),
                                type: 'POST',
                                headers: WebManager.getHeaders(),
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
                                                //revisamos el status del cliente para saber
                                                // si podemos seguir o no
                                                var isActive = false;
                                                if(this.checkClientStatus(response.status)){
                                                    isActive = true;
                                                }
                                                //SAVE TEAM LIST
                                                TeamsManager.init(response.push_alerts);
                                                //SAVE Client ID
                                                if(this.saveClientID(response, password)){
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
                            $.ajax({
                                url : Domain.clients.create,
                                data: JSON.stringify(jData),
                                type: 'POST',
                                headers: WebManager.getHeaders(),
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
                                                //revisamos el status del cliente para saber si podemos
                                                // seguir o no
                                                var isActive = false;
                                                if(this.checkClientStatus(response.status)){
                                                    isActive = true;
                                                }
                                                //SAVE TEAM LIST
                                                TeamsManager.init(response.push_alerts);
                                                //SAVE Client ID
                                                if(this.saveClientID(response, password)){
                                                    callback(isActive,response.status);
                                                }else{
                                                    errorCallback();
                                                }
                                            }else{
                                                errorCallback();
                                            }
                                        }else{
                                            console.log("Error guardando cliente: "
                                                +data.description);
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
                        console.log("Ocurrio un error al crear u obtener el cliente: "
                            +err.message);
                        errorCallback();
                        return false;
                    }
                },

                getClientStatus : function (callback, errorCallback){
                    var upstreamChannel = "";
                    //TODO se puede hacer refactor de estos ifs
                    if(CordovaDevice.getDevice() == "iOS"){
                        upstreamChannel = "IOS";
                    }else{
                        upstreamChannel = "Android";
                    }

                    $.ajax({
                        url : Domain.clients.get(clientId, upstreamChannel),
                        type: 'GET',
                        headers: WebManager.getHeaders(),
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
                                        //revisamos el status del cliente para saber si
                                        // podemos seguir o no
                                        var isActive = false;
                                        if(this.checkClientStatus(response.status)){
                                            isActive = true;
                                        }
                                        //SAVE TEAM LIST
                                        TeamsManager.init(response.push_alerts);
                                        //SAVE Client ID
                                        if(this.saveClientID(response, null)){
                                            callback(isActive,response.status);
                                        }else{
                                            errorCallback();
                                        }
                                    }else{
                                        errorCallback();
                                    }
                                }else{
                                    //TODO: que hacer en este caso, borrar el registro
                                    // para que empiece de cero?
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
                    var storedVersion = this.loadStoredVersion();
                    if(storedVersion != null && storedVersion != ""){
                        var storedInt = parseInt(storedVersion);
                        if(this.currentVersion > storedVersion){
                            //borramos todas las configuraciones
                            this.eraseAllConfigs();
                        }
                    }else{
                        //borramos todas las configs
                        this.eraseAllConfigs();
                    }
                    this.saveStoredVersion();
                },

                eraseAllConfigs : function (){
                    window.localStorage.removeItem(this.FILE_KEY_CLIENT_ID);
                    window.localStorage.removeItem(this.FILE_KEY_CLIENT_MSISDN);
                    window.localStorage.removeItem(PushManager.FILE_KEY_CLIENT_REGID);
                    window.localStorage.removeItem(this.FILE_KEY_CLIENT_DATASAFE);
                },

                saveStoredVersion : function () {
                    try{
                        window.localStorage.setItem(this.FILE_KEY_STOREDVERSION,""+this.currentVersion);
                        return true;
                    }catch(err){
                        return false;
                    }
                },

                loadStoredVersion : function () {
                    return window.localStorage.getItem(this.FILE_KEY_STOREDVERSION);
                }

            };
        }
    ]);
