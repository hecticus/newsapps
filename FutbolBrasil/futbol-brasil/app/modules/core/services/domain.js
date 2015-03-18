'use strict';

/**
 * @ngdoc object
 * @name core.Constants.Domain
 * @description Define a constant
 */
angular
    .module('core')
    .factory('Domain', ['Client', 'i18n',
        function(Client, i18n){

            var football_manager_url = 'http://footballmanager.hecticus.com/';
            var brazil_football_manager_url = 'http://brazil.footballmanager.hecticus.com/';
//            var football_manager_url = 'http://10.0.3.129:9001/';
            var appId = '1';
            var apiVersion = 'v1';
            var getLang = function(){
                if(!Client.getLanguage() && i18n.getDefaultLanguage()){
//                    Client.init();
                    return i18n.getDefaultLanguage().id_language;
                } else if(Client.getLanguage()){
                    return Client.getLanguage().id_language;
                } else {
                    return 405;
                }
            };
            var getClientId = function(){
                return Client.getClientId();
            };

            return {

                loading: function (width, height, appVersion, platform) {
                    return brazil_football_manager_url + 'api/loading/'
                        + width + '/' + height + '/' + appVersion + '/' + platform;
                },

                languages: brazil_football_manager_url + 'futbolbrasil/'
                    + apiVersion + '/languages',

                client: {
                    create: brazil_football_manager_url + 'futbolbrasil/'
                        + apiVersion + '/clients/create',
                    update: function () {
                        return brazil_football_manager_url + 'futbolbrasil/'
                            + apiVersion + '/clients/update/' + getClientId();
                    },
                    get: function (clientId, upstreamChannel) {
                        return brazil_football_manager_url + 'futbolbrasil/'
                            + apiVersion + '/clients/get/'
                            + clientId + '/' + upstreamChannel;
                    }
                },

                competitions: football_manager_url + 'footballapi/' + apiVersion
                    + '/competitions/list/' + appId + '/' + getLang(),

                news: {
                    index: function () {
                        return football_manager_url + 'newsapi/'
                            + apiVersion + '/news/scroll/'
                            + appId + '/' + getLang();
                    },

                    up: function (_news) {
                        return football_manager_url + 'newsapi/'
                            + apiVersion + '/news/scroll/up/rest/'
                            + appId + '/' + getLang() + '/' + _news;
                    },

                    down: function (_news) {
                        return football_manager_url + 'newsapi/'
                            + apiVersion + '/news/scroll/down/rest/'
                            + appId + '/' + getLang() + '/' + _news;
                    }
                },

                teams:{
                    index: football_manager_url + 'footballapi/'
                        + apiVersion + '/team/app/all/' + appId
                },

                standings: function () {
                    return football_manager_url + 'api/'
                        + apiVersion + '/rankings/get/'
                        + appId + getLang();
                },

                phases: function (_competition) {
                    return football_manager_url + 'footballapi/'
                        + apiVersion + '/competitions/phases/'
                        + appId + '/' + _competition + '/' + getLang();
                },

                ranking: function (_competition, _phase) {
                    return football_manager_url + 'footballapi/'
                        + apiVersion + '/competitions/ranking/'
                        + appId + '/' + _competition + '/' + getLang() + '/' + _phase;
                },

                scorers: function (_competition) {
                  return football_manager_url + 'footballapi/'
                          + apiVersion + '/players/competition/scorers/'
                          + appId + '/'
                          + _competition
                          + '?pageSize=15'
                          + '&page=0';
                },

                match: function (_date) {
                    return football_manager_url + 'footballapi/'
                        + apiVersion + '/matches/date/paged/' + appId + '/'
                        + getLang() + '/' + _date ;
                },

                mtm: function (_competition, _match, _event) {
                    return football_manager_url + 'footballapi/'
                        + apiVersion + '/matches/mam/next/'
                        + appId + '/' + _competition + '/' + _match
                        + '/' + getLang() + '/' + _event;
                },

                bets: {
                    get: function (_competition) {
                      return brazil_football_manager_url + 'futbolbrasil/'
                                            + apiVersion + '/clients/bets/get/' + getClientId() + '/' + _competition
                    },
                    create : function() {
                        return brazil_football_manager_url + 'futbolbrasil/v2/client/' + getClientId() + '/bet';
                    }

                },

                leaderboard:  {
                    //TODO cambiar version
                    phase: function (_competition, _phase) {
                        return brazil_football_manager_url+ 'futbolbrasil/v1/clients/leaderboard/get/'
                            + getClientId() + '/' + _competition + '/' + _phase
                    },

                    competition: function (_competition) {
                        return brazil_football_manager_url + 'futbolbrasil/v1/clients/leaderboard/global/get/'
                            + getClientId() + '/' + _competition
                    },

                    personal : {
                        competition: function() {
                            return brazil_football_manager_url
                                + "futbolbrasil/v1/clients/leaderboard/personal/tournament/"
                                + getClientId();
                        },
                        phase: {
                            index : function(){
                                return brazil_football_manager_url
                                    + "futbolbrasil/v1/clients/leaderboard/personal/phase/"
                                    + getClientId();
                            },
                            latest: function(idCompetition, date){
                                return football_manager_url + 'footballapi/' + apiVersion
                                + '/competitions/phases/latest/' +  appId + '/'
                                + idCompetition + '/' + date + '/' + getLang();
                            }
                        }
                    }

                }

            };
        }
    ]);
