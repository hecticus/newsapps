var FILE_KEY_CLIENT = "APPDATACLIENT";

function saveClientData(json) {
	if(json != null){
		try{
			window.localStorage.setItem(FILE_KEY_CLIENT,JSON.stringify(json));
			updateDeviceToServer();
			return true;
		}catch(e){
			return false;
		}
	}else{
		return false;
	}
}

function loadClientData() {
	try{
		var temp = window.localStorage.getItem(FILE_KEY_CLIENT);
		if(temp == null){
			return null;
		}else{
			return JSON.parse(temp);
		}
	}catch(e){
		return null;
	}
}
