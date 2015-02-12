'use strict';

/**
 * @ngdoc service
 * @name core.Services.Client
 * @description Client Factory
 */
angular
    .module('core')
    .factory('Client', ['$localStorage',
        function($localStorage) {

            var FILE_KEY_STOREDVERSION = "APPSTOREDVERSION";
            var FILE_KEY_CLIENT_ID = "APPDATACLIENTID";
            var FILE_KEY_CLIENT_PUSH_ALERTS = "APPDATACLIENTPUSHALERTS";
            var FILE_KEY_CLIENT_MSISDN = "APPDATACLIENTMSISDN";
            var FILE_KEY_CLIENT_DATASAFE = "APPDATACLIENTDATASAFE";
            var FILE_KEY_CLIENT_REGID = "APPDATACLIENTREGID";

            var regId = '';
            var clientId = "";
            var clientPushAlerts = [];
            var msisdn = "";
            var clientDataSafe = false;
            var clientPassword = "";
            var clientObj = {};
            var currentVersion = 0;
            var localStorage = $localStorage;

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

                /**
                 * @ngdoc function
                 * @name core.Services.Client#init
                 * @methodOf core.Services.Client
                 * @return {boolean} Returns a boolean value
                 */
                init : function() {
                    this.checkStoredData();
                    clientDataSafe = (localStorage[FILE_KEY_CLIENT_DATASAFE] === 'true');
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

                    this.loadClientMSISDN();
                    return true;
                },

                saveClient : function (data, password) {
                    clientId = data.id_client;
                    clientObj = {
                        id_client : data.id_client,
                        user_id : data.user_id,
                        login : data.login
                    };

                    if(password){
                        clientObj.password = password;
                        this.markClientAsOk();
                    }

                    localStorage[FILE_KEY_CLIENT_ID] = JSON.stringify(clientObj);
                    if(msisdn && msisdn !== ''){
                        localStorage[FILE_KEY_CLIENT_MSISDN] = msisdn;
                    }

                    this.setRegId(regId);
                    return true;
                },

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
                isActiveClient : function (status){
                    return !!(status > 0 && status != 2);
                },

                getClientId : function(){
                    return clientId;
                },
                getRegId : function(){
                    return regId;
                },
                getClientDataSafe : function(){
                    return clientDataSafe;
                },
                getPassword : function(){
                    return clientPassword;
                },
                setPassword : function(password){
                    clientPassword = password;
                },
                getClientObj : function(){
                    return clientObj;
                },
                getClientPushAlerts : function(){
                    return clientPushAlerts;
                },
                isClientOk : function(){
                    return clientDataSafe;
                },

                getMsisdn: function(){
                    return msisdn;
                },

                setMsisdn : function (clientMsisdn, successCallback, errorCallback) {
                    try{
                        clientMsisdn = (''+clientMsisdn).replace(/^\s+|\s+$/g, "");
                        if(isNaN(clientMsisdn) && (clientMsisdn.length < 8 || clientMsisdn.length > 11)){
                            typeof errorCallback == "function" && errorCallback();
                        }

                        for(var i=0;i<clientMsisdn.length;++i){
                            parseInt(clientMsisdn[i],10);
                        }

                        localStorage[FILE_KEY_CLIENT_MSISDN] = clientMsisdn;
                        msisdn = clientMsisdn;
                        typeof errorCallback == "function" && successCallback();
                    } catch(err){
                        console.log("setMsisdn. Error. Invalid MSISDN: " + err);
                        typeof errorCallback == "function" && errorCallback();
                    }
                },

                loadClientMSISDN : function () {
                    msisdn = localStorage[FILE_KEY_CLIENT_MSISDN];
                },

                markClientAsOk : function () {
                    clientDataSafe = true;
                    localStorage[FILE_KEY_CLIENT_DATASAFE] = 'true';
                    return true;
                },

                setRegId : function (id) {
                    regId = id;
                    localStorage[FILE_KEY_CLIENT_REGID] = id;
                },

                getPersistedRegId : function () {
                    return localStorage[FILE_KEY_CLIENT_REGID];
                },

                hasToUpdateRegId : function (){
                    var savedRegID = this.getPersistedRegId();
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
