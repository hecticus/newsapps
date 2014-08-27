var FILE_KEY_PUSH_OPTIONS = "APPDATAPUSHOPTIONS_V2";

var currentClientCategories;
var currentClientActions;

//Category links IDs
var pushCategoryIndexes;
//ACTIONS
var pushActionsIndex;

//NEW VARS
var pushList;

function setPushList(json, deleteOld){
	pushList = json.news_categories.item.slice(0);
	if(deleteOld){
		window.localStorage.removeItem(FILE_KEY_PUSH_OPTIONS);
		//getClientPushOptions(doNothing,doNothing);
	}
}

function checkIfCategoriesExists(categoriesClientList){
	for(var i=0;i<pushList.length;i++){
		for(var j=0;j<categoriesClientList.length;j++){
			if(pushList[i].id_category == categoriesClientList[j]){
				//almenos comparten 1 categoria, por ende ya estaba en el sistema y no hay que agregarlo a todas las categorias
				return true;
			}
		}
	}
	return false;
}

//Agrega la informacion necesaria a las categorias para saber cuales estan seleccionadas para hacer push y cuales no
function markCurrentPushServices(currentClientCategories,currentClientActions){
	for(var j=0;j<pushList.length; j++){
    	pushList[j].isSuscribed = false;
    }
	for(var i=0;i<pushList.length;i++){
		for(var j=0;j<currentClientActions.length;j++){
			if(pushList[i].id_action == currentClientActions[j]){
				//marcamos como que esta activa
				pushList[i].isSuscribed = true;
			}
		}
	}
}

//GETTERS
function getActionByID(actionID){
	for(var i=0;i<pushActionsIndex.length;i++){
		if(pushActionsIndex[i].id_action == actionID){
			return pushActionsIndex[i];
		}
	}
}

function savePushOptions(pushOptions) {
	try{
		window.localStorage.setItem(FILE_KEY_PUSH_OPTIONS,JSON.stringify(pushOptions));
		return true;
	}catch(e){
		return false;
	}
}

function loadPushOptions() {
	try{
		var temp = window.localStorage.getItem(FILE_KEY_PUSH_OPTIONS);
		if(temp == null){
			return null;
		}else{
			return JSON.parse(temp);
		}
	}catch(e){
		return null;
	}
}


function updatePushOptionsToServer(okFunction, failFunction){
	try {	
		//revisamos si tenemos cliente porque sino no podemos registrar nada
		var client = loadClientData();
		if(client == null){
			//console.log("Aun no hay cliente para registrar la categoria del push");
			failFunction();
			return;
		}
		//var urlUpdate = "http://10.0.3.144:9002/push/client/update";
		var urlUpdate = "http://polla.tvmax-9.com/push/client/update";
		/*var _data = {}
		_data.idClient = client.id_social_clients;
		var _innerArray = [];
		var _innerData = {};
		_innerData.category = PUSH_CATEGORY_NEWS;
		_innerArray.push(_innerData);
		_data.categories = _innerArray;*/
		var _data = makeCategoriesActionsUpdate();
		_data.idClient = client.id_social_clients;
		//console.log("DATA: "+JSON.stringify(_data));
	  	$.ajax({
			url : urlUpdate,
			data: JSON.stringify(_data),	
			type: 'POST',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			timeout : 30000,
			success : function(data, status) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				var code = data.error;
				//console.log("RESPONSE ="+JSON.stringify(data));
				if(code == 0){
					//SAVE Categories
					//console.log("GUARDO TODO BIEN "+JSON.stringify(_data));
					savePushOptions(_data);
					okFunction();
				}else{
					console.log("Error guardando push options: "+data.description);
					failFunction();
				}
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log("error add push options: "+thrownError);
				failFunction();
			}
		});
		   
	} catch (e) {
		failFunction();
	}
}

