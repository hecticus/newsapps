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
            'Client', 'WebManager', '$window', 'Domain', 'Bets', 'Moment', 'iScroll', 'Competitions',
            function($http, $rootScope, $scope, $state, $localStorage, Client, WebManager, $window,
                     Domain, Bets, Moment, iScroll, Competitions) {

            var config = WebManager.getFavoritesConfig($rootScope.isFavoritesFilterActive());

            $scope.vWrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            var _currentPage = 0;
            var _Match = -1;
            var _mBet = -1;

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

                if (_status == 0) {
                  var _jLeagues = $scope.leagues[_iLeague];
                  var _jMatch = _jLeagues.fixtures[_iFixture].matches[_iMatch];

                  if (( _jMatch.id_game_matches != _Match) || (_bet != _mBet)) {
                      $scope.$emit('load');
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

                      _Match = _jMatch.id_game_matches;
                      _mBet = _bet;
                  }
                }
            };

            $scope.getBets = function(){

                var _index =  $scope.scroll.currentPage.pageX;

                if (!$scope.leagues[_index].fixtures) {

                  $scope.$emit('load');

                  Bets.get($scope.leagues[_index].id_competitions,function(data){

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

                    $scope.$emit('unload');

                  }, function(){
                      //$scope.$emit('error');
                  });

                }

            };

            $scope.setScroll = function() {

                $scope.scroll = iScroll.horizontal('wrapperH');

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
                Competitions.get().then(function(data){
                  $scope.leagues  = data;
                  $scope.widthTotal = ($window.innerWidth * $scope.leagues.length);
                  $scope.setScroll();
                  $scope.getBets();
                });
                $scope.$emit('unload');
            }();

            $scope.$on('onRepeatLast', function(scope, element, attrs) {
              iScroll.vertical($scope.vWrapper.getName(_currentPage));
            });


    }
]);
