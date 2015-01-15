'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.NewsCtrl
 * @description NewsCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('NewsCtrl', ['$http','$rootScope','$scope','$state','$localStorage', '$window', 'Domain','Utilities',
        function($http, $rootScope, $scope, $state, $localStorage, $window, Domain, Utilities) {

            var _this = this;
            //Indicador de primera y ultima posicion en cache
            var _news = {
                first : 0,
                last : 0
            };
            var _promise = false;
            $scope.item = {};

            //TODO revisar esto y su directiva
            $rootScope.$on('onRepeatFirst', function(scope, element, attrs) {
                console.log('onRepeatFirst');
                _news.first = element.first().data('news');
                $rootScope.loading = false;
            });

            $rootScope.$on('onRepeatLast', function(scope, element, attrs) {
                console.log('onRepeatLast');
                _news.last = element.last().data('news');
                $rootScope.loading = false;
            });


            $scope.share = function(_news) {
                //funcion en SocialAppsManager
                sharePost(_news.title,'Brazil Football',null,_news.summary);
            };

            $scope.fromNow = function(_date) {
                //TODO. Working. revisar moment
                return Utilities.moment(_date).fromNow();
            };

            //TODO Revisar agregado de clases
            $scope.showContentNews = function(_news) {
                $rootScope.contentNews = _news;
                angular.element('#wrapper2').attr('class','page transition left');
                $scope._scroll2.scrollTo(0,0,0);
            };

            $scope.getNews = function() {
                console.log('getNews');
                if ($rootScope.$storage.news) {
                    console.log('getNews. news on storage');
                    _this.item = JSON.parse($rootScope.$storage.news);
                    $rootScope.loading = false;
                    $rootScope.error = !_this.item.hasOwnProperty('news');
                } else {
                    console.log('getNews. news NOT on storage');
                    $http({method: 'GET', url: Domain.news().index})
                        .then(function (obj) {
                            console.log('getNews. GET');
                            console.log(obj);
                            _this.item = obj.data.response;
                            $rootScope.$storage.news = JSON.stringify(_this.item);
                        })
                        .finally(function (data) {
                            console.log('finally. ');
                            console.log(data);
                            $rootScope.loading = false;
                            $rootScope.error = _this.item.hasOwnProperty('news');
                        })
                        .catch(function () {
                            console.log('catch. news. error');
                            $rootScope.error = true;
                        }
                    );
                }
            };

            $scope.getNewsPreviousToId = function(newsId){
//                console.log('getNewsPreviousToId. newsId: ' + newsId);
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $rootScope.loading = true;
                    $http({method: 'GET', url: Domain.news().up(newsId)})
                        .then(function (obj) {
//                            console.log(obj);
                            angular.forEach(obj.data.response.news, function (_item) {
                                _this.item.news.unshift(_item);
                            });
                        })
                        .finally(function (data) {
                            $rootScope.loading = false;
                        });
                }
            };

            $scope.getNewsAfterId = function(newsId){
//                console.log('getNewsAfterId. newsId: ' + newsId);
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $rootScope.loading = true;
                    $http({method: 'GET', url: Domain.news().down(newsId)})
                        .then(function (obj) {
//                            console.log(obj);
                            angular.forEach(obj.data.response.news, function (_item) {
                                _this.item.news.push(_item);
                            });
                        })
                        .finally(function (data) {
                            $rootScope.loading = false;
                        }
                    );
                }
            };

            $scope.setUpIScroll = function() {
                console.log('setUpIScroll');
                $scope._scroll = new IScroll('#wrapper'
                    , {click: true, preventDefault: true, bounce: true, probeType: 2});
                $scope._scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });
                $scope._scroll.on('scroll', function () {
                    if (this.y >= 50) {
                        $scope.getNewsPreviousToId(_news.first);
                    }

                    if (this.y <= this.maxScrollY) {
                        $scope.getNewsAfterId(_news.last);
                    }
                });

                $scope._scroll2 = new IScroll('#wrapper2', {click: true, preventDefault: true});
                $scope._scroll2.on('beforeScrollStart', function () {
                        this.refresh();
                    }
                );
            };

            $scope.init = function(){
                console.log('init');
                $scope.getNews();
                $scope.setUpIScroll();
            }();
        }
    ]);
