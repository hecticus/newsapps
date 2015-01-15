'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.StandingsCtrl
 * @description StandingsCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('StandingsCtrl',  ['$http','$rootScope','$scope','$state','$localStorage','Domain','Utilities',
      function($http, $rootScope, $scope, $state, $localStorage, Domain, Utilities, data) {

        var _this = this;
        var _promise = false;

        $rootScope.loading = false;
        $rootScope.error = false;

        _this.fromNow = function(_date) {
          return Utilities.moment(_date).format('MMMM Do YYYY');
        };

        _this.showContentPhases = function(competition) {

          $rootScope.loading = true;
          _this.item.ranking = [];
          _this.item.phases = [];
          _this.item.competition = false;
          _promise = $http({method: 'GET', url: Domain.phases(competition.id_competitions)});
          _promise.then(function(obj) {

            _this.item.phases = obj.data.response.phases;
            _this.item.competition = competition;
            if (_this.item.phases.length == 1) {
              _this.showContentRanking(_this.item.competition.id_competitions
                  , _this.item.phases[0].id_phases);
            } else {
              angular.element('#wrapper2').attr('class','page transition left');
              _scroll2.scrollTo(0,0,0);
            }

          }).finally(function(data) {
              $rootScope.loading = false;
              $rootScope.error = false;
          });

        };

        _this.showContentRanking = function(competition,phase) {

          $rootScope.loading = true;
          _this.item.phase = false;
          _this.item.ranking = [];
          _promise = $http({method: 'GET', url: Domain.ranking(competition,phase)});
          _promise.then(function(obj) {

            _this.item.tree = obj.data.response.tree;
            _this.item.phase = obj.data.response.phase;
            _this.item.ranking =  obj.data.response.ranking;

            angular.element('#wrapper3').attr('class','page transition left');
            _scroll3.scrollTo(0,0,0);

          }).finally(function(data) {
              $rootScope.loading = false;
              $rootScope.error = false;
          });

        };

        _this.item = JSON.parse($rootScope.$storage.competitions);

         var _scroll = new IScroll('#wrapper',{click:true,preventDefault:true, bounce: true,  probeType: 2});
        _scroll.on('beforeScrollStart', function () {
          this.refresh();
        });

        var _scroll2 = new IScroll('#wrapper2',{click:true, preventDefault:true});
        _scroll2.on('beforeScrollStart', function () {
          this.refresh();
        });

        var _scroll3 = new IScroll('#wrapper3',{click:true, preventDefault:true});
        _scroll3.on('beforeScrollStart', function () {
          this.refresh();
        });

      }
]);
