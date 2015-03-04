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
            var FILE_KEY_CLIENT = "APPDATACLIENT";
            var FILE_KEY_CLIENT_PUSH_ALERTS = "APPDATACLIENTPUSHALERTS";
            var FILE_KEY_CLIENT_DATASAFE = "APPDATACLIENTDATASAFE";

            var localStorage = $localStorage;
            var hasToUpdateRegId = false;
            var clientPushAlerts = [];
            var clientDataSafe = false;
            var client = {};
            var currentVersion = 0;

            var checkStoredData = function (){
                var storedVersion = loadStoredVersion();
                if(!!storedVersion || currentVersion > storedVersion){
                    eraseAllConfigs();
                }
                saveStoredVersion();
            };

            var eraseAllConfigs = function (){
                delete localStorage[FILE_KEY_CLIENT];
                delete localStorage[FILE_KEY_CLIENT_DATASAFE];
            };

            var loadClient = function(){
                checkStoredData();
                clientDataSafe = (localStorage[FILE_KEY_CLIENT_DATASAFE] === 'true');
                if(clientDataSafe){
                    var clientString = localStorage[FILE_KEY_CLIENT];
                    if(!!clientString && clientString != ''){
                        client = JSON.parse(clientString);
                    }
                }else{
                    eraseAllConfigs();
                }
            };

            var saveClient = function () {
                localStorage[FILE_KEY_CLIENT] = JSON.stringify(client);
            };

            var markClientAsOk = function () {
                clientDataSafe = true;
                localStorage[FILE_KEY_CLIENT_DATASAFE] = 'true';
                return true;
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
//                    console.log('Client.init');
                    loadClient();
                    return true;
                },

                updateClient : function (data, password) {
                    client.id_client = data.id_client;
                    client.user_id = data.user_id;
                    client.login = data.login;

                    if(!!password){
                        client.password = password;
                        markClientAsOk();
                    }
                    saveClient();
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
                    return client.id_client;
                },
                getPassword : function(){
                    return client.password;
                },
                setPassword : function(password){
                    if(!!password){
                        client.password = password;
                        saveClient();
                        markClientAsOk();
                    }
                },
                getClientObj : function(){
                    return client;
                },
                getClientPushAlerts : function(){
                    return clientPushAlerts;
                },
                isClientOk : function(){
                    return clientDataSafe;
                },
                getMsisdn: function(){
                    return client.msisdn;
                },
                setMsisdn : function (msisdn, successCallback, errorCallback) {
                    try{
                        msisdn = (''+msisdn).replace(/^\s+|\s+$/g, "");
                        if(isNaN(msisdn) && (msisdn.length < 8 || msisdn.length > 11)){
                            typeof errorCallback == "function" && errorCallback();
                        }

                        for(var i = 0; i < msisdn.length; ++i){
                            parseInt(msisdn[i],10);
                        }
                        client.msisdn = msisdn;
                        saveClient();
                        console.log(client);

                        typeof successCallback == "function" && successCallback();
                    } catch(err){
                        console.log("setMsisdn. Error. Invalid MSISDN: " + err);
                        typeof errorCallback == "function" && errorCallback();
                    }
                },

                getRegId : function(){
                    return client.regId;
                },

                setRegId : function (id) {
                    console.log('Client.setregId: ' + id);
                    hasToUpdateRegId = true;
                    client.regId = id;
                    saveClient();
                },

                hasToUpdateRegId : function (){
                    return hasToUpdateRegId;
                },

                setHasFavorites: function(value){
                    client.hasFavorites = value;
                    saveClient();
                },

                getHasFavorites : function(){
                    if(!client.hasFavorites){
                        loadClient();
                    }
                    return client.hasFavorites === true;
                },

                enableFavoritesFilter: function(value){
                    client.isFavoritesFilterActive = value;
                    saveClient();
                },

                isFavoritesFilterActive : function(){
                    if(!client.isFavoritesFilterActive){
                        loadClient();
                    }
                    return client.isFavoritesFilterActive;
                },

                setLanguage : function(language, callback){
                    client.language = language;
                    saveClient();
                    typeof callback === 'function' && callback();
                },

                getLanguage : function(){
                    if(!client.language){
                        loadClient();
                    }
                    return client.language;
                },

                getFriends : function(){
                    if(!client.friends){
                        loadClient();
                    }
                    return client.friends;
                },

                getFriendsIds : function(){
                    var idFriends = [];
                    if(!client.friends){
                        loadClient();
                    }

                    if(client.friends){
                        idFriends = client.friends.map(function(friend){
                            return friend.id;
                        });
                    }

                    return idFriends;
                },

                setFriends : function(pFriends){
                    client.friends = pFriends;
                    saveClient();
                }
            };
        }
    ]);
