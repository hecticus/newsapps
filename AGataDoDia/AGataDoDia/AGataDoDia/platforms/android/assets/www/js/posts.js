
	
	
	var _index = $('main').data('referer');
	var _json = _jMenu[_index].data; 
	var _html = '';
	
	if (_json) {
		
		var _width = $(window).width();
		var _break = false;

		$.each(_json.response, function(_index,_item) {

			if (_item.id_post == _jParameters.post) {
	
				_width = parseInt($(window).width() * _item.files.length);
				$.each(_item.files, function(_index,_file) {
					
					_html += '<figure style="width:' + $(window).width() + 'px; height:' + parseInt($(window).height() - 55) + 'px; float:left; " >';
					
						_html += '<img onerror="this.style.display=\'none\'" src="' + _file + '" alt="' + _item.woman.name + '" class="img-rounded" style="margin: auto; position: absolute;  z-index: 1; top: 0px; left: 0px; right: 0px;"   />';
	
						_html += '<div class="row" style="position: absolute; z-index: 5; top:30px; right:0px; text-align:center;">';							
							_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-bottom:5px !important;">';
								_html += '<i class="icon icon-material-favorite ' + (_item.starred ? 'on' : '') + '" data-touch="favorite" data-woman="' + _item.woman.id_woman + '"></i>';
							_html += '</div>';
							_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
								_html += '<i class="icon icon-material-share-alt" style="margin-left:2px; vertical-align:middle;" onclick="window.plugins.socialsharing.share(\'' + _item.title + '\', null, \'' + _file + '\', \'' + _item.source + '\');"></i>';
							_html += '</div>';
						_html += '</div>';
								
					_html += '</figure>';
													
				});
	
				if (_item.files.length >= 2) {
					$('.carousel-control').removeClass('hidden');
				}
	
				_break = true;
				
			}	 
							
			if (_break) return true;
		

		});
		
		$('#wrapper').css('width', $(window).width() + 'px');
		$('#wrapper .scroller').css('width',  _width + 'px');
		$('#wrapper .scroller .container').empty();		
		$('#wrapper .scroller .container').append(_html);
		
		_scroll.scrollTo(0,0,0);
		_scroll.refresh();
	
		/*$('.img-rounded').load(function(){
			$('.loading').addClass('hidden');
		}).error(function(){
			$('.error').removeClass('hidden');		
		});*/
	
	
	} 
	
	
	
	
	