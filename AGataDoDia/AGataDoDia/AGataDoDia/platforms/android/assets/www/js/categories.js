
	var _index = $('main').data('index');	
	var _infinite = true;
	
	
	var _fRenderHtml =  function(_json, _push) {
		_html = _fRenderHtmlListPost(_json,_push);
		$('div.plus').remove();			
		$('body.content-categories #wrapper .scroller .container').append(_html);
	};
	
	var _fTouchPlus =  function(_this) {
	
		_this.removeClass('icon-material-add-circle');
		_this.addClass('icon-material-more-horiz');
		
		if (_oAjax.state() != 'pending') {
			if (_infinite) {
	
				var _direction = 'down';
				var _post = 0;
				
				if (_this.data('direction')) _direction = _this.data('direction');
				if ($('div.post').last().data('value')) _post = $('div.post').last().data('value');
				

				_oAjax = _fGetAjaxJsonAsync(_url + '/garotas/v1/posts/get/client/' + _direction + '/category/' + clientID + '/' + _post + '/' + _jParameters.category);		
				if (_oAjax) {
					_oAjax.done(function(_json) {				
						 _fRenderHtml(_json);				 			
					});
				}
		
				
			}
		}
		
		
	};						

	_fTouchPlus($('i.icon.icon-material-add-circle'));	