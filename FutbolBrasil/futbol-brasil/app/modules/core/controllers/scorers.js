'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.ScorersCtrl
 * @description ScorersCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('ScorersCtrl',  ['$http','$rootScope','$scope', '$state', '$localStorage', '$window', '$translate', 'WebManager', 'Domain','Utilities',
        function($http, $rootScope, $scope, $state, $localStorage, $window, $translate, WebManager, Domain, Utilities) {

            $rootScope.$storage.scorers = false;

            $scope.wrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            $scope.width = $window.innerWidth;
            $scope.widthTotal = ($window.innerWidth * 11);

            $scope.getWidth = function(){
                return { 'width': $scope.width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': $scope.widthTotal + 'px'}
            };

            $scope.init = function(){
                $scope.$emit('load');
                if ($rootScope.$storage.scorers) {
                    $scope.item = JSON.parse($rootScope.$storage.scorers);
                    $rootScope.error = Utilities.error($scope.item.leagues,'scorers');
                } else {
                    var config = WebManager.getFavoritesConfig($scope.isFavoritesFilterActive());
                    config.params.page = 0;
                    config.params.pageSize = 20;
                    $http.get(Domain.scorers(), config)
                        .then(function (data, status, headers, config) {
                            data = data.data;
                            $scope.item =  data.response;
                            //Map for empty team names
                            var leagues = data.response.leagues;
                            leagues.forEach(function(league){
                                league.scorers.map(function(scorer){
                                    if(!scorer.team.name){
                                        scorer.team.name = $scope.strings.NOT_AVAILABLE;
                                    }
                                });
                            });
                            //End Map for empty team names
                            $rootScope.$storage.scorers = JSON.stringify(data.response);
                            $scope.widthTotal = ($window.innerWidth * $scope.item.leagues.length);
                            $scope.$emit('unload');
                        }, function () {
                            $scope.$emit('error');
                            $scope.$emit('unload');
                            $rootScope.error = $scope.item.leagues.hasOwnProperty('news');
                        });
                }

                var _scroll = Utilities.newScroll.horizontal('wrapperH');

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    angular.forEach($scope.item.leagues, function(_item, _index) {
                        Utilities.newScroll.vertical($scope.wrapper.getName(_index));
                    });

                });

                $scope.nextPage = function(){
                    console.log('nextPage');
                    _scroll.next();
                };

                $scope.prevPage = function(){
                    console.log('prevPage');
                    _scroll.prev();
                };

            }();
        }
    ]);