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
            var vScrolls = [];

            $scope.item = {};
            $scope.hasFriends = true;
            $scope.hasLeaderboard = true;

            $rootScope.$storage.leaderboard = false;


            function setActive(type) {
                active = type;
            }

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

            $scope.nextPage = function(){
                scroll.next();
            };

            $scope.prevPage = function(){
                scroll.prev();
            };

            $scope.showPhase = function(){
                setActive('phase'+ scroll.currentPage.pageX);
                var idCompetitions = $scope.item.competitions[ scroll.currentPage.pageX].id_competitions;
                var phase = $scope.item.competitions[scroll.currentPage.pageX].phase;
                //if (phase && phase.type == 0) getLeaderboardIndex(Domain.leaderboard.phase(idCompetitions, phase));
                 getLeaderboardIndex(Domain.leaderboard.phase(idCompetitions, phase));
            };

            $scope.showTournament = function(){
                setActive('competition' + scroll.currentPage.pageX);
                var idCompetition = $scope.item.competitions[scroll.currentPage.pageX].id_competitions;
                getLeaderboardIndex(Domain.leaderboard.competition(idCompetition));
            };

            function getLeaderboardIndex(_url){
                $scope.$emit('load');
                $scope.hasLeaderboard = true;
                var _page =  scroll.currentPage.pageX;
                var competition = $scope.item.competitions[_page];
                competition.leaderboard = [];
                $http.get(_url, config)
                    .then(function (data) {
                       if(data.data.error === 0){

                         $scope.hasLeaderboard = true;
                         data = data.data;
                         competition.leaderboard = data.response.leaderboard;
                         competition.leaderboard.forEach(function(_item, _index) {
                             _item.index = (_index + 1);
                         });

                         competition.client = data.response.client;
                         competition.client.index = competition.client.index + 1;

                         if(competition.client.index >= competition.leaderboard.length){
                             competition.leaderboard.push({client:'...',score:'...', index: '...'});
                             competition.leaderboard.push(competition.client)
                         }

                       } else {
                          $scope.hasLeaderboard = false;
                       }

                        $scope.$emit('unload');
                    }, function (data){
                        $scope.hasLeaderboard = false;
                        $scope.$emit('unload');
                        if(data.data.error === 3){
                        } else {
                            Notification.showNetworkErrorAlert();
                        }
                    });
            }

            function getFbFriends(){
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

            function getCompetitions(){
                Competitions.get().then(function(competitions){
                    widthTotal = ($window.innerWidth * competitions.length);
                    $scope.item.competitions = competitions;
                    $scope.item.competitions.forEach(function(competition) {
                        Competitions.getPhase(competition)
                            .then(function (phases) {
                                if (phases) {
                                  competition.phase = phases[phases.length - 1].id_phases;
                                  //if (competition.phase.type != 1) $scope.showTournament();
                                  $scope.showTournament();
                                }
                            }, function(){
                                //Notification.showNetworkErrorAlert();
                                $scope.$emit('unload');
                            });
                    });
                });
            }

            function setUpIScroll(){
                scroll = iScroll.horizontal('wrapperH');

                scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });

                scroll.on('scrollStart', function () {
                    _currentPage = this.currentPage.pageX;
                });

                scroll.on('scroll', function () {
                    if (this.currentPage.pageX != _currentPage) {
                        $scope.showTournament(this.currentPage.pageX);
                        _currentPage = this.currentPage.pageX;
                    }
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

            function init(){
                $scope.$emit('load');
                if($state.current.data.contentClass === 'content-friends'){
                    friendsMode = true;
                    getFbFriends();
                }

                getCompetitions();
                setUpIScroll();

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    vScrolls[_currentPage] = iScroll.vertical($scope.vWrapper.getName(_currentPage));
                });

            } init();
        }
    ]);
