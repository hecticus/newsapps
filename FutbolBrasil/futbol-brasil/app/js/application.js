'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName
    , ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider', '$httpProvider', '$translateProvider', '$fbProvider', '$twtProvider', 'AnalyticsProvider', 'ezfbProvider',
        function($locationProvider, $httpProvider, $translateProvider, $fbProvider, $twtProvider, AnalyticsProvider, ezfbProvider) {
            $locationProvider.hashPrefix('!');
            $httpProvider.defaults.useXDomain = true;
            $httpProvider.interceptors.push(['$q', '$location', '$injector',
                function ($q, $location, $injector) {
                    return {
                        request: function (config) {
                            var WebManager = WebManager || $injector.get('WebManager');
                            config.headers = $.extend(config.headers, WebManager.getHeaders());
                            return config;
                        }
                    };
                }
            ]);

            if(!window.cordova) {
                console.log('AnalyticsProvider.setAccount -> UA-60801639-2');
                // Setup your account
                AnalyticsProvider.setAccount('UA-60801639-2');
                // Automatic route tracking (default: true)
                AnalyticsProvider.trackPages(true);
                // Use display features plugin
                AnalyticsProvider.useDisplayFeatures(true);
                // Use analytics.js instead of ga.js
                AnalyticsProvider.useAnalytics(true);
                // Change the default page event name. This is useful for ui-router, which fires $stateChangeSuccess instead of $routeChangeSuccess
                AnalyticsProvider.setPageEvent('$stateChangeSuccess');


                $fbProvider.init(320314531485580);
                $twtProvider.init().trimText(true);
                
                ezfbProvider.setInitParams({
                    /******CAMBIAR POR APPID DE PRODUCCION******/
                    appId: '1379325579064871'
                }); 

            }

//            // Translations from Server
//            $translateProvider.useUrlLoader('http://brazil.footballmanager.hecticus.com/futbolbrasil/v2/locale.json');

//            // Translations from Variables (need to create vars again)
//            $translateProvider.translations('en', translationsEn);
//            $translateProvider.translations('es', translationsEs);
//            $translateProvider.translations('pt', translationsPt);

//            Translations from Files
            $translateProvider.useStaticFilesLoader({
                prefix: 'translations/locale-',
                suffix: '.js'
            });

            $translateProvider.preferredLanguage('pt');
            $translateProvider.use('pt');
            $translateProvider.usePostCompiling(true);
        }
    ])
    .run(['$rootScope', '$localStorage', '$state', '$translate', 'CordovaApp', 'ClientManager', 'Client',
        'Notification', 'hAnalytics', '$templateCache','FacebookManager', 'WebManager','App','i18n','Upstream', 'News', 'Analytics',
        function($rootScope, $localStorage, $state, $translate, CordovaApp, ClientManager, Client,
                 Notification, hAnalytics, $templateCache, FacebookManager, WebManager,App,i18n,Upstream,News, Analytics) {


            WebManager.loadServerConfigs().then(
            function(data){
                data = data.data.response;
                App.setCompanyName(data.company_name);
                App.setBuildVersion(data.build_version);
                App.setServerVersion(data.server_version);
                App.setUpdateInfo(data.version);

                i18n.init(data.default_language);
                News.setMaxNews(data.max_news);
                Upstream.setUp(data).then(Upstream.appLaunchEvent);
                CordovaApp.init();
            });




            $rootScope.defaultPage = 'prediction';
            $rootScope.contentClass = 'content-init';
            $rootScope.$storage = $localStorage.$default({
                news: false,
                leaderboard:false,
                scorers:false,
                match:false,
                competitions:false
            });

            $rootScope.$on('$stateChangeStart',  function (event, toState, toParams, fromState, fromParams){

                $rootScope.error = false;

                if($rootScope.hideMenu){ $rootScope.hideMenu(); }

                if(CordovaApp.requiresAuthSection(toState.name)){

                    if(!Client.isClientOk()){
                        //console.log('client data not loaded. Loading client data again.');
                        ClientManager.init()
                        .then(function(){
                            if(!Client.isClientOk()){
                                //console.log('User not Authenticated');
                                event.preventDefault();
                                $state.go('login');
                            }
                        }, CordovaApp.errorStartApp);
                    } else {

                        if (toState.data.state === 'friends') {
                            FacebookManager.getStatus(function (result) {
                                if (result) {
                                    if (result.status !== 'connected') {
                                        Notification.showQuestionFacebookDialog();
                                    }
                                }
                            });
                        };

                    }

                    if((Client.isGuest() || !Client.isActiveClient()) && CordovaApp.isBlockedSection(toState.name)){

                        if(Client.isGuest()){
                            Notification.showLockedSectionDialog();
                        } else {
                            Notification.showLockedSectionNotEligible();
                        }

                        event.preventDefault();
                        $rootScope.hideLoading();
                    }

                    $rootScope.isActiveButton = 'active';

                } else {
                    $rootScope.isActiveButton = '';
                }

            });

            $rootScope.$on('$stateChangeSuccess',  function (event, toState, toParams, fromState, fromParams) {
                $templateCache.removeAll();
                var fromName = fromState.name;
                var fromSection = fromState.data? fromState.data.section : null;
                var toSection = !!toState.data.section? toState.data.section : '';
                CordovaApp.setCurrentSection(toSection);

                if(toSection && toSection === 'remind'){
                    CordovaApp.setPreviousSection('login');
                } else if(fromName && fromSection !== 'settings' && !CordovaApp.isSettingsSubSection(toSection)
                    && !CordovaApp.isSettingsSubSection(fromSection)){
                    //console.log('setting previous section name: '+ fromName);
                    CordovaApp.setPreviousSection(fromName);
                } else if(fromName && fromSection === 'settings'){
                    CordovaApp.setIsOnSettingsSection(true);
                }

                $translate('SECTIONS.' + toSection.toUpperCase())
                .then(function(translate){
                    $rootScope.sectionTranslation = translate;
                });

                if (toState.data && toState.data.contentClass){
                    $rootScope.contentClass = toState.data.contentClass;
                }

                hAnalytics.trackView(toState.name);
                if(!window.cordova) {
                  console.log('Analytics.trackPage -> ' + toState.name);
                  Analytics.trackPage(toState.name);
                }


            });
        }
    ]);

//Then define the init function for starting up the application
angular
    .element(document)
    .ready(function() {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
        angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
    });
