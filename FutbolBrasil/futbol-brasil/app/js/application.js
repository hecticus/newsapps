'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName
    , ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
    ])
    .run(function($rootScope, $localStorage, $state, ClientManager, CordovaApp) {
        //Initialize ClientManager
//        ClientManager.init(CordovaApp.init, CordovaApp.errorStartApp);
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

            $rootScope.loading = false;
            $rootScope.error = false;

            if(toState.name !== 'login'){
              $rootScope.isActiveButton = 'active';
            } else {
              $rootScope.isActiveButton = '';
            };

//            console.log('toState.name: "' + toState.name + '", fromState: "' + fromState.name + '"');

//            if(toState.name !== 'login'){
               /* if(!ClientManager.getClientMSISDN()){
                    console.log('clientMSISDN undefined. Loading clientMSISDN again.');
                    ClientManager.loadClientMSISDN();
                }*/

//                console.log('ClientManager: ');
//                console.log(ClientManager);

               /* console.log('ClientManager.clientMSISDN: ' + ClientManager.getClientMSISDN());

                if(!ClientManager.getClientMSISDN() && toState.name !== 'login'){
                    console.log('User not Authenticated');
                    event.preventDefault();
                    $state.go('login');
                }*/
//            }
        });

        $rootScope.$on('$stateChangeSuccess',  function (event, toState, toParams, fromState, fromParams) {
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
