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
	
	
	function exitApp(){
		try{clearInterval(newsRefreshInterval);}catch(e){}
		//gaPlugin.exit(successGAHandler, successGAHandler);
		if (navigator.app) {					
	        navigator.app.exitApp();				            
	    } else if (navigator.device) {			        	
	        navigator.device.exitApp();				            				          
	    }
	}
	
