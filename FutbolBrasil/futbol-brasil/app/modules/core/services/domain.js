'use strict';

/**
 * @ngdoc object
 * @name core.Constants.Domain
 * @description Define a constant
 */
angular
    .module('core')
    .factory('Domain', ['Client',
        function(Client){

            var football_manager_url = 'http://footballmanager.hecticus.com/';
            var brazil_football_manager_url = 'http://brazil.footballmanager.hecticus.com/';
            var appId = '1';
            var apiVersion = 'v1';
            var provisionalLang = null;

           function getGMT(){
              return moment().format('[GMT]ZZ').replace(/\s/g, '');
           }

            function getLang(){
                if(!Client.getLanguage() && provisionalLang){
                    return provisionalLang.id_language;
                } else if(Client.getLanguage()){
                    return Client.getLanguage().id_language;
                } else {
                    return 405;
                }
            }

            function getClientId(){
                return Client.getClientId();
            }

            function setProvisionalLanguage(lang){
                provisionalLang = lang;
            }

            return {

                setProvisionalLanguage : setProvisionalLanguage,

                loading: function (width, height, appVersion, platform) {
                    return brazil_football_manager_url + 'api/loading/'
                        + width + '/' + height + '/' + appVersion + '/' + platform;
                },

                upstream: function () {
                  return brazil_football_manager_url + 'futbolbrasil/v2/client/' + getClientId() + '/upstream';
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

                competitions: football_manager_url + 'footballapi/'
                    + apiVersion + '/competitions/list/' + appId + '/' + getLang(),

                news: {
                    index: function () {
                        return football_manager_url + 'newsapi/'
                            + apiVersion + '/news/scroll/'
                            + appId + '/' + getLang()
                            + '?timezoneName=' + getGMT();
                    },

                    up: function (_news) {
                        return football_manager_url + 'newsapi/'
                            + apiVersion + '/news/scroll/up/rest/'
                            + appId + '/' + getLang() + '/' + _news
                            + '?timezoneName=' + getGMT();
                    },

                    down: function (_news) {
                        return football_manager_url + 'newsapi/'
                            + apiVersion + '/news/scroll/down/rest/'
                            + appId + '/' + getLang() + '/' + _news
                            + '?timezoneName=' + getGMT();
                    }
                },

                teams:{

                    index: football_manager_url + 'footballapi/'
                        + apiVersion + '/team/app/all/' + appId,

                     competition: function (id) {
                          return football_manager_url + 'footballapi/'
                                 + apiVersion + '/team/competition/all/' + id
                     }


                },

                standings: function () {

                    return football_manager_url + 'api/'
                        + apiVersion + '/rankings/get/'
                        + appId + getLang() + '?timezoneName=' + getGMT();
                },

                phases: function (_competition) {
                    return football_manager_url + 'footballapi/'
                        + apiVersion + '/competitions/phases/'
                        + appId + '/' + _competition + '/' + getLang() + '?timezoneName=' + getGMT();
                },

                ranking: function (_competition, _phase) {
                    return football_manager_url + 'footballapi/'
                        + apiVersion + '/competitions/ranking/'
                        + appId + '/' + _competition + '/' + getLang() + '/' + _phase + '?timezoneName=' + getGMT();
                },

                scorers: function (_competition) {
                    return football_manager_url + 'footballapi/'
                        + apiVersion + '/players/competition/scorers/'
                        + appId + '/'
                        + _competition
                        + '?pageSize=15'
                        + '&page=0'
                        + '&timezoneName=' + getGMT()
                },

                match: function (_date) {
                    return football_manager_url + 'footballapi/'
                        + apiVersion + '/matches/date/paged/' + appId + '/'
                        + getLang() + '/' + _date + '?timezoneName=' + getGMT();
                },

                mtm: function (_competition, _match, _event) {
                    return football_manager_url + 'footballapi/'
                        + apiVersion + '/matches/mam/next/'
                        + appId + '/' + _competition + '/' + _match
                        + '/' + getLang() + '/' + _event
                        + '?timezoneName=' + getGMT();
                },

                bets: {
                    get: function (_competition) {
                        return brazil_football_manager_url + 'futbolbrasil/'
                            + apiVersion + '/clients/bets/get/'
                            + getClientId() + '/' + _competition + '?timezoneName=' + getGMT();
                    },
                    create : function() {
                        return brazil_football_manager_url + 'futbolbrasil/'
                            + 'v2' + '/client/' + getClientId() + '/bet';
                    }
                },

                leaderboard:  {
                    phase: function (_competition, _phase) {
                        return brazil_football_manager_url+ 'futbolbrasil/'
                            + apiVersion + '/clients/leaderboard/get/'
                            + getClientId() + '/' + _competition + '/' + _phase + '?timezoneName=' + getGMT();
                    },

                    competition: function (_competition) {
                        return brazil_football_manager_url + 'futbolbrasil/'
                            + apiVersion + '/clients/leaderboard/global/get/'
                            + getClientId() + '/' + _competition + '?timezoneName=' + getGMT();
                    },

                    personal : {
                        competition: function() {
                            return brazil_football_manager_url
                                + 'futbolbrasil/'
                                + apiVersion + '/clients/leaderboard/personal/tournament/'
                                + getClientId() + '?timezoneName=' + getGMT();
                        },
                        phase: {
                            index : function(){
                                return brazil_football_manager_url
                                    + 'futbolbrasil/'
                                    + apiVersion + '/clients/leaderboard/personal/phase/'
                                    + getClientId() + '?timezoneName=' + getGMT();
                            },
                            latest: function(idCompetition, date){
                                return football_manager_url + 'footballapi/'
                                    + apiVersion + '/competitions/phases/latest/'
                                    + appId + '/' + idCompetition + '/' + date + '/' + getLang() + '?timezoneName=' + getGMT();
                            }
                        }
                    }
                }

            };
        }
    ]);
