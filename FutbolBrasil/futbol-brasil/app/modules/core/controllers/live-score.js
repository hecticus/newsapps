'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LiveScoreCtrl
 * @description LiveScoreCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('LiveScoreCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
      $rootScope.error = true;
      $rootScope.loading = false;
        console.log('LiveScoreCtrl.error ' + $rootScope.error);
    }
]);
