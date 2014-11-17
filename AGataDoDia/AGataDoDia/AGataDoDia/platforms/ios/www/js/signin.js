	
	
	var _oAjax = _fGetAjaxJson(_url + '/garotas/loading/'+$(window).width()+'/'+$(window).height());	
	if (_oAjax) {		
		_oAjax.done(function(_json) {
			var image = _json.response.feature_image.link;	
			if(image != null){
				document.body.style.backgroundImage="url('"+image+"')";
			}
		});
	}

