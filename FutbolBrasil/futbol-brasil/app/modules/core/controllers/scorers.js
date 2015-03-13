'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.ScorersCtrl
 * @description ScorersCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('ScorersCtrl',  ['$http','$rootScope','$scope', '$state', '$localStorage', '$window', '$translate', 'WebManager', 'Domain','iScroll', 'Competitions',
        function($http, $rootScope, $scope, $state, $localStorage, $window, $translate, WebManager, Domain, iScroll, Competitions) {

            var scroll = null;

            $rootScope.$storage.scorers = false;
            var _currentPage = 0;

            $scope.vWrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            $scope.width = $window.innerWidth;
            $scope.widthTotal = $window.innerWidth;

            $scope.getWidth = function(){
                return { 'width': $scope.width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': $scope.widthTotal + 'px'}
            };

            function getScorers(){
                var _index = scroll.currentPage.pageX;
                if (!$scope.leagues[_index].scorers) {
                    $scope.$emit('load');
                    Competitions.getScorers($scope.leagues[_index].id_competitions)
                        .then(function (scorers) {
                            if(scorers.length > 0){
                                scorers.map(function(scorer){
                                    if(!scorer.team.name){
                                        scorer.team.name = $scope.strings.NOT_AVAILABLE;
                                    }
                                });
                                $scope.leagues[_index].scorers = scorers;
                                $scope.leagues[_index].empty = false;
                            } else {
                                $scope.leagues[_index].empty = true;
                            }
                            $scope.$emit('unload');
                        }, function () {
                            $scope.leagues[_index].empty = true;
                            $scope.$emit('unload');
                            $scope.$emit('error');
                        }
                    );
                }
            }

            function setScroll() {

                scroll = iScroll.horizontal('wrapperH');

                $scope.nextPage = function(){
                    scroll.next();
                };

                $scope.prevPage = function(){
                    scroll.prev();
                };

                scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });

                scroll.on('scrollStart', function () {
                    _currentPage = this.currentPage.pageX;
                });

                scroll.on('scroll', function () {
                    if (this.currentPage.pageX != _currentPage) {
                        getScorers();
                        _currentPage = this.currentPage.pageX;
                    }
                });

            }

            function init(){
                $scope.$emit('load');
                Competitions.get.then(function(data){
                    $scope.leagues  = data;
                    $scope.widthTotal = ($window.innerWidth * $scope.leagues.length);
                    setScroll();
                    getScorers();
                });

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    iScroll.vertical($scope.vWrapper.getName(_currentPage));
                });

                $scope.$emit('unload');
            } init();

        }
    ]);
