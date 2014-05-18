
	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '"  />';		
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
		_html += '</figure>';
		return _html;
	};
	

	var _fRenderDataContent = function(_url) {
	
		var _html = '<div class="row" >';
	
			$.ajax({
		  		url: _url,
		  		async: false,
		    	type: 'GET',               
		    	dataType: 'xml',                      
		    }).done(function(xml) {
		    	
				var _title = $(xml).find('NewsItem > NewsComponent > NewsLines > HeadLine').text();
		    	var _data = $(xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent').clone();
		    		_data = $('<div>').append(_data).remove().html();
		    		
				var _id = $(xml).find('NewsItem > Identification > NameLabel').text();
					_id = _id.split('-');
					_id = _id[1];
				
	
				_html += '<div class="col-md-12" >';
	    		_html += _fGetImage({src:_urlCloud + '/' + _id +'.jpg',  caption: _title});		    		
			 	_html += _data;
			 	_html += '</div>';
			 														
			});	
	
		_html += '<div class="col-md-12" >';
		_html += '<span style="font-weight:bold;">' +_copyright + '</span>';
		_html += '</div>';
	
		_html += '</div>';
		
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');

	};

	var _fRenderInitP = function() {
	
		var _html = '<div class="row" >';
				
		
		$.each(_jPlayers, function(_index,_player) {				
				$.ajax({
			  		url: _player.url,
			  		async: false,
			    	type: 'GET',               
			    	dataType: 'xml',                      
			    }).done(function(xml) {
			    	
					var _title = $(xml).find('NewsItem > NewsComponent > NewsLines > HeadLine').text();
					var _id = $(xml).find('NewsItem > Identification > NameLabel').text();
						_id = _id.split('-');
						_id = _id[1];
							
					_html += '<div class="col-md-12 player" data-url="' + _player.url + '">';
		    		_html += _fGetImage({src:_urlCloud + '/' + _id +'.jpg',  caption: _title});		    		
				 	_html += '</div>';
				 	
								
				});		
		});


		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	$(document).on('tap','.player', function(e) {	
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});

	_fRenderInitP();

			
			
			