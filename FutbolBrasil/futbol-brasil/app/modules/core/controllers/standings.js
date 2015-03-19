'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.StandingsCtrl
 * @description StandingsCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('StandingsCtrl',  ['$rootScope', '$scope', '$timeout', 'Competitions', 'Notification',
        'Moment', 'iScroll',
        function($rootScope, $scope, $timeout, Competitions, Notification, Moment, iScroll) {

            $scope.item = {};
            $scope.hasCompetitions = true;
            $scope.hasPhases = true;
            $scope.hasRankings = true;

            $scope.fromNow = function(_date) {
                return Moment.date(_date).format('MMMM Do YYYY');
            };

            $scope.showContentPhases = function(competition) {
                $scope.$emit('load');
                $scope.item.ranking = [];
                $scope.item.phases = [];
                $scope.item.competition = false;

                Competitions.getPhase(competition)
                    .then(function (phases) {
                        $scope.hasPhases = true;
                        $scope.item.phases = phases;
                        $scope.item.competition = competition;
                        if ($scope.item.phases.length == 1) {
                            $scope.showContentRanking($scope.item.competition.id_competitions
                                , $scope.item.phases[0].id_phases);
                        } else {
                            $rootScope.transitionPageBack('#wrapper2', 'left');
                            $scope.scroll2.scrollTo(0,0,0);
                        }
                        $timeout(function(){
                            $scope.$emit('unload');
                        }, 500);
                    },function () {
                        $scope.hasPhases = false;
                        console.log('showContentPhases. error');
                        Notification.showNetworkErrorAlert();
                        $scope.$emit('unload');
                    });

            };

            function processEmptyTeams(item){
                if(item.ranking){
                    item.ranking.forEach(function(outerRanking){
                        outerRanking.ranking.forEach(function(innerRanking){
                            if(item.isTree){
                                var awayTeam = innerRanking.awayTeam;
                                var homeTeam = innerRanking.homeTeam;
                                if(awayTeam.name === '' || !awayTeam.name){
                                    awayTeam.name = $scope.strings.NOT_AVAILABLE;
                                }
                                if(homeTeam.name === '' || !homeTeam.name){
                                    homeTeam.name = $scope.strings.NOT_AVAILABLE;
                                }
                            } else {
                                var team = innerRanking.team;
                                if(team.name === '' || !team.name){
                                    team.name = $scope.strings.NOT_AVAILABLE;
                                }
                            }
                        });
                    });
                }
            }

            $scope.showContentRanking = function(competition, phase) {
                $scope.$emit('load');
                $scope.item.phase = false;
                $scope.item.ranking = [];

                Competitions.getRanking(competition, phase)
                    .then(function (response) {
                        $scope.hasRankings = true;
                        $scope.item.isTree = response.tree;
                        $scope.item.phase = response.phase;
                        $scope.item.ranking = response.ranking;

                        processEmptyTeams($scope.item);

                        $rootScope.transitionPageBack('#wrapper3', 'left');
                        $scope.scroll3.scrollTo(0,0,0);
                        $timeout(function(){
                            $scope.$emit('unload');
                        }, 500);
                    }, function () {
                        $scope.hasRankings = false;
                        $rootScope.transitionPageBack('#wrapper3', 'left');
                        $scope.scroll3.scrollTo(0,0,0);
                        $scope.$emit('unload');
                        Notification.showNetworkErrorAlert();
                    });
            };

            function setUpIScroll(){
                $scope.scroll = iScroll.vertical('wrapper');
                $scope.scroll2 = iScroll.vertical('wrapper2');
                $scope.scroll3 = iScroll.vertical('wrapper3');
            }

            function getCompetitions(){
                Competitions.get().then(function(competitions){
                    $scope.hasCompetitions = true;
                    $scope.item.competitions = competitions;
                }, function(){
                    $scope.hasCompetitions = false;
                    $scope.item.competitions = [];
                    Notification.showNetworkErrorAlert();
                });
            }

            function init(){
                setUpIScroll();
                getCompetitions();
            } init();
        }
    ]);
