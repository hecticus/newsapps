'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MtmCtrl
 * @description MtmCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('MtmCtrl', ['$http','$rootScope','$scope','$state','$localStorage','WebManager', 'Domain',
        'Moment', 'iScroll', '$timeout',
        function($http, $rootScope, $scope, $state, $localStorage, WebManager, Domain, Moment, iScroll, $timeout) {

            var _scroll = iScroll.vertical('wrapper');
            var _scroll2 = iScroll.vertical('wrapper2');
            var _event = {
                first: 0,
                last: 0,
                reset: function() {
                    _event.first = 0;
                    _event.last = 0;
                }
            };

            $scope.hasGamesForToday = true;

            $scope.refreshIconClass = '';

            $scope.interval = false;
            $scope.date = Moment.date().format('dddd Do YYYY');
            $scope.getTime = function (_date) {
                return Moment.date(_date).format('H:MM');
            };

            $scope.refreshEvents = function () {
                $scope.refreshIconClass = ' icon-refresh-animate';
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $scope.$emit('load');
                    var config = WebManager.getFavoritesConfig($rootScope.isFavoritesFilterActive());

                    //TODO check request cableado, no se valida que venga vacio data.response
                    $http.get(Domain.mtm(16, 3321, _event.first), config).then(
                        function (data) {
                            data = data.data;
                            console.log(data);
                            if (data.error === 0) {
                                if ($scope.item.mtm.length == 0) {
                                    $scope.item.mtm = data.response;
                                } else {
                                    angular.forEach(data.response.actions[0].events, function(_event, _eIndex) {
                                        $scope.item.mtm.actions[0].events.unshift(_event);
                                    });
                                }
                                _event.first = data.response.actions[0].events[0].id_game_match_events;
                                $scope.item.match.home.goals = data.response.home_team_goals;
                                $scope.item.match.away.goals = data.response.away_team_goals;
                            }
                            $scope.$emit('unload');
                            $scope.refreshIconClass = '';
                        }, function () {
                            $scope.refreshIconClass = '';
                            $scope.$emit('unload');
                            $scope.$emit('error');
                        }
                    );
                }

                $timeout.cancel($scope.interval);
                $scope.interval = $timeout(function () {
                    $scope.refreshEvents();
                },50000);

            };

            $scope.showContentEvents = function (_league, _match) {
                _event.reset();
                $scope.item.mtm = [];
                $scope.item.league = _league;
                $scope.item.match = {
                    home: {name:_match.homeTeam.name, goals:_match.home_team_goals},
                    away: {name:_match.awayTeam.name, goals:_match.away_team_goals},
                    status: _match.status
                };

                $rootScope.transitionPageBack('#wrapper2','left');
                _scroll2.scrollTo(0,0,0);
                $scope.refreshEvents();

            };

            $scope.mapLeagues = function(leagues){
                leagues.forEach(function(league){
                    league.fixtures.map(function(match){
                        if(!match.awayTeam.name){
                            match.awayTeam.name = $scope.strings.NOT_AVAILABLE;
                        }
                        if(!match.homeTeam.name){
                            match.homeTeam.name = $scope.strings.NOT_AVAILABLE;
                        }
                        match.status = 'MATCH.STATUS.' + match.id_status;
                    });
                });
            };

            $scope.init = function(){
                $scope.$emit('load');
                var date = Moment.date().format('YYYYMMDD');
//                date = "20150222";

                var config = WebManager.getFavoritesConfig($rootScope.isFavoritesFilterActive());
                config.params.pageSize = 100;
                config.params.page = 0;

                $http.get(Domain.match(date), config).then(
                    function (data) {
                        data = data.data;
                        console.log(data.response);
                        if(data.response && data.response.leagues.length == 0){
                            $scope.hasGamesForToday = false;
                            console.log('No info on response');
                        } else {
                            $scope.mapLeagues(data.response.leagues);
                            $scope.hasGamesForToday = true;
                            $scope.item = data.response;
                        }
                        $scope.$emit('unload');
                    }, function (data) {
                        $scope.$emit('unload');
                        console.log(data);
                        $scope.$emit('error');
                    }
                );
            }();
        }
    ]);
