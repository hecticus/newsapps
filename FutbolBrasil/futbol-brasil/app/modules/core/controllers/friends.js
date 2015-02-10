'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.FriendsCtrl
 * @description FriendsCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('FriendsCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
        $scope.$emit('error');
     }
]);
