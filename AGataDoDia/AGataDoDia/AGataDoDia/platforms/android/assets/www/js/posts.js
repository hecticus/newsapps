
		
	var _index = $('main').data('referer');	
	var _infinite = true; 
	var _init = true; 

	var _html = '<div class="container">';
		_html += '<div class="row" style="width:100%; height: 50px; line-height: 50px; background-color: #ffffff; position: absolute; top:50px; z-index: 5; border-bottom: 1pt solid #777777 !important; opacity: 0.8;" >';
				_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8" >';
					_html += '<h4>' + _jParameters.womanName + '</h4>';
				_html += '</div>';
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4" style="text-align: right;" >';
					_html += '<i class="icon icon-material-favorite ' + (isWomanFavorite({id_woman:_jParameters.woman}) ? 'on' : '') + '" style="font-size:1.6em; margin-left:8px;" data-touch="favorite" data-woman="' + _jParameters.woman + '"></i>';
				_html += '</div>';
			_html += '</div>';			
		_html += '</div>';

	$('body.content-posts main').prepend(_html);
	$('body.content-posts #wrapper .scroller .container').append(_fRenderHtmlListPostNone());
	
	var _fRenderHtml =  function(_json) {
			
		var _html = '';
	
		
		$.each(_json.response, function(_index,_item) {
		
			_html += '<div class="row post" data-value="' + _item.id_post + '"  >';				
				$.each(_item.files, function(_index,_file) {
						_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 figure" >';						
							_html += '<img data-src="' + _file + '"  onerror="this.style.display=\'none\'"  alt="" class="img-rounded"  style="border-bottom: 3pt solid #777777 !important; " />';							
							_html += '<div class="row" style="position: absolute; z-index: 5; top:30px; right:0px; text-align:center;">';																
								_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
									_html += '<i class="icon icon-material-share-alt" style="margin-right:20px;" onclick="sharePost(\'' + _item.title + '\', \'' + _file + '\', \'' + _item.source + '\');"></i>';
								_html += '</div>';
							_html += '</div>';					
						_html += '</div>';
				});							
			_html += '</div>';	
	
		});
				
		if (_json.response.length == 0) {
			_infinite = false;
			if ($('div.post').length == 0) _html += _fRenderHtmlListPostError();
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

		if (_init) {
						
			var _break = false;
			
			$.each(_jMenu[_index].data.response, function(_index,_item) {
				
				if (_item.id_post == _jParameters.post) {
					_fRenderHtml({response:[_item]});	
					_break = true;
										
				}

				if (_break) return _break;
				
			});
			
			
			_init = false;
				
		} else {
			
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
		}
		
										
						
	};
	
	_fTouchPlus($('i.icon.icon-material-add-circle'));	
	