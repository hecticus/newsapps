'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.TeamSelectionController
 * @description TeamSelectionController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('TeamSelectionController', ['$scope', '$rootScope', '$state', 'ClientManager',
        'TeamsManager', 'iScroll',
        function($scope, $rootScope, $state, ClientManager, TeamsManager, iScroll) {

            var scroll = null;
            var teams = [];
            var halfMaxItems = $scope.maxVisibleItems/2;
            var page = {
                'first' : 0,
                'last' : 0
            };
            $scope.teams = [];
            $scope.searchQuery = '';
            $scope.hasTeams = true;
            $scope.maxVisibleItems = 10;

            $scope.teamSelected = function(team){
                TeamsManager.addFavoriteTeam(team, function(){
                    $state.go('settings');
                });
            };

            $scope.getTeamClass = function(team){
                if(team.selected){
                    return 'mdi-action-favorite mdi-material-lime';
                }else{
                    return 'mdi-action-favorite-outline';
                }
            };

            function processTeams(teams){
                teams.sort(function(teamA, teamB){
                    var nameA = teamA.name.toUpperCase();
                    var nameB = teamB.name.toUpperCase();
                    if(!nameA){
                        return 1;
                    } else if(!nameB){
                        return -1;
                    } else {
                        if(nameA > nameB){
                            return 1;
                        } else if(nameA < nameB) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                });

                teams.map(function(team){
                    if(team.name === '' || !team.name){
                        team.name = $scope.strings.NOT_AVAILABLE;
                    }
                });
            }

            function getTeams(offset, pageSize){
                if(!offset){ offset = 0}
                if(!pageSize){ pageSize = 200}
                $scope.$emit('load');
                TeamsManager.getTeams(offset, pageSize).then(function(pTeams){
                    $scope.hasTeams = true;
                    processTeams(pTeams);
                    teams = pTeams;
                    $scope.teams = teams.slice();
                    getFavTeams();
                    $scope.$emit('unload');
                }, function(){
                    teams = [];
                    $scope.teams = teams;
                    $scope.hasTeams = false;
                    $scope.$emit('unload');
                });
            }

            function getFavTeams(){
                var favTeams = TeamsManager.getFavoriteTeams();
                favTeams.forEach(function(elem){
                    var index = $scope.teams.indexOf(elem);
                    if(index > -1){
                        $scope.teams.splice(index, 1);
                    }
                });
            }

            $scope.onScrollUp = function(){
//                if(!$scope.searchQuery && page.first !== 0 && (page.first - halfMaxItems) > 0){
//                    console.log('onScrollUp. Loading more teams');
//                    var original = $scope.teams;
//                    original = original.slice(original.length - 1, halfMaxItems);
//                    var start = page.first - halfMaxItems;
//                    var toPrepend = teams.slice(start, halfMaxItems);
//                    $scope.teams = toPrepend.concat(original);
//                }
            };

            $scope.onScrollDown = function(){
//                if(!$scope.searchQuery && (page.last + halfMaxItems) < (teams.length -1)){
//                    console.log('onScrollDown. Loading more teams');
//                    var original = $scope.teams;
//                    original = original.slice(page.first, halfMaxItems);
//                    var toAppend = teams.slice(page.last, halfMaxItems);
//                    console.log('original: [' + page.first + '-' + (page.first + halfMaxItems) + ']');
//                    console.log(original);
//                    console.log('toAppend: [' + page.last + '-' + (page.last + halfMaxItems) + ']');
//                    console.log(toAppend);
//                    $scope.teams = original.concat(toAppend);
//                    page.last = $scope.teams.length -1;
//                    page.first += halfMaxItems;
//                }
            };

            function setUpIScroll() {
                scroll = iScroll.vertical('wrapper');

                scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });

                $scope.$on('$destroy', function() {
                    scroll.destroy();
                    scroll = null;
                });
            }

            function init(){
                $scope.$emit('load');
                $scope.hasTeams = true;
                setUpIScroll();
                getTeams();

                $scope.$watch('searchQuery', function(newValue, oldValue){
                    if(newValue){
                        console.log('searchQuery changed. initializing teams again.');
                        $scope.teams = teams;
                        page.first = 0;
                        page.last = teams.length -1;
                    }
                });
            } init();
        }
]);
