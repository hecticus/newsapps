var FILE_KEY_PUSH_OPTIONS = "APPDATAPUSHOPTIONS";

var PUSH_CATEGORY_NEWS = 46;

var currentClientCountries;
var currentClientCategories;
var currentClientActions;

//Category links IDs
var pushCategoryIndexes;
//ACTIONS
var pushActionsIndex;
//countries
var pushCountriesIndexes;

//GETTERS
function getActionByID(actionID){
	for(var i=0;i<pushActionsIndex.length;i++){
		if(pushActionsIndex[i].id_action == actionID){
			return pushActionsIndex[i];
		}
	}
}

function getCountryByCategoryID(catID){
	for(var i=0;i<pushCountriesIndexes.length;i++){
		if(pushCountriesIndexes[i].id_category == catID){
			return pushCountriesIndexes[i];
		}
	}
	return null;
}

function getCategoryIDByCountryCode(countryCode){
	for(var i=0;i<pushCountriesIndexes.length;i++){
		if(pushCountriesIndexes[i].id_team == countryCode){
			return pushCountriesIndexes[i];
		}
	}
	return null;
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
		//console.log("Va a actualizar las categorias");
		/*var currentPushOptions = loadPushOptions();
		if(currentPushOptions != null){
			//Ya se guardaron los valores despues hay que revisar los valores individuales
			//console.log("Registrado en el servidor ya no se vuelve a registrar");
			return;
		}*/
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
				console.log("RESPONSE ="+JSON.stringify(data));
				if(code == 0){
					//SAVE Categories
					console.log("GUARDO TODO BIEN "+JSON.stringify(_data));
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
	for(var i=0; i<currentClientCategories.length; i++){
		var inner = {};
		inner.category = currentClientCategories[i];
		obj.categories.push(inner);
	}
	for(var i=0; i<currentClientCountries.length; i++){
		var inner = {};
		inner.category = currentClientCountries[i];
		obj.categories.push(inner);
	}
	for(var i=0; i<currentClientActions.length; i++){
		var inner = {};
		inner.action = currentClientActions[i];
		obj.actions.push(inner);
	}
	return obj;
}

function markAllCategoriesAndActions(){
	currentClientCountries = [];
	currentClientCategories = [];
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
	sortCategoriesActionsArrays();
}

function sortCategoriesActionsArrays(){
	currentClientCategories.sort(sortNumber);
	currentClientCountries.sort(sortNumber);
	currentClientActions.sort(sortNumber);
}

function checkIfPushConfigsChanged(newCountries, newClientActions){
	sortCategoriesActionsArrays();
	newClientActions.sort(sortNumber);
	var areEqual = false;
	if(currentClientCountries.equals(newCountries) && currentClientActions.equals(newClientActions)){
		areEqual = true;
	}
	console.log("Compare Push configs are Equal? "+areEqual);
	return areEqual;
}

function setNewPushOptionsToServer(newCountries, newClientActions, okFunction, failFunction){
	try{
		currentClientCountries = newCountries.slice(0);
		currentClientActions = newClientActions.slice(0);
		currentClientCountries.sort(sortNumber);
		currentClientActions.sort(sortNumber);
		updatePushOptionsToServer(okFunction, failFunction);
	}catch(e){
		failFunction();
	}
}

//GET INFO FROM CLIENT
function getClientPushOptions(successFunction, errorFunction, firstTime){
	
	try {	
		//revisamos si tenemos cliente porque sino no podemos buscar nada
		var client = loadClientData();
		if(client == null){
			//console.log("Aun no hay cliente para registrar la categoria del push");
			errorFunction();
			return;
		}
		
		if(firstTime){
			var pushOptions = loadPushOptions();
			if(pushOptions != null){
				return;
			}
		}
		//var urlFind = "http://10.0.3.144:9002/push/client/getInfo";
		var urlFind = "http://polla.tvmax-9.com/push/client/getInfo";
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
				console.log("RESPONSE ="+JSON.stringify(data));
				if(code == 0){
					//SAVE Categories
					console.log("CONSULTO TODO BIEN "+JSON.stringify(data));
					//split data for countries
					//pushCategoryIndexes = data.categoriesAll.slice(0);
					pushCountriesIndexes = [];
					pushCategoryIndexes = [];
					var tempIndex = data.categoriesAll.slice(0);
					for(var i=0;i<tempIndex.length;i++){
						if(tempIndex[i].id_team != null && tempIndex[i].id_team != ""){
							pushCountriesIndexes.push(tempIndex[i]);
						}else{
							pushCategoryIndexes.push(tempIndex[i]);
						}
					}
					pushActionsIndex = data.actionsAll.slice(0);
					
					//currentClientCategories = data.clientCategories.slice(0);
					//split data for countries
					currentClientCategories = [];
					currentClientCountries = [];
					var temp = data.clientCategories.slice(0);
					for(var i=0;i<temp.length;i++){
						//revisamos si es un id de country o de categoria
						if(isCategoryIndex(temp[i])){
							currentClientCategories.push(temp[i]);
						}else{
							currentClientCountries.push(temp[i]);
						}
					}
					
					currentClientActions = data.clientActions.slice(0);
					//revisamos si tenemos informacion guardada, esto es para activar todas las categorias
					var pushOptions = loadPushOptions();
					if(pushOptions == null){
						//hacemos update con todas las alertas encendidas si no tiene ninguna accion, ya que debe ser un cliente nuevo
						/*if(currentClientActions == null || currentClientActions.length == 0){
							markAllCategoriesAndActions();
						}*/
						markAllCategoriesAndActions(); //TODO:arreglar, por ahora dispositivo nuevo marca todas activas y listo
						updatePushOptionsToServer(doNothing,doNothing);
					}
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

function isCategoryIndex(catID){
	/*for(var i=0;i<pushCategoryIndexes.length;i++){
		if(pushCategoryIndexes[i].id_category == catID){
			return true;
		}
	}*/
	for(var i=0;i<pushCategoryIndexes.length;i++){
		if(pushCategoryIndexes[i].id_category == catID){
			if(pushCategoryIndexes[i].id_team == null || pushCategoryIndexes[i].id_team == ""){
				return true;
			}else{
				return false;
			}
		}
	}
	return false;
}

function checkCategoriesAndActions(){
	//las ordenamos para poder comparar
	currentClientCategories.sort(sortNumber);
	currentClientActions.sort(sortNumber);
	
}
