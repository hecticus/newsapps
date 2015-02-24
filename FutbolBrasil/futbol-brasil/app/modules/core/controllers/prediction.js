'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PredictionCtrl
 * @description PredictionCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('PredictionCtrl',  ['$http', '$rootScope', '$scope', '$state', '$localStorage',
        '$window', 'Domain','Utilities', 'Bets',
        function($http, $rootScope, $scope, $state, $localStorage, $window, Domain, Utilities, Bets) {
            $scope.vWrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };
            $scope.hScroll = null;
            $scope.width = $window.innerWidth;
            $scope.widthTotal = $window.innerWidth;

            $scope.leagues = [];

            $scope.getWidth = function(){
                return { 'width': $scope.width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': $scope.widthTotal + 'px'}
            };

            $scope.getDate = function (_date) {
                return Utilities.moment(_date).format('ll');
            };

            $scope.getTime = function (_date) {
                return Utilities.moment(_date).format('H:MM');
            };

            $scope.setBet = function (_status, _bet, _iLeague ,_iFixture, _iMatch) {
                console.log('setBet.');
                //match.status.id_status, 0, $parent.$parent.$index, $parent.$index, $index
                var _jLeagues = $scope.leagues[_iLeague];
                var _jMatch = _jLeagues.fixtures[_iFixture].matches[_iMatch];
                if (_status == 0) {
                    if (_jMatch.bet) {
                        _jMatch.bet.client_bet = _bet;
                    } else {
                        _jMatch.bet = {client_bet:_bet};
                        if (_jLeagues.total_bets > _jLeagues.client_bets){
                            _jLeagues.client_bets = _jLeagues.client_bets + 1;
                        }
                    }
                }
                _jLeagues.fixtures[_iFixture].matches[_iMatch] = _jMatch;
                $scope.leagues[_iLeague] = _jLeagues;
            };

            $scope.saveBet = function (_iLeague, _tournament) {
                $scope.$emit('load');
                var _jBets = [];
                angular.forEach($scope.leagues[_iLeague].fixtures, function (_fixture) {
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

                Bets.create({bets:_jBets},function() {
                    $scope.$emit('unload');
                }, function () {
                    $scope.$emit('error');
                });
            };

            $scope.getBets = function(){
                $scope.$emit('load');
                Bets.get(function(data){
//                    $scope.leagues = data.splice(0, 3);
                    $scope.leagues = data;
                    console.log(data);
                    $scope.widthTotal = ($window.innerWidth * $scope.leagues.length);
                    $scope.$emit('unload');
                }, function(){
                    $scope.$emit('error');
                });

            };

            $scope.setUpIScroll = function(){
                $scope.hSroll = Utilities.newScroll.horizontal('wrapperH');
                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    angular.forEach($scope.leagues, function(_item, _index) {
                        Utilities.newScroll.vertical($scope.vWrapper.getName(_index));
                    });
                });
                $scope.nextPage = function(_index){
//                    console.log('nextPage. index: ' + _index);
                    $scope.hSroll.next();
//                    angular.element($scope.vWrapper.getName(_index)).attr('class', ' hide');
//                    angular.element($scope.vWrapper.getName(_index + 1)).attr('class', ' page transition right');
                };

                $scope.prevPage = function(_index){
//                    console.log('prevPage. index: ' + _index);
                    $scope.hSroll.prev();
//                    angular.element($scope.vWrapper.getName(_index)).attr('class', ' page transition right');
//                    angular.element($scope.vWrapper.getName(_index -1)).attr('class', ' page transition left');
                };
            };

            $scope.init = function(){
                $scope.$emit('load');
                $scope.setUpIScroll();
                $scope.getBets();
            }();

    }
]);
