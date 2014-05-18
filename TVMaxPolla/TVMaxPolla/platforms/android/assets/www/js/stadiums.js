
	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '"  />';		
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
		_html += '</figure>';
		return _html;
	};
	
	var _fRenderInitE = function() {
	
		var _html = '<div class="row" >';
				
		
		$.each(_jStadiums, function(_index,_stadium) {				
			$.ajax({
			  	url: _stadium.url,
			  	async: false,
			    type: 'GET',               
			    dataType: 'xml',                      
			    }).done(function(xml) {
			    	
			    	var _data = $(xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent > dl').clone();
			    		_data = $('<div>').append(_data).remove().html();
			    	var _title = $(xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent > hl2').text();	
					var _id = $(xml).find('NewsItem > Identification > NameLabel').text();
						_id = _id.split('-');
						_id = _id[2];

					_html += '<div class="col-md-12">';
		    		_html += _fGetImage({src:_urlCloud + '/' + _id +'-in.jpg',  caption: _title});		    		
				 	//_html += _data';
				 	_html += '</div>';	
				 														
				});		
		});


		_html += '</div>';
		
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	_fRenderInitE();
			
			
			
			