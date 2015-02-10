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
            $scope.widthTotal = $window.innerWidth;

            $scope.getWidth = function(){
                return { 'width': $scope.width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': $scope.widthTotal + 'px'}
            };

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
                $scope.$emit('load');
                var _jBets = [];
                angular.forEach($scope.item.leagues[_iLeague].fixtures, function (_fixture) {
                    angular.forEach(_fixture.matches, function (_match) {
                        if (_match.bet) {
                            _jBets.push({
                                'id_tournament': _tournament,
                                'id_game_match': _match.id_game_matches,
                                'client_bet': _match.bet.client_bet
                            });
                        }
                    });
                });

                $http.post(Domain.bets.create(), {bets:_jBets}).
                    success(function(data) {
                        alert('success');
                        $scope.$emit('unload');
                    })
                    .catch(function () {
                        alert('error');
                        $scope.$emit('error');
                    });
            };

            $scope.getDate = function (_date) {
                return Utilities.moment(_date).format('ll');
            };


            $scope.getTime = function (_date) {
                return Utilities.moment(_date).format('H:MM');
            };


            $scope.init = function(){
                $scope.$emit('load');
                $http.get(Domain.bets.get())
                    .success(function (data, status, headers, config) {
                        $scope.item = data.response;
                        $rootScope.$storage.bet = JSON.stringify($scope.item);
                        $scope.widthTotal = ($window.innerWidth * $scope.item.leagues.length);
                    }).catch(function () {
                        $scope.$emit('error');
                    }).finally(function(data) {
                        $scope.$emit('unload');
                    });

                var _scroll = Utilities.newScroll.horizontal('wrapperH');
                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    angular.forEach($scope.item.leagues, function(_item, _index) {
                        Utilities.newScroll.vertical($scope.wrapper.getName(_index));
                    });
                });

                $scope.nextPage = function(){
                    _scroll.next();
                };

                $scope.prevPage = function(){
                    _scroll.prev();
                };

            }();

        }
    ]);
