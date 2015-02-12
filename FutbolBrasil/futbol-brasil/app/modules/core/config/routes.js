'use strict';

/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */
angular
    .module('core')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/news');

        /**
         * @ngdoc event
         * @name core.config.route
         * @eventOf core.config
         * @description
         *
         * Define routes and the associated paths
         *
         * - When the path is `'/'`, route to home
         * */
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl:'modules/core/views/login.html',
                controller:'LoginCtrl as login',
                data:{
                  prev: 'login',
                  next: 'login',
                  _class: 'content-login'
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl:'modules/core/views/settings.html',
                controller:'SettingsController',
                data:{
                    prev: 'news',
                    next: 'news',
                    _class: 'content-settings'
                }
            })
            .state('team-selection', {
                url: '/team-selection',
                templateUrl:'modules/core/views/team-selection.html',
                controller:'TeamSelectionController',
                data:{
                    prev: 'login',
                    next: 'news',
                    _class: 'content-team-selection'
                }
            })
            .state('match', {
                url: '/match',
                controller:'MatchCtrl as _this',
                templateUrl:'modules/core/views/match.html',
                data:{
                  prev: 'mtm',
                  next: 'standings',
                  _class: 'content-match'
                }
            })
            .state('standings', {
                url: '/standings',
                controller:'StandingsCtrl as _this',
                templateUrl:'modules/core/views/standings.html',
                data:{
                  prev: 'match',
                  next: 'news',
                  contentClass: 'content-standings'
                }
            })
            .state('news', {
                url: '/news',
                controller:'NewsCtrl  as _this',
                templateUrl:'modules/core/views/news.html',
                data:{
                    prev: 'standings',
                    next: 'scorers',
                    contentClass: 'content-news'
                }
            })
//            .state('news.detail', {
//                url: '/:idNews',
//                controller:'NewsDetailCtrl  as _this',
//                templateUrl:'modules/core/views/news-detail.html',
////                data:{
////                    prev: 'news',
////                    next: 'scorers',
////                    contentClass: 'content-news'
////                }
//            })
            .state('scorers', {
                url: '/scorers',
                controller:'ScorersCtrl  as _this',
                templateUrl:'modules/core/views/scorers.html',
                data:{
                  prev: 'news',
                  next: 'mtm',
                  contentClass: 'content-scorers'
                }
            })
            .state('mtm', {
                url: '/mtm',
                controller:'MtmCtrl',
                templateUrl:'modules/core/views/mtm.html',
                data:{
                  prev: 'scorers',
                  next: 'match',
                  contentClass: 'content-mtm'
                }
            })
            .state('prediction', {
                url: '/prediction',
                controller:'PredictionCtrl  as _this',
                templateUrl:'modules/core/views/prediction.html',
                data:{
                  prev: 'points',
                  next: 'leaderboard',
                  contentClass: 'content-prediction'
                }
            })
            .state('leaderboard', {
                url: '/leaderboard',
                controller:'LeaderboardCtrl  as _this',
                templateUrl:'modules/core/views/leaderboard.html',
                data:{
                  prev: 'prediction',
                  next: 'friends',
                  contentClass: 'content-leaderboard'
                }
            })
            .state('friends', {
                url: '/friends',
                controller:'FriendsCtrl  as _this',
                templateUrl:'modules/core/views/friends.html',
                data:{
                  prev: 'leaderboard',
                  next: 'points',
                  contentClass: 'content-friends'
                }
            })
            .state('points', {
                url: '/points',
                controller:'PointsCtrl  as _this',
                templateUrl:'modules/core/views/points.html',
                data:{
                  prev: 'friends',
                  next: 'prediction',
                  contentClass: 'content-points'
                }
            });
        }
    ]);
