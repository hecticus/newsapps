'use strict';

/**
 * @ngdoc service
 * @name core.Services.CordovaApp
 * @description CordovaApp Factory
 */
angular
    .module('core')
    .factory('CordovaApp',['$state', '$window', '$timeout', 'CordovaDevice', 'WebManager', 'ClientManager',
        'PushManager', 'FacebookManager', 'Settings', 'Competitions', 'App', 'Update', 'Upstream', 'Analytics',
        function($state, $window, $timeout, CordovaDevice, WebManager, ClientManager,
                 PushManager, FacebookManager, Settings, Competitions, App, Update, Upstream, Analytics) {

            var currentSection = '';
            var prevSection = '';
            var utilitySections = ['settings', 'login', 'remind', 'language-selection', 'team-selection'];
            var blockedSections = ['match', 'standings', 'scorers', 'mtm', 'friends'];
            var onSettingsSection = false;

            //TODO i18n-alizar
            var strings = {
                EXIT_APP_TITLE : 'Sair do Aplicativo',
                EXIT_APP_MSG : 'Tem certeza de que deseja sair do aplicativo?',
                OK : 'Ok',
                CANCEL : 'Cancelar'
            };

            function getVersion(){
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
            }

            function exitApp(){
                try{
                    FacebookManager.clearIntervalFriendsLoader();
                } catch(e){

                }

                Upstream.appCloseEvent();

                //Legacy
                if (!!navigator.app) {
                    navigator.app.exitApp();
                } else if (!!navigator.device) {
                    navigator.device.exitApp();
                } else {
                    console.log("Couldn't close app");
                }
            }

            function hideMenu() {
                var menuWrapper = $('#wrapperM');
                if (menuWrapper.hasClass('right')) {
                    menuWrapper.attr('class', ' page transition left');
                }
            }

            function onBackButtonPressed(){
                var hasPreviousSubsection = angular.element('.page.back.left:last').hasClass('left');

                if ($('#wrapperM').hasClass('right')) {
                    hideMenu();
                } else if(isOnUtilitySection()){
                    console.log('onSettingsSection:' + onSettingsSection);
                    if(onSettingsSection){
                        $state.go($state.current.data.prev);
                        onSettingsSection = false;
                    } else if(prevSection){
                        $state.go(prevSection);
                    } else if($state.current.data){
                        $state.go($state.current.data.prev);
                    }
                } else if(hasPreviousSubsection){
                    angular.element('.page.back.left:last')
                        .attr('class', ' page transition right');
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
                        }
                    );
                }
            }

            function showNotificationDialog(data, confirmCallback, cancelCallback){
                var hasNotificationPlugin = !!navigator.notification;
                if (hasNotificationPlugin) {
                    navigator.notification.confirm(data.message
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
                        , data.title, [data.confirm, data.cancel]);
                } else {
                    var confirmFallback = confirm(data.message);
                    if (confirmFallback === true) {
                        typeof confirmCallback === 'function' && confirmCallback();
                    } else {
                        typeof cancelCallback === 'function' && cancelCallback();
                    }
                }
            }

            function isOnUtilitySection(){
                return utilitySections.some(function(utilitySection){
                    return utilitySection === currentSection;
                });
            }

            function isBlockedSection(section){
                return blockedSections.some(function (blockedSection) {
                    return blockedSection === section;
                });
            }

            function setIsOnSettingsSection(val){
                onSettingsSection = val;
            }

            function bindEvents() {
//                    console.log('CordovaApp. bindEvents. ');
                document.addEventListener('deviceready', onDeviceReady, false);
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);

                if(typeof CustomEvent === 'function'){
                    var event = new CustomEvent("deviceready", { "detail": "Dummy deviceready event" });
                    document.dispatchEvent(event);
                }
            }

            function receivedEvent(id){
                if (id === 'deviceready') {
                    document.addEventListener('backbutton', function(e){
                        console.log('backbutton event');
                        onBackButtonPressed();
                    }, false);
                    getVersion();
                }
            }

            function onDeviceReady() {
                receivedEvent('deviceready');
                initAllAppData();
            }

            function startApp(isActive, status){
                    console.log("startApp. Starting App: Client Active: " + isActive
                        + ". Client Status: " + status);
            }

            function startAppOffline(){
                console.log("startAppOffline. App Offline");
            }

            function errorStartApp(){
                console.log("errorStartApp. Error. Couldn't Start Application");
            }

            function initAllAppData() {
                if(!!$window.StatusBar){
                    StatusBar.hide();
                }else{
                    console.log('$window.StatusBar Object not available. Are you directly on a browser?');
                }

                Analytics.init();
                ClientManager.init(startApp, errorStartApp);

                if (CordovaDevice.phonegapIsOnline()) {
                    PushManager.init();
                    WebManager.loadServerConfigs(
                        function(){
                            Settings.init();
                            Competitions.init();
                            Update.checkUpdate();
                            $timeout(function(){
                                Upstream.appLaunchEvent();
                            }, 300);
                        }, function(){
                            console.log("loadServerConfigs errorCallback. Error retrieving serverConfigs");
                        }
                    );
                }else{
                    startAppOffline();
                }
            }

            function init() {
                bindEvents();
            }

            return {

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

                bindEvents : bindEvents,

                onDeviceReady : onDeviceReady,

                receivedEvent : receivedEvent,

                initAllAppData : initAllAppData,

                startAppOffline : startAppOffline,

                startApp : startApp,

                errorStartApp : errorStartApp,

                getVersion: getVersion,

                isBlockedSection : isBlockedSection,

                isOnUtilitySection : isOnUtilitySection,

                setIsOnSettingsSection: setIsOnSettingsSection,

                onBackButtonPressed: onBackButtonPressed,

                showNotificationDialog: showNotificationDialog,

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaApp#init
                 * @methodOf core.Services.CordovaApp
                 */
                init : init
            };
        }
    ]);
