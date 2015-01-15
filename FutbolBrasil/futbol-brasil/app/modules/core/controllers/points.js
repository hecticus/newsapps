'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PointsCtrl
 * @description PointsCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('PointsCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
      $rootScope.error = true;
      $rootScope.loading = false;
    }
]);
