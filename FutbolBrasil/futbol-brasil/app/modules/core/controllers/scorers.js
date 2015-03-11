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

            var config = WebManager.getFavoritesConfig($scope.isFavoritesFilterActive());

            $rootScope.$storage.scorers = false;
            var _currentPage = 0;

            $scope.wrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            $scope.width = $window.innerWidth;
            $scope.getWidth = function(){
                return { 'width': $scope.width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': $scope.widthTotal + 'px'}
            };


            $scope.getScorers = function(){

                  var _index = $scope.scroll.currentPage.pageX;
                  if (!$scope.leagues[_index].scorers) {

                    $scope.$emit('load');
                    $http.get(Domain.scorers($scope.leagues[_index].id_competitions), config)
                    .success(function (data, status, headers, config) {

                        if (data.error == 0) {
                          //Map for empty team names
                          var scorers = data.response.scorers;
                          scorers.map(function(scorer){
                              if(!scorer.team.name){
                                  scorer.team.name = $scope.strings.NOT_AVAILABLE;
                              }
                          });
                          //End Map for empty team names
                          $scope.leagues[_index].scorers = data.response.scorers;
                        }

                    }).catch(function () {
                        //$scope.$emit('error');
                    }).finally(function(data) {
                        $scope.$emit('unload');
                    });

                  };

              };


            $scope.setScroll = function() {

              $scope.scroll = iScroll.horizontal('wrapperH');
              $scope.$on('onRepeatLast', function(scope, element, attrs) {
                  angular.forEach($scope.leagues, function(_item, _index) {
                      iScroll.vertical($scope.wrapper.getName(_index));
                  });
              });

              $scope.nextPage = function(){
                  $scope.scroll.next();
              };

              $scope.prevPage = function(){
                  $scope.scroll.prev();
              };

              $scope.scroll.on('beforeScrollStart', function () {
                  this.refresh();
              });

              $scope.scroll.on('scrollStart', function () {
                  _currentPage = this.currentPage.pageX;
              });

              $scope.scroll.on('scroll', function () {
                  if (this.currentPage.pageX != _currentPage) {
                      $scope.getScorers();
                      _currentPage = this.currentPage.pageX;
                  }
              });

            };

            $scope.init = function(){
                $scope.$emit('load');
                Competitions.get.then(function(data){
                   $scope.leagues  = data;
                   $scope.widthTotal = ($window.innerWidth * $scope.leagues.length);
                   $scope.setScroll();
                   $scope.getScorers();
                });
                $scope.$emit('unload');
            }();
        }
    ]);
