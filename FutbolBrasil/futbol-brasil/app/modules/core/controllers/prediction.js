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
        '$window', 'Domain', 'Moment', 'iScroll', 'Bets',
        function($http, $rootScope, $scope, $state, $localStorage, $window, Domain,Moment,
                 iScroll, Bets) {

            $scope.vWrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            var _currentPage = 0;

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
                return Moment.date(_date).format('ll');
            };

            $scope.getTime = function (_date) {
                return Moment.date(_date).format('H:MM');
            };

            $scope.setBet = function (_status, _bet, _iLeague ,_iFixture, _iMatch) {

                $scope.$emit('load');
                var _jLeagues = $scope.leagues[_iLeague];
                var _jMatch = _jLeagues.fixtures[_iFixture].matches[_iMatch];

                if (_status == 0) {
                    if (_jMatch.bet) {
                        _jMatch.bet.client_bet = _bet;
                    } else {
                        _jMatch.bet = {client_bet: _bet};
                        if (_jLeagues.bet.total_bets > _jLeagues.bet.client_bets){
                            _jLeagues.bet.client_bets = _jLeagues.bet.client_bets + 1;
                        }
                    }
                }

                _jLeagues.fixtures[_iFixture].matches[_iMatch] = _jMatch;
                $scope.leagues[_iLeague] = _jLeagues;

                var _jBet = {"bet": {
                  'id_tournament': $scope.leagues[_iLeague].id_competitions,
                  'id_game_match': _jMatch.id_game_matches,
                  'client_bet': _jMatch.bet.client_bet}
                };

                Bets.create(_jBet,function() {
                    $scope.$emit('unload');
                }, function () {
                    //$scope.$emit('error');
                });

            };


            $scope.getBets = function(){

                var _index =  $scope.scroll.currentPage.pageX;

                if (!$scope.leagues[_index].fixtures) {

                  $scope.$emit('load');
                  $http.get(Domain.bets.get($scope.leagues[_index].id_competitions), config)
                  .success(function (data, status, headers, config) {
                      if (data.error == 0) {

                        data = data.response;
                        data.fixtures.forEach(function(fixture){
                            fixture.matches.map(function(match){
                                if(!match.home_team.name)
                                  match.home_team.name = $scope.strings.NOT_AVAILABLE;
                                if(!match.away_team.name)
                                  match.away_team.name = $scope.strings.NOT_AVAILABLE;
                            });
                        });

                        $scope.leagues[_index].fixtures = data.fixtures;
                        $scope.leagues[_index].bet = {total_bets: data.total_bets, client_bets : data.client_bets}
                      }
                  }).catch(function () {
                      //$scope.$emit('error');
                  }).finally(function(data) {
                      $scope.$emit('unload');
                  });

                }

            };

            $scope.setScroll = function() {

                $scope.scroll = new IScroll('#' + 'wrapperH', {
                                                    scrollX: true,
                                                    scrollY: false,
                                                    mouseWheel: false,
                                                    momentum: false,
                                                    snap: true,
                                                    snapSpeed: 700,
                                                    probeType: 3,
                                                    bounce: false,
                                                    click: true
                                                });

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    angular.forEach($scope.leagues, function(_item, _index) {
                        iScroll.vertical($scope.vWrapper.getName(_index));
                    });
                });

                $scope.nextPage = function(){
                     $scope.scroll.next();
                };

                $scope.prevPage = function(){
                     $scope.scroll.prev();
                };

                 $scope.scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });

                 $scope.scroll.on('scrollStart', function () {
                    _currentPage = this.currentPage.pageX;
                });

                 $scope.scroll.on('scroll', function () {
                    if (this.currentPage.pageX != _currentPage) {
                         $scope.getBets();
                        _currentPage = this.currentPage.pageX;
                    }
                });

            };

            $scope.init = function(){

                $scope.$emit('load');
                $http.get(Domain.competitions, config)
                .success(function (data, status, headers, config) {

                    if (data.error == 0) {

                        $scope.leagues  = data.response.competitions;
                        $scope.widthTotal = ($window.innerWidth * $scope.leagues.length);
                        $scope.setScroll();
                        $scope.getBets();

                    }

                }).catch(function () {
                    $scope.$emit('error');
                }).finally(function(data) {
                    $scope.$emit('unload');
                });

            }();

    }
]);
