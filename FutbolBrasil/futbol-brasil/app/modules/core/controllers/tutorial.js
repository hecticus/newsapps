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
        '$scope', '$localStorage', '$state', '$window', 'iScroll', 'Client',
        function($scope, $localStorage, $state, $window, iScroll, Client) {


            $scope.language = Client.getLanguage().short_name;
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


            $scope.nextPage = function(){
                 $scope.hScroll.next();
            };

            $scope.prevPage = function(){
                 $scope.hScroll.prev();
            };

            $scope.getToggleOnClass = function(page) {
                if (page === $scope.hScroll.currentPage.pageX)
                  return 'mdi-toggle-radio-button-on';
            }

            $scope.getHiddenClass = function(page) {
                if (page === $scope.hScroll.currentPage.pageX)
                  return 'hidden';
            }

            function init(){
                $scope.hScroll = iScroll.horizontal('wrapperH');
            } init();
        }
]);
