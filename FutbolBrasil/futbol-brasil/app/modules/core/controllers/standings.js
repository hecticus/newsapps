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
        function($http, $rootScope, $scope, $state, $localStorage, Domain, Utilities) {

            var _scroll;
            var _scroll2;
            var _scroll3;



            //TODO Sacar a Service
            $scope.fromNow = function(_date) {
                return Utilities.moment(_date).format('MMMM Do YYYY');
            };

            $scope.showContentPhases = function(competition) {

                $rootScope.loading = true;
                $scope.item.ranking = [];
                $scope.item.phases = [];
                $scope.item.competition = false;
                $http.get(Domain.phases(competition.id_competitions))
                .success(function (data, status, headers, config) {
                    $scope.item.phases = data.response.phases;
                    $scope.item.competition = competition;
                    if ($scope.item.phases.length == 1) {
                        $scope.showContentRanking($scope.item.competition.id_competitions
                            , $scope.item.phases[0].id_phases);
                    } else {
                         $rootScope.transitionPageBack('#wrapper2', 'left');
                        _scroll2.scrollTo(0,0,0);
                    }
                }).catch(function () {
                    $scope.$emit('error');
                }).finally(function(data) {
                    $scope.$emit('unload');
                });

            };

            $scope.showContentRanking = function(competition, phase) {

                $scope.$emit('load');
                $scope.item.phase = false;
                $scope.item.ranking = [];
                $http.get(Domain.ranking(competition,phase))
                .success(function (data, status, headers, config) {
                    $scope.item.tree = data.response.tree;
                    $scope.item.phase = data.response.phase;
                    $scope.item.ranking =  data.response.ranking;
                    $rootScope.transitionPageBack('#wrapper3', 'left');
                    _scroll3.scrollTo(0,0,0);
                }).catch(function () {
                    $scope.$emit('error');
                }).finally(function(data) {
                    $scope.$emit('unload');
                });

            };

            $scope.init = function(){

                $scope.item = JSON.parse($rootScope.$storage.competitions);

                _scroll = new IScroll('#wrapper'
                    ,{click:true, preventDefault:true, bounce: true, probeType: 2});
                _scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });

                _scroll2 = new IScroll('#wrapper2',{click:true, preventDefault:true});
                _scroll2.on('beforeScrollStart', function () {
                    this.refresh();
                });

                _scroll3 = new IScroll('#wrapper3',{click:true, preventDefault:true});
                _scroll3.on('beforeScrollStart', function () {
                    this.refresh();
                });
            }();


        }
    ]);
