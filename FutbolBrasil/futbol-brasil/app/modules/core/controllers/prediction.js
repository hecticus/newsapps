'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PredictionCtrl
 * @description PredictionCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('PredictionCtrl',  ['$http','$rootScope','$scope','$state','$localStorage', '$window', 'Domain','Utilities',
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

            $scope.init = function(){

              $http({method: 'GET', url: Domain.bets.get()})
              .then(function(obj) {
                 _this.item =  obj.data.response;
              })
              .finally(function(data) {
                  $rootScope.loading = false;
                  $rootScope.error = false;
              });

              var _scroll = Utilities.newScroll.horizontal('wrapperH');
              $scope.$on('onRepeatLast', function(scope, element, attrs) {
                  angular.forEach(_this.item.leagues, function(_item, _index) {
                      Utilities.newScroll.vertical(_this.wrapper.getName(_index));
                  });
              });

            }();

    }
]);
