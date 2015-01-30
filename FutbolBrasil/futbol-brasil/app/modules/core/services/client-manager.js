'use strict';

/**
 * @ngdoc service
 * @name core.Services.ClientManager
 * @description ClientManager Factory
 */
angular
    .module('core')
    .factory('ClientManager',['$localStorage', '$http', 'CordovaDevice', 'WebManager', 'TeamsManager'
        , 'Domain', 'Utilities',
        function($localStorage, $http, CordovaDevice, WebManager, TeamsManager, Domain, Utilities) {
            var regId = '';
            var clientId = "";
            var clientMsisdn = "";
            var clientDataSafe = false;
            var clientPassword = "";
            var clientObj = {};
            var currentVersion = 0;
            var localStorage = $localStorage;

            var FILE_KEY_STOREDVERSION = "APPSTOREDVERSION";
            var FILE_KEY_CLIENT_ID = "APPDATACLIENTID";
            var FILE_KEY_CLIENT_MSISDN = "APPDATACLIENTMSISDN";
            var FILE_KEY_CLIENT_DATASAFE = "APPDATACLIENTDATASAFE";
            var FILE_KEY_CLIENT_REGID = "APPDATACLIENTREGID";

            /**
             * @ngdoc function
             * @name core.Services.ClientManager#isActiveClient
             * @description
             * {
             *  -1 : Unsuscribed by Upstream,
             *   0 : Unsuscribed by User,
             *   1 : Active and Paid,
             *   2 : Trial period, awaiting confirmation
             * }
             * @methodOf core.Services.ClientManager
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
                    console.log('getClientMSISDN: ' + clientMsisdn);
                    return clientMsisdn;
                },
                getClientDataSafe : function(){
                    return clientDataSafe;
                },
                getClientPassword : function(){
                    return clientPassword;
                },
                getClientObj : function(){
                    return clientObj;
                },
                isClientOk : function(){
                    return clientDataSafe;
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
                    console.log('clientManager.init');
                    this.loadClient();
                    this.loadClientMSISDN();
                    console.log("ClientManager. init. clientId: " + clientId + " msisdn:" + clientMsisdn);
                    if(clientId){
                        this.getClientStatus(successCallback, errorCallback);
                    }else{
                        successCallback(false, 2); //Cliente en periodo de pruebas
                    }
                },

                saveClient : function (response, password) {
                    clientId = response.id_client;
                    clientObj.id_client = response.id_client;
                    clientObj.user_id = response.user_id;
                    clientObj.login = response.login;
                    if(password){
                        clientObj.password = password;
                        this.markClientAsOk();
                    }
                    localStorage[FILE_KEY_CLIENT_ID] = JSON.stringify(clientObj);
                    if(clientMsisdn && clientMsisdn !== ''){
                        localStorage[FILE_KEY_CLIENT_MSISDN] = clientMsisdn;
                    }
                    this.saveRegId(regId);
                    return true;
                },

                loadClient : function () {
                    clientDataSafe = localStorage[FILE_KEY_CLIENT_DATASAFE] === 'true';
                    if(clientDataSafe){
                        var clientString = localStorage[FILE_KEY_CLIENT_ID];
                        if(!!clientString && clientString != ""){
                            clientObj = JSON.parse(clientString);
                            clientId = clientObj.id_client;
                        }
                    }else{
                        delete localStorage[FILE_KEY_CLIENT_ID];
                        delete localStorage[FILE_KEY_CLIENT_MSISDN];
                    }
                },

                saveClientMSISDN : function (_clientMSISDN, successCallback, errorCallback) {
                    try{
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
                    } catch(err){
                        console.log("saveClientMSISDN. Error. Invalid MSISDN: " + err);
                        errorCallback();
                    }
                },

                loadClientMSISDN : function () {
                    clientMsisdn = localStorage[FILE_KEY_CLIENT_MSISDN];
                },

                markClientAsOk : function () {
                    try{
                        clientDataSafe = true;
                        localStorage[FILE_KEY_CLIENT_DATASAFE] = "true";
                        return true;
                    } catch(err){
                        return false;
                    }
                },

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#createOrUpdateClient
                 * @description Creates or Updates a Client on the server, if password is null
                 * then it only upates the client
                 * @methodOf core.Services.ClientManager
                 */
                createOrUpdateClient : function (msisdn, password, subscribe, successCallback, errorCallback){
                    this.loadClient();
                    var devices = [];
                    var device = {};
                    var jData = {
                        country : 3,
                        device_id : CordovaDevice.getDeviceId(),
                        upstreamChannel : CordovaDevice.getUpstreamChannel()
                    };

                    clientPassword = password;
                    regId = "APA91bGUo-_CbLa7jbiwHDkUZkUjGHBuAcVMnuGLl-afFqmw_O2Gukymxf6UPPR-R8-EguAq4F4xD2Ls8Om-8gCU4xkK_ht55x-5YroQdprfAUkn0xG-G4QLj7FM4YsZEs668YF3dgZrK-K6TgzWJXL9eM7y2LcXQHHueiGeQWXdtolAhOgh1oQ";
                    if(regId){
                        device.device_id = jData.device_id;
                        device.registration_id = regId;
                        devices.push(device);
                    }else{
                        console.log('createOrUpdateClient. no regId.');
                    }

                    if(msisdn) { jData.login = msisdn; }
                    if(password){ jData.password = password; }


                    if(clientId){
                        jData.add_devices = devices;
                        if(subscribe){ jData.subscribe = true; }
                        this.updateClient(jData, successCallback, errorCallback);
                    }else{
                        jData.devices = devices;
                        this.createClient(jData, successCallback, errorCallback);
                    }
                },

                createClient: function(jData, successCallback, errorCallback){
                    var that = this;
                    $http({
                        url : Domain.clients.create,
                        method: 'POST',
                        headers: WebManager.getHeaders(),
                        data: jData,
                        timeout : 60000
                    })
                    .success(function(data, status) {
//                        try{
                            if(typeof data == "string"){
                                data = JSON.parse(data);
                            }
                            var errorCode = data.error;
                            var response = data.response;
                            if(errorCode == 0 && response != null){
                                var isActive = isActiveClient(response.status);
                                TeamsManager.init(response.push_alerts);
                                if(that.saveClient(response, clientPassword)){
                                    console.log('saveClient: true');
                                    successCallback(isActive,response.status);
                                }else{
                                    console.log('saveClient: false');
                                    errorCallback();
                                }
                            }else{
                                console.log("Error guardando cliente: " + data.description);
                                errorCallback();
                            }
//                        }catch(e){
//                            console.log('catch. ');
//                            errorCallback();
//                        }
                    })
                    .error(function(data, status) {
                        console.log("createClient. Error creating client. status: " + status);
                        console.log("createClient. Error creating client. data: ");
                        console.log(data);
                        errorCallback();
                    });
                },

                updateClient: function(jData, successCallback, errorCallback){
                    var that = this;
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
                                        var isActive = isActiveClient(response.status);
                                        TeamsManager.init(response.push_alerts);
                                        if(that.saveClient(response, clientPassword)){
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
                                        if(this.saveClient(response, null)){
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

                updateRegistrationID : function (){
                    try {
                        this.loadClient();
                        if(clientId && this.hasToUpdateRegId()){
                            this.loadClientMSISDN();
                            this.createOrUpdateClient(clientMsisdn, null, false
                                , Utilities.doNothing, Utilities.doNothing);
                        }
                    } catch(err) {

                    }
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
                    return localStorage[FILE_KEY_CLIENT_REGID];
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
                    if(!!storedVersion || currentVersion > storedVersion){
                        eraseAllConfigs();
                    }
                    saveStoredVersion();
                }
            };
        }
    ]);
