'use strict';

/**
 * @ngdoc service
 * @name core.Services.TeamsManager
 * @description TeamsManager Factory
 */
angular
    .module('core')
    .factory('TeamsManager', ['Domain', 'WebManager',
        function(Domain, WebManager) {
            var teamList = [
                {
                    id_push_alert : 1
                },
                {
                    id_push_alert : 2
                }
            ];
            return {
                FAVORITE_ADD : 0,
                FAVORITE_REMOVE : 1,

                /**
                 * @ngdoc function
                 * @name core.Services.TeamsManager#init
                 * @description Initializes the Service
                 * @methodOf core.Services.TeamsManager
                 */
                init : function (data){
                    try{
                        if(data != null && data.length > 0){
                            teamList = [];
                            for(var i=0; i<data.length;i++){
                                teamList.push(data[i].team);
                            }
                        }
                        console.log("PushManager.init. Favorites: ");
                        console.log(teamList);
                        return true;
                    }catch(err){
                        console.log("Ocurrio un error al guardar equipos favoritos: " + err.message);
                        return false;
                    }
                },

                addTeam : function (team){
                    try{
                        for(var i=0; i<teamList.length; i++){
                            if(this.teamList[i].id_push_alert === team.id_push_alert){
                                return true;
                            }
                        }
                        this.teamList.push(team);
                        this.saveFavoritesToClient(team, this.FAVORITE_ADD);
                        return true;
                    }catch (e) {
                        console.log("ERROR ADD "+e);
                        return false;
                    }
                },

                removeTeam : function (team){
                    try{
                        var index = -1;
                        for(var i=0; i<teamList.length; i++){
                            if(this.teamList[i].id_push_alert == team.id_push_alert){
                                index = i;
                                break;
                            }
                        }
                        if(index != -1){
                            this.teamList.splice(index, 1);
                            //SAVE TO WS
                            this.saveFavoritesToClient(team, this.FAVORITE_REMOVE);
                        }
                        return true;
                    }catch (e) {
                        console.log("ERROR REMOVE "+e);
                        return false;
                    }
                },

                isTeamFavoriteById : function (idTeam){
                    for(var i=0; i<this.teamList.length; i++){
                        if(this.teamList[i].id_push_alert == idTeam){
                            return true;
                        }
                    }
                    return false;
                },

                isTeamFavorite : function (team){
                    for(var i=0; i<this.teamList.length; i++){
                        if(this.teamList[i].id_push_alert == team.id_push_alert){
                            return true;
                        }
                    }
                    return false;
                },

                //TODO WHUT?
                saveFavoritesToClient : function (team, type){
                    var jsonData = {};
                    var teamArray = [];
                    teamArray.push(team.id_push_alert);

                    if(type === this.FAVORITE_ADD){
                        jsonData.add_team = teamArray;
                    }else{
                        jsonData.remove_team = teamArray;
                    }

                    $.ajax({
                        url : Domain.clients.update(this.clientId),
                        data: JSON.stringify(jsonData),
                        type: 'POST',
                        headers: WebManager.getHeaders(),
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        timeout : 60000,
                        success : function(data, status) {
                            try{
                                if(typeof data == "string"){
                                    data = JSON.parse(data);
                                }
                                var code = data.error;
                                var response = data.response;
                                if(code == 0 && response != null){
                                    console.log("Guardados los favoritos: "+JSON.stringify(response));
                                }else{
                                    console.log("Error guardando nuevos favoritos");
                                }
                            }catch(e){
                                console.log("Exception guardando nuevos favoritos: "+e);
                            }
                        },
                        error : function(xhr, ajaxOptions, thrownError) {
                            console.log("error save favorite");
                        }
                    });
                }

            };
        }
    ]);
