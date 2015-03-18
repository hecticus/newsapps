'use strict';

/**
 * @ngdoc service
 * @name core.Services.ClientManager
 * @description ClientManager Factory
 */
angular
    .module('core')
    .factory('ClientManager',['$http', '$translate', 'CordovaDevice', 'WebManager', 'FacebookManager',
        'TeamsManager', 'Client', 'Domain', 'i18n',
        function($http, $translate, CordovaDevice, WebManager, FacebookManager,
                 TeamsManager, Client, Domain, i18n) {

            function setLanguage(){
                var lang = Client.getLanguage();
                if(!lang){
                    lang = i18n.getDefaultLanguage();
                }
                if(lang){
                    $translate.use(lang.short_name.toLowerCase());
                }
            }

            function getLanguage(){
                var lang = Client.getLanguage();
                if(!lang){
                    lang = i18n.getDefaultLanguage();
                }
                return lang;
            }

            function createOrUpdateClient(client, subscribe, successCallback, errorCallback){
                var devices = [];
                var device = {};
                var isNewClient = true;
                var lang = getLanguage();

                var jData = {
                    country : 3,
                    language: lang? lang.id_language : 405,
                    device_id : CordovaDevice.getDeviceId(),
                    upstreamChannel : CordovaDevice.getUpstreamChannel()
                };

                var facebook_id = FacebookManager.getUserId();
                if(facebook_id){
                    jData.facebook_id = facebook_id;
                }

                if(Client.getRegId()){
                    device.device_id = jData.device_id;
                    device.registration_id = Client.getRegId();
                    devices.push(device);
                }else{
                    console.log('createOrUpdateClient. no regId.');
                }

                if(client.msisdn){
                    jData.login = client.msisdn;
                }

                if(client.password){
                    jData.password = client.password;
                    Client.setPassword(client.password);
                }

                if(client.nickname){
                    Client.setNickname(client.nickname);
                    jData.nickname = client.nickname;
                }

                var url = '';

                if(Client.getClientId()){
                    url = Domain.client.update();
                    jData.add_devices = devices;
                } else {
                    url = Domain.client.create;
                    jData.devices = devices;
                    if(subscribe){ jData.subscribe = true; }
                }

                $http({
                    url : url,
                    method: 'POST',
                    data: jData,
                    timeout : 60000
                })
                    .success(function(data, status) {
                        if(typeof data == "string"){
                            data = JSON.parse(data);
                        }
                        console.log('status: ');
                        console.log(status);
                        isNewClient = (status === 201);

                        var errorCode = data.error;
                        var response = data.response;
                        if(errorCode == 0 && response != null){
                            TeamsManager.setFavoriteTeamsFromServer(response.push_alerts_teams);
                            if(Client.updateClient(response)){
                                console.log('saveClient: true');
                                typeof successCallback == "function" && successCallback(isNewClient);
                            }else{
                                console.log('saveClient: false');
                                typeof errorCallback == "function" && errorCallback();
                            }
                        }else{
                            console.log("Error guardando cliente: " + data.description);
                            typeof errorCallback == "function" && errorCallback();
                        }
                    })
                    .error(function(data, status) {
                        console.log("createClient. Error creating client. status: " + status);
                        console.log("createClient. Error creating client. data: " + data);
                        console.log(data);
                        typeof errorCallback == "function" && errorCallback();
                    });

            }

            function getClientStatus(successCallback, errorCallback){
                var upstreamChannel = CordovaDevice.getUpstreamChannel();
                var clientId = Client.getClientId();

                if(!clientId || !upstreamChannel){
                    typeof errorCallback == "function" && errorCallback();
                    return;
                }

                $http.get(Domain.client.get(clientId, upstreamChannel),
                    {cache: false, timeout : 60000})
                    .success(function(data, status) {
                        if(typeof data == "string"){
                            data = JSON.parse(data);
                        }
                        var errorCode = data.error;
                        var response = data.response;
                        if(errorCode == 0 && response != null){
                            var isActive = Client.isActiveClient(response.status);
                            TeamsManager.setFavoriteTeamsFromServer(response.push_alerts_teams);
                            if(Client.updateClient(response, null)){
                                typeof successCallback == "function"
                                && successCallback(isActive, response.status);
                            }else{
                                typeof errorCallback == "function" && errorCallback();
                            }
                        }else{
                            console.log("Error. obteniendo status de cliente: "
                                + data.description?data.description:'No Error Description');
                            typeof errorCallback == "function" && errorCallback();
                        }
                    })
                    .error(function(data, status) {
                        console.log("Error. Get status client " + data);
                        typeof errorCallback == "function" && errorCallback();
                    });
            }

            function init(successCallback, errorCallback){
                Client.init();
                setLanguage();

                if(Client.getClientId()){
                    TeamsManager.init();
                    this.getClientStatus(successCallback, errorCallback);
                }else{
                    //Cliente en periodo de pruebas
                    typeof successCallback == "function" && successCallback(false, 2);
                }
            }

            function updateRegistrationId(id){
                Client.setRegId(id);
                if(Client.getClientId() && Client.hasToUpdateRegId()){
                    this.createOrUpdateClient({'msisdn' : Client.getMsisdn()}, false);
                }
            }

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#init
                 * @methodOf core.Services.ClientManager
                 */
                init : init,

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#createOrUpdateClient
                 * @description Creates or Updates a Client on the server, if password is null
                 * then it only upates the client
                 * @methodOf core.Services.ClientManager
                 */
                createOrUpdateClient : createOrUpdateClient,

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#getClientStatus
                 * @description Retrieves Client info from the server
                 * @methodOf core.Services.ClientManager
                 */
                getClientStatus : getClientStatus,

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#updateRegistrationId
                 * @description Triggers a Client info update on the server if the remote RegId differs from
                 * local RegId
                 * @methodOf core.Services.ClientManager
                 */
                updateRegistrationId : updateRegistrationId
            };
        }
    ]);
