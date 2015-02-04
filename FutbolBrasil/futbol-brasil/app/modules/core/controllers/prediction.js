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

            var _this = this;
            _this.wrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            $scope.width = $window.innerWidth;
            $scope.widthTotal = ($window.innerWidth * 11);

            $scope.setBet = function (_tournament, _game, _status, _bet, _iLeague ,_iFixture, _iMatch) {

                var _jLeagues = $scope.item.leagues[_iLeague];
                var _jMatch = _jLeagues.fixtures[_iFixture].matches[_iMatch];

                if (_status == 0) {

                    if (_jMatch.bet) {

                        /*if (_jMatch.bet.client_bet == _bet) {
                         _jMatch.bet.client_bet = -1;
                         _jLeagues.client_bets = _jLeagues.client_bets - 1;
                         } else {

                         if (_jMatch.bet.client_bet == -1) {
                         _jLeagues.client_bets = _jLeagues.client_bets + 1;
                         }*/

                        _jMatch.bet.client_bet = _bet;

                        //}

                    } else {
                        _jMatch.bet = {client_bet:_bet};
                        if (_jLeagues.total_bets > _jLeagues.client_bets){
                            _jLeagues.client_bets = _jLeagues.client_bets + 1;
                        }
                    }
                }

                _jLeagues.fixtures[_iFixture].matches[_iMatch] = _jMatch;
                $scope.item.leagues[_iLeague] = _jLeagues;
            };

            $scope.saveBet = function (_iLeague, _tournament) {

                var _jBets = [];
                angular.forEach($scope.item.leagues[_iLeague].fixtures, function(_fixture) {
                    angular.forEach(_fixture.matches, function(_match) {
                        if (_match.bet) {
                            _jBets.push({
                                'id_tournament': _tournament,
                                'id_game_match': _match.id_game_matches,
                                'client_bet': _match.bet.client_bet
                            });
                        }
                    });
                });

                console.log(JSON.stringify({bets:_jBets}));

                $http.post(Domain.bets.create(), {bets:_jBets}).
                    success(function(data) {
                        alert('success');
                    }).
                    error(function (data) {
                        alert('error')
                    });

            };

            $scope.getDate = function (_date) {
                return Utilities.moment(_date).format('ll');
            };


            $scope.getTime = function (_date) {
                return Utilities.moment(_date).format('H:MM');
            };


            $scope.init = function(){
                $http({method: 'GET', url: Domain.bets.get()})
                    .then(function(obj) {
                        $scope.item =  obj.data.response;
                        //$scope.processDataBet();
                        $rootScope.$storage.bet = JSON.stringify($scope.item);
                        $scope.widthTotal = ($window.innerWidth * $scope.item.leagues.length);
                    })
                    .finally(function(data) {
                        $rootScope.loading = false;
                        $rootScope.error = false;
                    });

                var _scroll = Utilities.newScroll.horizontal('wrapperH');
                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    angular.forEach(_this.item.leagues, function(_item, _index) {
                        Utilities.newScroll.vertical(_this.wrapper.getName(_index));
                    });
                });

            }();

        }
    ]);
