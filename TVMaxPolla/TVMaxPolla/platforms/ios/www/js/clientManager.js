var FILE_KEY_CLIENT = "APPDATACLIENT";

function saveClientData(json) {
	if(json != null){
		try{
			window.localStorage.setItem(FILE_KEY_CLIENT,JSON.stringify(json));
			return true;
		}catch(e){
			return false;
		}
	}else{
		return false;
	}
}

function loadClientData() {
	return window.localStorage.getItem(FILE_KEY_CLIENT);
}
