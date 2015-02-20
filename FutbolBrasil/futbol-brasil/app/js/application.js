'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName
    , ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider', '$httpProvider', '$translateProvider',
        function($locationProvider, $httpProvider, $translateProvider) {
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
    //                    ,response: function (response) {
    //                        if (response.status == 200
    //                            && response.headers('Content-Type').indexOf('application/json')!=-1
    //                            && response.data.hasOwnProperty('key')
    //                            && response.data.key === 'AuthorizationFailure'){
    //                            var Auth = Auth || $injector.get('Auth');
    //                            console.log('Auth Interceptor triggered, invalidating session: ');
    //                            console.log(response.data);
    //                            Auth.invalidateSession();
    //                            return $q.reject(response);
    //                        }
    //                        return response || $q.when(response);
    //                    }
                    };
                }
            ]);

            $translateProvider.useStaticFilesLoader({
                prefix: '../translations/locale-',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('pt');
            $translateProvider.use('pt');
            $translateProvider.usePostCompiling(true);
        }
    ])
    .run(function($rootScope, $localStorage, $state, CordovaApp, ClientManager, Client) {
        CordovaApp.init();
        $rootScope.contentClass = 'content-init';
        $rootScope.$storage = $localStorage.$default({
            news: false,
            leaderboard:false,
            scorers:false,
            match:false,
            competitions:false
        });

        $rootScope.$on('$stateChangeStart',  function (event, toState, toParams, fromState, fromParams) {
            $rootScope.$emit('unload');
            if($rootScope.hideMenu) {
                $rootScope.hideMenu();
            }

            if(toState.name !== 'login'){
                if(!Client.isClientOk()){
                    console.log('client data not loaded. Loading client data again.');
                    ClientManager.init(function(){
//                        CordovaApp.startApp();
                        if(!Client.isClientOk()){
                            console.log('User not Authenticated');
                            event.preventDefault();
                            $state.go('login');
                        }
                    }, CordovaApp.errorStartApp);
                }

                $rootScope.isActiveButton = 'active';
            } else {
                $rootScope.isActiveButton = '';
            }

        });

        $rootScope.$on('$stateChangeSuccess',  function (event, toState, toParams, fromState, fromParams) {
            $rootScope.section = !!toState.data.section ? toState.data.section : '';
            if (toState.data.contentClass){
                $rootScope.contentClass = toState.data.contentClass;
            }
        });

    });

//Then define the init function for starting up the application
angular
    .element(document)
    .ready(function() {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
        angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
    });
