
	
	
	var _index = $('main').data('referer');
	var _json = _jMenu[_index].data;
	var _infinite = true; 
	var _html = '';
	
	if (_json) {
		
		var _width = $(window).width();
		var _break = false;

		$.each(_json.response, function(_index,_item) {

			if (_item.id_post == _jParameters.post) {
							
				_html += '<div class="row post" data-value="' + _item.id_post + '" data-woman="' + _item.woman.id_woman + '"  style="border-bottom: 3pt solid #777777 !important;" >';				
				$.each(_item.files, function(_index,_file) {
					
						_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 figure" >';						
							_html += '<img onerror="this.style.display=\'none\'" src="' + _file + '" alt="' + _item.woman.name + '" class="img-rounded lazy"  />';							
							_html += '<div class="row" style="position: absolute; z-index: 5; top:30px; right:0px; text-align:center;">';																
								_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
									_html += '<i class="icon icon-material-share-alt" style="margin-right:20px;" onclick="window.plugins.socialsharing.share(\'' + _item.title + '\', null, \'' + _file + '\', \'' + _item.source + '\');"></i>';
								_html += '</div>';
							_html += '</div>';					
						_html += '</div>';
					
				});
								
				_html += '</div>';
				
				_break = true;
								
			}	 
							
			if (_break) return true;
		

		});
		
		
		if (_json.response.length == 0) {
			_infinite = false;
			_html += '<div class="row" >';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center;" >';
					_html += '<h4>El resultado de la b&uacute;squeda no gener&oacute; ning&uacute;n resultado</h4>';
				_html += '</div>';
			_html += '</div>';
		} else {
			_html += '<div class="row plus" >';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center; margin-top:10px !important; margin-bottom:10px !important;" >';		
					_html += '<i class="icon icon-material-add-circle" data-touch="plus" data-direction="down" ></i>';
				_html += '</div>';
			_html += '</div>';
		}
		

		$('#wrapper .scroller .container').empty();		
		$('#wrapper .scroller .container').append(_html);
		
				

	} 
	
	var _fTouchPlus =  function(_this) {
		
		_this.removeClass('icon-material-add-circle');
		_this.addClass('icon-material-more-horiz');

		if (_oAjax.state() != 'pending') {			
			if (_infinite) {
				
				var _direction = 'down';
				var _post = 0;
				var _woman = 0;
				
				if (_this.data('direction')) _direction = _this.data('direction');
				if ($('div.post').last().data('value')) _post = $('div.post').last().data('value');
				if ($('div.post').last().data('woman')) _woman = $('div.post').last().data('woman');

				_oAjax = _fGetAjaxJsonAsync(_url + '/garotas/v1/posts/images/get/client/' + _this.data('direction') + '/woman/' + clientID + '/' + _post + '/' + _woman);
				if (_oAjax) {
					_oAjax.done(function(_json) {				
					
						 _html = '';
						 
						 $.each(_json.response, function(_index,_item) {
							_html += '<div class="row post" data-value="' + _item.id_post + '" data-woman="' + _woman + '"  style="border-bottom: 3pt solid #777777 !important;" >';
							
								$.each(_item.files, function(_index,_file) {
									
										_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 figure" >';						
											_html += '<img onerror="this.style.display=\'none\'" src="' + _file + '" alt="' + _woman + '" class="img-rounded lazy"  />';							
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
							_html += '<div class="row" >';
								_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center;" >';
									_html += '<h4>El resultado de la b&uacute;squeda no gener&oacute; ning&uacute;n resultado</h4>';
								_html += '</div>';
							_html += '</div>';
						} else {
							_html += '<div class="row plus" >';
								_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center; margin-top:10px !important; margin-bottom:10px !important;" >';		
									_html += '<i class="icon icon-material-add-circle" data-touch="plus" data-direction="down" ></i>';
								_html += '</div>';
							_html += '</div>';
						}
						
						$('div.plus').remove();
						$('#wrapper .scroller .container').append(_html);
						 
						 				 			
					});			
				}
					
			}
				
		}									
						
	};
	
	
	