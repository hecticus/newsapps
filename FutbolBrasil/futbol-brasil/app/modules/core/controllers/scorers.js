'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.ScorersCtrl
 * @description ScorersCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('ScorersCtrl',  ['$http','$rootScope','$scope','$state','$localStorage', '$window', 'Domain','Utilities',
        function($http, $rootScope, $scope, $state, $localStorage, $window, Domain, Utilities) {

            var _this = this;
            _this.wrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            _this.width = $window.innerWidth;
            _this.widthTotal = ($window.innerWidth * 11);

            $scope.getWidth = function(){
                return { 'width': _this.width + 'px'}
            };

            $scope.getTotalWidth = function(){
                return { 'width': _this.widthTotal + 'px'}
            };

            $scope.init = function(){
                if ($rootScope.$storage.scorers) {
                    _this.item = JSON.parse($rootScope.$storage.scorers);
                    $rootScope.loading = false;
                    $rootScope.error = Utilities.error(_this.item.leagues,'scorers');
                } else {
                    $http({method: 'GET', url: Domain.scorers()})
                        .then(function(obj) {
                            _this.item =  obj.data.response;
                            $rootScope.$storage.scorers = JSON.stringify(obj.data.response);
                        })
                        .finally(function(data) {
                            $rootScope.loading = false;
                            $rootScope.error = _this.item.leagues.hasOwnProperty('news');
                        });
                }

                var _scroll = Utilities.newScroll.horizontal('wrapperH');

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    //TODO revisar forEach
                    angular.forEach(_this.item.leagues, function(_item, _index) {
                        utilities.newScroll.vertical(_this.wrapper.getName(_index));
                    });
                });
            }();

        }
    ]);
