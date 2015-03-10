'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.StandingsCtrl
 * @description StandingsCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('StandingsCtrl',  ['$http', '$rootScope', '$scope', '$timeout', '$state', '$localStorage', 'Domain', 'WebManager',
        'TeamsManager', 'Moment', 'iScroll',
        function($http, $rootScope, $scope, $timeout, $state, $localStorage, Domain, WebManager, TeamsManager, Moment, iScroll) {

            $scope.item = {};

            $scope.fromNow = function(_date) {
                return Moment.date(_date).format('MMMM Do YYYY');
            };

            $scope.showContentPhases = function(competition) {
                $scope.$emit('load');
                $scope.item.ranking = [];
                $scope.item.phases = [];
                $scope.item.competition = false;
                $http.get(Domain.phases(competition.id_competitions))
                .then(function (data) {
                    data = data.data;
                    $scope.item.phases = data.response.phases;
                    $scope.item.competition = competition;
                    if ($scope.item.phases.length == 1) {
                        $scope.showContentRanking($scope.item.competition.id_competitions
                            , $scope.item.phases[0].id_phases);
                    } else {
                        $rootScope.transitionPageBack('#wrapper2', 'left');
                        $scope.scroll2.scrollTo(0,0,0);
                    }
                    $timeout(function(){
                        $scope.$emit('unload');
                    }, 500);
                },function () {
                    console.log('showContentPhases. error');
                    $scope.$emit('error');
                });

            };

            $scope.showContentRanking = function(competition, phase) {
                $scope.$emit('load');
                $scope.item.phase = false;
                $scope.item.ranking = [];

                $http.get(Domain.ranking(competition,phase))
                    .then(function (data, status) {
                        data = data.data;
                        console.log('data: ');
                        console.log(data);
                        $scope.item.tree = data.response.tree;
                        $scope.item.phase = data.response.phase;
                        $scope.item.ranking =  data.response.ranking;
                        console.log(data.response.ranking);
                        $rootScope.transitionPageBack('#wrapper3', 'left');
                        $scope.scroll3.scrollTo(0,0,0);
                        $scope.$emit('unload');
                    }, function () {
                        $scope.$emit('unload');
                        $scope.$emit('error');
                    });
            };

            $scope.getCompetitions = function(){
                var config = WebManager.getFavoritesConfig($scope.isFavoritesFilterActive());
                $http.get(Domain.competitions, config).success(function(obj){
                    $rootScope.$storage.competitions = JSON.stringify(obj.response);
                    $scope.item = obj.response;
                });
            };

            $scope.setUpIScroll = function(){
                $scope.scroll = iScroll.vertical('wrapper');
                $scope.scroll2 = iScroll.vertical('wrapper2');
                $scope.scroll3 = iScroll.vertical('wrapper3');
            };

            $scope.init = function(){
                $scope.setUpIScroll();
                if($rootScope.$storage.competitions){
                    $scope.item = JSON.parse($rootScope.$storage.competitions);
                }
                $scope.getCompetitions();
            }();
        }
    ]);
