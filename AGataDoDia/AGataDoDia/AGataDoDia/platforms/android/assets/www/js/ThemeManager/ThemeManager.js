var themesList = [];

var FAVORITE_ADD = 0;
var FAVORITE_REMOVE = 1;

function initThemeManager(data){
	try{
		//data[i].theme es el objeto
		if(data != null && data.length > 0){
			themesList = []; //vaciamos la lista anterior que tenemos
			for(var i=0; i<data.length;i++){
				themesList.push(data[i].theme);
			}
		}
		//console.log("Favorites: "+JSON.stringify(themesList));
		return true;
	}catch(err){
		console.log("Ocurrio un error al crear la lista de mujeres: "+err.message)
		return false;
	}
}

/*var FILE_KEY_THEME_LIST = "APPDATATHEMELIST";

function saveThemeList() {
	try{
		var tempString = JSON.stringify(themesList);
		window.localStorage.setItem(FILE_KEY_THEME_LIST,tempString);
		return true;
	}catch(err){
		return false;
	}
}

function loadThemeList() {
	var tempList = window.localStorage.getItem(FILE_KEY_THEME_LIST);
	if(tempList != null && tempList != ""){
		try{
			themesList = JSON.parse(tempList);
		}catch (e) {
			themesList = [];
		}
	}else{
		themesList = [];
	}
}*/

//Funciones base
function addTheme(theme){
	try{
		var found = false;
		for(var i=0; i<themesList.length; i++){
			if(themesList[i].id_theme == theme.id_theme){
				found = true;
				return true;
			}
		}
		if(!found){
			themesList.push(theme);
			//SAVE TO WS
			saveFavoritesToClient(theme, FAVORITE_ADD);
		}
		return true;
	}catch (e) {
		// TODO: handle exception
		console.log("ERROR ADD "+e);
		return false;
	}
}

function removeTheme(theme){
	try{
		var index = -1;
		for(var i=0; i<themesList.length; i++){
			if(themesList[i].id_theme == theme.id_theme){
				index = i;
				break;
			}
		}
		if(index != -1){
			themesList.splice(index, 1);
			//SAVE TO WS
			saveFavoritesToClient(theme, FAVORITE_REMOVE);
		}
		return true;
	}catch (e) {
		// TODO: handle exception
		console.log("ERROR REMOVE "+e);
		return false;
	}
}

function isIDThemeFavorite(idTheme){
	for(var i=0; i<themesList.length; i++){
		if(themesList[i].id_theme == idTheme){
			return true;
		}
	}
	return false;
}

function isThemeFavorite(theme){
	for(var i=0; i<themesList.length; i++){
		if(themesList[i].id_theme == theme.id_theme){
			return true;
		}
	}
	return false;
}

function saveFavoritesToClient(theme, type){
	var jsonData = {};
	
	var themeArray = [];
	themeArray.push(theme.id_theme);
	
	if(type == FAVORITE_ADD){
		jsonData.add_theme = themeArray;
	}else{
		jsonData.remove_theme = themeArray;
	}
	
	//hacemos update
	var urlUpdateClients = _url+"/api/v1/clients/update";
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
