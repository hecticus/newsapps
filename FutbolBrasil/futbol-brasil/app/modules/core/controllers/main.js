'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MainCtrl
 * @description MainCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('MainCtrl', ['$rootScope', '$scope', '$location', '$state', '$localStorage', '$http', 'Domain', '$timeout','CordovaApp'
      , function($rootScope, $scope, $location, $state, $localStorage, $http, Domain, $timeout,CordovaApp) {

        $rootScope.$storage = $localStorage;

        $scope.isActive = function(className){
            return $state.current.name === className;
        };

        $rootScope.runBackButton = function(_exit) {
            if (angular.element('.page.back.left:last').hasClass('left')) {
              $rootScope.transitionPage('.page.back.left:last', 'right')
            } else if ($('#wrapperM').hasClass('right')) {
              $rootScope.transitionPage('#wrapperM', 'left');
            } else {
                if (_exit) {
                    if (confirm('Para sair da aplicação')) {
                      CordovaApp.exitApp();
                    };
                }
            };
        };

        $rootScope.showSection = function(_section) {
            $rootScope.runBackButton();
            $timeout(function() {
              angular.element('.section').removeClass('active');
              angular.element('[data-section="' + _section + '"]').addClass('active');
              $state.go(_section);
            },300);
        };

        $rootScope.transitionPage = function(_wrapper, _direction, _class) {
            if (!_class) _class = '';
            angular.element(_wrapper).attr('class', _class + ' page transition ' + _direction);
        }

        $rootScope.transitionPageBack = function(_wrapper, _direction) {
          $rootScope.transitionPage(_wrapper,_direction, 'back')
        }
        $rootScope.nextPage = function() {
            $rootScope.runBackButton(false);
        };

        $rootScope.prevPage = function() {
            $rootScope.runBackButton(false);
        };

        $scope.getCompetitions = function(){
            return $http({method: 'GET', url:Domain.competitions()}).success(function(obj){
                //TODO Usado en StandingsCtrl
                $rootScope.$storage.competitions = JSON.stringify(obj.response);
            });
        };

        $scope.showMenu = function() {
          if ($('#wrapperM').hasClass('right')) {
            $rootScope.transitionPage('#wrapperM', 'left');
          } else {
            $rootScope.transitionPage('#wrapperM', 'right');
          }
        };

        $scope.init = function(){
            $scope.getCompetitions();
        }();
    }
]);
