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

            var onBackButtonPressed = function(){

            };

            return {
                setBackButtonCallback: function(callback){
                    if(typeof callback === 'function')
                    onBackButtonPressed = callback;
                },

                bindEvents : function() {
//                    console.log('CordovaApp. bindEvents. ');
                    document.addEventListener('deviceready', that.onDeviceReady, false);
                    document.addEventListener('touchmove', function (e) {
                        e.preventDefault();
                    }, false);
                    var event = new CustomEvent("deviceready", { "detail": "Example of an event" });
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
//                    console.log('CordovaApp. initAllAppData. ');
                    var StatusBar = StatusBar? StatusBar: undefined;
                    if(!!StatusBar) {
                        StatusBar.hide();
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

                exitApp : function (){
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

                doneCreating : function (){
                    console.log("DONE CREATING!!!!");
                },

                errorCreating : function (){
                    console.log("ERROR CREATING!!!!");
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
