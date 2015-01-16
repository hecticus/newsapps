'use strict';

/**
 * @ngdoc object
 * @name core.Constants.Domain
 * @description Define a constant
 */
angular
    .module('core')
    .constant('Domain',
    {

        football_manager_url: 'http://footballmanager.hecticus.com/',
        brazil_football_manager_url: 'http://brazil.footballmanager.hecticus.com',

        loading: function(width, height){
            return this.brazil_football_manager_url + '/api/loading/'
                + width + '/' + height;
        },

        clients : {
            create: this.brazil_football_manager_url + "/futbolbrasil/v1/clients/create",
            update: function(clientId){
                return this.brazil_football_manager_url + "/futbolbrasil/v1/clients/update/" + clientId;
            },
            get: function(clientId, upstreamChannel){
                return this.brazil_football_manager_url + "/futbolbrasil/v1/clients/get/"
                    + clientId + '/' + upstreamChannel;
            }
        },

        competitions : function () {
            return this.url + 'footballapi/v1/competitions/list/1';
        },

        news: {
            index: this.football_manager_url + 'newsapi/v1/news/scroll/1',

            up: function (_news, _limit) {
                return this.football_manager_url + 'newsapi/v1/news/scroll/up/rest/1/'
                    + _news;
            },

            down: function (_news, _limit) {
                return  this.football_manager_url + 'newsapi/v1/news/scroll/down/rest/1/'
                    + _news;
            }
        },

        standings: function () {
            return this.football_manager_url + 'api/v1/rankings/get/1';
        },

        phases: function (_competition) {
            return this.football_manager_url + 'footballapi/v1/competitions/phases/1/' + _competition;
        },

        ranking: function (_competition, _phase) {
            return this.football_manager_url + 'footballapi/v1/competitions/ranking/1/'
                + _competition + '/' + _phase;
        },

        scorers: function () {
            return this.football_manager_url + 'footballapi/v1/players/competitions/scorers/1';
        },

        match: function (_date, _limit, _page) {
            return this.football_manager_url + 'footballapi/v1/matches/date/paged/1/' + _date
                + '?pageSize=' + _limit + '&page=' + _page;
        }

    }
);
