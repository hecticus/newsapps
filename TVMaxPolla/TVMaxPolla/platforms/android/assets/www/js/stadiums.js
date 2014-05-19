
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
			_oAjax = $.fGetAjaXJSON(_stadium.url, 'xml', 'text/xml charset=utf-8', false);
			if (_oAjax) {
				_oAjax.done(function(_xml) {
					
					var _data = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent > dl').clone();
			    		_data = $('<div>').append(_data).remove().html();
			    		
			    	var _title = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent > hl2').text();	
					var _id = $(_xml).find('NewsItem > Identification > NameLabel').text();
						_id = _id.split('-');
						_id = _id[2];
						
					_stadium.datacontent = _fGetImage({src:_urlCloud + '/' + _id +'-in.jpg',  caption: _title});		
					_stadium.datacontent += _data;

					_html += '<div class="col-md-12 stadium" data-url="' + encodeURI(_stadium.url) + '">';
		    		_html += _fGetImage({src:_urlCloud + '/' + _id +'-in.jpg',  caption: _title});		    		
				 	_html += '</div>';
					
					
				});
			}		
		});


		_html += '</div>';
		
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	$(document).on('tap','.stadium', function(e) {
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});

	_fRenderInitE();
			
			
			
			