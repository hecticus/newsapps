

	//loading...




		
	var _oAjax = _fGetAjaxJson(_url + '/v1/posts/get/client/' + _jParameters.client);
	
	if (_oAjax) {		
		_oAjax.done(function(_json) {

			var _html = '';				
				$.each(_json.response, function(_index,_item) {
					
					_html += '<div class="row" data-touch="post" data-post="' + _item.id_post + '" >';
						_html += '<div class="col-md-12">';
						
						 _html += '<figure>';				     		
							_html += '<img onerror="this.style.display=\'none\'" src="' + _item.woman.default_photo + '" alt="' +_item.woman.name + '" class="img-rounded" />';		
							_html += '<figcaption>';
								_html += '<h5 style="text-transform: capitalize;">' + _fGetMoment(_item.date).format('MMMM, DD YYYY / hh:mm a') + '</h5>';
								_html += '<p>' + _item.content + '</p>';
							_html += '</figcaption>';
						_html += '</figure>';
								
						_html += '</div>';		
				
					
						_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="height:40px; height:40px; line-height:40px;" >';
							_html += '<i class="icon icon-material-camera-alt" ></i><span class="badge">' + _item.woman.posts + '</span>';
							_html += '<i class="icon icon-material-person" ></i><span class="badge">' + _item.woman.clients + '</span>';
						_html += '</div>';		

						_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="text-align:right; height:40px; line-height:40px;">';
						
							_html += '<i class="icon icon-material-favorite ' + (_item.starred ? 'on' : '') + '" data-touch="favorite" data-woman="' + _item.woman.id_woman + '"></i>';
							_html += '<i class="icon icon-material-share-alt" style="margin-left:2px; vertical-align:middle;"></i>';
							
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

						
						_html += '<div class="col-md-12">';
							$.each(_item.woman.categories, function(_index,_item) {
								_html += '<span class="label label-default" data-touch="category" data-category="' + _item.category.id_category + '" style="margin-right:2px;">' + _item.category.name + '</span>';
							});
						_html += '</div>';
						
							_html += '<br />';
								
					_html += '</div>';	
									
				});		
			
						
			$('#wrapper .scroller .container').empty();
			$('#wrapper .scroller .container').append(_html);
																
		});
	}


	




