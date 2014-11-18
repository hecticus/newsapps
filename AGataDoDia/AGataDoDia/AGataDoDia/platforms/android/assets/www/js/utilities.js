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
		window.localStorage.removeItem(FILE_KEY_CLIENT_DATASAFE);
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
	
	var touchType = "click";
	//Para manejo de los touch
	function checkBadTouch(e, onClickEvent){
		if(device.platform == "iOS"){
			if(onClickEvent){
				return e.type == "touchstart" || e.type == "touchend";
			}else{
				return e.type == "touchstart";
			}
		}else{
			return e.type == "touchstart" || e.type == "touchend";
		}
	}
	function setTouchType(){
		if(device.platform == "iOS"){
			touchType = "touchend";
		}else{
			touchType = "click";
		}
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
	
	function _fAlert(_message) {
		

		var _html = '<div id="alert" class="alert alert-warning alert-dismissible" role="alert">';			
  			 _html += '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';  			 
  			 _html += '<span style="color:#ffffff;">' + _message + '</span>';			
		_html += '</div>';
		
		$('#alert').remove();
		$('body').append(_html);
		
		$('#alert').fadeOut(5000, function(){
			$(this).remove();
		});
		
	};


	function _fPhonegapIsOnline(){
	 	var networkState = navigator.connection.type;
	 	if(networkState == Connection.NONE || networkState == Connection.UNKNOWN){
	  		return false;
	 	}else{
	  		return true;
	 	}
	};
	
	function _fUseImageCache(_image,_background) {		
		if (ImgCache.ready) {
					
			var _selector = 'img[src="' + _image + '"]';		
			if (_background) _selector = 'div[data-src="' + _image + '"]';
	
			$(_selector).each(function() {
		    	var _this = $(this);
				ImgCache.isCached(_this.attr('src'), function(_path, _success) {
					if(_success) {
						if(isOffline()) {
							if (_background) {
								ImgCache.useCachedBackground(_this);
							} else {
								ImgCache.useCachedFile(_this); 
							};						
						};
					} else {
						ImgCache.cacheFile(_this.attr('src'), function() {
							ImgCache.useOnlineFile(_this);
					    });
					};
				});                                	
			});
			
		};
	};
