'use strict';

/**
 * @ngdoc service
 * @name core.Services.ClientManager
 * @description ClientManager Factory
 */
angular
    .module('core')
    .factory('ClientManager',['$http', 'CordovaDevice', 'WebManager', 'TeamsManager'
        , 'Client', 'Domain', 'Utilities',
        function($http, CordovaDevice, WebManager, TeamsManager, Client, Domain, Utilities) {

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#init
                 * @methodOf core.Services.ClientManager
                 */
                init : function (successCallback, errorCallback){
                    Client.init();
                    if(Client.getClientId()){
                        TeamsManager.init();
                        this.getClientStatus(successCallback, errorCallback);
                    }else{
                        //Cliente en periodo de pruebas
                        typeof successCallback == "function" && successCallback(false, 2);
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
                    var devices = [];
                    var device = {};
                    var jData = {
                        country : 3,
                        language: 405,
                        device_id : CordovaDevice.getDeviceId(),
                        upstreamChannel : CordovaDevice.getUpstreamChannel()
                    };
                    var isNewClient = true;

                    Client.setPassword(password);
                    //TODO Solo para Debug en Web
                    Client.setRegId("APA91bGUo-_CbLa7jbiwHDkUZkUjGHBuAcVMnuGLl-afFqmw_O2Gukymxf6UPPR-R8-EguAq4F4xD2Ls8Om-8gCU4xkK_ht55x-5YroQdprfAUkn0xG-G4QLj7FM4YsZEs668YF3dgZrK-K6TgzWJXL9eM7y2LcXQHHueiGeQWXdtolAhOgh1oQ");
                    if(Client.getRegId()){
                        device.device_id = jData.device_id;
                        device.registration_id = Client.getRegId();
                        devices.push(device);
                    }else{
                        console.log('createOrUpdateClient. no regId.');
                    }

                    if(msisdn) { jData.login = msisdn; }
                    if(password){ jData.password = password; }


                    var url = '';
                    if(Client.getClientId()){
                        url = Domain.client.update(Client.getClientId());
                        jData.add_devices = devices;
                        isNewClient = false;
                    } else {
                        url = Domain.client.create;
                        jData.devices = devices;
                        if(subscribe){ jData.subscribe = true; }
                        isNewClient = true;
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
                        var errorCode = data.error;
                        var response = data.response;
                        if(errorCode == 0 && response != null){
                            var isActive = Client.isActiveClient(response.status);
                            TeamsManager.setFavoriteTeamsFromServer(response.push_alerts_teams);
                            if(Client.updateClient(response, null)){
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

                },

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#getClientStatus
                 * @description Retrieves Client info from the server
                 * @methodOf core.Services.ClientManager
                 */
                getClientStatus : function (successCallback, errorCallback){
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
                            /* TODO: que hacer en este caso, borrar el registro
                             * para que empiece de cero?
                             * */
                            console.log("Error. obteniendo status de cliente: "
                                + data.description?data.description:'No Error Description');
                            typeof errorCallback == "function" && errorCallback();
                        }
                    })
                    .error(function(data, status) {
                        console.log("Error. Get status client " + data);
                        typeof errorCallback == "function" && errorCallback();
                    });
                },

                /**
                 * @ngdoc function
                 * @name core.Services.ClientManager#updateRegistrationID
                 * @description Triggers a Client info update on the server if the remote RegId differs from
                 * local RegId
                 * @methodOf core.Services.ClientManager
                 */
                updateRegistrationID : function (){
                    if(Client.getClientId() && Client.hasToUpdateRegId()){
                        this.createOrUpdateClient(Client.getMsisdn(), null, false);
                    }
                }
            };
        }
    ]);
