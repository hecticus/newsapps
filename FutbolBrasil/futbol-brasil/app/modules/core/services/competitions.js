'use strict';

/**
 * @ngdoc service
 * @name core.Services.Competitions
 * @description Competitions Factory
 */
angular
    .module('core')
    .factory('Competitions',['$localStorage', '$http', '$q', 'Domain', 'WebManager', 'Client',
        function($localStorage, $http, $q, Domain, WebManager, Client) {
            var FILE_KEY_COMPETITIONS = "APPCOMPETITIONS";

            var localStorage = $localStorage;
            var competitions = [];
            var config = WebManager.getFavoritesConfig(Client.isFavoritesFilterActive());

            function saveCompetitions(comps) {
                if(comps){
                    competitions = comps;
                }
                localStorage[FILE_KEY_COMPETITIONS] = competitions;
            }

            function loadCompetitions() {
                if(localStorage[FILE_KEY_COMPETITIONS]){
                    competitions = localStorage[FILE_KEY_COMPETITIONS];
                } else {
                    getCompetitions();
                }
                return competitions;
            }

            function getCompetitions() {
                return $http.get(Domain.competitions).then(function(response, status){
                    competitions = response.data.response.competitions;
                    saveCompetitions();
                    return competitions;
                },function(response){
                    return $q.reject(response.data);
                });
            }

            function getScorers(id_competition){
                return $http.get(Domain.scorers(id_competition), config)
                    .then(function (data) {
                        data = data.data;
                        if (data.error == 0) {
                            return data.response.scorers;
                        } else {
                            return [];
                        }
                    }, function (response) {
                        return $q.reject(response.data);
                    }
                );
            }

            function init(){
                loadCompetitions();
            }

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.Competitions#method1
                 * @methodOf core.Services.Competitions
                 * @return {boolean} Returns a boolean value
                 */
                init: init,

                /**
                 * @ngdoc function
                 * @name core.Services.Competitions#method2
                 * @methodOf core.Services.Competitions
                 * @return {boolean} Returns a boolean value
                 */
                get: getCompetitions,

                getScorers: getScorers,

                leaderboard : {
                    personal : {
                        tournament: function(){
                            console.log('Competitions.leaderboard.personal.tournament');
                            return $http.get(Domain.leaderboard.personal.competition())
                                .then(function(response){
                                    var leaderboard = response.data.response.leaderboard;
                                    leaderboard.map(function(score){
                                        competitions.some(function(competition){
                                            if(competition.id_competitions === score.id_tournament){
                                                score.name = competition.name;
                                                return true;
                                            }
                                        });
                                    });
                                    return leaderboard;
                                }, function(response){
                                    return $q.reject(response.data);
                                });
                        },
                        phase : {
                            index : function(idTournament, phases){
                                var config = {
                                    params : {
                                        idTournament : idTournament,
                                        phases : phases
                                    }
                                };

                                return $http.get(Domain.leaderboard.personal.phase.index(), config)
                                    .then(function(response){
                                        console.log('idTournament: ' + idTournament
                                            + ' ,phases: ' + JSON.stringify(phases));
                                        var phasesResult = response.data.response.leaderboard[0].phases;
                                        console.log(phasesResult);
                                        return phasesResult;
                                    }, function(response){
                                        return $q.reject(response.data);
                                    });

                            },
                            latest : function(idTournament, date){
                                //TODO persistir response
                                return $http.get(Domain.leaderboard.personal.phase.latest(idTournament, date))
                                    .then(function(response){
                                        return response.data.response;
                                    }, function(response){
                                        return $q.reject(response.data);
                                    });
                            }
                        }
                    }
                }
            };
        }
    ]);
