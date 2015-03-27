'use strict';

/**
 * @ngdoc service
 * @name core.Services.CordovaApp
 * @description CordovaApp Factory
 */
angular
    .module('core')
    .factory('CordovaApp',['$state', '$window', '$timeout', '$translate',
        'CordovaDevice', 'WebManager', 'ClientManager', 'PushManager', 'FacebookManager',
        'Settings', 'Competitions', 'App', 'Update', 'Upstream', 'Analytics', 'i18n', 'News', 'Domain',
        function($state, $window, $timeout, $translate, CordovaDevice, WebManager, ClientManager,
                 PushManager, FacebookManager, Settings, Competitions, App, Update, Upstream, Analytics, i18n, News, Domain) {

            var currentSection = '';
            var prevSection = '';
            var utilitySections = ['settings', 'login', 'remind', 'language-selection', 'team-selection'];
            var blockedSections = ['match', 'standings', 'scorers', 'mtm', 'friends'];
            var onSettingsSection = false;

            var strings = {};

            //noinspection UnnecessaryLocalVariableJS
            var service = {

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaApp#init
                 * @methodOf core.Services.CordovaApp
                 */
                init : init,

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

                errorStartApp : errorStartApp,

                getVersion: getVersion,

                isBlockedSection : isBlockedSection,

                isOnUtilitySection : isOnUtilitySection,

                requiresAuthSection : requiresAuthSection,

                setIsOnSettingsSection: setIsOnSettingsSection,

                onBackButtonPressed: onBackButtonPressed,

                showNotificationDialog: showNotificationDialog
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
                FacebookManager.clearIntervalFriendsLoader();
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

            function requiresAuthSection(section){
                return !(section === 'login' || section === 'remind');
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
                if(CordovaDevice.isWebPlatform()){
                    initAllAppData();
                } else {
                    document.addEventListener('deviceready', onDeviceReady, false);
                }

                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);
            }

            function onDeviceReady() {
                receivedEvent('deviceready');
                initAllAppData();
            }

            function receivedEvent(id){
                if (id === 'deviceready') {
                    document.addEventListener('backbutton', function(e){
                        console.log('backbutton event');
                        onBackButtonPressed();
                    }, false);
                }
            }

            function startApp(data){
                console.log("startApp. Starting App: Client Active: " + data.is_active
                    + ". Client Status: " + data.status);
            }

            function startAppOffline(){
                console.log("startAppOffline. App Offline");
            }

            function errorStartApp(){
                console.log("errorStartApp. Error. Couldn't Start Application");
            }

            function getTranslations(){
                $translate(['EXIT_APP_TITLE', 'EXIT_APP_MSG', 'OK', 'CANCEL'])
                    .then(function(translation){
                        strings['EXIT_APP_TITLE'] = translation['EXIT_APP_TITLE'];
                        strings['EXIT_APP_MSG'] = translation['EXIT_APP_MSG'];
                        strings['OK'] = translation['OK'];
                        strings['CANCEL'] = translation['CANCEL'];
                    });
            }

            function initAllAppData() {
                if(!!$window.StatusBar){
                    StatusBar.hide();
                }else{
                    console.log('$window.StatusBar Object not available. Are you directly on a browser?');
                }

                getVersion();

                Analytics.init();
                ClientManager.init().then(startApp, errorStartApp);

                if(CordovaDevice.phonegapIsOnline()) {
                    PushManager.init();
                    WebManager.loadServerConfigs().then(
                        function(data){
                            data = data.data.response;
                            Upstream.setUp(data).then(Upstream.appLaunchEvent);

                            App.setCompanyName(data.company_name);
                            App.setBuildVersion(data.build_version);
                            App.setServerVersion(data.server_version);
                            App.setUpdateInfo(data.version);

                            Domain.setProvisionalLanguage(data.default_language);
                            i18n.init(data.default_language);

                            News.setMaxNews(data.max_news);

                            Settings.init();
                            Competitions.init();
                            getTranslations();

                            if(!CordovaDevice.isWebPlatform()){
                                Update.checkUpdate();
                            }
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

            return service;
        }
    ]);
