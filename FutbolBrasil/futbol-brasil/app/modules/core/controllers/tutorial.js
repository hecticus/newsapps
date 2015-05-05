'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.TutorialController
 * @description TutorialController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('TutorialController', [
        '$scope', '$localStorage', '$state', '$window', 'iScroll',
        function($scope, $localStorage, $state, $window, iScroll) {

            var width = $window.innerWidth;
            var widthTotal = $window.innerWidth;

            $scope.getWidth = function(){
                return { 'width': width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': (widthTotal * 6) + 'px'}
            };

            $scope.goToIndex = function(){
                $state.go('prediction');
            };

            function init(){
                $scope.hScroll = iScroll.horizontal('wrapperH');
            } init();
        }
]);
