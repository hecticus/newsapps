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

                if ($scope.item.leagues[_iLeague].fixtures[_iFixture].matches[_iMatch].bet) {
                  $scope.item.leagues[_iLeague].fixtures[_iFixture].matches[_iMatch].bet.client_bet = _bet;
                } else {
                  $scope.item.leagues[_iLeague].fixtures[_iFixture].matches[_iMatch].bet = {client_bet:_bet};
                  if ($scope.item.leagues[_iLeague].bet.matches > $scope.item.leagues[_iLeague].bet.bets){
                    $scope.item.leagues[_iLeague].bet.bets = $scope.item.leagues[_iLeague].bet.bets + 1;
                  }
                }

                $rootScope.$storage.bet = JSON.stringify($scope.item);

            };


            $scope.saveBet = function () {

              var _jBets = [];

              angular.forEach($scope.item.leagues, function(_league, _lIndex) {
                angular.forEach(_league.fixtures, function(_fixture) {
                  angular.forEach(_fixture.matches, function(_match) {

                    if (_match.bet) {
                      _jBets.push({
                                  'id_tournament': _league.id_competitions,
                                  'id_game_match': _match.id_game_matches,
                                  'client_bet': _match.bet.client_bet
                                  });
                    }

                  });
                });
              });

              console.log(JSON.stringify({bets:_jBets}));
              alert('ready!');
              /*$http.post(Domain.bets.create(), {bets:_jBets}).
              success(function(data) {
                alert(JSON.stringify({bets:_jBets}));
              }).
              error(function (data) {
                alert('error')
              });*/

            };

            $scope.getTime = function (_date) {
                return Utilities.moment(_date).format('H:MM');
            };

            $scope.processDataBet = function(){
              angular.forEach($scope.item.leagues, function(_league, _lIndex) {
                var _jLeague = {matches:0, bets: 0};
                angular.forEach(_league.fixtures, function(_fixture) {
                  _jLeague.matches = _jLeague.matches + _fixture.matches.length;
                  angular.forEach(_fixture.matches, function(_match) {
                    if (_match.bet) _jLeague.bets = _jLeague.bets + 1;
                  });
                });
                $scope.item.leagues[_lIndex].bet = _jLeague;
              });
            };

            $scope.init = function(){
              if ($rootScope.$storage.bet) {

                $scope.item = JSON.parse($rootScope.$storage.bet);
                $scope.processDataBet();
                $rootScope.loading = false;

              } else {

                $http({method: 'GET', url: Domain.bets.get()})
                .then(function(obj) {

                  $scope.item =  obj.data.response;
                  $scope.processDataBet();
                  $rootScope.$storage.bet = JSON.stringify($scope.item);

                })
                .finally(function(data) {
                    $rootScope.loading = false;
                    $rootScope.error = false;
                });

              }


              var _scroll = Utilities.newScroll.horizontal('wrapperH');
              $scope.$on('onRepeatLast', function(scope, element, attrs) {
                  angular.forEach($scope.item.leagues, function(_item, _index) {
                      Utilities.newScroll.vertical($scope.wrapper.getName(_index));
                  });
              });

            }();

    }
]);
