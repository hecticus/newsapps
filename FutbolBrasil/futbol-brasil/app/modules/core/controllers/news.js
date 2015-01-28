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

            //Indicador de primera y ultima posicion en cache
            var _news = {
                first : 0,
                last : 0
            };
            $scope.item = {};
            $scope.news = [];

            $scope.share = function(_news) {
              sharePost(_news.title,'Brazil Football',null,_news.summary);
            };

            $scope.fromNow = function(_date) {
                return Utilities.moment(_date).fromNow();
            };

            $scope.showContentNews = function(_news) {
                $scope.news.indexOf(_news);
                $scope.contentNews = $scope.news[$scope.news.indexOf(_news)];
                angular.element('#wrapper2').attr('class','page transition left');
                $scope._scroll2.scrollTo(0,0,0);
            };

            $scope.getNews = function() {
                console.log('getNews');
                if ($rootScope.$storage.news) {
                    console.log('getNews. news on storage');
                    $rootScope.loading = false;
                    $rootScope.error = !$rootScope.$storage.hasOwnProperty('news');
                    $scope.news = JSON.parse($rootScope.$storage.news);
                    _news.first = $scope.news[0].idNews;
				            _news.last  = $scope.news[$scope.news.length-1].idNews;
                    console.log($scope.news);
                } else {
                    console.log('getNews. news NOT on storage');
                    $http({method: 'GET', url: Domain.news.index()})
                        .then(function (obj) {
                            console.log('getNews. GET');
                            console.log(obj);
                            $scope.news = obj.data.response.news;
                            _news.first = $scope.news[0].idNews;
                            _news.last  = $scope.news[$scope.news.length-1].idNews;
                            $rootScope.$storage.news = JSON.stringify($scope.news);
                        })
                        .finally(function (data) {
                            console.log('finally. ');
                            console.log($scope.item);
                            console.log(!$scope.item.hasOwnProperty('news'));
                            $rootScope.loading = false;
                            $rootScope.error = !$scope.news;
                        })
                        .catch(function () {
                            console.log('catch. news. error');
                            $rootScope.error = true;
                        }
                    );
                }
            };

            $scope.getNewsPreviousToId = function(newsId){
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $rootScope.loading = true;
                    $http({method: 'GET', url: Domain.news.up(newsId)})
                      .then(function (obj) {
                          if (obj.data.response.news.length >= 1) {
                            _news.first = obj.data.response.news[0].idNews;
                            angular.forEach(obj.data.response.news, function(_item) {
                              $scope.news.unshift(_item);
                            });
                          }
                      })
                      .finally(function (data) {
                          $rootScope.loading = false;
                      });
                }
            };

            $scope.getNewsAfterId = function(newsId){
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $rootScope.loading = true;
                    $http({method: 'GET', url: Domain.news.down(newsId)})
                      .then(function (obj) {
                          if (obj.data.response.news.length >= 1) {
                            _news.last = obj.data.response.news[obj.data.response.news.length-1].idNews;
                            angular.forEach(obj.data.response.news, function(_item) {
                              $scope.news.push(_item);
                            });
                          }
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
