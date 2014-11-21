

	var _fRenderHtml = function(_json) {
		
		var _html = '<div class="row" >';
			$.each(_json.response.news, function(_index,_item) {
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 news" data-touch="page" data-target="content-news" data-param="news" data-value="' + _item.idNews + '" >';						
					_html += '<h5 class="title" >' + _item.title + '</h5>';
					_html += '<p class="moment">' +  _fGetMoment(_item.publicationDate, "YYYYMMDD").fromNow() + '</p>';		
				_html += '</div>';
			});												
		_html += '</div>';
			
		$('#wrapper .scroller .container').append(_html);
		
	};

	var _fRenderContentHtml = function(_json, _news) {
		
		var _html = '<div class="row" >';
			$.each(_json.response.news, function(_index,_item) {
				
				if (_item.idNews== _news) {
				
					_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 news" >';												
						_html += '<h3 class="title" >' + _item.title + '</h3>';
						_html += '<p class="moment">' +  _fGetMoment(_item.publicationDate, "YYYYMMDD").fromNow() + '</p>';
						_html += '<h5 class="summary" >' + _item.summary + '</h5>';
						_html += '<p class="body">' +  _item.body + '</p>';									
					_html += '</div>';

				}
								
			});												
		_html += '</div>';
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');	
		_scroll2.scrollTo(0,0,0);
	};


	_fRenderHtml(_jApp.pages.page.data);
	
	$(document).on('click','[data-touch="page"][data-target="content-news"]', function(e) {
		
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,false)) {return false;}
				
		var _load = $(this).data('target');
		var _param = $(this).data('param');
		var _value = $(this).data('value');
				
		_fRenderContentHtml(_jApp.pages.page.data,_value);
			
		
	});


