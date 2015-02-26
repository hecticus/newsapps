'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LeaderboardCtrl
 * @description LeaderboardCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('LeaderboardCtrl', ['$http','$rootScope','$scope','$state','$localStorage', '$window', 'WebManager', 'Domain','Utilities',
        function($http, $rootScope, $scope, $state, $localStorage, $window, WebManager, Domain, Utilities) {

          var config = WebManager.getFavoritesConfig($scope.isFavoritesFilterActive());
          var _currentPage = 0;

          $rootScope.$storage.leaderboard = false;
          $scope.active = 'competition';

          $scope.setActive = function(type) {
              $scope.active = type;
          };

          $scope.isActive = function(type) {
              return type === $scope.active;
          };


          $scope.strings = {
            PLAYER_NAME_LABEL: '##',
            TEAM_LABEL: 'Jugador',
            GOALS_LABEL: 'Puntos'
          };

          $scope.wrapper = {
              name:'wrapperV',
              getName : function(_index) {
                  return this.name + _index;
              }
          };

          $scope.width = $window.innerWidth;
          //$scope.widthTotal = ($window.innerWidth * 5);

          $scope.getWidth = function(){
              return { 'width': $scope.width + 'px'}
          };

          $scope.getTotalWidth = function(){
              return { 'width': $scope.widthTotal + 'px'}
          };


          $scope.init = function(){

            $scope.$emit('load');

            $http.get(Domain.competitions, config)
            .success(function (data, status, headers, config) {
                if (data.error == 0) {

                 $scope.item.competitions =  data.response.competitions;
                 $scope.widthTotal = ($window.innerWidth * $scope.item.competitions.length);

                 angular.forEach($scope.item.competitions, function(_event, _index) {
                     $http.get(Domain.phases($scope.item.competitions[_index].id_competitions), config)
                      .success(function (data, status, headers, config) {
                           if (data.error == 0) {
                            $scope.item.competitions[_index].phase = data.response.phases[data.response.phases.length-1].id_phases
                            $scope.getCompetition();
                           }
                      }).catch(function () {
                          $scope.$emit('error');
                      }).finally(function(data) {
                          $scope.$emit('unload');
                      });
                 });

                }

            }).catch(function () {
                $scope.$emit('error');
            }).finally(function(data) {
                $scope.$emit('unload');
            });

            $scope.item = JSON.parse($rootScope.$storage.scorers);
            var _scroll = Utilities.newScroll.horizontal('wrapperH');
            $scope.$on('onRepeatLast', function(scope, element, attrs) {
                angular.forEach($scope.item.competitions, function(_item, _index) {
                    Utilities.newScroll.vertical($scope.wrapper.getName(_index));
                });
            });

            $scope.nextPage = function(){
                _scroll.next();
            };

            $scope.prevPage = function(){
                _scroll.prev();
            };

            _scroll.on('beforeScrollStart', function () {
                this.refresh();
            });

            _scroll.on('scrollStart', function () {
                _currentPage = this.currentPage.pageX;
            });

            _scroll.on('scroll', function () {
                if (this.currentPage.pageX != _currentPage) {
                  var _variable = $scope.item.competitions[this.currentPage.pageX].leaderboard;
                  if ((!_variable) || (_variable == '')) $scope.getCompetition(this.currentPage.pageX);
                  _currentPage = this.currentPage.pageX;
                }
            });

            $scope.getLeaderboardIndex = function(_url){

               var _page = _scroll.currentPage.pageX;
               $scope.$emit('load');
               $scope.item.competitions[_page].leaderboard = [];
               $http.get(_url, config)
               .success(function (data, status, headers, config) {
                    if (data.error == 0) {

                      angular.forEach(data.response.leaderboard, function(_item, _index) {
                        data.response.leaderboard[_index].index = (_index+1)
                      });

                      $scope.item.competitions[_page].leaderboard = data.response.leaderboard;
                      $scope.item.competitions[_page].client = data.response.client;

                      // Esta condición se debe ajustar a partir de un parametro de configuración
                      if (data.response.leaderboard.length >= data.response.leaderboard.length) {
                        $scope.item.competitions[_page].leaderboard.push({client:'...',score:'...', index: '...'});
                        $scope.item.competitions[_page].leaderboard.push(data.response.client)
                      }

                    }
               }).catch(function () {
                   $scope.$emit('error');
               }).finally(function(data) {
                   $scope.$emit('unload');
               });


            }

            $scope.getPhase = function(){
               //console.log(Domain.leaderboard.phase($scope.item.competitions[_scroll.currentPage.pageX].id_competitions,$scope.item.competitions[_index].phase));
               $scope.setActive('phase');
               $scope.getLeaderboardIndex(Domain.leaderboard.phase($scope.item.competitions[_scroll.currentPage.pageX].id_competitions,$scope.item.competitions[_index].phase));
            };

            $scope.getCompetition = function(){
              //console.log(Domain.leaderboard.competition($scope.item.competitions[_scroll.currentPage.pageX].id_competitions));
              $scope.setActive('competition');
              $scope.getLeaderboardIndex(Domain.leaderboard.competition($scope.item.competitions[_scroll.currentPage.pageX].id_competitions));
            };

          }();

        }
    ]);
