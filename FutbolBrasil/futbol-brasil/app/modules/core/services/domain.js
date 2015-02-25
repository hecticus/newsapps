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
//            var football_manager_url = 'http://10.0.3.129:9001/';
            var appId = '1';
            var apiVersion = 'v1';
            var getLang = function(){
                return Client.getLanguage().id_language;
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
                    update: function (clientId) {
                        return brazil_football_manager_url + 'futbolbrasil/'
                            + apiVersion + '/clients/update/' + clientId;
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

                scorers: function () {
                    return football_manager_url + 'footballapi/'
                        + apiVersion + '/players/competitions/scorers/' + appId;
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
                    get: brazil_football_manager_url + 'futbolbrasil/'
                        + apiVersion + '/clients/bets/get/' + appId,
                    create:  brazil_football_manager_url + 'futbolbrasil/'
                        + apiVersion + '/clients/bets/create/' + appId
                }
            };
        }
    ]);
