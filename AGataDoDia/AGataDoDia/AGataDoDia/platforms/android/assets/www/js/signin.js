	
	
	var _oAjax = _fGetAjaxJson(_url + '/loading');	
	if (_oAjax) {		
		_oAjax.done(function(_json) {

			var _html = '';
			var _html2 = '';
			var _width = $(window).width();
			var _item = _json.response.posts[0];
			_width = parseInt($(window).width() * _item.files.length);
			
			_html += '<div class="row" style="overflow:hidden; height:' + parseInt(($(window).height()) /2) + 'px;">';
				$.each(_item.files, function(_index,_file) {			
					_html += '<figure style="width:' + $(window).width() + 'px; height:auto; float:left; " >';								
						_html += '<img onerror="this.style.display=\'none\'" src="' + _file + '" alt="' +_item.woman.name + '" class="img-rounded" />';	
					_html += '</figure>';
				});	
			_html += '</div>';
					
			
			_html2 = '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="height:40px; line-height:40px;" >';
				_html2 += '<i class="icon icon-material-camera-alt" data-touch="post" data-post="' + _item.id_post + '"></i><span class="badge">' + _item.woman.posts + '</span>';
				_html2 += '<i class="icon icon-material-person" ></i><span class="badge">' + _item.woman.clients + '</span>';
			_html2 += '</div>';		

			_html2 += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="text-align:right; height:40px; line-height:40px;">';

				switch(_item.social_network.name) {
				    case 'instagram': _html2 += '<i class="icon icon-material-post-instagram" style="margin-left:2px;"  onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
				       break;
				    case 'facebook': _html2 += '<i class="icon icon-material-post-facebook" style="margin-left:2px;" onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
				       break;
				    case 'twitter': _html2 += '<i class="icon icon-material-post-twitter" style="margin-left:2px;" onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
				       break;
				    default: _html2 += '<i class="icon icon-material-link" style="margin-left:2px;"></i>';	
				       break;
				}

				_html2 += '<i class="icon icon-material-share-alt" style="margin-left:2px; vertical-align:middle;" onclick="window.plugins.socialsharing.share(\'' + _item.title + '\', null, \'' + _item.woman.default_photo + '\', \'' + _item.source + '\');"></i>';

			_html2 += '</div>';
								

								
			$('#wrapper1').css('height',  parseInt(($(window).height()) /2)  + 'px');
			$('#wrapper1').css('width', $(window).width() + 'px');
			$('#wrapper1 .scroller').css('width',  _width + 'px');
			$('#wrapper1 .scroller .container').append(_html);
			$('.something').append(_html2);
			
		});
	}

