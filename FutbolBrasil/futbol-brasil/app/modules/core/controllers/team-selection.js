'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.TeamSelectionController
 * @description TeamSelectionController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('TeamSelectionController', [
        '$scope', '$rootScope', '$state', 'ClientManager', 'TeamsManager',
        function($scope, $rootScope, $state, ClientManager, TeamsManager) {
            $scope.teams = [];
            $scope.searchQuery = '';

            $scope.teamSelected = function(team){
                TeamsManager.addFavoriteTeam(team, function(){
                    $state.go('settings');
                });
            };

            $scope.getTeams = function(){
                $scope.teams = TeamsManager.getTeams(0, 200);
                $scope.teams.map(function(team){
                    if(team.name === '' || !team.name){
                        team.name = $scope.strings.NOT_AVAILABLE;
                    }
                });
                var favTeams = TeamsManager.getFavoriteTeams();
                favTeams.forEach(function(elem){
                    var index = $scope.teams.indexOf(elem);
                    if(index > -1){
                        $scope.teams.splice(index, 1);
                    }
                });
                $scope.$emit('unload');
            };

            $scope.getTeamClass = function(team){
                if(team.selected){
                    return 'mdi-action-favorite mdi-material-lime';
                }else{
                    return 'mdi-action-favorite-outline';
                }
            };

            $scope.setUpIScroll = function() {
                $scope._scroll = new IScroll('#wrapper'
                    , {click: true, preventDefault: true, bounce: true, probeType: 2});
                $scope._scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });
            };

            $scope.init = function(){
                $scope.setUpIScroll();
                $scope.getTeams();
            }();
        }
]);
