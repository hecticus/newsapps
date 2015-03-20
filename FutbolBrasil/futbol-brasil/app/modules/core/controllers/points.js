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
        'Moment', 'iScroll',
        function($rootScope, $scope, $window, $translate, $q, Competitions, Moment, iScroll) {

            $scope.tournaments = [];
            $scope.hasScore = true;
            var tournamentScroll = null;
            var tournamentScrollId = 'tournamentScroll';

            var width = $window.innerWidth;
            var widthTotal = ($window.innerWidth * 2);
            var height = ($window.innerHeight);

            $scope.getHeight = function(){
                return { 'height': (height-140) + 'px'}
            };

            $scope.getWidth = function(){
                return { 'width': width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': widthTotal + 'px'}
            };

            function processPhases(tournament, phases){
                console.log('processPhases');
                Competitions.leaderboard.personal.phase.index(tournament.id_tournament, phases)
                    .then(
                    function(result){
                        var index;
                        var keys = Object.getOwnPropertyNames(result);

                        result.forEach(function(phase){
                            if(tournament.active_phase
                                && tournament.active_phase.id_phases === phase.id_phase){
                                for(index = 0; index < keys.length; ++index){
                                    tournament.active_phase[keys[index]] = phase[keys[index]];
                                }
                            }

                            if(tournament.last_phase
                                && tournament.last_phase.id_phases === phase.id_phase){
                                for(index = 0; index < keys.length; ++index){
                                    tournament.last_phase[keys[index]] = phase[keys[index]];
                                }
                            }
                        });

                    }, function(){
                        //TODO se podría hacer más especifico el dialogo de error
                        Notification.showNetworkErrorAlert();
                        $scope.$emit('unload');
                    }
                );
            }

            function processTournament(tournament){
                console.log('processTournament');
                var date = Moment.date().format('YYYYMMDD');
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

                        var phases = [];

                        if(tournament.active_phase){
                            phases.push(tournament.active_phase.id_phases);
                        }
                        if(tournament.last_phase){
                            phases.push(tournament.last_phase.id_phases);
                        }

                        processPhases(tournament, phases);
                    }, function(){
                        //TODO se podría hacer más especifico el dialogo de error
                        Notification.showNetworkErrorAlert();
                        $scope.$emit('unload');
                    });
            }

            function getPoints(){
                console.log('getPoints');
                $scope.$emit('load');
                Competitions.leaderboard.personal.tournament().then(function(response){
                    $scope.tournaments = response;
                    $scope.hasScore = $scope.tournaments.length > 0;
                    $scope.tournaments.forEach(processTournament);
                    $scope.$emit('unload');
                }, function(){
                    Notification.showNetworkErrorAlert();
                    $scope.$emit('unload');
                });
            }

            function setUpIScroll(){
                tournamentScroll = iScroll.vertical(tournamentScrollId);

                $scope.$on('$destroy', function() {
                    tournamentScroll.destroy();
                    tournamentScroll = null;
                });
            }

            function init(){
                $scope.$emit('unload');
                setUpIScroll();
                getPoints();
            } init();
        }
    ]);