function makeCategoriesActionsUpdate(){
	//{"categories":[{"category": 13},{"category": 14}], "idClient":23, "actions":[{"action": 13},{"action": 14}]}
	var obj = {};
	obj.categories = [];
	obj.actions = [];
	for(var i=0; i<pushList.length; i++){
		//Siempre se mantiene la suscripcion a la categoria, mas no a la accion
		var innerCat = {};
		innerCat.category = pushList[i].id_category;
		obj.categories.push(innerCat);
		if(pushList[i].isSuscribed == true){
			var innerAct = {};
			innerAct.action = pushList[i].id_action;
			obj.actions.push(innerAct);
		}
	}
	return obj;
	/*var obj = {};
	obj.categories = [];
	obj.actions = [];
	for(var i=0; i<currentClientCategories.length; i++){
		var inner = {};
		inner.category = currentClientCategories[i];
		obj.categories.push(inner);
	}
	for(var i=0; i<currentClientActions.length; i++){
		var inner = {};
		inner.action = currentClientActions[i];
		obj.actions.push(inner);
	}
	return obj;*/
}

function markAllCategoriesAndActions(){
	for(var i=0;i<pushList.length;i++){
		//marcamos como que esta activa
		pushList[i].isSuscribed = true;
	}
	/*currentClientCategories = [];
	for(var i=0;i<pushCategoryIndexes.length;i++){
		//agregamos todas las categorias que no sean paises, eso si se tiene que agregar a parte
		if(pushCategoryIndexes[i].id_team == null || pushCategoryIndexes[i].id_team == ""){
			currentClientCategories.push(pushCategoryIndexes[i].id_category);
		}
	}
	currentClientActions = [];
	for(var i=0;i<pushActionsIndex.length;i++){
		//agregamos todas las acciones
		currentClientActions.push(pushActionsIndex[i].id_action);
	}
	sortCategoriesActionsArrays();*/
}

function sortCategoriesActionsArrays(){
	currentClientCategories.sort(sortNumber);
	currentClientActions.sort(sortNumber);
}

function checkIfPushConfigsChanged(newClientActions){
	sortCategoriesActionsArrays();
	newClientActions.sort(sortNumber);
	var areEqual = false;
	if(currentClientActions.equals(newClientActions)){
		areEqual = true;
	}
	//console.log("Compare Push configs are Equal? "+areEqual);
	return areEqual;
}

//GET INFO FROM CLIENT
function getClientPushOptions(successFunction, errorFunction, fromAlerts){
	
	try {	
		//revisamos si tenemos cliente porque sino no podemos buscar nada
		var client = loadClientData();
		if(client == null){
			//console.log("Aun no hay cliente para registrar la categoria del push");
			if(fromAlerts){
				setTimeout(function() {
					updateDeviceToServer();	
				}, 100);
			}
			setTimeout(function() {
				errorFunction();	
			}, 600);
			
			return;
		}

		var urlFind = "http://polla.tvmax-9.com/push/client/getInfoSimple";
		var _data = {}
		_data.idClient = client.id_social_clients;
		
	  	$.ajax({
			url : urlFind,
			data: JSON.stringify(_data),	
			type: 'POST',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			timeout : 30000,
			success : function(data, status) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				var code = data.error;
				//console.log("RESPONSE ="+JSON.stringify(data));
				if(code == 0){
					//SAVE Categories
					//console.log("CONSULTO TODO BIEN "+JSON.stringify(data));

					currentClientCategories = data.clientCategories.slice(0);
					currentClientActions = data.clientActions.slice(0);
					//revisamos si tenemos informacion guardada, esto es para activar todas las categorias
					var pushOptions = loadPushOptions();
					if(!checkIfCategoriesExists(currentClientCategories)){
						markAllCategoriesAndActions(); //TODO:arreglar, por ahora dispositivo nuevo marca todas activas y listo
						updatePushOptionsToServer(doNothing,doNothing);
					}
					
					markCurrentPushServices(currentClientCategories,currentClientActions);
					successFunction();
				}else{
					console.log("Error consultando push options: "+data.description);
				}
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log("error consultando push options: "+thrownError);
				errorFunction();
			}
		});
		   
	} catch (e) {
		errorFunction();
	}
}

function checkCategoriesAndActions(){
	//las ordenamos para poder comparar
	currentClientCategories.sort(sortNumber);
	currentClientActions.sort(sortNumber);
	
}
