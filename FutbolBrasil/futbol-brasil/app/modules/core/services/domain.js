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

        //TODO reformat
        url: 'http://footballmanager.hecticus.com/',

        competitions: function () {
          return this.url + 'footballapi/v1/competitions/list/1';
        },

        news: function () {
          return {

            index:  this.url + 'newsapi/v1/news/scroll/1',

            up: function (_news,_limit) {
              return 'http://footballmanager.hecticus.com/newsapi/v1/news/scroll/up/rest/1/'
              + _news;
            },

            down: function (_news,_limit) {
              return  'http://footballmanager.hecticus.com/newsapi/v1/news/scroll/down/rest/1/'
                + _news;
            }

          };

        },

        standings: function () {
          return this.url + 'api/v1/rankings/get/1';
        },

        phases: function (_competition) {
          return this.url + 'footballapi/v1/competitions/phases/1/' + _competition;
        },

        ranking: function (_competition, _phase) {
          return this.url + 'footballapi/v1/competitions/ranking/1/' + _competition + '/' + _phase;
        },

        scorers: function () {
          return this.url + 'footballapi/v1/players/competitions/scorers/1';
        },

        match: function (_date, _limit, _page) {
          return this.url + 'footballapi/v1/matches/date/paged/1/' + _date + '?pageSize=' + _limit + '&page=' + _page;
        }

      }
    );
