	
	var _index = $('main').data('index');	
	var _json = _jMenu[_index].data; 
	var _infinite = true;
	
	var _fRenderHtml =  function(_json, _push) {		
		_html = _fRenderHtmlListPost(_json,_push);
		$('div.plus').remove();		
		$('#wrapper .scroller .container').append(_html);
		if(!_push) setTimeout(function(){_scroll.scrollTo(0,scrollPosition,0);},10);
	};
	
		
	if (_json) _fRenderHtml(_json);			

	var _fTouchPlus =  function(_this) {
		
		_this.removeClass('icon-material-add-circle');
		_this.addClass('icon-material-more-horiz');

		
		if (_oAjax.state() != 'pending') {
			
			if (_infinite) {
				_oAjax = _fGetAjaxJsonAsync(_url + '/garotas/v1/posts/get/client/' + _this.data('direction') + '/' + clientID + '/' + $('div.post').last().data('value'));
				if (_oAjax) {
					_oAjax.done(function(_json) {				
						 _fRenderHtml(_json,true);				 			
					});			
				}	
			}
				
		}									
						
	};
