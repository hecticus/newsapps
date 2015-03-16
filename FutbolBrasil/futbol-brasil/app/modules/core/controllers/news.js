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
        ,'Moment', 'iScroll', 'SocialAppsManager', 'News', 'CordovaApp', 'CordovaDevice',
        function($http, $rootScope, $scope, $state, $localStorage, $window, Domain, Moment,
                 iScroll, SocialAppsManager, News, CordovaApp, CordovaDevice) {

            $rootScope.$storage.news = false;
            $scope.hasNews = true;
            $scope.item = {};
            $scope.news = [];

            //Indicador de primera y ultima posicion en cache
            var _news = {
                first : 0,
                last : 0
            };

            var listScrollWrapper = null;
            var detailScrollWrapper = null;

            $scope.share = function(_news) {
                if(CordovaDevice.isWebPlatform()){
                    $scope.showShareModal(_news.summary, _news.title);
                } else {
                    SocialAppsManager.share(_news.summary, _news.title);
                }
            };

            $scope.fromNow = function(_date) {
                return Moment.date(_date).fromNow();
            };

            $scope.showContentNews = function(_news) {
                if(!$scope.isGuest() || ($scope.isGuest() && News.canViewNews(_news))){
                    $scope.contentNews = $scope.news[$scope.news.indexOf(_news)];
                    $scope.contentNews.body = $scope.contentNews.body.replace(/\n/g, '<br/><br/>');
                    $rootScope.transitionPageBack('#wrapper2', 'left');
                    $scope._scroll2.scrollTo(0,0,0);
                } else {
                    CordovaApp.showNotificationDialog(
                        {
                            title: 'Daily News Limit Exceeded',
                            message: 'You have exceeded your free daily news limit',
                            confirm: 'Ok',
                            cancel: 'Cancel'
                        }
                    );
                    console.log('Daily News Limit Exceeded');
                }
            };

            function getNewsPreviousToId(newsId){
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $scope.$emit('load');
                    $http.get(Domain.news.up(newsId))
                        .then(function (data) {
                            data = data.data;
                            if (data.response.news.length >= 1) {
                                _news.first = data.response.news[0].idNews;
                                angular.forEach(data.response.news, function(_item) {
                                    var matches = $scope.news.filter(function(elem){
                                        return elem.idNews === _item.idNews;
                                    });
                                    if(matches.length == 0) {
                                        $scope.news.unshift(_item);
                                    }
                                });
                            }
                            $scope.$emit('unload');
                        }, function () {
                            $scope.$emit('error');
                            $scope.$emit('unload');
                        });
                }
            }

            function getNewsAfterId(newsId){
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $scope.$emit('load');
                    $http.get(Domain.news.down(newsId))
                        .then(function (data) {
                            data = data.data;
                            if (data.response.news.length >= 1) {
                                _news.last = data.response.news[data.response.news.length-1].idNews;
                                angular.forEach(data.response.news, function(_item) {
                                    var matches = $scope.news.filter(function(elem){
                                        return elem.idNews === _item.idNews;
                                    });
//                                    console.log(_item.idNews);
//                                    console.log(matches);
                                    if(matches.length == 0) {
                                        $scope.news.push(_item);
                                    }
                                });
                            }
                            $scope.$emit('unload');
                        }, function () {
                            $scope.$emit('unload');
                            $scope.$emit('error');
                        });
                }
            }

            function getNews() {
                if ($rootScope.$storage.news) {
                    $rootScope.error = !$rootScope.$storage.hasOwnProperty('news');
                    $scope.news = JSON.parse($rootScope.$storage.news);
                    _news.first = $scope.news[0].idNews;
                    _news.last  = $scope.news[$scope.news.length-1].idNews;
                    //$scope.$emit('unload');
                }
                $http.get(Domain.news.index())
                    .then(function (data, status) {
                        data = data.data;
                        if(data.response.total > 0){
                            $scope.hasNews = true;
                            $scope.news = data.response.news;
                            _news.first = $scope.news[0].idNews;
                            _news.last  = $scope.news[$scope.news.length-1].idNews;
                            $rootScope.$storage.news = JSON.stringify($scope.news);
                        } else {
                            $scope.hasNews = false;
                            console.log('No News Available');
                        }
                        $rootScope.error = !$scope.news;
                        $scope.$emit('unload');
                    }, function () {
                        $scope.$emit('unload');
                        $scope.$emit('error');
                    });
            }

            function setUpIScroll() {
                listScrollWrapper = iScroll.vertical('wrapper');
                listScrollWrapper.on('scroll', function () {
                    if (this.y >= 50) {
                        getNewsPreviousToId(_news.first);
                    }

                    if (this.y <= this.maxScrollY) {
                        getNewsAfterId(_news.last);
                    }
                });

                detailScrollWrapper = iScroll.vertical('wrapper2');
            }

            function init(){
                $scope.$emit('load');
                getNews();
                setUpIScroll();
            }init();
        }
    ]);
