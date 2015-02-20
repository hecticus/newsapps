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
        '$scope', '$rootScope', '$state', 'ClientManager', 'TeamsManager', 'FacebookManager', 'Settings', 'Utilities', 'Client',
        function($scope, $rootScope, $state, ClientManager, TeamsManager, FacebookManager, Settings, Utilities, Client) {
            $scope.strings = {
                'PUSH_SETTINGS_TITLE': 'Push Notifications',
                'FAVORITE_TEAMS_TITLE': 'My Favorite Teams',
                'SOCIAL_ACCOUNTS_TITLE': 'Social Accounts',
                'TOGGLE_BETS': 'Toggle Bets',
                'TOGGLE_MTM': 'Toggle MTM',
                'TOGGLE_NEWS': 'Toggle News',
                'CONNECT_FACEBOOK': 'Connect With Facebook',
                'CONNECTED_FACEBOOK': 'Connected to Facebook',
                'ADD_TEAM': 'Add Team',
                'NOT_AVAILABLE': 'Not Available',
                'LANGUAGES': 'Languages'
            };

            $scope.vScroll = null;

            $scope.fbObject = {
                fbStatus: null,
                fbButtonMsg: $scope.strings.CONNECT_FACEBOOK
            };

            $scope.favoriteTeams = [undefined, undefined, undefined];

            $scope.toggles = {
                bets: false,
                news: false,
                mtm: false
            };

            $scope.teamSelected = function(team){
                if($scope.isEmptySlot(team)){
                    $scope.$emit('load');
                    $state.go('team-selection');
                }
            };

            $scope.removeTeam = function(team){
                if(team){
                    TeamsManager.removeFavoriteTeam(team, $scope.getFavoriteTeams);
                    $scope.favoriteTeams[$scope.favoriteTeams.indexOf(team)] = {isEmpty: true};
                }
            };

            $scope.getFavoriteTeams = function(){
                var teams = TeamsManager.getFavoriteTeams();
                $scope.hasFavorites = false;
                for(var i = 0; i < 3; i++){
                    if(teams[i]) {
                        $scope.favoriteTeams[i] = teams[i];
                        $scope.favoriteTeams[i].isEmpty = false;
                        $scope.hasFavorites = true;
                    } else {
                        $scope.favoriteTeams[i] = {};
                        $scope.favoriteTeams[i].isEmpty = true;
                    }
                }
            };

            $scope.getTeamName = function(team){
                if(team && typeof team.name != 'undefined'){
                    return team.name !== ''? team.name : $scope.strings.NOT_AVAILABLE;
                }else{
                    return $scope.strings.ADD_TEAM;
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
                Settings.toggleBetsPush($scope.toggles.bets);
            };

            $scope.toggleNews = function(){
                $scope.toggles.news = !$scope.toggles.news;
                Settings.toggleNewsPush($scope.toggles.news);
            };

            $scope.toggleMtm = function(){
                $scope.toggles.mtm = !$scope.toggles.mtm;
                Settings.toggleMtmPush($scope.toggles.mtm);
            };

            $scope.loadSettings = function(){
                $scope.toggles.bets = Settings.isBetsPushActive();
                $scope.toggles.news = Settings.isNewsPushActive();
                $scope.toggles.mtm = Settings.isMtmPushActive();
            };

            $scope.setUpIScroll = function() {
                $scope.vScroll = Utilities.newScroll.verticalForm('wrapper');
            };

            $scope.onFbButtonClick = function(){
                if(!window.facebookConnectPlugin){ return;}
                if($scope.fbObject.fbStatus !== 'connected'){
                    FacebookManager.login();
                }
                $scope.setFbButtonMsg();
            };

            $scope.getStatus = function(){
                if(!window.facebookConnectPlugin){ return;}
                FacebookManager.getStatus(function(result){
                    if(result){
                        $scope.fbObject.fbStatus = result.status;
//                        console.log('Settings.getStatus. $scope.fbObject: ' + JSON.stringify($scope.fbObject, undefined, 2));
                        $scope.setFbButtonMsg();
                    }
                });
//                setTimeout(function(){
//                    $scope.fbObject.fbStatus = 'connected';
//                    $scope.setFbButtonMsg();
//                }, 2000);
            };

            $scope.setFbButtonMsg = function(){
                if(!window.facebookConnectPlugin){ return;}
                if($scope.fbObject.fbStatus === 'connected'){
                    $scope.fbObject.fbButtonMsg = $scope.strings.CONNECTED_FACEBOOK;
                } else{
                    $scope.fbObject.fbButtonMsg = $scope.strings.CONNECT_FACEBOOK;
                }
                $scope.$apply();
                console.log('setFbButtonMsg. fbObject: ' + JSON.stringify($scope.fbObject, undefined, 2));
            };

            $scope.selectLanguage = function(team){
                $scope.$emit('load');
                $state.go('language-selection');
            };

            $scope.getClientLanguage = function(){
                var lang = Client.getLanguage();
                if(lang){
                    return lang.name;
                } else {
                    return 'No Language Selected';
                }
            };

            $scope.init = function(){
                $scope.setUpIScroll();
                $scope.getFavoriteTeams();
                $scope.loadSettings();
                $scope.getStatus();
                $scope.$emit('unload');
            }();

        }
]);
