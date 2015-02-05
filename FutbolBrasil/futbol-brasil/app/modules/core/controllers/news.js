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


            $rootScope.$storage.news = false;

            //Indicador de primera y ultima posicion en cache
            var _news = {
                first : 0,
                last : 0
            };

            $scope.item = {};
            $scope.news = [];

            var _scroll = Utilities.newScroll.vertical('wrapper');
			      var _scroll2 = Utilities.newScroll.vertical('wrapper2');

            $scope.share = function(_news) {
              sharePost(_news.title,'Brazil Football',null,_news.summary);
            };

            $scope.fromNow = function(_date) {
                return Utilities.moment(_date).fromNow();
            };



            $scope.showContentNews = function(_news) {
                $scope.news.indexOf(_news);
                $scope.contentNews = $scope.news[$scope.news.indexOf(_news)];
                $scope.contentNews.body = $scope.contentNews.body.replace(/\n/g, '<br/><br/>');
                $rootScope.transitionPageBack('#wrapper2', 'left');
                _scroll2.scrollTo(0,0,0);
            };

            $scope.getNews = function() {
                if ($rootScope.$storage.news) {
                    $rootScope.error = !$rootScope.$storage.hasOwnProperty('news');
                    $scope.news = JSON.parse($rootScope.$storage.news);
                    _news.first = $scope.news[0].idNews;
				            _news.last  = $scope.news[$scope.news.length-1].idNews;
                    //$scope.$emit('unload');
                } else {
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
                            $rootScope.error = !$scope.news;
                            $scope.$emit('unload');
                        })
                        .catch(function () {
                            $rootScope.error = true;
                        }
                    );
                }
            };

            $scope.getNewsPreviousToId = function(newsId){
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $scope.$emit('load');
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
                          $scope.$emit('unload');
                      });
                }
            };

            $scope.getNewsAfterId = function(newsId){
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $scope.$emit('load');
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
                         $scope.$emit('unload');
                      }
                    );
                }
            };

            $scope.setUpIScroll = function() {
                console.log('setUpIScroll');

                _scroll.on('scroll', function () {
                    if (this.y >= 50) {
                        $scope.getNewsPreviousToId(_news.first);
                    }

                    if (this.y <= this.maxScrollY) {
                        $scope.getNewsAfterId(_news.last);
                    }
                });


            };

            $scope.init = function(){
                $scope.$emit('load');
                $scope.getNews();
                $scope.setUpIScroll();
            }();




        }
    ]);
