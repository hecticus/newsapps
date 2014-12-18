

	var _infinite = true;
	var _init = true;
	var _index = $('main').data('index');
	var _json = _jMenu[_index].data;	 

	var _fRenderHtml =  function(_json, _push) {
		_init = false;	
		
		_html = _fRenderHtmlListPost(_json,_push);
		$('div.plus').remove();			
		$('body.content-categories #wrapper .scroller .container').append(_html);
		
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
				var _push = true;
				
				if (_this.data('direction')) _direction = _this.data('direction');
				if ($('div.post').last().data('value')) _post = $('div.post').last().data('value');
				
				if (_init) {
					_oAjax = _fGetAjaxJsonAsync(_url + '/api/v1/posts/get/client/category/' + clientID + '/' + _jParameters.category);
					_push = false;	
				
				} else {
					_oAjax = _fGetAjaxJsonAsync(_url + '/api/v1/posts/get/client/' + _direction + '/category/' + clientID + '/' + _post + '/' + _jParameters.category);
					_push = true;						
				}
				
						
				if (_oAjax) {
					_oAjax.done(function(_json) {
						if (_init) _jMenu[_index].data = _json;					
						 _fRenderHtml(_json,_push);			 			
					});
				}
		

				
			}
		}
		
		
	};
							
	$('#wrapper .scroller .container').append(_fRenderHtmlListPostNone());	
	_fTouchPlus($('i.icon.icon-material-add-circle'));
	
	
		
