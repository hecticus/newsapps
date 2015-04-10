'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

//configure function passed to angular config. Defined below
angular.module(ApplicationConfiguration.applicationModuleName)
    .config(configure)
    .run(run);

    //Injecting dependencias to configure function
    configure.$inject = ['$locationProvider', '$httpProvider', '$urlMatcherFactoryProvider', '$translateProvider'];
    //Defining configure function
    function configure($locationProvider, $httpProvider, $urlMatcherFactoryProvider, $translateProvider) {
        $locationProvider.hashPrefix('!');
        //Enable cross-origin requests (CORS) support
        $httpProvider.defaults.useXDomain = true;

        //Disable strict mode to accept urls with and without trailing slash
        $urlMatcherFactoryProvider.strictMode(false);

        /* Set up interceptors for requests and responses. For now
        * For now only appending HECTICUS-X-AUTH-TOKEN to every request
        * */
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

        //Translations from Files
        $translateProvider.useStaticFilesLoader({
            prefix: 'translations/locale-',
            suffix: '.js'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.use('en');
        $translateProvider.usePostCompiling(true);
    }

run.$inject = ['$rootScope', '$localStorage', '$state', '$translate'
    , 'CordovaApp', 'ClientManager', 'Client', 'Notification', 'Analytics'];
function run($rootScope, $localStorage, $state, $translate, CordovaApp, ClientManager, Client,
         Notification, Analytics) {

    CordovaApp.init();
    $rootScope.$storage = $localStorage.$default({
        news: false,
        athletes: false,
        categories: false
    });

    $rootScope.$on('$stateChangeStart',  function (event, toState, toParams, fromState, fromParams){
        $rootScope.error = false;
        $rootScope.$emit('unload');

        if($rootScope.hideMenu){ $rootScope.hideMenu(); }

        if(CordovaApp.requiresAuthSection(toState.name)){
            if(!Client.isClientOk()){
                console.log('client data not loaded. Loading client data again.');
                ClientManager.init()
                    .then(function(){
                        if(!Client.isClientOk()){
                            console.log('User not Authenticated');
                            event.preventDefault();
                            $state.go('login');
                        }
                    }, CordovaApp.errorStartApp);
            }

            if(Client.isGuest() && CordovaApp.isBlockedSection(toState.name)){
                Notification.showLockedSectionDialog();
                event.preventDefault();
            }

            $rootScope.isActiveButton = 'active';
        } else {
            $rootScope.isActiveButton = '';
        }

    });

    $rootScope.$on('$stateChangeSuccess',  function (event, toState, toParams, fromState, fromParams) {
        var fromName = fromState.name;
        var fromSection = fromState.data? fromState.data.section : null;
        var toSection = !!toState.data.section? toState.data.section : '';
        CordovaApp.setCurrentSection(toSection);

        if(toSection && toSection === 'remind'){
            CordovaApp.setPreviousSection('login');
        } else if(fromName && fromSection !== 'settings' && !CordovaApp.isSettingsSubSection(toSection)
            && !CordovaApp.isSettingsSubSection(fromSection)){
            console.log('setting previous section name: '+ fromName);
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

        if(toSection && toSection === 'login'){
            Client.logout();
        }

        Analytics.trackView(toState.name);
    });
}

//Then define the init function for starting up the application
angular.element(document).ready(function() {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
        angular
            .bootstrap(document,
                [ApplicationConfiguration.applicationModuleName]);
    });
