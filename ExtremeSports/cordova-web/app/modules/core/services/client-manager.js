'use strict';

/**
 * @ngdoc service
 * @name core.Services.ClientManager
 * @description ClientManager Factory
 */
angular.module('core').factory('ClientManager', ClientManager);

ClientManager.$injector = ['$http', '$translate', '$q'
    , 'CordovaDevice', 'FacebookManager', 'AthleteManager', 'CategoryManager'
    , 'Client', 'Domain', 'i18n'];

function ClientManager($http, $translate, $q, CordovaDevice, FacebookManager
    , AthleteManager, CategoryManager, Client, Domain, i18n) {

    //noinspection UnnecessaryLocalVariableJS
    var service = {

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

    function init(){
        var deferred = $q.defer();
        Client.init().then(function(){
            if(Client.getClientId()){
                AthleteManager.init();
                CategoryManager.init();
                getClientStatus()
                    .then(function(data){
                        console.log('init.resolve');
                        deferred.resolve(data);
                    }, function(){
                        console.log('init.reject');
                        deferred.reject();
                    });
            }else{
                //Cliente en periodo de pruebas
                console.log('init.resolve trial');
                deferred.resolve(false, 2);
            }
        });

        return deferred.promise;
    }

    function createOrUpdateClient(client, subscribe, successCallback, errorCallback){
        var devices = [];
        var device = {};
        var isNewClient = true;
        var lang = getLanguage();
        var facebook_id = FacebookManager.getUserId();

        //TODO country cableado a 1 (VE) pero deberia ser 3
        var jData = {
            country : 1,
            language: lang? lang.id_language : 405,
            device_id : CordovaDevice.getDeviceId(),
            upstreamChannel : CordovaDevice.getUpstreamChannel()
        };

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

        if(client.language){
          jData.language = client.language;
        }

        if(Client.getClientId()){
            jData.add_devices = devices;
            return $http.put(Domain.client.client(),jData, {
                timeout : 60000
            }).then(success, error);

        } else {
            jData.devices = devices;
            if(subscribe){ jData.subscribe = true; }
            return $http.post(Domain.client.create(), jData, {
                timeout : 60000
            }).then(success, error);
        }

        function success(response) {
            isNewClient = (response.status === 201);
            if(response.data.error == 0 && response.data.response != null){
                //TODO manejar modificacion a athletes y categories
//                    TeamsManager.setFavoriteTeams(response.push_alerts_teams);
                if(Client.updateClient(response.data.response)){
                    typeof successCallback == "function" && successCallback(isNewClient);
                }else{
                    typeof errorCallback == "function" && errorCallback();
                }
            }else{
                console.log("Error guardando cliente: " + response.data.description);
                typeof errorCallback == "function" && errorCallback();
            }
        }

        function error(response) {
            console.log("createClient. Error creating client. status: " + response.status);
            console.log("createClient. Error creating client. data: " + response.data);
            console.log(response.data);
            typeof errorCallback == "function" && errorCallback();
        }
    }

    function getClientStatus(){
        var deferred = $q.defer();
        var upstreamChannel = CordovaDevice.getUpstreamChannel();
        var clientId = Client.getClientId();

        if(!clientId){
            return $q.reject();
        }

        $http.get(Domain.client.get(clientId, upstreamChannel), {cache: false, timeout : 60000})
        .success(function(data, status) {
            var errorCode = data.error;
            var response = data.response;
            if(response && errorCode === 0){
                //TODO manejar modificacion a athletes y categories
//                TeamsManager.setFavoriteTeams(response.push_alerts_teams);
                Client.updateClient(response, null)
                .then(
                    function(){
                        var clientData = {
                            'is_active': Client.isActiveClient(response.status),
                            'status' : response.status
                        };
                        setLanguage(response.language);
                        deferred.resolve(clientData);
                    }, function(){
                        deferred.reject();
                    }
                );
            }else{
                var description = data.description ? data.description:'No Error Description';
                console.log("Error. obteniendo status de cliente: " + description);
                deferred.reject();
            }
        })
        .error(function(data, status) {
            console.log("Error. Get status client " + data);
            deferred.reject();
        });

        return deferred.promise;
    }

    function updateRegistrationId(id){
        Client.setRegId(id);
        if(Client.getClientId() && Client.getHasToUpdateRegId()){
            createOrUpdateClient({'msisdn' : Client.getMsisdn()}, false);
        }
    }

    function setLanguage(lang){
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

    function getNickName(){
       return Client.getNickName();
    }

    return service;
}
