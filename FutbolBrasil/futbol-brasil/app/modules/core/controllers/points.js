'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PointsCtrl
 * @description PointsCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('PointsCtrl', ['$rootScope', '$scope', '$window', '$translate', '$q', 'Competitions',
        'Utilities',
        function($rootScope, $scope, $window, $translate, $q, Competitions, Utilities) {

            $scope.tournaments = [];

            $scope.tournamentScroll = null;
            $scope.tournamentScrollId = 'tournamentScroll';

            $scope.width = $window.innerWidth;
            $scope.widthTotal = ($window.innerWidth * 2);
            $scope.height = ($window.innerHeight);

            $scope.getHeight = function(){
                return { 'height': ($scope.height-140) + 'px'}
            };

            $scope.getWidth = function(){
                return { 'width': $scope.width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': $scope.widthTotal + 'px'}
            };

            $scope.getPoints = function(){
                Competitions.leaderboard.personal.tournament().then(function(response){
                    $scope.tournaments = response;
                    var date = Utilities.moment().format('YYYYMMDD');
                    $scope.tournaments.forEach(function(tournament){
                        Competitions.leaderboard.personal.phase.latest(tournament.id_tournament, date)
                            .then(function(result){
                                var keys = Object.getOwnPropertyNames(result);
                                for(var index = 0; index < keys.length; ++index){
                                    tournament[keys[index]] = result[keys[index]];
                                }
                                if(tournament.active_phase){
                                    tournament.active_phase.hits = 0;
                                    tournament.active_phase.score = 0;
                                }
                                if(tournament.last_phase){
                                    tournament.last_phase.hits = 0;
                                    tournament.last_phase.score = 0;
                                }
                                console.log($scope.tournaments);
                                //sacar idTournament y phases para solicitar puntuaciones de jornadas
                                var phases = [];
                                if(tournament.active_phase){ phases.push(tournament.active_phase.id_phases); }
                                if(tournament.last_phase){ phases.push(tournament.last_phase.id_phases); }
                                Competitions.leaderboard.personal.phase.index(tournament.id_tournament, phases)
                                    .then(
                                        function(result){
                                            var index;
                                            var keys = Object.getOwnPropertyNames(result);

                                            result.forEach(function(phase){
                                                if(tournament.active_phase && tournament.active_phase.id_phases === phase.id_phase){
                                                    for(index = 0; index < keys.length; ++index){
                                                        tournament.active_phase[keys[index]] = phase[keys[index]];
                                                    }
                                                }

                                                if(tournament.last_phase && tournament.last_phase.id_phases === phase.id_phase){
                                                    for(index = 0; index < keys.length; ++index){
                                                        tournament.last_phase[keys[index]] = phase[keys[index]];
                                                    }
                                                }
                                            });

                                        }
                                );
                            });
                    });
                });
            };

            $scope.init = function(){
                $scope.getPoints();
                $scope.tournamentScroll = Utilities.newScroll.vertical($scope.tournamentScrollId);
            }();
        }
    ]);
