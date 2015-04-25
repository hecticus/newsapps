'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PredictionCtrl
 * @description PredictionCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('PredictionCtrl',  ['$http', '$rootScope', '$scope', '$state', '$localStorage', '$translate',
        'Client', 'WebManager', '$window', 'Domain', 'Bets', 'Moment', 'iScroll', 'Competitions', 'Notification',
        function($http, $rootScope, $scope, $state, $localStorage, $translate, Client, WebManager, $window,
                 Domain, Bets, Moment, iScroll, Competitions, Notification) {

            var scroll = null;
            var vScrolls = [];
            var _currentPage = 0;
            var _Match = -1;
            var _mBet = -1;
            var strings = {};

            var width = $window.innerWidth;
            var widthTotal = $window.innerWidth;

            function getTranslations(){

              $translate(['ALERT.SET_BET.TITLE',
                          'ALERT.SET_BET.SUBTITLE',
                          'ALERT.SET_BET.MSG'])
              .then(function(translation){
                  strings['SET_BET_TITLE'] = translation['ALERT.SET_BET.TITLE'];
                  strings['SET_BET_SUBTITLE'] = translation['ALERT.SET_BET.SUBTITLE'];
                  strings['SET_BET_MSG'] = translation['ALERT.SET_BET.MSG'];
              });

            };

            $scope.vWrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            $scope.leagues = [];

            $scope.getWidth = function(){
                return { 'width': width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': widthTotal + 'px'}
            };

            $scope.nextPage = function(){
                scroll.next();
            };

            $scope.prevPage = function(){
                scroll.prev();
            };

            $scope.getDate = function (_date) {
                return Moment.date(_date).format('ll');
            };

            $scope.getTime = function (_date) {
                return Moment.date(_date).format('HH:mm');
            };

            $scope.setBet = function (_status, _bet, _iLeague ,_iFixture, _iMatch) {

                if (_status == 3) {

                    var _jLeagues = $scope.leagues[_iLeague];
                    var _jMatch = _jLeagues.fixtures[_iFixture].matches[_iMatch];

                    var dateMatch = moment(_jMatch.date,'YYYYMMDD hh:mm').format('YYYY-MM-DD');
                    var dateToday = moment().format('YYYY-MM-DD');

                    if (moment(dateToday).isBefore(dateMatch)) {
                      if (( _jMatch.id_game_matches != _Match) || (_bet != _mBet)) {
                        $scope.$emit('load');
                        if (_status == 3) {
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

                        var _jBet = {
                            'bet': {
                                'id_tournament': $scope.leagues[_iLeague].id_competitions,
                                'id_game_match': _jMatch.id_game_matches,
                                'client_bet': _jMatch.bet.client_bet
                            }
                        };

                        Bets.create(_jBet,function() {
                            $scope.$emit('unload');
                        }, function () {
                            $scope.$emit('unload');
                            //$scope.$emit('error');
                        });

                        _Match = _jMatch.id_game_matches;
                        _mBet = _bet;
                      }
                    } else {
                      Notification.showInfoAlert({
                          title: strings['SET_BET_TITLE'],
                          subtitle: strings['SET_BET_SUBTITLE'],
                          message: strings['SET_BET_MSG'],
                          type: 'warning'
                      });
                    }
                }
            };

            function mapEmptyTeamNames(fixtures){
                fixtures.forEach(function(fixture){
                    fixture.matches.map(function(match){
                        if(!match.home_team.name)
                            match.home_team.name = $scope.strings.NOT_AVAILABLE;
                        if(!match.away_team.name)
                            match.away_team.name = $scope.strings.NOT_AVAILABLE;
                    });
                });
            }

            function setEmptyLeagueFlag(league){
                if(league.fixtures.length > 0){
                    var leagueReduce = league.fixtures.reduce(function(previousValue, currentValue, index) {
                        if(index > 1){
                            return previousValue + currentValue.matches.length;
                        }else{
                            return previousValue.matches.length + currentValue.matches.length;
                        }
                    });
                    league.empty = leagueReduce <= 0;
                } else {
                    league.empty = true;
                }
            }

            function getBets(){
                var _index =  scroll.currentPage.pageX;
                var league = $scope.leagues[_index];
                if (!league.fixtures) {
                    $scope.$emit('load');
                    Bets.get(league.id_competitions, function(data){
                        if (data.error == 0) {
                            data = data.response;
                            mapEmptyTeamNames(data.fixtures);
                            league.fixtures = data.fixtures;
                            league.bet = {
                                total_bets: data.total_bets,
                                client_bets : data.client_bets
                            };
                            console.log('league: ');
                            console.log(league);
                            setEmptyLeagueFlag(league);
                        }
                        $scope.$emit('unload');
                    }, function(){
                        $scope.$emit('unload');
                        //$scope.$emit('error');
                    });
                }
            }

            function setUpIScroll() {
                scroll = iScroll.horizontal('wrapperH');

                scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });

                scroll.on('scrollStart', function () {
                    _currentPage = this.currentPage.pageX;
                });

                scroll.on('scroll', function () {
                    if (this.currentPage.pageX != _currentPage) {
                        getBets();
                        _currentPage = this.currentPage.pageX;
                    }
                });

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    vScrolls[_currentPage] = iScroll.vertical($scope.vWrapper.getName(_currentPage));
                    $scope.$emit('unload');
                });

                $scope.$on('$destroy', function() {
                    scroll.destroy();
                    scroll = null;

                    vScrolls.forEach(function(scroll){
                        scroll.destroy();
                        scroll = null;
                    });
                });
            }

            function getCompetitions(){
                Competitions.get().then(function(data){
                    $scope.leagues  = data;
                    widthTotal = ($window.innerWidth * $scope.leagues.length);
                    setUpIScroll();
                    getBets();
                });
            }

            function init(){
                $scope.$emit('load');
                getTranslations();
                getCompetitions();
            } init();

        }
    ]);
