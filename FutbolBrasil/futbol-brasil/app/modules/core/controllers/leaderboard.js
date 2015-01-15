'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LeaderboardCtrl
 * @description LeaderboardCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('LeaderboardCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
      $rootScope.error = true;
      $rootScope.loading = false;
    }
]);
