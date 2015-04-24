'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.NewsCtrl
 * @description NewsCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('NewsCtrl', ['$http','$rootScope','$scope','$state', '$stateParams', '$localStorage', '$window', '$translate', 'Domain'
        ,'Moment', 'iScroll', 'SocialAppsManager', 'News', 'CordovaDevice', 'Notification',
        function($http, $rootScope, $scope, $state, $stateParams, $localStorage, $window, $translate, Domain, Moment,
                 iScroll, SocialAppsManager, News, CordovaDevice, Notification) {


            //Indicador de primera y ultima posicion en cache
            var _news = {
                first : 0,
                last : 0
            };

            var strings = {};

            var listScroll = null;
            var detailScroll = null;

            $rootScope.$storage.news = false;
            $scope.hasNews = true;
            $scope.news = [];
            $rootScope.share = share;
            $scope.fromNow = fromNow;
            $scope.showContentNews = showContentNews;


            /*---------------- Scope Functions ----------------*/
            function share(_news) {
                SocialAppsManager.share({
                    'message' : _news.summary,
                    'subject' : _news.title,
                    'link' : 'http://timfutebol.hecticus.com/#!/news/' + _news.idNews
                });
            }

            function fromNow(_date) {
                return Moment.date(_date).fromNow();
            }

            function getTranslations(){
                $translate(['ALERT.NEWS_LIMIT.TITLE', 'ALERT.NEWS_LIMIT.MSG', 'ALERT.NEWS_LIMIT.CONFIRM', 'ALERT.NEWS_LIMIT.CANCEL'])
                    .then(function(translation){
                        strings['NEWS_LIMIT_TITLE'] = translation['ALERT.NEWS_LIMIT.TITLE'];
                        strings['NEWS_LIMIT_MSG'] = translation['ALERT.NEWS_LIMIT.MSG'];
                        strings['NEWS_LIMIT_CONFIRM'] = translation['ALERT.NEWS_LIMIT.CONFIRM'];
                        strings['NEWS_LIMIT_CANCEL'] = translation['ALERT.NEWS_LIMIT.CANCEL'];
                    });
            }


            function showContentNews(_news) {
                if(_news) {



                    if (!$scope.isGuest() || ($scope.isGuest() && News.canViewNews(_news))) {
                        $scope.contentNews = $scope.news[$scope.news.indexOf(_news)];
                        $scope.contentNews.body = $scope.contentNews.body.replace(/\n/g, '<br/><br/>');
                        if (_news.resources != undefined) $scope.contentNews.img = _news.resources[0];
                        $rootScope.transitionPageBack('#wrapper2', 'left');
                        $rootScope.isPageContentLeft = angular.element('#wrapper2').hasClass('left');
                        detailScroll.scrollTo(0, 0, 0);
                    } else {
                        Notification.showNotificationDialog(
                            {
                                title: strings.NEWS_LIMIT_TITLE,
                                message: strings.NEWS_LIMIT_MSG,
                                confirm: strings.NEWS_LIMIT_CONFIRM,
                                cancel: strings.NEWS_LIMIT_CANCEL
                            }
                        );
                        console.log('Daily News Limit Exceeded');
                    }
                } else {
                    console.log('Not a valid news object');
                }
            }

            /*---------------- Internal Functions ----------------*/

            function getNewsPreviousToId(newsId){
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $scope.$emit('load');
                    return $http.get(Domain.news.up(newsId))
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
                            Notification.showNetworkErrorAlert();
                            console.log('getNewsPreviousToId. Network Error.');
                            $scope.$emit('unload');
                        });
                }
            }

            function getNewsAfterId(newsId){
                if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $scope.$emit('load');
                    return $http.get(Domain.news.down(newsId))
                        .then(function (data) {
                            data = data.data;
                            if (data.response.news.length >= 1) {
                                _news.last = data.response.news[data.response.news.length-1].idNews;
                                angular.forEach(data.response.news, function(_item) {
                                    var matches = $scope.news.filter(function(elem){
                                        return elem.idNews === _item.idNews;
                                    });
                                    if(matches.length == 0) {
                                        $scope.news.push(_item);
                                    }
                                });
                            }
                            $scope.$emit('unload');
                        }, function () {
                            Notification.showNetworkErrorAlert();
                            console.log('getNewsAfterId. Network Error.');
                            $scope.$emit('unload');
                        });
                }
            }

            function getNews() {
                if ($rootScope.$storage.news) {
                    $rootScope.error = !$rootScope.$storage.hasOwnProperty('news');
                    $scope.news = JSON.parse($rootScope.$storage.news);
                    _news.first = $scope.news[0].idNews;
                    _news.last  = $scope.news[$scope.news.length-1].idNews;
                }
                return $http.get(Domain.news.index()).then(
                    function (data) {
                        data = data.data;
                        if(data.response.total > 0){
                            $scope.hasNews = true;
                            $scope.news = data.response.news;
                            _news.first = $scope.news[0].idNews;
                            _news.last  = $scope.news[$scope.news.length-1].idNews;
                            $rootScope.$storage.news = JSON.stringify($scope.news);
                        } else {
                            $scope.hasNews = false;
                            console.log('No News Available.');
                        }
                        $scope.$emit('unload');
                    }, function () {
                        $scope.hasNews = false;
                        Notification.showNetworkErrorAlert();
                        console.log('getNews. Network Error.');
                        $scope.$emit('unload');
                    });
            }

            function getNewsById(id){
                return $scope.news.filter(function(news){
                    return news.idNews === id;
                })[0];
            }

            function setUpIScroll() {
                listScroll = iScroll.vertical('wrapper');
                listScroll.on('scroll', function () {
                    if (this.y >= 50) {
                        getNewsPreviousToId(_news.first);
                    }

                    if (this.y <= this.maxScrollY) {
                        getNewsAfterId(_news.last);
                    }
                });
                detailScroll = iScroll.vertical('wrapper2');

                $scope.$on('$destroy', function() {
                    listScroll.destroy();
                    listScroll = null;

                    detailScroll.destroy();
                    detailScroll = null;
                });
            }

            function init(){
               $scope.$emit('load');
               getTranslations();
                getNews().then(function(){
                    if($stateParams.newsId){
                        $scope.showContentNews(getNewsById($stateParams.newsId));
                    }
                });
                setUpIScroll();
            } init();

            $scope.$on('onRepeatLast', function(scope, element, attrs) {
              $scope.$emit('unload');
            });

        }
    ]);
