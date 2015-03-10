'use strict';

/**
 * @ngdoc service
 * @name core.Services.CordovaApp
 * @description CordovaApp Factory
 */
angular
    .module('core')
    .factory('CordovaApp',['$state', '$window', 'Domain', 'Utilities', 'CordovaDevice', 'WebManager', 'ClientManager',
        'PushManager', 'FacebookManager', 'Client', 'Settings', 'Competitions', 'App',
        function($state, $window, Domain, Utilities, CordovaDevice, WebManager, ClientManager,
                 PushManager, FacebookManager, Client, Settings, Competitions, App) {

            var that = this;
            var backButtonCallback = null;
            var updateCallback = null;
            var currentSection = '';
            var prevSection = '';

            //TODO i18n-alizar
            var strings = {
                EXIT_APP_TITLE : 'Sair do Aplicativo',
                EXIT_APP_MSG : 'Tem certeza de que deseja sair do aplicativo?',
                OK : 'Ok',
                CANCEL : 'Cancelar'
            };

            var checkUpdate = function(){
                var updateInfo = App.getUpdateInfo();
                updateInfo.current_version = App.getBundleVersion();
                updateInfo.bundle_id = App.getBundleId();
                if(updateInfo.update === 1){
                    updateCallback(updateInfo);
                }
            };

            var exitApp = function (){
                try{
                    FacebookManager.clearIntervalFriendsLoader();
                } catch(e){

                }

                //Legacy
                if (!!navigator.app) {
                    navigator.app.exitApp();
                } else if (!!navigator.device) {
                    navigator.device.exitApp();
                } else {
                    console.log("Couldn't close app");
                }
            };

            var hideMenu = function() {
                var menuWrapper = $('#wrapperM');
                if (menuWrapper.hasClass('right')) {
                    menuWrapper.attr('class', ' page transition left');
                }
            };

            var onBackButtonPressed = function(){
                var hasPreviousSubsection = angular.element('.page.back.left:last').hasClass('left');
                var hasNotificationPlugin = !!navigator.notification;

                if ($('#wrapperM').hasClass('right')) {
                    hideMenu();
                } else if(isOnUtilitySection()){
                    if($state.current.name === 'settings' && prevSection){
                        $state.go(prevSection);
                    } else if($state.current.data){
                        $state.go($state.current.data.prev);
                    }
                } else if(hasPreviousSubsection){
                    angular.element('.page.back.left:last')
                        .attr('class', ' page transition right');
//                    typeof backButtonCallback === 'function' && backButtonCallback();
                } else {
                    showNotificationDialog({
                            title: strings.EXIT_APP_TITLE,
                            message: strings.EXIT_APP_MSG,
                            confirm: strings.OK,
                            cancel: strings.CANCEL
                        },
                        function(){
                            console.log('Ok selected');
                            exitApp();
                        },
                        function(){
                            console.log('Cancelled by User');
                        });
                }
            };

            var showNotificationDialog = function(data,
                  confirmCallback, cancelCallback){
                var hasNotificationPlugin = !!navigator.notification;
                if (hasNotificationPlugin) {
                    navigator.notification
                        .confirm(data.message
                        , function(btnIndex){
                            switch (btnIndex) {
                                case 1:
                                    typeof confirmCallback === 'function' && confirmCallback();
                                    break;
                                case 2:
                                    typeof cancelCallback === 'function' && cancelCallback();
                                    break;
                                default:
                            }
                        }
                        , data.title
                        , [data.confirm, data.cancel]);
                } else {
                    var confirmFallback = confirm(data.message);
                    if (confirmFallback === true) {
                        typeof confirmCallback === 'function' && confirmCallback();
                    } else {
                        typeof cancelCallback === 'function' && cancelCallback();
                    }
                }
            };

            var isOnUtilitySection = function(){
                return (currentSection === 'settings' || currentSection === 'login');
            };

            return {
                setBackButtonCallback: function(callback){
                    backButtonCallback = callback;
                },

                setUpdateCallback: function(callback){
                    updateCallback = callback;
                },

                bindEvents : function() {
//                    console.log('CordovaApp. bindEvents. ');
                    document.addEventListener('deviceready', that.onDeviceReady, false);
                    document.addEventListener('touchmove', function (e) {
                        e.preventDefault();
                    }, false);

                    if(typeof CustomEvent === 'function'){
                        var event = new CustomEvent("deviceready", { "detail": "Dummy deviceready event" });
                        document.dispatchEvent(event);
                    }
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
                            console.log('backbutton event');
                            onBackButtonPressed();
                        }, false);
                        this.getVersion();
                    }

                },

                initAllAppData : function() {
                    if(!!$window.StatusBar){
                        StatusBar.hide();
                    }else{
                        console.log('$window.StatusBar Object not available. Are you directly on a browser?');
                    }

                    ClientManager.init(that.startApp, that.errorStartApp);

                    if (CordovaDevice.phonegapIsOnline()) {
                        WebManager.loadServerConfigs(
                            function(){
                                Settings.init();
                                Competitions.init();
                                PushManager.init();
                                checkUpdate();
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
//                    console.log("startApp. Starting App: Client Active: " + isActive
//                        + ". Client Status: " + status);
                },
                errorStartApp : function (){
                    console.log("errorStartApp. Error. Couldn't Start Application");
                },

                getVersion: function(){
                    if(!!$window.wizUtils){
                        $window.wizUtils.getBundleVersion(function(result){
                            App.setBundleVersion(result);
                        });
                        $window.wizUtils.getBundleIdentifier(function(id){
                            App.setBundleId(id);
                        });
                    }else{
                        console.log('$window.wizUtils Object not available. Are you directly on a browser?');
                    }
                },

                setCurrentSection : function(sect){
                    currentSection = sect;
                },
                getCurrentSection : function(){
                    return currentSection;
                },

                setPreviousSection : function(sect){
                    prevSection = sect;
                },
                getPreviousSection : function(){
                    return prevSection;
                },

                isOnUtilitySection : isOnUtilitySection,

                onBackButtonPressed: onBackButtonPressed,

                showNotificationDialog: showNotificationDialog,

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaApp#init
                 * @methodOf core.Services.CordovaApp
                 */
                init : function() {
                    that = this;
                    this.bindEvents();
                }
            };
        }
    ]);
