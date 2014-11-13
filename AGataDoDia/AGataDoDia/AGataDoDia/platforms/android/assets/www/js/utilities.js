	var _lastClicked = 0;
	
	function _fGetCurrentTimeMillis() {
		return new Date().getTime();
	}
	
	function _fPreventDefaultClick(e){
		try{e.preventDefault();}catch(ex){}
		try{e.stopPropagation();}catch(ex){}
		try{e.stopImmediatePropagation();}catch(ex){}	
		if(_lastClicked != 0 &&  _fGetCurrentTimeMillis() - _lastClicked  < 500){
			return true;
		}else{
			_lastClicked = _fGetCurrentTimeMillis();
			return false;
		}
	};


	var _fGetAjaxJson = function(_url) {
		try {		
			return $.ajax({
					url: _url,			
					type: 'GET',          		
					dataType : 'json',
					async: false,
					contentType: 'application/json; charset=utf-8',		
				}).fail(function(jqXHR, textStatus, errorThrown) {		
					return false;
				});
		} catch (e) {
			return false;
		}
	};
		
	var _fGetAjaxJsonAsync = function(_url) {
		try {		
			return $.ajax({
					url: _url,			
					type: 'GET',          		
					dataType : 'json',
					async: true,
					contentType: 'application/json; charset=utf-8',		
				}).fail(function(jqXHR, textStatus, errorThrown) {		
					return false;
				});
		} catch (e) {
			return false;
		}	
	};
	
	var _fPostAjaxJson = function(_url, _data) {
		
		try {				
		  	return $.ajax({
				url: _url,		
				data: JSON.stringify(_data),	
				type: 'POST',
				dataType: 'json',				
				contentType: "application/json; charset=utf-8",
			}).fail(function(jqXHR, textStatus, errorThrown) {		
				return false;
			});			   
		} catch (e) {
			return false;
		}
		
	};
	
	
	function _fGetMoment(_date) {	
		var _oMoment = moment();	
		if (_date) _oMoment = moment(_date,'YYYYMMDD hh:mm');
		
		_oMoment.locale('es');
		return _oMoment;
	};
	
	//get device type
	function getDevice(){
		var devicePlatform = device.platform;
		//IOS
		if(devicePlatform == "iOS"){
			return "iOS";
		}else{
			return "android";
		}
		
		//return "android";
	}
	
	//REMOVE OLD DATA
	var FILE_KEY_STOREDVERSION = "APPSTOREDVERSION";
	var currentVersion = 0;
	function checkStoredData(){
		var storedVersion = loadStoredVersion();
		if(storedVersion != null && storedVersion != ""){
			var storedInt = parseInt(storedVersion);
			if(currentVersion > storedVersion){
				//borramos todas las configuraciones
				eraseAllConfigs();
			}
		}else{
			//borramos todas las configs
			eraseAllConfigs();
		}
		saveStoredVersion();
	}
	function eraseAllConfigs(){
		window.localStorage.removeItem(FILE_KEY_CLIENT_ID);
		window.localStorage.removeItem(FILE_KEY_CLIENT_MSISDN);
		window.localStorage.removeItem(FILE_KEY_CLIENT_REGID);
	}
	function saveStoredVersion() {
		try{
			window.localStorage.setItem(FILE_KEY_STOREDVERSION,""+currentVersion);
			return true;
		}catch(err){
			return false;
		}
	}
	function loadStoredVersion() {
		return window.localStorage.getItem(FILE_KEY_STOREDVERSION);
	}
	
	
	function exitApp(){
		try{clearInterval(newsRefreshInterval);}catch(e){}
		//gaPlugin.exit(successGAHandler, successGAHandler);
		if (navigator.app) {					
	        navigator.app.exitApp();				            
	    } else if (navigator.device) {			        	
	        navigator.device.exitApp();				            				          
	    }
	}
	


	

