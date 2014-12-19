	var real_width = 0;
	var real_height = 0;
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
		//PRUEBA
		try{sendUpstreamEvent("APP_CLOSE");}catch(e){console.log("FALLA UPSTREAM");}
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
	
	function setRealWidth(val){
		try{
			if(val != null && val != "" && !isNaN(val)){
				real_width = parseInt(val);
			}
		}catch(e){
			console.log("Bad width: "+e);
		}
	}
	function setRealHeight(val){
		try{
			if(val != null && val != "" && !isNaN(val)){
				real_height = parseInt(val);
			}
		}catch(e){
			console.log("Bad height: "+e);
		}
	}
	
	function getRealWidth(){
		if(real_width != 0){
			return real_width;
		}else{
			return $(window).width();
		}
	}
	function getRealHeight(){
		if(real_height != 0){
			return real_height;
		}else{
			return $(window).height();
		}
	}
	function errorShareConfigs(err){
		console.log("ERROR errorShareConfigs:"+err);
	}
	
	function nocallback(){
		//callback vacio para peticiones que no necesitan callback como tal
	}
