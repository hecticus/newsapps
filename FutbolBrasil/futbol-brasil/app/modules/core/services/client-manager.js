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
                    console.log('clientManager.init');
                    Client.init();
                    if(Client.getClientId()){
                        TeamsManager.init();
                        this.getClientStatus(successCallback, errorCallback);
                    }else{
                        typeof successCallback == "function" && successCallback(false, 2); //Cliente en periodo de pruebas
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

                    Client.setPassword(password);
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
                    if(!Client.getClientId()){
                        url = Domain.clients.create;
                        jData.devices = devices;
                        if(subscribe){ jData.subscribe = true; }
                    }else{
                        url = Domain.clients.update(Client.getClientId());
                        jData.add_devices = devices;
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
                            if(Client.saveClient(response, Client.getPassword())){
                                console.log('saveClient: true');
                                typeof successCallback == "function" && successCallback(isActive,response.status);
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

                getClientStatus : function (successCallback, errorCallback){
                    var upstreamChannel = CordovaDevice.getUpstreamChannel();
                    $http.get(Domain.clients.get(Client.getClientId(), upstreamChannel),
                        {cache: false, timeout : 60000})
                    .success(function(data, status) {
                        try{
                            if(typeof data == "string"){
                                data = JSON.parse(data);
                            }
                            var errorCode = data.error;
                            var response = data.response;
                            if(errorCode == 0 && response != null){
                                var isActive = Client.isActiveClient(response.status);
                                TeamsManager.setFavoriteTeamsFromServer(response.push_alerts_teams);
                                if(this.saveClient(response, null)){
                                    typeof successCallback == "function" && successCallback(isActive, response.status);
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
                        }catch(e){
                            typeof errorCallback == "function" && errorCallback();
                        }
                    })
                    .error(function(data, status) {
                        console.log("Error. Get status client " + data);
                        typeof errorCallback == "function" && errorCallback();
                    });
                },

                updateRegistrationID : function (){
                    if(Client.getClientId() && Client.hasToUpdateRegId()){
                        this.createOrUpdateClient(Client.getMsisdn(), null, false);
                    }
                }
            };
        }
    ]);
