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
        function($http, $rootScope, $scope, $window, $state, $localStorage, Domain, Utilities) {

            var _limit = 100;
            var _currentPage = 0;
            var _start = true;
            var _index = 0;
            var _formatDate = 'MMM Do YY';

            $scope.$emit('load');
            $scope.wrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            $scope.getTime = function(_date) {
                return Utilities.moment(_date).format('H:MM');
            };

            $scope.pagesBefore = [];
            $scope.pagesAfter = [];

            $scope.pages = [
                {id: 1, name: Utilities.moment().subtract(2, 'days').format(_formatDate), date:Utilities.moment().subtract(2, 'days').format('YYYYMMDD')},
                {id: 2, name:'Ontem', date:Utilities.moment().subtract(1, 'days').format('YYYYMMDD')},
                {id: 3, name:'Hoje', date:Utilities.moment().format('YYYYMMDD')},
                {id: 4, name:'Amanha', date:Utilities.moment().add(1, 'days').format('YYYYMMDD')},
                {id: 5, name: Utilities.moment().add(2, 'days').format(_formatDate), date:Utilities.moment().add(2, 'days').format('YYYYMMDD')}
            ];

            $scope.width = $window.innerWidth;
            $scope.widthTotal = ($window.innerWidth * 11);

            $scope.getWidth = function(){
                return { 'width': $scope.width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': $scope.widthTotal + 'px'}
            };

            $scope.getMatchStatusClass = function(match){
                if(match.status == 'Encerrado') {
                    return 'encerrado';
                }else if(match.status == 'Default'){
                    return 'default';
                } else {
                    //TODO WTF?!
                    return 'else';
                }
            };

            $scope.init = function(){
                $rootScope.loading = false;

                angular.forEach($scope.pages, function(_item, _index) {
                    $http.get(Domain.match(_item.date,_limit,0))
                        .success(function (data, status, headers, config) {
                           $scope.pages[_index].matches = data.response;
                        }).catch(function () {
                            $scope.$emit('error');
                        }).finally(function(data) {
                           $scope.$emit('unload');
                           $rootScope.error = Utilities.error();
                        });
                });

                $scope.width = $window.innerWidth;
                $scope.widthTotal = ($window.innerWidth * $scope.pages.length);
                var _scroll = new IScroll('#wrapperH', {
                    scrollX: true,
                    scrollY: false,
                    mouseWheel: false,
                    momentum: false,
                    snap: true,
                    snapSpeed: 700,
                    probeType: 3,
                    bounce: false
                });

                _scroll.on('scrollEnd', function () {
                    //this.refresh();
                });

                $scope.$on('onRepeatFirst', function(scope, element, attrs) {
                    //console.log('onRepeatFirst');
                });

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    if (_start) {

                        _scroll.refresh();
                        _scroll.goToPage(2,0);
                        _start = false;

                        angular.forEach($scope.pages, function(_item, _index) {
                            Utilities.newScroll.vertical($scope.wrapper.getName(_index));
                        });
                    }
                });

                _scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });

                _scroll.on('scrollStart', function () {
                    _currentPage = this.currentPage.pageX;
                });

                _scroll.on('scroll', function () {

                    if (this.currentPage.pageX != _currentPage) {

                        if (this.currentPage.pageX  == ($scope.pages.length - 1)) {

                            _index = $scope.pagesAfter.length + 3;
                            $scope.pagesAfter.push(
                                {
                                    id: ($scope.pages.length + 1),
                                    name: Utilities.moment().add(_index, 'days').format(_formatDate),
                                    date: Utilities.moment().add(_index, 'days').format('YYYYMMDD')
                                }
                            );

                            $scope.pages.push(($scope.pagesAfter[$scope.pagesAfter.length - 1]));
                            $scope.widthTotal = (window.innerWidth * $scope.pages.length);

                            $scope.$emit('load');

                            _index = $scope.pages.length - 1;

                            $http.get(Domain.match($scope.pages[_index].date,_limit,0))
                              .success(function (data, status, headers, config) {
                                  $scope.pages[_index].matches = data.response;
                                  Utilities.newScroll.vertical($scope.wrapper.getName(_index));
                              }).catch(function () {
                                $scope.$emit('error');
                              }).finally(function(data) {
                                  $scope.$emit('unload');
                                  $rootScope.error = Utilities.error();
                              });

                        }

                        _currentPage = this.currentPage.pageX;

                    }
                });
            }();

        }
    ]);
