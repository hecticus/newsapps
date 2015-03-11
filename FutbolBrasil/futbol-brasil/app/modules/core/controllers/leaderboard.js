'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LeaderboardCtrl
 * @description LeaderboardCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('LeaderboardCtrl', ['$http','$rootScope','$scope','$state','$localStorage', '$window',
        'Client', 'WebManager', 'Domain', 'FacebookManager', 'iScroll', 'Competitions',
        function($http, $rootScope, $scope, $state, $localStorage, $window, Client, WebManager, Domain
            , FacebookManager, iScroll, Competitions) {

            var config = WebManager.getFavoritesConfig($scope.isFavoritesFilterActive());

            var _currentPage = 0;
            $scope.item = {};
            $scope.hasFriends = true;

            $rootScope.$storage.leaderboard = false;
            $scope.friendsMode = false;
            $scope.active = 'competition';

            $scope.setActive = function(type) {
                $scope.active = type;
            };

            $scope.isActive = function(type) {
                return type === $scope.active;
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
                if($state.current.data.contentClass === 'content-friends'){
                    $scope.friendsMode = true;
                    if(!!$window.facebookConnectPlugin){
                        FacebookManager.getFriends(function(friends){
                            console.log('getFriends Callback. friends: ');
                            console.log(friends);
                            console.log('getFriends Callback. Client.getFriends(): ');
                            console.log(Client.getFriends());
                            console.log('getFriends Callback. Client.friendsIds: ');
                            console.log(Client.getFriendsIds());
                            $scope.hasFriends = friends && (Client.getFriendsIds().length > 0);
                            console.log('friendsMode && !hasFriends');
                            console.log($scope.friendsMode && !$scope.hasFriends);
                        });
                        config.params.friends = Client.getFriendsIds();
                    } else {
                        console.log('facebookconnectPlugin Object not available. Are you directly on a browser?');
                    }
                }
                console.log('config: ');
                console.log(config);
                console.log('friendsMode Active: ' + $scope.friendsMode);

                $scope.$emit('load');
                Competitions.get.then(function(data){
                  $scope.item.competitions =  data;
                  $scope.widthTotal = ($window.innerWidth * $scope.item.competitions.length);
                  $scope.item.competitions.forEach(function(competition, index) {
                      $http.get(Domain.phases(competition.id_competitions), config)
                      .then(function (data, status) {
                              data = data.data;
                          if (data.error == 0) {
                              var phases = data.response.phases;
                              competition.phase = phases[phases.length - 1].id_phases;
                              $scope.getCompetition();
                          }
                          $scope.$emit('unload');
                      }, function(){
                          $scope.$emit('error');
                          $scope.$emit('unload');
                      });
                  });
                });

                $scope.scroll = iScroll.horizontal('wrapperH');
                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    angular.forEach($scope.item.competitions, function(_item, _index) {
                        iScroll.vertical($scope.wrapper.getName(_index));
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
                        var leaderboard = $scope.item.competitions[this.currentPage.pageX].leaderboard;
                        if (!leaderboard || (leaderboard == '')) {
                            $scope.getCompetition(this.currentPage.pageX);
                        }
                        _currentPage = this.currentPage.pageX;
                    }
                });

                $scope.getLeaderboardIndex = function(_url){

                    var _page =  $scope.scroll.currentPage.pageX;
                    var competition = $scope.item.competitions[_page];
                    $scope.$emit('load');
                    competition.leaderboard = [];
                    $http.get(_url, config)
                        .success(function (data, status) {
                            if (data.error == 0) {
//                                console.log(_url);
//                                console.log(data.response);
                                data.response.leaderboard.forEach(function(_item, _index) {
                                    _item.index = (_index + 1);
                                });

                                competition.leaderboard = data.response.leaderboard;
                                competition.client = data.response.client;

                                if(competition.client.index >= competition.leaderboard.length){
                                // Esta condición se debe ajustar a partir de un parametro de configuración
//                                if (data.response.leaderboard.length >= data.response.leaderboard.length) {
                                    competition.leaderboard.push({client:'...',score:'...', index: '...'});
                                    competition.leaderboard.push(data.response.client)
                                }

                            }
                        }, function(){
                            $scope.$emit('error');
                            $scope.$emit('unload');
                        });
                };

                $scope.getPhase = function(){
                    $scope.setActive('phase');
                    var idCompetitions = $scope.item.competitions[ $scope.scroll.currentPage.pageX].id_competitions;
                    var phase = $scope.item.competitions[$scope.scroll.currentPage.pageX].phase;
                    $scope.getLeaderboardIndex(Domain.leaderboard.phase(idCompetitions, phase));
                    $scope.$emit('unload');
                };

                $scope.getCompetition = function(){
                    $scope.setActive('competition');
                    var idCompetition = $scope.item.competitions[$scope.scroll.currentPage.pageX].id_competitions;
                    $scope.getLeaderboardIndex(Domain.leaderboard.competition(idCompetition));
                    $scope.$emit('unload');
                };

            }();

        }
    ]);
