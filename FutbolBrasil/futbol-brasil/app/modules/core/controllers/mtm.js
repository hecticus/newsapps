'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MtmCtrl
 * @description MtmCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('MtmCtrl', ['$http','$rootScope','$scope','$state','$localStorage', '$interval', 'WebManager',
        'Domain', 'Moment', 'iScroll', 'Notification',
        function($http, $rootScope, $scope, $state, $localStorage, $interval, WebManager,
                 Domain, Moment, iScroll, Notification) {

            var refreshInterval = null;
            var listScroll = null;
            var matchScroll = null;
            var _event = {
                first: 0,
                last: 0,
                reset: function() {
                    _event.first = 0;
                    _event.last = 0;
                }
            };

            $scope.item = {};
            $scope.item.mtm = [];
            $scope.item.mtm.actions = [];

            $scope.hasGamesForToday = true;

            $scope.refreshIconClass = '';

            $scope.interval = false;
            $scope.competitionId = 0;
            $scope.matchId = 0;


            $scope.date = Moment.date().format('dddd Do YYYY');

            $scope.getTime = function (_date) {
                return Moment.date(_date).format('HH:mm');
            };

            function refreshSuccess(data){
                console.log('$scope.item: ');
                console.log($scope.item);
                data = data.data;
                var response = data.response;
                if (data.error === 0) {
                    if (!!$scope.item.mtm && $scope.item.mtm.length == 0) {
                        $scope.item.mtm = response;
                    } else {
                        response.actions[0].events.forEach(function(_event) {
                            $scope.item.mtm.actions[0].events.unshift(_event);
                        });
                    }
                    _event.first = response.actions[0].events[0].id_game_match_events;
                    $scope.item.match.home.goals = response.home_team_goals;
                    $scope.item.match.away.goals = response.away_team_goals;
                }
                $scope.$emit('unload');
                $scope.refreshIconClass = '';
            }

            function refreshError(){
                $scope.refreshIconClass = '';
                $scope.$emit('unload');
                Notification.showNetworkErrorAlert();
            }

            $scope.refreshEvents = function (competitionId, matchId) {

                $scope.refreshIconClass = ' icon-refresh-animate';
                //if ($http.pendingRequests.length === 0) {
                    $scope.$emit('load');
                    var config = WebManager.getFavoritesConfig($rootScope.isFavoritesFilterActive());

                    $http.get(Domain.mtm(competitionId, matchId, _event.first), config)
                        .then(refreshSuccess, refreshError);

                   if (angular.element('#wrapperM').hasClass('left')) {
                     refreshInterval = $interval(function () {
                         //console.log('$interval refreshEvents triggered.');
                         $scope.refreshEvents(competitionId, matchId);
                     },50000);
                   };

               // }
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
                matchScroll.scrollTo(0,0,0);

                //TODO check request cableado
                var competitionId = _league.id_competitions;
                competitionId = 16;
                var matchId = _match.id_game_matches;
                matchId = 3321;
                $scope.competitionId = competitionId;
                $scope.matchId = matchId;

                $scope.refreshEvents(competitionId, matchId);

            };

            function mapLeagues(leagues){
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
            }

            function getMatchesForToday(){
                var date = Moment.date().format('YYYYMMDD');

                var config = WebManager.getFavoritesConfig($rootScope.isFavoritesFilterActive());
                config.params.pageSize = 100;
                config.params.page = 0;

                $http.get(Domain.match(date), config).then(
                    function (data) {
                        var response = data.data.response;
                        if(response && response.leagues.length > 0){
                            $scope.hasGamesForToday = true;
                            mapLeagues(response.leagues);
                            $scope.item = response;
                        } else {
                            $scope.hasGamesForToday = false;
                            console.log('No info on response');
                        }
                        $scope.$emit('unload');
                    }, function () {
                        $scope.hasGamesForToday = false;
                        Notification.showNetworkErrorAlert();
                        $scope.$emit('unload');
                    }
                );
            }

            function setUpIScroll(){
                listScroll = iScroll.vertical('wrapper');
                matchScroll = iScroll.vertical('wrapper2');

                $scope.$on('$destroy', function() {
                    listScroll.destroy();
                    listScroll = null;

                    matchScroll.destroy();
                    matchScroll = null;
                });
            }

            function init(){

                $scope.$emit('load');
                setUpIScroll();
                getMatchesForToday();

                $scope.$on('$destroy', function() {
                    $interval.cancel(refreshInterval);
                    refreshInterval = undefined;
                });

            } init();
        }
    ]);
