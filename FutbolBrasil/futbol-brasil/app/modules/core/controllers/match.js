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
        ,'WebManager', 'Domain', 'Moment', 'iScroll',
        function($http, $rootScope, $scope, $window, $state, $localStorage, WebManager,
                 Domain, Moment, iScroll) {

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
                return Moment.date(_date).format('H:MM');
            };

            $scope.pagesBefore = [];
            $scope.pagesAfter = [];

            $scope.pages = [
                {id: 1, name: Moment.date().subtract(2, 'days').format(_formatDate), date:Moment.date().subtract(2, 'days').format('YYYYMMDD')},
                {id: 2, name:'Ontem', date:Moment.date().subtract(1, 'days').format('YYYYMMDD')},
                {id: 3, name:'Hoje', date:Moment.date().format('YYYYMMDD')},
                {id: 4, name:'Amanha', date:Moment.date().add(1, 'days').format('YYYYMMDD')},
                {id: 5, name: Moment.date().add(2, 'days').format(_formatDate), date:Moment.date().add(2, 'days').format('YYYYMMDD')}
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

            function setEmptyDayFlag(day){
                if(day.leagues.length > 0){
                    var leagueReduce = day.leagues.reduce(function(previousValue, currentValue, index) {
                        if(index > 1){
                            return previousValue + currentValue.fixtures.length;
                        }else{
                            return previousValue.fixtures.length + currentValue.fixtures.length;
                        }
                    });
                    console.log('leagueReduce: ' + leagueReduce);
                    day.empty = leagueReduce <= 0;
                } else {
                    day.empty = true;
                }
            }

            function getDayMatches(_item, _index){
                var config = WebManager.getFavoritesConfig($rootScope.isFavoritesFilterActive());
                config.params.pageSize = _limit;
                config.params.page = 0;

                $http.get(Domain.match(_item.date), config)
                    .then(function (data) {
                        data = data.data;
                        var day = data.response;
                        setEmptyDayFlag(day);
                        $scope.pages[_index].matches = day;
                        $scope.$emit('unload');
                    }, function () {
                        $scope.$emit('unload');
                        $scope.$emit('error');
                    }
                );
            }

            function init(){
                $scope.$emit('unload');

                angular.forEach($scope.pages, function(_item, _index) {
                    getDayMatches(_item, _index);
                });

                $scope.width = $window.innerWidth;
                $scope.widthTotal = ($window.innerWidth * $scope.pages.length);

                $scope.scroll = iScroll.horizontal('wrapperH');
                $scope.nextPage = function(){
                    $scope.scroll.next();
                };

                $scope.prevPage = function(){
                    $scope.scroll.prev();
                };

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    if (_start) {

                        $scope.scroll.refresh();
                        $scope.scroll.goToPage(2,0);
                        _start = false;

                        angular.forEach($scope.pages, function(_item, _index) {
                            iScroll.vertical($scope.wrapper.getName(_index));
                        });
                    }
                });

                $scope.scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });

                $scope.scroll.on('scrollStart', function () {
                    _currentPage = this.currentPage.pageX;
                });

                $scope.scroll.on('scroll', function () {
                    if (this.currentPage.pageX != _currentPage) {
                        _currentPage = this.currentPage.pageX;
                    }

                    var page = $scope.pages[_currentPage];
                    if(page && page.matches && page.matches.leagues && page.matches.leagues.length <1){
                        console.log('Page Empty: ' + _currentPage);
                    }


                    if (this.currentPage.pageX  == ($scope.pages.length - 1)) {
                        _index = $scope.pagesAfter.length + 3;
                        $scope.pagesAfter.push(
                            {
                                id: ($scope.pages.length + 1),
                                name: Moment.date().add(_index, 'days').format(_formatDate),
                                date: Moment.date().add(_index, 'days').format('YYYYMMDD')
                            }
                        );

                        $scope.pages.push(($scope.pagesAfter[$scope.pagesAfter.length - 1]));
                        $scope.widthTotal = (window.innerWidth * $scope.pages.length);

                        $scope.$emit('load');
                        _index = $scope.pages.length - 1;
                        getDayMatches($scope.pages[_index], _index);
                    }
                });
            } init();

        }
    ]);
