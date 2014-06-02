var FILE_KEY_PUSH_CATEGORIES = "APPDATAPUSHCATEGORIES";

var PUSH_CATEGORY_NEWS = 46;

function savePushCategories(pushCategories) {
	try{
		window.localStorage.setItem(FILE_KEY_PUSH_CATEGORIES,JSON.stringify(pushCategories));
		return true;
	}catch(e){
		return false;
	}
}

function loadPushCategories() {
	try{
		var temp = window.localStorage.getItem(FILE_KEY_PUSH_CATEGORIES);
		if(temp == null){
			return null;
		}else{
			return JSON.parse(temp);
		}
	}catch(e){
		return null;
	}
}


function updatePushCategoriesToServer(){
	try {	
		//console.log("Va a actualizar las categorias");
		var currentPushCategories = loadPushCategories();
		if(currentPushCategories != null){
			//Ya se guardaron los valores despues hay que revisar los valores individuales
			//console.log("Registrado en el servidor ya no se vuelve a registrar");
			return;
		}
		//revisamos si tenemos cliente porque sino no podemos registrar nada
		var client = loadClientData();
		if(client == null){
			//console.log("Aun no hay cliente para registrar la categoria del push");
			return;
		}
		//var urlUpdate = "http://192.168.1.128:9002/push/client/insert";
		var urlUpdate = "http://polla.tvmax-9.com/push/client/insert";
		var _data = {}
		_data.idClient = client.id_social_clients;
		var _innerArray = [];
		var _innerData = {};
		_innerData.category = PUSH_CATEGORY_NEWS;
		_innerArray.push(_innerData);
		_data.categories = _innerArray;
		//console.log("DATA: "+JSON.stringify(_data));
	  	$.ajax({
			url : urlUpdate,
			data: JSON.stringify(_data),	
			type: 'POST',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			timeout : 60000,
			success : function(data, status) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				var code = data.error;
				console.log("RESPONSE ="+JSON.stringify(data));
				if(code == 0){
					//SAVE Categories
					//console.log("GUARDO TODO BIEN "+JSON.stringify(_data));
					savePushCategories(_data);
				}else{
					console.log("Error guardando push categories: "+data.description);
				}
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log("error add push categories: "+thrownError);
			}
		});
		   
	} catch (e) {
	}
}
