'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MainCtrl
 * @description MainCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('MainCtrl', ['$rootScope', '$scope', '$location', '$state', '$localStorage', '$http', '$timeout', 'Domain', 'ClientManager'
      , function($rootScope, $scope, $location, $state, $localStorage, $http, $timeout, Domain, ClientManager) {

        $rootScope.$storage = $localStorage;

        $scope.isActive = function(className){
            return $state.current.name === className;
        };

        $rootScope.showSection = function(_section) {
            angular.element('#wrapperM').attr('class','page transition left');
            $timeout(function() {
              angular.element('.section').removeClass('active');
              angular.element('[data-section="' + _section + '"]').addClass('active');
              $state.go(_section);
            },300);
        };

        $rootScope.nextPage = function() {
            console.log('nextPage');
            if (angular.element('#wrapperM').hasClass('right')) {
              angular.element('#wrapperM').attr('class','page transition left');
            }
        };

        $rootScope.prevPage = function() {
            console.log('prevPage');
            if (angular.element('#wrapper3').hasClass('left')) {
              angular.element('#wrapper3').attr('class','page transition right');
            } else if (angular.element('#wrapper2').hasClass('left')) {
              angular.element('#wrapper2').attr('class','page transition right');
            }/* else if (angular.element('#wrapperM').hasClass('left')) {
              angular.element('#wrapperM').attr('class','page transition right');
            }*/

        };

        $scope.getCompetitions = function(){
            return $http({method: 'GET', url:Domain.competitions()}).success(function(obj){
                //TODO Usado en StandingsCtrl
                $rootScope.$storage.competitions = JSON.stringify(obj.response);
            });
        };

        $scope.showMenu = function(e) {
          if ($('#wrapperM').hasClass('right')) {
            angular.element('#wrapperM').attr('class','page transition left');
          } else {
            angular.element('#wrapperM').attr('class','page transition right');
          }
        };

        $scope.init = function(){
            $scope.getCompetitions();
//            ClientManager.getClientStatus(
//                function(){
//                    console.log();
//                },
//                function(){}
//            );
        }();
    }
]);
