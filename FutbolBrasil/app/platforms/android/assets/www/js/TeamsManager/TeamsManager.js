var _url = 'http://brazil.footballmanager.hecticus.com';
var teamList = [];

var FAVORITE_ADD = 0;
var FAVORITE_REMOVE = 1;

function initTeamManager(data){
	try{
		//data[i].team es el objeto
		if(data != null && data.length > 0){
			teamList = []; //vaciamos la lista anterior que tenemos
			for(var i=0; i<data.length;i++){
				teamList.push(data[i].team);
			}
		}
		console.log("Favorites: "+JSON.stringify(teamList));
		return true;
	}catch(err){
		console.log("Ocurrio un error al crear la lista de mujeres: "+err.message)
		return false;
	}
}

/*var FILE_KEY_TEAMS_LIST = "APPDATATEAMSLIST";

function saveTeamList() {
	try{
		var tempString = JSON.stringify(teamList);
		window.localStorage.setItem(FILE_KEY_TEAMS_LIST,tempString);
		return true;
	}catch(err){
		return false;
	}
}

function loadTeamList() {
	var tempList = window.localStorage.getItem(FILE_KEY_TEAMS_LIST);
	if(tempList != null && tempList != ""){
		try{
			teamList = JSON.parse(tempList);
		}catch (e) {
			teamList = [];
		}
	}else{
		teamList = [];
	}
}*/

//Funciones base
function addTeam(team){
	try{
		var found = false;
		for(var i=0; i<teamList.length; i++){
			if(teamList[i].id_push_alert == team.id_push_alert){
				found = true;
				return true;
			}
		}
		if(!found){
			teamList.push(team);
			//SAVE TO WS
			saveFavoritesToClient(team, FAVORITE_ADD);
		}
		return true;
	}catch (e) {
		// TODO: handle exception
		console.log("ERROR ADD "+e);
		return false;
	}
}

function removeTeam(team){
	try{
		var index = -1;
		for(var i=0; i<teamList.length; i++){
			if(teamList[i].id_push_alert == team.id_push_alert){
				index = i;
				break;
			}
		}
		if(index != -1){
			teamList.splice(index, 1);
			//SAVE TO WS
			saveFavoritesToClient(team, FAVORITE_REMOVE);
		}
		return true;
	}catch (e) {
		// TODO: handle exception
		console.log("ERROR REMOVE "+e);
		return false;
	}
}

function isIDTeamFavorite(idTeam){
	for(var i=0; i<teamList.length; i++){
		if(teamList[i].id_push_alert == idTeam){
			return true;
		}
	}
	return false;
}

function isTeamFavorite(team){
	for(var i=0; i<teamList.length; i++){
		if(teamList[i].id_push_alert == team.id_push_alert){
			return true;
		}
	}
	return false;
}

function saveFavoritesToClient(team, type){
	var jsonData = {};
	
	var teamArray = [];
	teamArray.push(team.id_push_alert);
	
	if(type == FAVORITE_ADD){
		jsonData.add_team = teamArray;
	}else{
		jsonData.remove_team = teamArray;
	}
	
	//hacemos update
	var urlUpdateClients = _url+"/futbolbrasil/v1/clients/update";
	urlUpdateClients = urlUpdateClients+"/"+clientID;
	
	$.ajax({
		url : urlUpdateClients,
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
