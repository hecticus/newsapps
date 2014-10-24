
	var _oAjax = _fGetAjaxJson(_url + '/v1/posts/get/' + _jParameters.post);	
	if (_oAjax) {		
		
		
		var _width = $(window).width();
		var _html = '';
					
		_oAjax.done(function(_json) {

			_item = _json.response;		
			_width = parseInt($(window).width() * _item.files.length);
			$.each(_item.files, function(_index,_file) {
				_html += '<figure style="width:' + $(window).width() + 'px; height:' + parseInt($(window).height() - 55) + 'px; float:left; " >';														
					_html += '<img onerror="this.style.display=\'none\'" src="' + _file.link + '" alt="' +_item.woman.name + '" class="img-rounded" style="margin: auto; position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"   />';
					
				_html += '</figure>';								
			});

			if (_item.files.length >= 2) {
				$('.carousel-control').removeClass('hidden');
			}
				
			
										
		});
		
		
		$('#wrapper').css('width', $(window).width() + 'px');
		$('#wrapper .scroller').css('width',  _width + 'px');
		$('#wrapper .scroller .container').empty();		
		$('#wrapper .scroller .container').append(_html);
		
		_scroll.scrollTo(0,0,0);
		_scroll.refresh();
		
	}
