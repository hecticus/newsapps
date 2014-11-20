
	

	
	var _fRenderHtml = function(_json) {
		
		var _html = '<div class="row" >';
			$.each(_json.response.news, function(_index,_item) {
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 news" >';						
					_html += '<h5 class="title" >' + _item.title + '</h5>';
					_html += '<p class="moment">' +  _fGetMoment(_item.publicationDate, "YYYYMMDD").fromNow() + '</p>';		
				_html += '</div>';
			});												
		_html += '</div>';
			
		$('#wrapper .scroller .container').append(_html);
		
	};




	_oAjax = _fGetAjaxJsonAsync(_jApp.domain.news(1));
	if (_oAjax) {
		_oAjax.done(function(_json) {										
		 	_fRenderHtml(_json);	 				 			
		});			
	}
	

