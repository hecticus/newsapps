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


            $scope.wrapper = {
                name:'wrapperV',
                getName : function(_index) {
                    return this.name + _index;
                }
            };

            $scope.width = $window.innerWidth;
            $scope.widthTotal = ($window.innerWidth * 11);

            $scope.init = function(){
                if ($rootScope.$storage.scorers) {
                    $scope.item = JSON.parse($rootScope.$storage.scorers);
                    $rootScope.loading = false;
                    $rootScope.error = Utilities.error($scope.item.leagues,'scorers');
                } else {
                    $http({method: 'GET', url: Domain.scorers()})
                        .then(function(obj) {
                            $scope.item =  obj.data.response;
                            $rootScope.$storage.scorers = JSON.stringify(obj.data.response);
                            $scope.widthTotal = ($window.innerWidth * $scope.item.leagues.length);
                        })
                        .finally(function(data) {
                            $rootScope.loading = false;
                            $rootScope.error = $scope.item.leagues.hasOwnProperty('news');
                        });
                }

                var _scroll = Utilities.newScroll.horizontal('wrapperH');

                $scope.$on('onRepeatLast', function(scope, element, attrs) {
                    angular.forEach($scope.item.leagues, function(_item, _index) {
                        utilities.newScroll.vertical($scope.wrapper.getName(_index));
                    });
                });
            }();

        }
    ]);
