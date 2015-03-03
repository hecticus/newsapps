'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.ScorersCtrl
 * @description ScorersCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('ScorersCtrl',  ['$http','$rootScope','$scope','$state','$localStorage', '$window', 'WebManager', 'Domain','Utilities',
        function($http, $rootScope, $scope, $state, $localStorage, $window, WebManager, Domain, Utilities) {

            $rootScope.$storage.scorers = false;

            $scope.strings = {
                PLAYER_NAME_LABEL: 'Nome do jogador',
                TEAM_LABEL: 'Equipe',
                GOALS_LABEL: 'Goles'
            };

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

            $scope.getScorerName = function(scorer){
                if(scorer.nickname && scorer.nickname != ''){
                    return scorer.nickname;
                } else {
                    return scorer.name;
                }
            };

            $scope.init = function(){
                $scope.$emit('load');
                if ($rootScope.$storage.scorers) {
                    $scope.item = JSON.parse($rootScope.$storage.scorers);
                    $rootScope.error = Utilities.error($scope.item.leagues,'scorers');
                } else {
                    var config = WebManager.getFavoritesConfig($scope.isFavoritesFilterActive());
                    $http.get(Domain.scorers(), config)
                        .success(function (data, status, headers, config) {
                            $scope.item =  data.response;
                            console.log(data.response);
                            $rootScope.$storage.scorers = JSON.stringify(data.response);
                            $scope.widthTotal = ($window.innerWidth * $scope.item.leagues.length);
                        }).catch(function () {
                            $scope.$emit('error');
                        }).finally(function(data) {
                            $scope.$emit('unload');
                            $rootScope.error = $scope.item.leagues.hasOwnProperty('news');
                        });
                }

                var _scroll = Utilities.newScroll.horizontal('wrapperH');

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    angular.forEach($scope.item.leagues, function(_item, _index) {
                        console.log('vScroll for ' + $scope.wrapper.getName(_index));
                        Utilities.newScroll.vertical($scope.wrapper.getName(_index));
                    });

                });

                $scope.nextPage = function(){
                    _scroll.next();
                };

                $scope.prevPage = function(){
                    _scroll.prev();
                };

            }();




        }
    ]);