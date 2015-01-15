'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PredictionCtrl
 * @description PredictionCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('PredictionCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
      $rootScope.error = true;
      $rootScope.loading = false;
    }
]);
