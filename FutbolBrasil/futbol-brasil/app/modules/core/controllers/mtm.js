'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MtmCtrl
 * @description MtmCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('MtmCtrl', ['$http','$rootScope','$scope','$state','$localStorage','Domain','Utilities',
        function($http, $rootScope, $scope, $state, $localStorage, Domain, Utilities) {

            var _scroll = Utilities.newScroll.vertical('wrapper');
            var _scroll2 = Utilities.newScroll.vertical('wrapper2');

            $scope.date = Utilities.moment().format('dddd Do YYYY');

            $scope.getTime = function (_date) {
                return Utilities.moment(_date).format('H:MM');
            };

            $scope.refreshEvents = function () {
                $rootScope.loading = true;
                $http({method: 'GET', url: Domain.mtm()}).then(function (obj) {
                    $scope.item.mtm = obj.data.response;
                    $scope.item.match = {
                        home: {name: obj.data.response.home_team.name, goals: obj.data.response.home_team_goals},
                        away: {name: obj.data.response.away_team.name, goals: obj.data.response.away_team_goals}
                    };
                }).finally(function (data) {
                    $rootScope.loading = false;
                    $rootScope.error = Utilities.error();
                });
            };

            $scope.showContentEvents = function (_league, _match) {
                $scope.item.mtm = [];

                $scope.item.league = _league;
                $scope.item.match = {
                    home: {name: _match.homeTeam.name, goals: _match.home_team_goals},
                    away: {name: _match.awayTeam.name, goals: _match.away_team_goals}
                };

                angular.element('#wrapper2').attr('class', 'page transition left');
                _scroll2.scrollTo(0, 0, 0);

                $rootScope.loading = true;
                $http({method: 'GET', url: Domain.mtm()}).then(function (obj) {
                    $scope.item.mtm = obj.data.response;
                }).finally(function (data) {
                    $rootScope.loading = false;
                    $rootScope.error = Utilities.error();
                });
            };

            $scope.hasHomeWinnerClass = function (match) {
                if(match) {
                    return (match.home_team_goals >= match.away_team_goals);
                } else {
                    return false;
                }
            };

            $scope.hasAwayWinnerClass = function (match) {
                if(match) {
                    return (match.home_team_goals <= match.away_team_goals);
                } else {
                    return false;
                }
            };

            $scope.getMatchStatusClass = function(match){
                if(match.status == 'Encerrado') {
                    return 'encerrado';
                }else if(match.status == 'Default'){
                    return 'default';
                } else {
                    //TODO WTF?!
                    return 'else';
                }
            };

            $scope.getPeriodClass = function(period){
                if(period.short_name == 'PT') {
                    return 'pt';
                } else if(period.short_name == 'ST'){
                    return 'st';
                }
            };

            $scope.init = function(){
                $http({method: 'GET', url: Domain.match(Utilities.moment().format('YYYYMMDD'), 100, 0)})
                    .then(function (obj) {
                        $scope.item = obj.data.response;
                    }).finally(function (data) {
                        $rootScope.loading = false;
                        $rootScope.error = Utilities.error();
                    });
            }();
        }
    ]);
