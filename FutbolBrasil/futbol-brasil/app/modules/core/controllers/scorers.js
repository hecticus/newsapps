'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.ScorersCtrl
 * @description ScorersCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('ScorersCtrl',  ['$http','$rootScope','$scope','$state','$localStorage','Domain','Utilities',
      function($http, $rootScope, $scope, $state, $localStorage, Domain, Utilities) {

        var _this = this;
        var _promise = false;
        var _element =  angular.element;

        _this.width = window.innerWidth;
        _this.widthTotal = (window.innerWidth * 11);

          if ($rootScope.$storage.scorers) {
            _this.item = JSON.parse($rootScope.$storage.scorers);
            $rootScope.loading = false;
            $rootScope.error = Utilities.error(_this.item.leagues,'scorers');
          } else {
            _promise = $http({method: 'GET', url: Domain.scorers()});
          _promise.then(function(obj) {
            _this.item =  obj.data.response;
            $rootScope.$storage.scorers = JSON.stringify(obj.data.response);
          }).finally(function(data) {
              $rootScope.loading = false;
              $rootScope.error = Utilities.error(_this.item.leagues,'scorers');
          });
          }

        var _scroll = new IScroll('#wrapperH', {
          scrollX: true,
          scrollY: false,
          mouseWheel: true,
          momentum: false,
          snap: true,
          snapSpeed: 1000,
          probeType: 3,
          bounce: false,
        });

        _scroll.on('beforeScrollStart', function () {
          this.refresh();
        });

      }
]);
