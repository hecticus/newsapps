'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LeaderboardCtrl
 * @description LeaderboardCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('LeaderboardCtrl', ['$http','$rootScope','$scope','$state', '$window',
        'Client', 'WebManager', 'Domain', 'FacebookManager', 'iScroll', 'Competitions', 'Notification',
        function($http, $rootScope, $scope, $state, $window, Client, WebManager, Domain
            , FacebookManager, iScroll, Competitions, Notification) {

            var config = WebManager.getFavoritesConfig($rootScope.isFavoritesFilterActive());

            var _currentPage = 0;
            var friendsMode = false;
            var active = 'competition';
            var width = $window.innerWidth;
            var widthTotal = $window.innerWidth;

            var scroll = null;

            $scope.item = {};
            $scope.hasFriends = true;

            $rootScope.$storage.leaderboard = false;


            $scope.setActive = function(type) {
                active = type;
            };

            $scope.isActive = function(type) {
                return type === active;
            };

            $scope.vWrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            $scope.getWidth = function(){
                return { 'width': width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': widthTotal + 'px'}
            };

            $scope.getPhase = function(){
                $scope.setActive('phase');
                var idCompetitions = $scope.item.competitions[ scroll.currentPage.pageX].id_competitions;
                var phase = $scope.item.competitions[scroll.currentPage.pageX].phase;
                getLeaderboardIndex(Domain.leaderboard.phase(idCompetitions, phase));
                $scope.$emit('unload');
            };

            $scope.getCompetition = function(){
                $scope.setActive('competition');
                var idCompetition = $scope.item.competitions[scroll.currentPage.pageX].id_competitions;
                getLeaderboardIndex(Domain.leaderboard.competition(idCompetition));
                $scope.$emit('unload');
            };

            function getLeaderboardIndex(_url){
                var _page =  scroll.currentPage.pageX;
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
                            competition.client.index = competition.client.index + 1;

                            if(competition.client.index >= competition.leaderboard.length){
                                // Esta condición se debe ajustar a partir de un parametro de configuración
//                                if (data.response.leaderboard.length >= data.response.leaderboard.length) {
                                competition.leaderboard.push({client:'...',score:'...', index: '...'});
                                competition.leaderboard.push(competition.client)
                            }

                        }
                    }, function(){
                        Notification.showNetworkErrorAlert();
                        $scope.$emit('unload');
                    });
            }

            function init(){
                $scope.$emit('load');

                if($state.current.data.contentClass === 'content-friends'){
                    friendsMode = true;
                    if(!!$window.facebookConnectPlugin){
                        FacebookManager.getFriends(function(friends){
//                            console.log('getFriends Callback. friends: ');
//                            console.log(friends);
//                            console.log('getFriends Callback. Client.getFriends(): ');
//                            console.log(Client.getFriends());
//                            console.log('getFriends Callback. Client.friendsIds: ');
//                            console.log(Client.getFriendsIds());
                            $scope.hasFriends = friends && (Client.getFriendsIds().length > 0);
//                            console.log('friendsMode && !hasFriends');
//                            console.log(friendsMode && !$scope.hasFriends);
                        });
                        config.params.friends = Client.getFriendsIds();
                    } else {
                        console.log('facebookconnectPlugin Object not available. Are you directly on a browser?');
                    }
                }
//                console.log('config: ');
//                console.log(config);
//                console.log('friendsMode Active: ' + friendsMode);

                Competitions.get().then(function(competitions){
                  $scope.item.competitions =  competitions;
                  widthTotal = ($window.innerWidth * $scope.item.competitions.length);
                  $scope.item.competitions.forEach(function(competition) {
                      Competitions.getPhase(competition)
                      .then(function (phases) {
                          competition.phase = phases[phases.length - 1].id_phases;
                          $scope.getCompetition();
                          $scope.$emit('unload');
                      }, function(){
                          Notification.showNetworkErrorAlert();
                          $scope.$emit('unload');
                      });
                  });
                });

                scroll = iScroll.horizontal('wrapperH');

                $scope.nextPage = function(){
                    scroll.next();
                };

                $scope.prevPage = function(){
                     scroll.prev();
                };

                 scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });

                 scroll.on('scrollStart', function () {
                    _currentPage = this.currentPage.pageX;
                });

                 scroll.on('scroll', function () {
                    if (this.currentPage.pageX != _currentPage) {
                        var leaderboard = $scope.item.competitions[this.currentPage.pageX].leaderboard;
                        if (!leaderboard || (leaderboard == '')) {
                            $scope.getCompetition(this.currentPage.pageX);
                        }
                        _currentPage = this.currentPage.pageX;
                    }
                });

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    iScroll.vertical($scope.vWrapper.getName(_currentPage));
                });

            } init();
        }
    ]);
