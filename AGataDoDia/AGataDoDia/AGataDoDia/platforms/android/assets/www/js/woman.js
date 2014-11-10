

	var _index = $('main').data('index');
	
	
	_oAjax = _fGetAjaxJson(_url + '/garotas/v1/posts/get/client/woman/' + clientID + '/' + _jParameters.woman);
	
	
	if (_oAjax) {
		_oAjax.done(function(_json) {				
			_jMenu[_index].data = _json; 						 			
		});
	}
	
	var _json = _jMenu[_index].data; 
	
	var _fRenderHtml =  function(_json, _push) {	
		_html = _fRenderHtmlListPost(_json,_push);
		$('div.plus').remove();			
		$('#wrapper .scroller .container').append(_html);
	};
		
		
	if (_json) _fRenderHtml(_json);
				
	var _fTouchPlus =  function(_this) {
		_this.removeClass('icon-material-add-circle');
		_this.addClass('icon-material-more-horiz');		
		_oAjax = _fGetAjaxJsonAsync(_url + '/garotas/v1/posts/get/client/down/woman/' + _this.data('direction') + '/' + _jParameters.client + '/' + $('div.post').last().data('value') + '/' + _jParameters.woman);		
		if (_oAjax) {
			_oAjax.done(function(_json) {				
				 _fRenderHtml(_json,true);				 			
			});
		}						
	};
