'use strict';

/**
 * @ngdoc service
 * @name core.Services.TeamsManager
 * @description TeamsManager Factory
 */
angular
    .module('core')
    .factory('TeamsManager', ['$http', '$localStorage', 'Domain', 'Client'
        , function($http, $localStorage, Domain, Client) {
        var KEY_TEAMS_LIST = 'TEAMS_LIST';
        var KEY_FAVORITE_TEAMS_LIST = 'FAVORITE_TEAMS_LIST';
        var teamList = [
            {id_push_alert : 1},
            {id_push_alert : 2}
        ];
        var teams = [];
        var favTeams = [];
        var remoteTeams = [];
        var getTeamsFromServer = function(isDone){
            var page = 0;
            var pageSize = 200;
            $http.get(Domain.teams.index,
                {
                    params: {
                        page: page,
                        pageSize: pageSize
                    }
                }).success(function(data, status){
                    isDone = data.response.teams.length < pageSize;
                    remoteTeams = remoteTeams.concat(data.response.teams);
                    if(isDone){
                        persistTeams(remoteTeams);
                    } else {
                        getTeamsFromServer(isDone);
                    }
                })
                .error(function(data, status){
                    console.log('getTeamsFromServer. error getting teams. last values: page='
                        + page + 'pageSize=' + pageSize);
                    console.log('getTeamsFromServer. data: ');
                    console.log(data);
                });
        };

        var persistTeams = function(remoteTeams){
            $localStorage[KEY_TEAMS_LIST] = JSON.stringify(remoteTeams);
            teams = remoteTeams.slice();
        };

        var loadPersistedTeams = function(){
            if($localStorage[KEY_TEAMS_LIST]){
                teams = JSON.parse($localStorage[KEY_TEAMS_LIST]);
            } else {
                console.log('loadPersistedTeams. No records found for teams.');
                teams = [];
            }
        };

        var persistFavoriteTeams = function(favoriteTeams){
            if(favoriteTeams){
                $localStorage[KEY_FAVORITE_TEAMS_LIST] = JSON.stringify(favoriteTeams);
                favTeams = favoriteTeams.slice();
            }
        };

        var loadPersistedFavoriteTeams = function(){
            if($localStorage[KEY_FAVORITE_TEAMS_LIST]) {
                favTeams = JSON.parse($localStorage[KEY_FAVORITE_TEAMS_LIST]);
                Client.setHasFavorites(true);
            } else {
                console.log('loadPersistedFavoriteTeams. No records found for favorite teams.');
                favTeams = [];
                Client.setHasFavorites(false);
            }
        };

        return {
            KEY_FAVORITE_ADD : 'add_push-alert',
            KEY_FAVORITE_REMOVE : 'remove_push_alert',

            /**
             * @ngdoc function
             * @name core.Services.TeamsManager#init
             * @description Initializes the Service
             * @methodOf core.Services.TeamsManager
             */
            init : function (){
                remoteTeams = [];
                loadPersistedTeams();
                loadPersistedFavoriteTeams();
                getTeamsFromServer(false);
                this.setFavoriteTeamsFromServer();
            },

            isTeamFavoriteById : function (idTeam){
                for(var i=0; i < favTeams.length; i++){
                    if(favTeams[i].id_teams == idTeam){
                        return true;
                    }
                }
                return false;
            },

            isTeamFavorite : function (team){
                return (favTeams.indexOf(team) > -1);
            },

            addFavoriteTeam : function (team, callback){
                var index = favTeams.indexOf(team);
                for(var i = 0; i < favTeams.length; i++){
                    if(team.id_teams === favTeams[i].id_teams){
                        index = i;
                        break;
                    }
                }
                if(index > -1){
                    console.log('Team. name: ' + team.name + ', id: ' + team.id_teams
                        + '. Is already a Favorite');
                } else {
                    favTeams.push(team);
                    persistFavoriteTeams(favTeams);
                    this.saveFavoriteTeamToServer({'add_push_alert' : [team.id_teams]}, callback);
                }
            },

            removeFavoriteTeam : function (team, callback){
                console.log('removeFavoriteTeam. ');
                var index = favTeams.indexOf(team);
                for(var i = 0; i < favTeams.length; i++){
                    if(team.id_teams === favTeams[i].id_teams){
                        index = i;
                        break;
                    }
                }
                if(index > -1){
                    favTeams.splice(index, 1);
                    this.saveFavoriteTeamToServer({'remove_push_alert' : [team.id_teams]}, callback);
                } else {
                    console.log('removeFavoriteTeam. Team to remove not found');
                }
            },

            saveFavoriteTeamToServer : function (jsonData, callback){
                $http.post(Domain.client.update(Client.getClientId()), jsonData, {timeout : 60000}
                )
                .success(function(data, status) {
                    if(typeof data == "string"){
                        data = JSON.parse(data);
                    }
                    var errorCode = data.error;
                    var response = data.response;
                    if(errorCode == 0 && response != null){
                        console.log("Favoritos actualizados con éxito en el servidor. ");
                        persistFavoriteTeams(favTeams);
                        typeof callback == "function" && callback();
                    }else{
                        console.log("Error guardando nuevos favoritos");
                    }
                })
                .error (function(data, status) {
                    console.log("error save favorite");
                });
            },

            setFavoriteTeamsFromServer : function(pushAlerts){
                if(!pushAlerts){ return; }
                var favoriteTeams = teams.filter(function(element){
                    var teamId = element.id_teams;
                    var found = false;
                    pushAlerts.forEach(function(pushAlert){
                        var pushAlertId = pushAlert.push_alert.id_ext;
                        found |= pushAlertId === teamId;
                    });
                    return found;
                });
                persistFavoriteTeams(favoriteTeams);
            },

            /**
             * @ngdoc function
             * @name core.Services.TeamsManager#getTeams
             * @description Gets Teams List from Local Storage
             * @methodOf core.Services.TeamsManager
             */
            getTeams: function(offset, pageSize) {
                if(!offset || offset === ''){
                    offset = 0;
                }

                if(!pageSize || pageSize === ''){
                    pageSize = 100;
                }

                return teams.slice(offset, offset+pageSize-1);
            },

            getFavoriteTeams: function() {
                return favTeams;
            }

        };
    }]);
