

	//loading...
		
	var _oAjax = _fGetAjaxJson(_url + '/v1/posts/list?pageSize=100&page=0');	
	if (_oAjax) {		
		_oAjax.done(function(_json) {

			var _html = '<div class="row" >';				
				$.each(_json.response, function(_index,_item) {
					
					_html += '<div class="col-md-12" data-id="' + _item.woman.id + '" >';
						_html += '<img onerror="this.style.display=\'none\'" src="' + _item.files[0].link + '" alt="' +_item.woman.name + '" style="width:100%; height:auto;" />';
						_html += '<h3>' + _item.woman.name + '</h3>';
						_html += '<h5 style="text-transform: capitalize;">' + _fGetMoment(_item.date).format('MMMM, DD YYYY / hh:mm a') + '</h5>';
						_html += '<h2>' + _item.localizations[0].title + '</h2>';
						_html += '<p>' + _item.localizations[0].content + '</p>';
					_html += '</div>';		
					
					_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
						_html += '<i class="icon-material-camera-alt" style="margin-right:2px;"></i>';
					_html += '</div>';		

					_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="text-align:right;">';
					
						$.each(_item.woman.social_networks, function(_index,_item) {							
							switch(_item.social_network.id_social_network) {
							    case 1: _html += '<i class="icon icon-material-post-instagram" style="margin-left:2px;"></i>';	
							       break;
							    case 2: _html += '<i class="icon icon-material-post-facebook" style="margin-left:2px;"></i>';	
							       break;
							    case 3: _html += '<i class="icon icon-material-post-twitter" style="margin-left:2px;"></i>';	
							       break;
							}	
						});
						
						_html += '<i class="icon-material-favorite-outline" style="margin-left:2px;"></i>';
						
					_html += '</div>';		

									
				});		
			_html += '</div>';
						
			$('#wrapper .scroller .container-fluid').empty();
			$('#wrapper .scroller .container-fluid').append(_html);
																
		});
	}
