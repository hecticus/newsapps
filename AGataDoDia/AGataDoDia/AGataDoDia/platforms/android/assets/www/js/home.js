	
	var _index = $('main').data('index');	
	var _json = _jMenu[_index].data; 
	
	var _fRenderHtml =  function(_json, _push) {
		
		_html = '';
		
		$.each(_json.response, function(__index,_item) {

			if (_push) _jMenu[_index].data.response.push(_item);
			

			_html += '<div class="row post" data-value="' + _item.id_post + '">';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 figure">';
					//_html += '<img onerror="this.style.display=\'none\'" src="' + _item.woman.default_photo + '" alt="' +_item.woman.name + '" class="img-rounded"  data-touch="load" data-target="2" data-param="post" data-value="' + _item.id_post+ '" />';
					_html += '<img onerror="this.onerror=null;this.src=\''+_item.woman.default_photo+'\'" src="' + _item.files[0] + '" alt="' +_item.woman.name + '" class="img-rounded"  data-touch="load" data-target="2" data-param="post" data-value="' + _item.id_post+ '" />';
				_html += '</div>';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 caption">';
					_html += '<h5 style="text-transform: capitalize;">' + _fGetMoment(_item.date).format('MMMM, DD YYYY / hh:mm a') + '</h5>';
					_html += '<p>' + _item.content + '</p>';
				_html += '</div>';
			_html += '</div>';
			
			_html += '<div class="row">';
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="height:40px; line-height:40px;" >';										
					//_html += '<i class="icon icon-material-camera-alt" data-touch="load" data-target="2" data-param="post" data-value="' + _item.id_post+ '" ></i><span class="badge">' + _item.woman.posts + '</span>';
					_html += '<i class="icon icon-material-camera-alt" data-touch="post" data-param="post" data-target="2" data-value="' + _item.id_post + '" ></i><span class="badge">' + _item.files.length + '</span>';
					_html += '<i class="icon icon-material-group" ></i><span class="badge">' + _item.woman.clients + '</span>';
				_html += '</div>';		
	
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="text-align:right; height:40px; line-height:40px;">';
	
					switch(_item.social_network.name) {
					    case 'instagram': _html += '<i class="icon icon-material-post-instagram" style="margin-left:2px;"  onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
					       break;
					    case 'facebook': _html += '<i class="icon icon-material-post-facebook" style="margin-left:2px;" onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
					       break;
					    case 'twitter': _html += '<i class="icon icon-material-post-twitter" style="margin-left:2px;" onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
					       break;
					    default: _html += '<i class="icon icon-material-launch" style="margin-left:2px;" onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
					       break;
					}
	
					_html += '<i class="icon icon-material-favorite ' + (_item.starred ? 'on' : '') + '" data-touch="favorite" data-woman="' + _item.woman.id_woman + '"></i>';
					_html += '<i class="icon icon-material-share-alt" style="margin-left:2px; vertical-align:middle;" onclick="window.plugins.socialsharing.share(\'' + _item.title + '\', null, \'' + _item.woman.default_photo + '\', \'' + _item.source + '\');"></i>';
	
				_html += '</div>';
			_html += '</div>';
			
			_html += '<div class="row">';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" >';
					$.each(_item.woman.categories, function(_index,_item) {
						_html += '<span class="label label-default" data-touch="load" data-target="3" data-param="category" data-value="' + _item.category.id_category + '" style="margin-left:2px; margin-right:2px;">' + _item.category.name + '</span>';
					});
				_html += '</div>';
			_html += '</div>';
			
			_html += '<br />';

		});


		_html += '<div class="row plus" >';
			_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center;" >';							
				_html += '<i class="icon icon-material-add-circle" style="font-size:3em; color:' + ((_json.response.length >= 1) ? 'green' : 'red') + ';" data-touch="plus" data-direction="down" ></i>';
				_html += '<br/>';
				_html += '<br/>';							
			_html += '</div>';
		_html += '</div>';

		$('div.plus').remove();		
		$('#wrapper .scroller .container').append(_html);
		if(!_push) setTimeout(function(){_scroll.scrollTo(0,scrollPosition,0);},10);
	};
		
		
	if (_json) _fRenderHtml(_json);			

	$(document).on('click','[data-touch="plus"]', function(e) {
		
		if(_fPreventDefaultClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
				
		var _this = $(this); 
		_this.removeClass('icon-material-add-circle');
		_this.html('loading...');	
		
		_oAjax = _fGetAjaxJsonAsync(_url + '/garotas/v1/posts/get/client/' + $(this).data('direction') + '/' + _jParameters.client + '/' + $('div.post').last().data('value'));
		if (_oAjax) {
			_oAjax.done(function(_json) {				
				 _fRenderHtml(_json,true);				 			
			});
		}
							
	});
