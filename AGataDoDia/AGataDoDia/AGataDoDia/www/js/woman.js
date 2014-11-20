
	
	var _infinite = true;
	
	var _fRenderHtml =  function(_json, _push) {
		_html = _fRenderHtmlListPost(_json,_push);
		$('div.plus').remove();			
		$('body.content-woman #wrapper .scroller .container').append(_html);
		
		$('img.img-rounded').each(function (e) {
			
			var _this = $(this);					
			var _img = new Image();
    		_img.src = _this.data('src');        		        		         		
		    _img.onload = function() {		    	
		    	_this.attr('src',  _this.data('src'));
		    };
		    
		});
		
		
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
					
				_oAjax = _fGetAjaxJsonAsync(_url + '/garotas/v1/posts/get/client/' + _direction+ '/woman/' + clientID + '/' + _post + '/' + _jParameters.woman);		
				if (_oAjax) {					
					_oAjax.done(function(_json) {								
						 _fRenderHtml(_json);				 			
					});
				}
					
			}			
		}
							
	};
	
	$('#wrapper .scroller .container').append(_fRenderHtmlListPostNone());	
	_fTouchPlus($('i.icon.icon-material-add-circle'));	