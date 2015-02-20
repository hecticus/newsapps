'use strict';

/**
 * @ngdoc service
 * @name core.Services.CordovaApp
 * @description CordovaApp Factory
 */
angular
    .module('core')
    .factory('CordovaApp',['$window', 'Domain', 'Utilities', 'CordovaDevice', 'WebManager', 'ClientManager', 'PushManager'
        , 'FacebookManager', 'Client', 'Settings', 'App',
        function($window, Domain, Utilities, CordovaDevice, WebManager, ClientManager, PushManager, FacebookManager
            , Client, Settings, App) {
            var that = this;

            var strings = {
                EXIT_APP_TITLE : 'Sair do Aplicativo',
                EXIT_APP_MSG : 'Tem certeza de que deseja sair do aplicativo?',
                OK : 'Ok',
                CANCEL : 'Cancelar'
            };

            var exitApp = function (){
                try{
                    FacebookManager.clearIntervalFriendsLoader();
                } catch(e){

                }

                //Legacy
                if (navigator.app) {
                    navigator.app.exitApp();
                } else if (navigator.device) {
                    navigator.device.exitApp();
                }
            };

            var backButtonCallback = null;

            var onBackButtonPressed = function(){
                if(angular.element('.page.back.left:last').hasClass('left')){
                    typeof backButtonCallback === 'function' && backButtonCallback();
                } else if (!!navigator.notification) {
                    navigator.notification.confirm(strings.EXIT_APP_MSG, exitApp(), strings.EXIT_APP_TITLE
                        , [strings.OK, strings.CANCEL]);
                } else if (confirm(strings.EXIT_APP_MSG)) {
                    exitApp();
                }
            };

            return {
                setBackButtonCallback: function(callback){
                    backButtonCallback = callback;
                },

                bindEvents : function() {
//                    console.log('CordovaApp. bindEvents. ');
                    document.addEventListener('deviceready', that.onDeviceReady, false);
                    document.addEventListener('touchmove', function (e) {
                        e.preventDefault();
                    }, false);
                    var event = new CustomEvent("deviceready", { "detail": "Dummy deviceready event" });
                    document.dispatchEvent(event);
                },

                onDeviceReady : function() {
//                    console.log('CordovaApp. onDeviceReady. ');
                    that.receivedEvent('deviceready');
                    that.initAllAppData();
                },

                receivedEvent : function(id) {
//                    console.log('CordovaApp. receivedEvent. ');
                    if (id === 'deviceready') {
                        document.addEventListener('backbutton', function(e) {
                            onBackButtonPressed();
                        }, false);
                        this.getVersion();
                    }

                },

                initAllAppData : function() {
                    if(!!$window.StatusBar){
                        StatusBar.hide();
                    }else{
                        console.log('$window.StatusBar Object not available');
                    }

                    Settings.init();
                    ClientManager.init(that.startApp, that.errorStartApp);

                    if (CordovaDevice.phonegapIsOnline()) {
                        WebManager.loadServerConfigs(
                            function(){
                                console.log("loadServerConfigs successCallback. Starting PushManager");
                                PushManager.init();
                            }, function(){
                                console.log("loadServerConfigs errorCallback. Error retrieving serverConfigs");
                            }
                        );
                    }else{
                        this.startAppOffline();
                    }
                },

                startAppOffline : function (){
                    console.log("startAppOffline. App Offline");
                },

                startApp : function (isActive, status){
                    console.log("startApp. Starting App: Client Active: " + isActive
                        + ". Client Status: " + status);
                },
                errorStartApp : function (){
                    console.log("errorStartApp. Error. Couldn't Start Application");
                },

                getVersion: function(){
                    if(!!$window.wizUtils){
                        $window.wizUtils.getBundleVersion(function(result){
                            App.setBundleVersion(result);
                        });
                    }else{
                        console.log('$window.wizUtils Object not available');
                    }
                },

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaApp#init
                 * @methodOf core.Services.CordovaApp
                 */
                init : function() {
//                    console.log('Ready. initialize. ');
                    that = this;
                    this.bindEvents();
                }
            };
        }
    ]);
