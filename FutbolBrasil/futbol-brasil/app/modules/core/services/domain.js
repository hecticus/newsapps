'use strict';

/**
 * @ngdoc object
 * @name core.Constants.Domain
 * @description Define a constant
 */
angular
    .module('core')
    .factory('Domain', function(){

        var football_manager_url = 'http://footballmanager.hecticus.com/';
        var brazil_football_manager_url = 'http://brazil.footballmanager.hecticus.com/';
//        var brazil_football_manager_url = 'http://10.0.3.127:9000';

        return {

            loading: function (width, height) {
                return brazil_football_manager_url + 'api/loading/'
                    + width + '/' + height;
            },

            clients: {
                create: brazil_football_manager_url + "futbolbrasil/v1/clients/create",
                update: function (clientId) {
                    return brazil_football_manager_url + "futbolbrasil/v1/clients/update/" + clientId;
                },
                get: function (clientId, upstreamChannel) {
                    return brazil_football_manager_url + "futbolbrasil/v1/clients/get/"
                        + clientId + '/' + upstreamChannel;
                }
            },

            competitions: function () {
                return football_manager_url + 'footballapi/v1/competitions/list/1';
            },

            news: {
                index: function () {
                    return football_manager_url + 'newsapi/v1/news/scroll/1';
                },

                up: function (_news, _limit) {
                    return football_manager_url + 'newsapi/v1/news/scroll/up/rest/1/'
                        + _news;
                },

                down: function (_news, _limit) {
                    return football_manager_url + 'newsapi/v1/news/scroll/down/rest/1/'
                        + _news;
                }
            },

            teams:{
                index: football_manager_url + 'footballapi/v1/team/app/all/1'
            },

            standings: function () {
                return football_manager_url + 'api/v1/rankings/get/1';
            },

            phases: function (_competition) {
                return football_manager_url + 'footballapi/v1/competitions/phases/1/' + _competition;
            },

            ranking: function (_competition, _phase) {
                return football_manager_url + 'footballapi/v1/competitions/ranking/1/'
                    + _competition + '/' + _phase;
            },

            scorers: function () {
                return football_manager_url + 'footballapi/v1/players/competitions/scorers/1';
                          },

            match: function (_date, _limit, _page) {
                return football_manager_url + 'footballapi/v1/matches/date/paged/1/' + _date
                    + '?pageSize=' + _limit + '&page=' + _page;
            },

            mtm: function (_competition, _game, _event) {
                return football_manager_url + 'footballapi/v1/matches/mam/next/1/' + _competition + '/' + _game + '/' + _event;
            },

            bets: {
                get: function () {
                  return brazil_football_manager_url + 'futbolbrasil/v1/clients/bets/get/1';
                },
                create:  function () {
                  return brazil_football_manager_url + 'futbolbrasil/v1/clients/bets/create/1';
                }
            }
        };
    });
