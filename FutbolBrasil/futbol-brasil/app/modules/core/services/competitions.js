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
            var FILE_KEY_ALL_COMPETITIONS = "APPALLCOMPETITIONS";
            var localStorage = $localStorage;
            var competitions = [];
            var allCompetitions = [];

            function saveCompetitions(comps) {
                if(comps){
                    competitions = comps;
                }

                localStorage[FILE_KEY_COMPETITIONS] = competitions;

                if(!localStorage[FILE_KEY_ALL_COMPETITIONS]){
                    localStorage[FILE_KEY_ALL_COMPETITIONS] = competitions;
                }

            }

            function loadCompetitions() {

                if(localStorage[FILE_KEY_COMPETITIONS]){
                    competitions = localStorage[FILE_KEY_COMPETITIONS];
                }

                if(localStorage[FILE_KEY_ALL_COMPETITIONS]){
                    allCompetitions = localStorage[FILE_KEY_ALL_COMPETITIONS];
                }


                return competitions;
            }

            function getCompetitions(noConfig) {
                loadCompetitions();
                var config = WebManager.getFavoritesConfig(Client.isFavoritesFilterActive());
                //console.log("getCompetitions-> " + Domain.competitions);
                if (noConfig) config = false;
                console.log('JSON.stringify -> ' + JSON.stringify(config));
                return $http.get(Domain.competitions, config).then(function(response){
                    competitions = response.data.response.competitions;
                    saveCompetitions();
                    return competitions;
                },function(response){
                    return $q.reject(response);
                });
            }

            function getRanking(competition, phase){
            console.log("getRanking-> " + Domain.ranking(competition,phase));
                return $http.get(Domain.ranking(competition,phase))
                    .then(function (response) {
//                        console.log('getRanking.response: ');
//                        console.log(response);
                        if(response.data.error === 0){
                            return response.data.response;
                        } else {
                            return $q.reject(response);
                        }

                    }, function (response) {
                        return $q.reject(response);
                    });
            }

            function getPhase(competition, filter){
                var config = {};
                if(filter){
                    config = WebManager.getFavoritesConfig(Client.isFavoritesFilterActive());
                }

                return $http.get(Domain.phases(competition.id_competitions), config)
                    .then(function (response) {
                        if (response.data.error === 0) {
                          return response.data.response.phases;
                        }
                    },function (response) {
                        return $q.reject(response);
                    });
            }

            function getScorers(id_competition){
                var config = WebManager.getFavoritesConfig(Client.isFavoritesFilterActive());
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

                getRanking : getRanking,

                getPhase : getPhase,

                getScorers: getScorers,

                leaderboard : {
                    personal : {
                        tournament: function(){
                            return $http.get(Domain.leaderboard.personal.competition())
                                .then(function(response){
                                    var leaderboard = response.data.response.leaderboard;
                                    leaderboard.map(function(score){
                                        allCompetitions.some(function(competition){
                                            if(competition.id_competitions === score.id_tournament){
                                                //alert(competition.competiton_type.name);
                                                score.name = competition.competiton_type.name;
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
                                        //console.log('idTournament: ' + idTournament + ' ,phases: ' + JSON.stringify(phases));
                                         var phasesResult = false;
                                        if (response.data.response.leaderboard[0]) {
                                           phasesResult = response.data.response.leaderboard[0].phases;
                                          //console.log(phasesResult);
                                        }

                                        return phasesResult;

                                    }, function(response){
                                        return $q.reject(response.data);
                                    });

                            },
                            latest : function(idTournament, date){
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
