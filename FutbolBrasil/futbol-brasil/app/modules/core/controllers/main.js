'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MainCtrl
 * @description MainCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('MainCtrl', ['$rootScope', '$scope', '$location', '$state', '$localStorage', '$http', 'Domain'
      , function($rootScope, $scope, $location, $state, $localStorage, $http, Domain) {

        $rootScope.$storage = $localStorage;

        $scope.isActive = function(className){
            return $state.current.name === className;
        };

        $rootScope.showSection = function(_section) {
            angular.element('.section').removeClass('active');
            angular.element('[data-section="' + _section + '"]').addClass('active');
            $state.go(_section);
        };

        $rootScope.nextPage = function() {
            console.log('nextPage');
        /*if (!angular.element('#wrapper2').hasClass('left')) {
            $location.path($state.current.next);
         } */
        };

        $rootScope.prevPage = function() {
            console.log('prevPage');
            if (angular.element('#wrapper3').hasClass('left')) {
                angular.element('#wrapper3').attr('class','page transition right');
            } else if (angular.element('#wrapper2').hasClass('left')) {
                angular.element('#wrapper2').attr('class','page transition right');
            }

        };

        $scope.getCompetitions = function(){
            return $http({method: 'GET', url:Domain.competitions()}).success(function(obj){
                //TODO Usado en StandingsCtrl
                $rootScope.$storage.competitions = JSON.stringify(obj.response);
            });
        };

        $scope.init = function(){
            $scope.getCompetitions();
        }();
    }
]);
