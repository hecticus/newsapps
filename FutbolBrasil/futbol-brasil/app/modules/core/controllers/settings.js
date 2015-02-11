'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.SettingsController
 * @description SettingsController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('SettingsController', [
        '$scope', '$rootScope', '$state', 'ClientManager', 'TeamsManager', 'Settings',
        function($scope, $rootScope, $state, ClientManager, TeamsManager, Settings) {
            $scope.favoriteTeams = [undefined, undefined, undefined];
            $scope.strings = {
                'PUSH_SETTINGS_TITLE': 'Push Notifications',
                'FAVORITE_TEAMS_TITLE': 'My Favorite Teams',
                'SOCIAL_ACCOUNTS_TITLE': 'Social Accounts',
                'TOGGLE_BETS': 'Toggle Bets',
                'TOGGLE_MTM': 'Toggle MTM',
                'TOGGLE_NEWS': 'Toggle News',
                'CONNECT_FACEBOOK': 'Connect With Facebook'
            };

            $scope.toggles = {
                bets: false,
                news: false,
                mtm: false
            };

            $scope.teamSelected = function(team){
                if($scope.isEmptySlot(team)){
                    $state.go('team-selection');
                }
            };

            $scope.removeTeam = function(team){
                if(team){
                    console.log('removeTeam: ');
                    console.log(team);
                    TeamsManager.removeFavoriteTeam(team, $scope.getFavoriteTeams);
                }
            };

            $scope.getFavoriteTeams = function(){
                var teams = TeamsManager.getFavoriteTeams();
                for(var i = 0; i < 3; i++){
                    if(teams[i]) {
                        $scope.favoriteTeams[i] = teams[i];
                        $scope.favoriteTeams[i].isEmpty = false;
                    } else {
                        $scope.favoriteTeams[i] = {};
                        $scope.favoriteTeams[i].isEmpty = true;
                    }
                }
            };

            $scope.getTeamName = function(team){
                if(team && typeof team.name != 'undefined'){
                    return team.name !== ''? team.name : 'Not Available';
                }else{
                    return 'Add Team';
                }
            };

            $scope.getTeamClasses = function(team, index){
                var cssClass = $scope.isEmptySlot(team)? 'mdi-content-add ': 'mdi-action-grade ';
                if($scope.isEmptySlot(team)){
                    cssClass += 'btn-primary ';
                }else if(index / 2 == 0){
                    cssClass += 'btn-success ';
                } else {
                    cssClass += 'btn-info ';
                }
                return cssClass;
            };

            $scope.isEmptySlot = function(team){
                return !!team.isEmpty;
            };

            $scope.toggleBets = function(){
                $scope.toggles.bets = !$scope.toggles.bets;
                console.log('toggleBets. ' + $scope.toggles.bets);
                Settings.toggleBetsPush($scope.toggles.bets);
            };

            $scope.toggleNews = function(){
                $scope.toggles.news = !$scope.toggles.news;
                console.log('toggleNews. ' + $scope.toggles.news);
                Settings.toggleNewsPush($scope.toggles.news);
            };

            $scope.toggleMtm = function(){
                $scope.toggles.mtm = !$scope.toggles.mtm;
                console.log('toggleMtm. ' + $scope.toggles.mtm);
                Settings.toggleMtmPush($scope.toggles.mtm);
            };

            $scope.loadSettings = function(){
                $scope.toggles.bets = Settings.isBetsPushActive();
                $scope.toggles.news = Settings.isNewsPushActive();
                $scope.toggles.mtm = Settings.isMtmPushActive();
            };

            $scope.init = function(){
                console.log('init');
                $scope.getFavoriteTeams();
                $scope.loadSettings();
                $rootScope.loading = false;
            }();

        }
]);
