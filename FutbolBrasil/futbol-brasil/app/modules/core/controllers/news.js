'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.NewsCtrl
 * @description NewsCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('NewsCtrl', ['$http','$rootScope','$scope','$state','$localStorage','Domain','Utilities',
      function($http, $rootScope, $scope, $state, $localStorage, Domain, Utilities) {

        var _this = this;
        var _news = {first:0, last:0};
        var _promise = false;

        $scope.$on('onRepeatFirst', function(scope, element, attrs) {
          _news.first = element.first().data('news');
          $rootScope.loading = false;
          });

        $scope.$on('onRepeatLast', function(scope, element, attrs) {
          _news.last = element.last().data('news');
          $rootScope.loading = false;
          });


        _this.share = function(_news) {
          window.plugins.socialsharing.share(_news.title,'Brazil Football',null,_news.summary);
        };

        _this.fromNow = function(_date) {
          return Utilities.moment(_date).fromNow();
        };

        _this.showContentNews = function(_news) {
          $rootScope.contentNews = _news;
          angular.element('#wrapper2').attr('class','page transition left');
          _scroll2.scrollTo(0,0,0);
          };

        if ($rootScope.$storage.news) {
          _this.item = JSON.parse($rootScope.$storage.news);
          $rootScope.loading = false;
          $rootScope.error = Utilities.error(_this.item.news);
        } else {
          _promise = $http({method: 'GET', url: Domain.news().index});
          _promise.then(function(obj) {
            _this.item =  obj.data.response;
            $rootScope.$storage.news = JSON.stringify(obj.data.response);
          }).finally(function(data) {
              $rootScope.loading = false;
              $rootScope.error = Utilities.error(_this.item.news);
          }).catch(function() {
            $rootScope.error = true;
          });
        }


        var _scroll = new IScroll('#wrapper',{click:true,preventDefault:true, bounce: true,  probeType: 2});
        _scroll.on('beforeScrollStart', function () {
          this.refresh();
        });

        _scroll.on('scroll', function () {

          if (this.y >= 50 ) {
            if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
              $rootScope.loading = true;
              _promise = $http({method: 'GET', url: Domain.news().up(_news.first)});
              _promise.then(function(obj) {
                angular.forEach(obj.data.response.news, function(_item) {
                  _this.item.news.unshift(_item);
                });
              }).finally(function(data) {
                $rootScope.loading = false;
              });
            }
                }

                if (this.y <= this.maxScrollY) {
                  if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
                    $rootScope.loading = true;
                    _promise = $http({method: 'GET', url: Domain.news().down(_news.last)});
              _promise.then(function(obj) {
                angular.forEach(obj.data.response.news, function(_item) {
                  _this.item.news.push(_item);
                });
              }).finally(function(data) {
                $rootScope.loading = false;
              });
            }
          }

        });

        var _scroll2 = new IScroll('#wrapper2',{click:true, preventDefault:true});
        _scroll2.on('beforeScrollStart', function () {
          this.refresh();
        });
      }
]);
