var womenList = [];

var FAVORITE_ADD = 0;
var FAVORITE_REMOVE = 1;

function initWomenManager(data){
	try{
		//data[i].woman es el objeto
		if(data != null && data.length > 0){
			womenList = []; //vaciamos la lista anterior que tenemos
			for(var i=0; i<data.length;i++){
				womenList.push(data[i].woman);
			}
		}
		console.log("Favorites: "+JSON.stringify(womenList));
		return true;
	}catch(err){
		console.log("Ocurrio un error al crear la lista de mujeres: "+err.message)
		return false;
	}
}

/*var FILE_KEY_WOMEN_LIST = "APPDATAWOMENLIST";

function saveWomenList() {
	try{
		var tempString = JSON.stringify(womenList);
		window.localStorage.setItem(FILE_KEY_WOMEN_LIST,tempString);
		return true;
	}catch(err){
		return false;
	}
}

function loadWomenList() {
	var tempList = window.localStorage.getItem(FILE_KEY_WOMEN_LIST);
	if(tempList != null && tempList != ""){
		try{
			womenList = JSON.parse(tempList);
		}catch (e) {
			womenList = [];
		}
	}else{
		womenList = [];
	}
}*/

//Funciones base
function addWoman(woman){
	try{
		var found = false;
		for(var i=0; i<womenList.length; i++){
			if(womenList[i].id_woman == woman.id_woman){
				found = true;
				return true;
			}
		}
		if(!found){
			womenList.push(woman);
			//SAVE TO WS
			saveFavoritesToClient(woman, FAVORITE_ADD);
		}
		return true;
	}catch (e) {
		// TODO: handle exception
		console.log("ERROR ADD "+e);
		return false;
	}
}

function removeWoman(woman){
	try{
		var index = -1;
		for(var i=0; i<womenList.length; i++){
			if(womenList[i].id_woman == woman.id_woman){
				index = i;
				break;
			}
		}
		if(index != -1){
			womenList.splice(index, 1);
			//SAVE TO WS
			saveFavoritesToClient(woman, FAVORITE_REMOVE);
		}
		return true;
	}catch (e) {
		// TODO: handle exception
		console.log("ERROR REMOVE "+e);
		return false;
	}
}

function isIDWomanFavorite(idWoman){
	for(var i=0; i<womenList.length; i++){
		if(womenList[i].id_woman == idWoman){
			return true;
		}
	}
	return false;
}

function isWomanFavorite(woman){
	for(var i=0; i<womenList.length; i++){
		if(womenList[i].id_woman == woman.id_woman){
			return true;
		}
	}
	return false;
}

function saveFavoritesToClient(woman, type){
	var jsonData = {};
	
	var womanArray = [];
	womanArray.push(woman.id_woman);
	
	if(type == FAVORITE_ADD){
		jsonData.add_woman = womanArray;
	}else{
		jsonData.remove_woman = womanArray;
	}
	
	//hacemos update
	var urlUpdateClients = _url+"/garotas/v1/clients/update";
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
