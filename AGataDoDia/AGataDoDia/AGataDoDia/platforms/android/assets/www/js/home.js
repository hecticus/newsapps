

	//loading...
		
	var _oAjax = _fGetAjaxJson(_url + '/v1/posts/get/client/' + _client);
	
	if (_oAjax) {		
		_oAjax.done(function(_json) {

			var _html = '';				
				$.each(_json.response, function(_index,_item) {
					
					_html += '<div class="row" data-touch="post" data-post="' + _item.id_post + '" >';
						_html += '<div class="col-md-12">';
							_html += '<img onerror="this.style.display=\'none\'" src="' + _item.woman.default_photo + '" alt="' +_item.woman.name + '" style="width:100%; height:auto;" />';
							_html += '<h3>' + _item.woman.name + '</h3>';
							
							_html += '<h5 style="text-transform: capitalize;">' + _fGetMoment(_item.date).format('MMMM, DD YYYY / hh:mm a') + '</h5>';
							_html += '<h2>' + _item.title + '</h2>';
							_html += '<p>' + _item.content + '</p>';
							
						_html += '</div>';		
				
					
						_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
							_html += '<i class="icon-material-camera-alt" style="margin-right:2px;"></i>';
						_html += '</div>';		

						_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="text-align:right;">';
						
							_html += '<i class="icon-material-favorite" style="margin-left:2px;" data-touch="favorite" data-woman="' + _item.woman.id_woman + '"></i>';
							_html += '<i class="icon-material-share-alt" style="margin-left:2px;"></i>';
							
							/*$.each(_item.woman.social_networks, function(_index,_item) {							
								switch(_item.social_network.id_social_network) {
								    case 1: _html += '<i class="icon icon-material-post-instagram" style="margin-left:2px;"></i>';	
								       break;
								    case 2: _html += '<i class="icon icon-material-post-facebook" style="margin-left:2px;"></i>';	
								       break;
								    case 3: _html += '<i class="icon icon-material-post-twitter" style="margin-left:2px;"></i>';	
								       break;
								}	
							});*/
									/*
							';
							_html += '<i class="icon-material-link" style="margin-left:2px;"></i>';
							_html += '<i class="icon-material-web2" style="margin-left:2px;"></i>';
							*/
						
						
	
						_html += '</div>';		
					_html += '</div>';	
									
				});		
			
						
			$('#wrapper .scroller .container').empty();
			$('#wrapper .scroller .container').append(_html);
																
		});
	}


	$(document).on('click','[data-touch="post"]', function(e) {
		if(_fPreventDefault(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		var _post = $(this).data('post');		
	});


	$(document).on('click','[data-touch="favorite"]', function(e) {
				
		if(_fPreventDefault(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		
		var _woman = $(this).data('woman');
		var _data = {'add_woman': [],'remove_woman': []};
		
		if($(this).hasClass('on')) {
			$('[data-touch="favorite"][data-woman="' + _woman + '"]').removeClass('on');
			_data.add_woman.push(_woman);
			
			alert(_url + '/v1/clients/update/' + _client);
			
			var _oAjax = _fPostAjaxJson(_url + '/v1/clients/update/' + _client,_data) ;			
			if (_oAjax) {		
				_oAjax.done(function(_json) {
					alert(JSON.stringify(_json));				
				});			
			} else {
				alert(_data);	
			};						
		} else {
			$('[data-touch="favorite"][data-woman="' + _woman + '"]').addClass('on');
			_data.remove_woman.push(_woman);			
			var _oAjax = _fPostAjaxJson(_url + '/v1/clients/update/' + _client,_data) ;			
			if (_oAjax) {		
				_oAjax.done(function(_json) {
					alert(JSON.stringify(_json));				
				});			
			} else {
				alert(_oAjax);
			};	
		}
		
		
	});




