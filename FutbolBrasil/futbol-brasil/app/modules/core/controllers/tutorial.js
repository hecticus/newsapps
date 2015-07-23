'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.TutorialController
 * @description TutorialController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('TutorialController', ['$rootScope',
        '$scope', '$localStorage', '$state', '$window', 'iScroll', 'Client',
        function($rootScope, $scope, $localStorage, $state, $window, iScroll, Client) {


            $scope.language = Client.getLanguage().short_name;
            var width = $window.innerWidth;
            var widthTotal = $window.innerWidth;
            var hScroll = null;

            $scope.getWidth = function(){
                return { 'width': width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': (widthTotal * 4) + 'px'}
            };

            $scope.goToIndex = function(){
                $state.go($rootScope.defaultPage);
            };


            $scope.nextPage = function(){
                 hScroll.next();
            };

            $scope.prevPage = function(){
                 hScroll.prev();
            };

            $scope.getToggleOnClass = function(page) {
                if (page === hScroll.currentPage.pageX)
                  return 'mdi-toggle-radio-button-on';
            }

            $scope.getHiddenClass = function(page) {
                if (page === hScroll.currentPage.pageX)
                  return 'hidden';
            }

            function init(){
                hScroll = iScroll.horizontal('wrapperH');
                hScroll.refresh();
                $scope.$emit('unload');
            } init();
        }
]);
