	var _oAjax = _fGetAjaxJson(_url + '/garotas/loading/'+$(window).width()+'/'+$(window).height());	
	if (_oAjax) {		
		_oAjax.done(function(_json) {

			if (_json.response.feature_image.link != null) {
				var _img = new Image();
    			_img.src = _json.response.feature_image.link;        		        		         		
		    	_img.onload = function() {
		    		document.body.style.backgroundImage="url('"+_json.response.feature_image.link+"')";	    	
		    	};
			}
 
		});
	}