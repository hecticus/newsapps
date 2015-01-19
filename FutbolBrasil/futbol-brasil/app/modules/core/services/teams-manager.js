'use strict';

/**
 * @ngdoc service
 * @name core.Services.TeamsManager
 * @description TeamsManager Factory
 */
angular
    .module('core')
    .factory('TeamsManager', ['Domain',
        function() {
            return {

                teamList : [{id_push_alert : 1},{id_push_alert : 2}],
                FAVORITE_ADD : 0,
                FAVORITE_REMOVE : 1,

                /**
                 * @ngdoc function
                 * @name core.Services.TeamsManager#method1
                 * @methodOf core.Services.TeamsManager
                 * @return {boolean} Returns a boolean value
                 */
                method1: function() {
                    return true;
                },

                init : function (data){
                    try{
                        //data[i].team es el objeto
                        if(data != null && data.length > 0){
                            this.teamList = []; //vaciamos la lista anterior que tenemos
                            for(var i=0; i<data.length;i++){
                                teamList.push(data[i].team);
                            }
                        }
                        console.log("Favorites: "+JSON.stringify(teamList));
                        return true;
                    }catch(err){
                        console.log("Ocurrio un error al crear la lista de mujeres: "+err.message);
                        return false;
                    }
                },

                addTeam : function (team){
                    try{
                        var found = false;
                        for(var i=0; i<teamList.length; i++){
                            if(this.teamList[i].id_push_alert == team.id_push_alert){
                                found = true;
                                return true;
                            }
                        }
                        if(!found){
                            this.teamList.push(team);
                            //SAVE TO WS
                            this.saveFavoritesToClient(team, FAVORITE_ADD);
                        }
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

                isIDTeamFavorite : function (idTeam){
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

                saveFavoritesToClient : function (team, type){
                    var jsonData = {};

                    var teamArray = [];
                    teamArray.push(team.id_push_alert);

                    if(type == FAVORITE_ADD){
                        jsonData.add_team = teamArray;
                    }else{
                        jsonData.remove_team = teamArray;
                    }

                    //hacemos update
                    $.ajax({
                        url : Domain.clients.update(this.clientId),
                        data: JSON.stringify(jsonData),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        timeout : 60000,
                        success : function(data, status) {
                            try{
                                if(typeof data == "string"){
                                    data = JSON.parse(data);
                                }
                                var code = data.error;
                                if(code == 0){
                                    var response = data.response;
                                    if(response != null){
                                        //tenemos que revisar el response? no creo que sea necesario
                                        console.log("Guardados los favoritos: "+JSON.stringify(response));
                                    }else{
                                        console.log("Error guardando nuevos favoritos");
                                    }
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
