

	
	var _oAjax = _fGetAjaxJson(_url + '/v1/posts/get/category/' + _jParameters.client + '/' + _jParameters.category + '/0/10');	

	if (_oAjax) {		
		_oAjax.done(function(_json) {

			_html = '';
			$.each(_json.response, function(_index,_item) {
					
				_html += '<div class="row"  style="margin-top:5px !important;" >';	
					_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
					
					 _html += '<figure  data-touch="load" data-target="2" data-post="' + _item.id_post + '">';				     		
						_html += '<img onerror="this.style.display=\'none\'" src="' + _item.woman.default_photo + '" alt="' +_item.woman.name + '" class="img-rounded"   />';		
						_html += '<figcaption>';
							_html += '<h5 style="text-transform: capitalize;">' + _fGetMoment(_item.date).format('MMMM, DD YYYY / hh:mm a') + '</h5>';
							_html += '<p>' + _item.content + '</p>';
						_html += '</figcaption>';
					_html += '</figure>';
							
					_html += '</div>';		
				_html += '</div>';
				
				_html += '<div class="row">';
					_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="height:40px; line-height:40px;" >';
						_html += '<i class="icon icon-material-camera-alt" data-touch="post" data-post="' + _item.id_post + '"></i><span class="badge">' + _item.woman.posts + '</span>';
						_html += '<i class="icon icon-material-person" ></i><span class="badge">' + _item.woman.clients + '</span>';
					_html += '</div>';		

					_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="text-align:right; height:40px; line-height:40px;">';

						switch(_item.social_network.name) {
						    case 'instagram': _html += '<i class="icon icon-material-post-instagram" style="margin-left:2px;"  onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
						       break;
						    case 'facebook': _html += '<i class="icon icon-material-post-facebook" style="margin-left:2px;" onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
						       break;
						    case 'twitter': _html += '<i class="icon icon-material-post-twitter" style="margin-left:2px;" onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
						       break;
						    default: _html += '<i class="icon icon-material-link" style="margin-left:2px;"></i>';	
						       break;
						}

						_html += '<i class="icon icon-material-favorite ' + (_item.starred ? 'on' : '') + '" data-touch="favorite" data-woman="' + _item.woman.id_woman + '"></i>';
						_html += '<i class="icon icon-material-share-alt" style="margin-left:2px; vertical-align:middle;" onclick="window.plugins.socialsharing.share(\'' + _item.title + '\', null, \'' + _item.woman.default_photo + '\', \'' + _item.source + '\');"></i>';

					_html += '</div>';
				_html += '</div>';
				
				_html += '<div class="row">';
					_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" >';
						$.each(_item.woman.categories, function(_index,_item) {
							_html += '<span class="label label-default" data-touch="category" data-category="' + _item.category.id_category + '" style="margin-right:2px;">' + _item.category.name + '</span>';
						});
					_html += '</div>';
				_html += '</div>';	
									
			});		
			
						
			$('#wrapper .scroller .container').empty();
			$('#wrapper .scroller .container').append(_html);
																
		});
	}


	
	/*$(document).on('click','[data-touch="post"]', function(e) {


		
		if(_fPreventDefaultClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}						
		var _post = $(this).data('post');
		var _html = '';
		var _width = $(window).width();
		_oAjax.done(function(_json) {
		$.each(_json.response, function(_index,_item) {				
				if (_item.id_post == _post) {
					_width = parseInt($(window).width() * _item.files.length);
					$.each(_item.files, function(_index,_file) {
						_html += '<figure style="width:' + $(window).width() + 'px; float:left;">';														
							_html += '<img onerror="this.style.display=\'none\'" src="' + _file + '" alt="' +_item.woman.name + '" class="img-rounded" style="max-height:' + parseInt($(window).height() - 55) + 'px;"  />';
						_html += '</figure>';								
					});							
				}				
			});		

		});
		

				
		$('#wrapper2').css('width', $(window).width() + 'px');
		$('#wrapper2 .scroller').css('width',  _width + 'px');
		$('#wrapper2 .scroller .container').empty();		
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
		_scroll2.scrollTo(0,0,0);
		_scroll2.refresh();
		
	});*/

