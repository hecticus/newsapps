'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MtmCtrl
 * @description MtmCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('MtmCtrl', ['$http','$rootScope','$scope','$state','$localStorage','WebManager', 'Domain','Utilities','$timeout',
        function($http, $rootScope, $scope, $state, $localStorage, WebManager, Domain, Utilities,$timeout) {

            var _scroll = Utilities.newScroll.vertical('wrapper');
            var _scroll2 = Utilities.newScroll.vertical('wrapper2');
            var _event = {first:0, last:0, reset: function() {
                _event.first = 0;
                _event.last = 0;
            }};

            $scope.hasGamesForToday = true;

            $scope.interval = false;
            $scope.date = Utilities.moment().format('dddd Do YYYY');
            $scope.getTime = function (_date) {
                return Utilities.moment(_date).format('H:MM');
            };

            $scope.refreshEvents = function () {
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $scope.$emit('load');
                    var config = WebManager.getFavoritesConfig($scope.isFavoritesFilterActive());

                    //TODO check request cableado, no se valida que venga vacio data.response
                    $http.get(Domain.mtm(5,390,_event.first), config).success(function (data, status) {
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
                    }).catch(function () {
                        $scope.$emit('error');
                    }).finally(function(data) {
                        $scope.$emit('unload');
                        $rootScope.error = Utilities.error();
                    });

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

            $scope.prevPageMtM = function () {
                $rootScope.loading = false;
                _event = {first:0, last:0};
                $timeout.cancel($scope.interval);
                $rootScope.prevPage();
            };

            $scope.getTeamName = function(team){
                return team && team.name !== ''? team.name : 'Name Not Available';
            };

            $scope.init = function(){
                $scope.$emit('load');
                var date = Utilities.moment().format('YYYYMMDD');
//                date = "20150222";
                var config = WebManager.getFavoritesConfig($scope.isFavoritesFilterActive());
                config.params.pageSize = 100;
                config.params.page = 0;
                $http.get(Domain.match(date), config)
                    .success(function (data, status) {
//                        console.log(data);
                        if(data.response && data.response.leagues.length == 0){
                            $scope.hasGamesForToday = false;
                            console.log('No info on response');
                        } else {
                            $scope.hasGamesForToday = true;
                            $scope.item = data.response;
                        }
                        $scope.$emit('unload');
                    }).error(function (data) {
                        console.log(data);
                        $scope.$emit('error');
//                        $rootScope.error = Utilities.error();
                    });
            }();
        }
    ]);
