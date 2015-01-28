'use strict';

/**
 * @ngdoc service
 * @name core.Services.ClientManager
 * @description ClientManager Factory
 */
angular
    .module('core')
    .factory('ClientManager',['$localStorage', 'CordovaDevice', 'WebManager', 'TeamsManager'
        , 'Domain', 'Utilities',
        function($localStorage, CordovaDevice, WebManager, TeamsManager, Domain, Utilities) {
            var that = this;
            var regId = '';
            var clientId = "";
            var clientMSISDN = "";
            var clientDataSafe = false;
            var clientPassword = "";
            var clientOBJ = {};
            var currentVersion = 0;
            var localStorage = $localStorage;

            var FILE_KEY_STOREDVERSION = "APPSTOREDVERSION";
            var FILE_KEY_CLIENT_ID = "APPDATACLIENTID";
            var FILE_KEY_CLIENT_MSISDN = "APPDATACLIENTMSISDN";
            var FILE_KEY_CLIENT_DATASAFE = "APPDATACLIENTDATASAFE";
            var FILE_KEY_CLIENT_REGID = "APPDATACLIENTREGID";

            /**
             * @ngdoc function
             * @name core.Services.CordovaApp#isActiveClient
             * @description
             * {
             *  -1 : Unsuscribed by Upstream,
             *   0 : Unsuscribed by User,
             *   1 : Active and Paid,
             *   2 : Trial period, awaiting confirmation
             * }
             * @methodOf core.Services.CordovaApp
             * @return {boolean} Returns a boolean value
             */
            var isActiveClient = function (status){
                return !!(status > 0 && status != 2);
            };

            var eraseAllConfigs = function (){
                delete localStorage[FILE_KEY_CLIENT_ID];
                delete localStorage[FILE_KEY_CLIENT_MSISDN];
                delete localStorage[FILE_KEY_CLIENT_REGID];
                delete localStorage[FILE_KEY_CLIENT_DATASAFE];
            };

            var saveStoredVersion = function () {
                try{
                    localStorage[FILE_KEY_STOREDVERSION] = currentVersion;
                    return true;
                }catch(err){
                    return false;
                }
            };

            var loadStoredVersion = function () {
                return localStorage[FILE_KEY_STOREDVERSION];
            };

            return {

                getClientId : function(){
                    return clientId;
                },
                getClientMSISDN : function(){
                    return clientMSISDN;
                },
                getClientDataSafe : function(){
                    return clientDataSafe;
                },
                getClientPassword : function(){
                    return clientPassword;
                },
                getClientOBJ : function(){
                    return clientOBJ;
                },

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#method1
                 * @methodOf core.Services.ClientManager
                 * @return {boolean} Returns a boolean value
                 */
                method1 : function() {
                    return true;
                },

                init : function (successCallback, errorCallback){
//                    try {
                        this.loadClientID();
                        console.log("INIT CLIENT: " + clientId + " msisdn:" + clientMSISDN);
                        if(clientId){
                            //tenemos client ID asi que solo hacemos get
                            this.getClientStatus(successCallback, errorCallback);
                        }else{
                            //no creamos un cliente generico, esperamos a que se cree con msisdn
                            // por lo menos
                            successCallback(false, 2); //periodo de pruebas mientras pone su informacion
                        }
//                    } catch(err) {
//                        console.log('There was an error on this page.\n\nError description: '
//                            + err.message + '\n\n');
//                        errorCallback();
//                    }
                },

                //Si ya tenemos el cliente creado entonces enviamos la info del regId, sino, esperamos que
                // lo haga cuando se suscriba y ya
                updateRegistrationID : function (){
                    try {
                        this.loadClientID();
                        if(clientId){
                            if(this.hasToUpdateRegId()){
                                this.loadClientMSISDN();
                                //solo actualizamos el regId, lo demas lo dejamos como esta
                                this.createOrUpdateClient(clientMSISDN, null, false
                                    , Utilities.doNothing
                                    , Utilities.doNothing);
                            }
                        }
                    } catch(err) {

                    }
                },

                saveClientID : function (response, password) {
                    try {
                        clientOBJ.id_client = response.id_client;
                        clientOBJ.user_id = response.user_id;
                        clientOBJ.login = response.login;
                        if(password){ clientOBJ.password = password; }
                        clientId = clientOBJ.id_client;
                        localStorage[FILE_KEY_CLIENT_ID] = JSON.stringify(clientOBJ);
                        this.saveRegId(regId);
                        return true;
                    } catch(err){
                        return false;
                    }
                },

                loadClientID : function () {
                    clientDataSafe = localStorage[FILE_KEY_CLIENT_DATASAFE];
                    if(clientDataSafe == null || clientDataSafe != "true"){
                        delete localStorage[FILE_KEY_CLIENT_ID];
                        delete localStorage[FILE_KEY_CLIENT_MSISDN];
                    }else{
                        var clientString = localStorage[FILE_KEY_CLIENT_ID];
                        if(clientString != null && clientString != ""){
                            try{
                                clientOBJ = JSON.parse(clientString);
                                clientId = clientOBJ.id_client;
                                console.log(this.getClientId());
                            }catch(e){
                            }
                        }
                    }
                },

                saveClientMSISDN : function (_clientMSISDN, successCallback, errorCallback) {
//                    try{
                        _clientMSISDN = (''+_clientMSISDN).replace(/^\s+|\s+$/g, "");
                        if(isNaN(_clientMSISDN) && (_clientMSISDN.length < 8 || _clientMSISDN.length > 11)){
                            errorCallback();
                        }

                        for(var i=0;i<_clientMSISDN.length;++i){
                            parseInt(_clientMSISDN[i],10);
                        }

                        localStorage[FILE_KEY_CLIENT_MSISDN] = _clientMSISDN;
                        this.loadClientMSISDN();
                        successCallback();
//                    } catch(err){
//                        console.log("Error: Invalid Client MSISDN: " + err);
//                        errorCallback();
//                    }
                },

                loadClientMSISDN : function () {
                    clientMSISDN = localStorage[FILE_KEY_CLIENT_MSISDN];
                },

                markClientAsOK : function () {
                    try{
                        clientDataSafe = true;
                        localStorage[FILE_KEY_CLIENT_DATASAFE] = "true";
                        return true;
                    } catch(err){
                        return false;
                    }
                },

                createOrUpdateClient : function (msisdn, password, subscribe, successCallback, errorCallback){
//                    try{
                        this.loadClientID();
                        var devices = [];
                        var device = {};
                        var jData = {
                            country : 3,
                            device_id : CordovaDevice.getDeviceId(),
                            upstreamChannel : CordovaDevice.getUpstreamChannel()
                        };

                        clientPassword = password;

                        if(regId){
                            device.device_id = jData.device_id;
                            device.registration_id = regId;
                            devices.push(device);
                        }else{
                            //Si no tenemos informacion del push no hacemos nada diferente, seguimos y
                            // esperamos que cuando llege se mande a actualizar
                        }

                        if(msisdn) { jData.login = msisdn; }
                        if(password){ jData.password = password; }


                        if(clientId){
                            jData.add_devices = devices;
                            if(subscribe){
                                jData.subscribe = true;
                            }
                            this.updateClient(jData, successCallback, errorCallback);
                        }else{
                            jData.devices = devices;
                            this.createClient(jData, successCallback, errorCallback);
                        }

                        return true;
//                    }catch(err){
//                        console.log("Ocurrio un error al crear u obtener el cliente: " + err.message);
//                        errorCallback();
//                        return false;
//                    }
                },

                createClient: function(jData, successCallback, errorCallback){
                    console.log("createClient. data: ");
                    console.log(jData);
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
                                        if(isActive(response.status)){
                                            isActive = true;
                                        }
                                        //SAVE TEAM LIST
                                        TeamsManager.init(response.push_alerts);
                                        //SAVE Client ID
                                        if(this.saveClientID(response, password)){
                                            successCallback(isActive,response.status);
                                        }else{
                                            errorCallback();
                                        }
                                    }else{
                                        errorCallback();
                                    }
                                }else{
                                    console.log("Error guardando cliente: " + data.description);
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
                },

                updateClient: function(jData, successCallback, errorCallback){
                    $.ajax({
                        url : Domain.clients.update(clientId),
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
                                        if(isActive(response.status)){
                                            isActive = true;
                                        }
                                        //TODO Check initialization
                                        //SAVE TEAM LIST
                                        TeamsManager.init(response.push_alerts);
                                        //SAVE Client ID
                                        if(this.saveClientID(response, password)){
                                            successCallback(isActive,response.status);
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
                },

                getClientStatus : function (successCallback, errorCallback){
                    console.log('getClientStatus');
                    var upstreamChannel = CordovaDevice.getUpstreamChannel();
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
                                var response = data.response;
                                if(code == 0){
//                                    var response = data.response;
                                }else{
                                    if(response != null){
                                        var isActive = isActiveClient(response.status);

                                        //SAVE TEAM LIST
                                        TeamsManager.init(response.push_alerts);
                                        //SAVE Client ID
                                        if(this.saveClientID(response, null)){
                                            successCallback(isActive, response.status);
                                        }else{
                                            errorCallback();
                                        }
                                    }else{
                                        errorCallback();
                                    }
                                    //TODO: que hacer en este caso, borrar el registro
                                    // para que empiece de cero?
                                    console.log("Error. guardando cliente: " + data.description);
                                    errorCallback();
                                }
                            }catch(e){
                                errorCallback();
                            }
                        },
                        error : function(xhr, ajaxOptions, thrownError) {
                            console.log("Error. Get status client " + thrownError);
                            errorCallback();
                        }
                    });
                },

                saveRegId : function (id) {
                    try{
                        regId = id;
                        localStorage[FILE_KEY_CLIENT_REGID] = id;
                        return true;
                    }catch(e){
                        return false;
                    }
                },

                loadPersistedRegId : function () {
                    return localStorage[this.FILE_KEY_CLIENT_REGID];
                },

                getRegId : function(){
                    return regId;
                },

                hasToUpdateRegId : function (){
                    var savedRegID = this.loadPersistedRegId();
                    return !!(!savedRegID || savedRegID != regId);
                },

                checkStoredData : function (){
                    var storedVersion = loadStoredVersion();
                    if(!storedVersion || currentVersion > storedVersion){
                        eraseAllConfigs();
                    }
                    saveStoredVersion();
                }
            };
        }
    ]);
