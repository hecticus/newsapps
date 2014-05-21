
	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '"  />';		
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
		_html += '</figure>';
		return _html;
	};
	
	var _fRenderDataContent = function(_url) {
	
		var _html = '<div class="row" >';

		$.each(_jStadiums, function(_index,_stadium) {			
			if (_stadium.url == _url) {							
				_html += '<div class="col-md-12 team" >';
				_html += _fGetImage({src:_stadium.image,  caption: _stadium.title});					    
			 	_html += _stadium.datacontent;
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
	
	
	var _fRenderInitE = function() {
	
		var _html = '<div class="row" >';
		
		$.each(_jStadiums, function(_index,_stadium) {	
			_html += '<div class="col-md-12 stadium" data-url="' + encodeURI(_stadium.url) + '">';
			//_html += _fGetImage({src:_stadium.image,  caption: _stadium.title});
			_html += '<h3>' + _stadium.title + '</h3>';				    		
		 	_html += '</div>';		
		});

		_html += '</div>';
		
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	$(document).on('tap','.stadium', function(e) {
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});

	_fRenderInitE();
			
			
			
			