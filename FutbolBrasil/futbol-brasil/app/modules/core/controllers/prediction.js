'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PredictionCtrl
 * @description PredictionCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('PredictionCtrl',  ['$http','$rootScope','$scope','$state','$localStorage', '$window', 'Domain','Utilities',
        function($http, $rootScope, $scope, $state, $localStorage, $window, Domain, Utilities) {


            $scope.wrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            $scope.width = $window.innerWidth;
            $scope.widthTotal = ($window.innerWidth * 11);

            $scope.setBet = function (_tournament, _game, _bet, _iLeague ,_iFixture, _iMatch) {
                var _jBet = {'id_tournament': _tournament, 'id_game_match': _game, 'client_bet': _bet};
                $scope.item.leagues[_iLeague].fixtures[_iFixture].matches[_iMatch].bet = _jBet;
            };

            $scope.getTime = function (_date) {
                return Utilities.moment(_date).format('H:MM');
            };

            $scope.init = function(){

              $http({method: 'GET', url: Domain.bets.get()})
              .then(function(obj) {
                 $scope.item =  obj.data.response;
              })
              .finally(function(data) {
                  $rootScope.loading = false;
                  $rootScope.error = false;
              });

              var _scroll = Utilities.newScroll.horizontal('wrapperH');
              $scope.$on('onRepeatLast', function(scope, element, attrs) {
                  angular.forEach($scope.item.leagues, function(_item, _index) {
                      Utilities.newScroll.vertical($scope.wrapper.getName(_index));
                  });
              });

            }();

    }
]);
