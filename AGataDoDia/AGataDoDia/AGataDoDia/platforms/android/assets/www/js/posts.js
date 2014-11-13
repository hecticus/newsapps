
		
	var _index = $('main').data('referer');
	var _infinite = true; 
	$('#wrapper .scroller .container').append(_fRenderHtmlListPostNone());	
	
	var _fRenderHtml =  function(_json) {
			
		var _html = '';
		
		$.each(_json.response, function(_index,_item) {
			_html += '<div class="row post" data-value="' + _item.id_post + '"  >';				
				$.each(_item.files, function(_index,_file) {
						_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 figure" >';						
							_html += '<img data-src="' + _file + '"  onerror="this.style.display=\'none\'"  alt="" class="img-rounded"  />';							
							_html += '<div class="row" style="position: absolute; z-index: 5; top:30px; right:0px; text-align:center;">';																
								_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
									_html += '<i class="icon icon-material-share-alt" style="margin-right:20px;" onclick="window.plugins.socialsharing.share(\'' + _item.title + '\', null, \'' + _file + '\', \'' + _item.source + '\');"></i>';
								_html += '</div>';
							_html += '</div>';					
						_html += '</div>';
				});							
			_html += '</div>';
		});
				
		if (_json.response.length == 0) {
			_infinite = false;
			_html += _fRenderHtmlListPostError();	
		} else {
			_html += _fRenderHtmlListPostNone();
		}
						
		$('div.plus').remove();
		$('body.content-posts #wrapper .scroller .container').append(_html);
		
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
				var _post = _jParameters.post;
				var _woman = _jParameters.woman;
				
				if (_this.data('direction')) _direction = _this.data('direction');
				if ($('div.post').last().data('value')) _post = $('div.post').last().data('value');
	

				_oAjax = _fGetAjaxJsonAsync(_url + '/garotas/v1/posts/images/get/client/' + _direction + '/woman/' + clientID + '/' + _post + '/' + _jParameters.woman);
				if (_oAjax) {
					_oAjax.done(function(_json) {										
					 	_fRenderHtml(_json);				 				 			
					});			
				}
					
			}
				
		}									
						
	};
	
	_fTouchPlus($('i.icon.icon-material-add-circle'));	
	