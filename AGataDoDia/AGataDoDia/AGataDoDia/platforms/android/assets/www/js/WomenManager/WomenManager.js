var womenList = [];

function initWomenManager(){
	try{
		loadWomenList();
	}catch (e) {
		
	}
}

var FILE_KEY_WOMEN_LIST = "APPDATAWOMENLIST";

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
}

//WOMEN MANAGER OPERATIONS
function setWomenFromWS(data){
	try{
		//data[i].woman es el objeto
		return true;
	}catch(err){
		console.log("Ocurrio un error al crear la lista de mujeres: "+err.message)
		return false;
	}
}

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
		}
		return true;
	}catch (e) {
		// TODO: handle exception
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
		}
		return true;
	}catch (e) {
		// TODO: handle exception
		return false;
	}
}
