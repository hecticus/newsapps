'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.NewsCtrl
 * @description NewsCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('NewsCtrl', ['$http','$rootScope','$scope','$state','$localStorage', '$window', 'Domain'
        ,'Utilities', 'SocialAppsManager',
        function($http, $rootScope, $scope, $state, $localStorage, $window, Domain, Utilities
            , SocialAppsManager) {
            $rootScope.$storage.news = false;

            //Indicador de primera y ultima posicion en cache
            var _news = {
                first : 0,
                last : 0
            };
            $scope.item = {};
            $scope.news = [];

            $scope.share = function(_news) {
                SocialAppsManager.sharePost(_news.title,'Brazil Football',null,_news.summary);
            };

            $scope.fromNow = function(_date) {
                return Utilities.moment(_date).fromNow();
            };

            $scope.showContentNews = function(_news) {
                $scope.news.indexOf(_news);
                $scope.contentNews = $scope.news[$scope.news.indexOf(_news)];
                $scope.contentNews.body = $scope.contentNews.body.replace(/\n/g, '<br/><br/>');
                $rootScope.transitionPageBack('#wrapper2', 'left');
                $scope._scroll2.scrollTo(0,0,0);
            };

            $scope.getNews = function() {
                if ($rootScope.$storage.news) {
                    $rootScope.error = !$rootScope.$storage.hasOwnProperty('news');
                    $scope.news = JSON.parse($rootScope.$storage.news);
                    _news.first = $scope.news[0].idNews;
                    _news.last  = $scope.news[$scope.news.length-1].idNews;
                    //$scope.$emit('unload');
                } else {
                    $http.get(Domain.news.index())
                        .success(function (data, status, headers, config) {
                            $scope.news = data.response.news;
                            _news.first = $scope.news[0].idNews;
                            _news.last  = $scope.news[$scope.news.length-1].idNews;
                            $rootScope.$storage.news = JSON.stringify($scope.news);
                        }).finally(function (data) {
                            $rootScope.error = !$scope.news;
                            $scope.$emit('unload');
                        }).catch(function () {
                          $scope.$emit('error');
                        }
                    );
                }
            };

            $scope.getNewsPreviousToId = function(newsId){
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $scope.$emit('load');
                    $http.get(Domain.news.up(newsId))
                      .success(function (data, status, headers, config) {
                          if (data.response.news.length >= 1) {
                            _news.first = data.response.news[0].idNews;
                            angular.forEach(data.response.news, function(_item) {
                              $scope.news.unshift(_item);
                            });
                          }
                      }).catch(function () {
                        $scope.$emit('error');
                      }).finally(function (data) {
                          $scope.$emit('unload');
                      });
                }
            };

            $scope.getNewsAfterId = function(newsId){
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $scope.$emit('load');
                    $http.get(Domain.news.down(newsId))
                      .success(function (data, status, headers, config) {
                          if (data.response.news.length >= 1) {
                            _news.last = data.response.news[data.response.news.length-1].idNews;
                            angular.forEach(data.response.news, function(_item) {
                              $scope.news.push(_item);
                            });
                          }
                      }).catch(function () {
                          $scope.$emit('error');
                      }).finally(function (data) {
                         $scope.$emit('unload');
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
                $scope.$emit('load');
                $scope.getNews();
                $scope.setUpIScroll();
            }();




        }
    ]);
