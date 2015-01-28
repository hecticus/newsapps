'use strict';

/**
 * @ngdoc service
 * @name core.Services.CordovaApp
 * @description CordovaApp Factory
 */
angular
    .module('core')
    .factory('CordovaApp',['Utilities', 'CordovaDevice', 'WebManager', 'ClientManager', 'PushManager'
        , 'FacebookManager',
        function(Utilities, CordovaDevice, WebManager, ClientManager, PushManager, FacebookManager) {
            var that = this;
            var upstreamAppKey = '';
            var upstreamAppVersion = '';
            var upstreamServiceID = '';
            var upstreamURL = '';
            var companyName = '';
            var buildVersion = '';
            var serverVersion = '';

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaApp#init
                 * @methodOf core.Services.CordovaApp
                 */
                init : function() {
                    console.log('Ready. initialize. ');
                    that = this;
                    this.bindEvents();
                },

                bindEvents : function() {
                    document.addEventListener('deviceready', that.onDeviceReady, false);
                    document.addEventListener('touchmove', function (e) {
                        e.preventDefault();
                    }, false);
                },

                onDeviceReady : function() {
                    that.receivedEvent('deviceready');
                    that.initAllAppData();
                },

                receivedEvent : function(id) {
                    if (id === 'deviceready') {
                        document.addEventListener('backbutton', function(e) {
                            that.backButton();
                        }, false);
                    }

                },

                initAllAppData : function() {
                    StatusBar.hide();
                    ClientManager.checkStoredData();
                    if (CordovaDevice.phonegapIsOnline()) {
                        this.loadServerConfigs();
                        PushManager.init();
                    }else{
                        this.startAppOffline();
                    }
                },

                exitApp : function (){
                    try{
                        FacebookManager.clearIntervalFriendsLoader();
                    } catch(e){

                    }

                    if (navigator.app) {
                        navigator.app.exitApp();
                    } else if (navigator.device) {
                        navigator.device.exitApp();
                    }
                },

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaApp#back_button
                 * @methodOf core.Services.CordovaApp
                 */
                backButton: function () {
                    if (angular.element('#wrapper3').hasClass('left')) {
                        angular.element('#wrapper3').attr('class','page transition right');
                    } else if (angular.element('#wrapper2').hasClass('left')) {
                        angular.element('#wrapper2').attr('class','page transition right');
                    }else {
                        this.exitApp();
                    }
                },

                startAppOffline : function (){
                    alert("OFFLINE APP");
                },

                startApp : function (isActive, status){
                    console.log(this);
                    console.log("startApp. Starting App: Client Active: " + isActive + ". Client Status: " + status);
                },
                errorStartApp : function (){
                    console.log("errorStartApp. Error. Couldn't Start Application");
                },

                doneCreating : function (){
                    console.log("DONE CREATING!!!!");
                },

                errorCreating : function (){
                    console.log("ERROR CREATING!!!!");
                },

                loadServerConfigs : function (){
                    WebManager.enableCerts(true);
                    console.log("LOADING: " + Domain.loading(CordovaDevice.getRealWidth(), CordovaDevice.getRealHeight()));
                    Utilities._fGetAjaxJson(Domain.loading(CordovaDevice.getRealWidth(), CordovaDevice.getRealHeight()))
                        .done(function(_json) {
                            console.log("JSON LOAD: "+JSON.stringify(_json));
                            upstreamAppKey = _json.response.upstreamAppKey;
                            upstreamAppVersion = _json.response.upstreamAppVersion;
                            upstreamServiceID = _json.response.upstreamServiceID;
                            upstreamURL = _json.response.upstreamURL;
                            companyName = _json.response.company_name;
                            buildVersion = _json.response.build_version;
                            serverVersion = _json.response.server_version;
                            console.log("FINISH LOADING");
                            ClientManager.init(this.startApp, this.errorStartApp);
                        });
                }
            };
        }
    ]);
