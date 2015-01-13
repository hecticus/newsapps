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
    .run(function($rootScope, $localStorage, $http, Domain) {
      //TODO mover el GET a MainCtrl y convertir Domain en constant

      $rootScope.contentClass = 'content-init';
      $rootScope.$storage = $localStorage.$default({
        news: false,
        leaderboard:false,
        scorers:false,
        match:false,
        competitions:false,
      });


      $http({method: 'GET', url:Domain.competitions()}).success(function(obj){
      //TODO revisar esta linea ngStorage
        $rootScope.$storage.competitions = JSON.stringify(obj.response);
      });

    })

//Then define the init function for starting up the application
angular
    .element(document)
    .ready(function() {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
        angular
            .bootstrap(document,
                [ApplicationConfiguration.applicationModuleName]);
    });
