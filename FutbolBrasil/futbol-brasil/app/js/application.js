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
    .run(function($rootScope, $localStorage, $state, ClientManager) {

      $rootScope.contentClass = 'content-init';
      $rootScope.$storage = $localStorage.$default({
        news: false,
        leaderboard:false,
        scorers:false,
        match:false,
        competitions:false,
      });

      $rootScope.$on('$stateChangeStart',  function (event, toState, toParams, fromState, fromParams) {
        $rootScope.loading = false;
        $rootScope.error = false;

//        ClientManager.loadClientMSISDN();
//        if(!ClientManager.clientMSISDN){
//          console.log('User not Authenticated');
//          if(toState.name !== 'login'){
//            $state.go('login');
//          }
//        }
      });

      $rootScope.$on('$stateChangeSuccess',  function (event, toState, toParams, fromState, fromParams) {
        $rootScope.loading = true;
        if (toState.data.contentClass){
          $rootScope.contentClass = toState.data.contentClass;
        }
      });

    })

//Then define the init function for starting up the application
angular
    .element(document)
    .ready(function() {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
        angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
    });
