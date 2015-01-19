'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MatchCtrl
 * @description MatchCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('MatchCtrl', ['$http','$rootScope','$scope', '$window', '$state','$localStorage'
        ,'Domain','Utilities',
      function($http, $rootScope, $scope, $window, $state, $localStorage, Domain, Utilities, data) {

        var _this = this;
        var _promise = false;
        var _angular =  angular.element;
        var _limit = 2;
        var _date = Utilities.moment().format('YYYYMMDD');
        var _currentPage = 0;
        var _goToPage = true;

        _this.pages = [
          {name:'Ontem'},
          {name:'Hoje'},
          {name:'Amanha'}
        ];

        _this.width = $window.innerWidth;
        _this.widthTotal = ($window.innerWidth * _this.pages.length);

        $scope.getWidth = function(){
          return { 'width': _this.width + ' px'}
        };

        $scope.getTotalWidth = function(){
          return { 'width': _this.widthTotal + ' px'}
        };

        var _scroll = new IScroll('#wrapperH', {
          scrollX: true,
          scrollY: false,
          mouseWheel: false,
          momentum: false,
          snap: true,
          snapSpeed: 1000,
          probeType: 3,
          bounce: false
        });

        _scroll.on('beforeScrollStart', function () {
          this.refresh();
        });

        _scroll.on('scrollStart', function () {
          _currentPage = this.currentPage.pageX;
        });

        _scroll.on('scroll', function () {

          if (this.currentPage.pageX != _currentPage) {

            if (_currentPage < this.currentPage.pageX) {

              if (this.currentPage.pageX  == (_this.pages.length - 1)) {
                $scope.$apply(function () {
                  _this.pages.push({name: Utilities.moment().add((_this.pages.length - 1), 'days')
                    .format('MMM Do YY')});
                  _this.widthTotal = (window.innerWidth * _this.pages.length);
                });
              }

            } else {
              /*if (this.currentPage.pageX == 0)  {
                $scope.$apply(function () {
                  _this.pages.unshift({name: Utilities.moment().subtract(1, 'days').format('MMM Do YY')});
                  _this.widthTotal = (window.innerWidth * _this.pages.length);
                });
              }*/
            }

            _currentPage = this.currentPage.pageX;

          }
        });

        _scroll.on('scrollEnd', function () {
          //this.refresh();
        });

        $scope.$on('onRepeatLast', function(scope, element, attrs) {
          if (_goToPage) {
            _scroll.refresh();
            _scroll.goToPage(1,0);
            _goToPage = false;
          }

        });

        $rootScope.loading = false;
          console.log('match');

      }
]);
