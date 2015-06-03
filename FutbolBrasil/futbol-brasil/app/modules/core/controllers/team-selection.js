'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.TeamSelectionController
 * @description TeamSelectionController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('TeamSelectionController', ['$rootScope', '$scope', '$state', '$stateParams', 'TeamsManager', 'iScroll', 'Competitions',
        function($rootScope, $scope, $state, $stateParams, TeamsManager, iScroll, Competitions) {

            $scope.scroll = null;
            $scope.scrollL = null;
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

            /*function processTeams(teams){
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
            }*/

            function getTeams(id_competition, offset, pageSize){

                if(!offset){ offset = 0}
                if(!pageSize){ pageSize = 1000}

                $scope.$emit('load');

                TeamsManager.getTeamsIdCompetition(id_competition, offset, pageSize).then(function(pTeams){

                    $scope.hasTeams = true;
                    //processTeams(pTeams);
                    teams = pTeams;
                    getFilterFavoriteTeams();
                    $scope.teams = teams.slice(page.first, page.last);
                    //getFavTeams();

                }, function(){
                    $scope.hasTeams = false;
                    teams = [];
                    $scope.teams = teams;
                }).finally(function(){
                  $scope.$emit('unload');
                });

            }

            function getFilterFavoriteTeams(){
                var favTeams = TeamsManager.getFavoriteTeams();
                favTeams.forEach(function(fTeams){
                  teams.forEach(function(lTeams,index){
                    if (fTeams.id_teams == lTeams.id_teams) {
                      teams.splice(index, 1);
                      console.log(JSON.stringify(lTeams) + ' -> index -> ' + index);
                    }
                  });
                });
            }


            /*function getFavTeams(){
                var favTeams = TeamsManager.getFavoriteTeams();
                favTeams.forEach(function(elem){
                    var index = $scope.teams.indexOf(elem);
                    if(index > -1){
                        $scope.teams.splice(index, 1);
                    }
                });
            }*/

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
                $scope.scrollL = iScroll.vertical('wrapperL');

                $scope.scrollL.on('beforeScrollStart', function () {
                    this.refresh();
                });

                /*$scope.$on('$destroy', function() {
                    $scope.scrollL.destroy();
                    $scope.scrollL = null;
                });*/
            }

            $scope.showContentTeams = function(league) {


                //alert(league.id_competitions + ' -> ' + league.name);

                $rootScope.transitionPageBack('#wrapper2', 'left');
                 $scope.teams = null;
                $scope.searchQuery = null;
                $scope.hasTeams = true;
                $scope.hasNext = true;
                $scope.hasPrev = false;
                page.first = 0;
                page.last = maxItems;
                setUpIScroll();
                getTeams(league.id_competitions );

                $scope.$watch('searchQuery', function(newValue, oldValue){

                    if(newValue !== oldValue){

                        if(newValue !== '' && !isDirtySearchQuery){
                            //console.log('searchQuery changed. initializing teams again.');
                            //isDirtySearchQuery = true;
                            $scope.teams = teams;
                            page.first = 0;
                            page.last = teams.length -1;

                        }

                       /* if(newValue === ''){

                            //console.log('searchQuery empty. initializing teams again.');
                            isDirtySearchQuery = false;
                            page.first = 0;
                            page.last = maxItems;
                            $scope.teams = teams.slice(page.first, page.last);


                        }*/

                    }

                });

            }

           function getCompetitions(){
                Competitions.get(true).then(function(data){
                    $scope.leagues  = data;
                    $scope.scroll = iScroll.vertical('wrapper');
                    $scope.$emit('unload');
                });
            }

            function init(){
              $scope.scroll = iScroll.vertical('wrapper');
              getCompetitions();
            }
        }
]);
