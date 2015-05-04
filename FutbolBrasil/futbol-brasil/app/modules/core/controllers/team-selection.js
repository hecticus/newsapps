'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.TeamSelectionController
 * @description TeamSelectionController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('TeamSelectionController', ['$scope', '$state', '$stateParams', 'TeamsManager', 'iScroll',
        function($scope, $state, $stateParams, TeamsManager, iScroll) {
            var scroll = null;
            var teams = [];
            var maxItems = 10;
            var page = {};
            var isDirtySearchQuery = false;

            $scope.teams = [];
            $scope.searchQuery = '';
            $scope.hasTeams = true;
            $scope.hasNext = true;
            $scope.hasPrev = false;
            $scope.teamSelected = teamSelected;
            $scope.getTeamClass = getTeamClass;
            $scope.showPrevPage = showPrevPage;
            $scope.showNextPage = showNextPage;

            init();

            //////////////////////////////////////////////////////////////

            function teamSelected(team){
                TeamsManager.addFavoriteTeam(team, function(){
                    $state.go('settings',{newClient:$stateParams.newClient});
                });
            }

            function getTeamClass(team){
                if(team.selected){
                    return 'mdi-action-favorite mdi-material-lime';
                }else{
                    return 'mdi-action-favorite-outline';
                }
            }

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
                if(!pageSize){ pageSize = 1000}
                $scope.$emit('load');
                TeamsManager.getTeams(offset, pageSize).then(function(pTeams){
                    $scope.hasTeams = true;
                    processTeams(pTeams);
                    teams = pTeams;
                    $scope.teams = teams.slice(page.first, page.last);
                    getFavTeams();
                    $scope.$emit('unload');
                }, function(){
                    $scope.hasTeams = false;
                    teams = [];
                    $scope.teams = teams;
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

            function showPrevPage(){
                if(!$scope.searchQuery){
                    var start = page.first - maxItems;
                    if(start < 0){
                        start = 0;
                    }

                    var end = page.first - 1;
                    if(end < 0){
                        end = ((teams.length - 1) < (start + maxItems))? start + maxItems: teams.length - 1;
                    }

                    updateVisibleTeams(start, end);
                }
            }

            function showNextPage(){
                if(!$scope.searchQuery){
                    var start = page.first + maxItems;
                    if(start > teams.length){
                        start = teams.length - (1 + maxItems);
                    }

                    console.log('page.last: ' + page.last);
                    var end = page.last + maxItems;
                    if(end >= teams.length){
                        end = teams.length === 0 ? 0 : teams.length - 1;
                    }

                    updateVisibleTeams(start, end);
                }
            }

            function updateVisibleTeams(start, end){
                if(start !== page.first && end !== page.last){
                    console.log('updateVisibleTeams. Loading more teams. [' + start + ', ' + end +']');
                    $scope.teams = teams.slice(start, end);
                    page.first = start;
                    page.last = end;

                    $scope.hasPrev = page.first > 0;
                    $scope.hasNext = page.last  < (teams.length - 1);
                }
            }

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
                $scope.hasNext = true;
                $scope.hasPrev = false;
                page.first = 0;
                page.last = maxItems;
                setUpIScroll();
                getTeams();

                $scope.$watch('searchQuery', function(newValue, oldValue){

                    if(newValue !== oldValue){
                        if(newValue !== '' && !isDirtySearchQuery){
                            console.log('searchQuery changed. initializing teams again.');
                            isDirtySearchQuery = true;
                            $scope.teams = teams;
                            page.first = 0;
                            page.last = teams.length -1;
                        }

                        if(newValue === ''){
                            console.log('searchQuery empty. initializing teams again.');
                            isDirtySearchQuery = false;
                            page.first = 0;
                            page.last = maxItems;
                            $scope.teams = teams.slice(page.first, page.last);
                        }
                    }
                });
            }
        }
]);
