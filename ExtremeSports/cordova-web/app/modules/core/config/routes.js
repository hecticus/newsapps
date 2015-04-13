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
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

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
                    params: {'msisdn': ''},
                    templateUrl: 'modules/core/views/login.html',
                    controller: 'LoginController as login',
                    data:{
                        prev: 'login',
                        section: 'login'
                    }
                })
                .state('remind', {
                    url: '/remind',
                    templateUrl: 'modules/core/views/remind.html',
                    controller: 'LoginController as remind',
                    data:{
                        prev: 'login',
                        section: 'remind'
                    }
                })
                .state('settings', {
                    url: '/settings',
                    templateUrl:'modules/core/views/settings.html',
                    controller:'SettingsController as settings',
                    data:{
                        prev: 'news',
                        _class: 'content-settings',
                        section: 'settings'
                    }
                })
                .state('language-selection', {
                    url: '/language-selection',
                    templateUrl:'modules/core/views/language-selection.html',
                    controller:'LanguageSelectionController as langSelection',
                    params: {'isLogin': false},
                    data:{
                        prev: 'settings',
                        section: 'language-selection'
                    }
                })
                .state('news', {
                    url: '/news',
                    templateUrl: 'modules/core/views/news.html',
                    controller: 'NewsController as news',
                    data:{
                        prev: 'news',
                        section: 'news'
                    }
                })
                .state('news-detail', {
                    url: '/news/{newsId:int}',
                    params : {
                        newsId : {value: null, squash: true}
                    },
                    templateUrl: 'modules/core/views/news-detail.html',
                    controller: 'NewsDetailController as newsPost',
                    data:{
                        prev: 'news',
                        section: 'news-detail'
                    }
                })
                .state('gallery', {
                    url: '/gallery',
                    templateUrl: 'modules/core/views/gallery.html',
                    controller: 'GalleryController as gallery',
                    data:{
                        prev: 'gallery',
                        section: 'gallery'
                    }
                });
        }
    ]);
