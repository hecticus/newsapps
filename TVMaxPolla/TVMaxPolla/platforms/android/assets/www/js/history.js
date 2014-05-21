
	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '"  />';		
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
		_html += '</figure>';
		return _html;
	};
	
	var _fRenderDataContent = function(_url) {

		var _html = '<div class="row" >';

		$.each(_jHistory, function(_index,_history) {
			if (_history.url == _url) {
				_html += '<div class="col-md-12" >';
				_html += _fGetImage({src:_history.image,  caption: _history.title});				    
			 	_html += _history.datacontent;
			 	_html += '</div>';			
			}
		});

		_html += '<div class="col-md-12" >';
		_html += '<span style="font-weight:bold;">' +_copyright + '</span>';
		_html += '</div>';
	
		_html += '</div>';
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
		myScroll2.scrollTo(0,0,0);
	};		
	
	
	var _fRenderInitH = function() {
	
		var _html = '<div class="row" >';
		
		$.each(_jHistory, function(_index,_history) {
			_html += '<div class="col-md-12 history" data-url="' + encodeURI(_history.url) + '">';
			//_html += _fGetImage({src:_history.image,  caption: _history.title});
			
			var a = _history.title.lastIndexOf('(');
			var b = _history.title.lastIndexOf(')');
			
			var _date = _history.title.substring((a+1), b);
			var _title =  _history.title.substring(0, a);
			
			_html += '<h4>' + _title + '</h4>';
			_html += '<span style="font-style:italic; color:#4D4D4D; ">' + _date + '</span>';
		 	_html += '</div>';
		});
				

		_html += '</div>';

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	$(document).on('tap','.history', function(e) {					
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});
			
	_fRenderInitH();	
			