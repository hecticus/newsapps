'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MtmCtrl
 * @description MtmCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('MtmCtrl', ['$http','$rootScope','$scope','$state','$localStorage','Domain','Utilities','$timeout',
        function($http, $rootScope, $scope, $state, $localStorage, Domain, Utilities,$timeout) {

            var _scroll = Utilities.newScroll.vertical('wrapper');
            var _scroll2 = Utilities.newScroll.vertical('wrapper2');
				    var _event = {first:0, last:0};

            $scope.interval = false;
            $scope.date = Utilities.moment().format('dddd Do YYYY');
            $scope.getTime = function (_date) {
                return Utilities.moment(_date).format('H:MM');
            };

            $scope.refreshEvents = function () {


              if ($http.pendingRequests.length == 0 && !$rootScope.loading) {

                  $rootScope.loading = true;
                  $http({method: 'GET', url: Domain.mtm(_event.first)}).then(function (obj) {

                    if (obj.data.error == 0) {

                      if ($scope.item.mtm.length == 0) {
                        $scope.item.mtm = obj.data.response;
                      } else {
                        angular.forEach(obj.data.response.actions[0].events, function(_event, _eIndex) {
                          $scope.item.mtm.actions[0].events.unshift(_event);
                        });
                      }

                      _event.first =  obj.data.response.actions[0].events[0].id_game_match_events;
                      $scope.item.match.home.goals = obj.data.response.home_team_goals;
                      $scope.item.match.away.goals = obj.data.response.away_team_goals;
                
                    }

                  }).finally(function(data) {
                      $rootScope.loading = false;
                      $rootScope.error = Utilities.error();
                  });

                }

                $timeout.cancel($scope.interval);
                $scope.interval = $timeout(function () {
                  $scope.refreshEvents();
                },50000);

            };

            $scope.showContentEvents = function (_league, _match) {

              $scope.item.mtm = [];
              $scope.item.league = _league;
              $scope.item.match = {
                home: {name:_match.homeTeam.name, goals:_match.home_team_goals},
                away: {name:_match.awayTeam.name, goals:_match.away_team_goals},
                status: _match.status
              };

              angular.element('#wrapper2').attr('class','page transition left');
              _scroll2.scrollTo(0,0,0);
              $scope.refreshEvents();

            };

            $scope.prevPageMtM = function () {
              $rootScope.loading = false;
              _event = {first:0, last:0};
              $timeout.cancel($scope.interval);
              $rootScope.prevPage();
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
