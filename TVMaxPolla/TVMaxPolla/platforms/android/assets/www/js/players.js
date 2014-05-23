	
	var _fRenderDataContent = function(_url) {
	
		var _html = '<div class="row">';
	
		$.each(_jPlayers, function(_index,_player) {				
			if (_player.url == _url) {				
				_html += '<div class="col-md-12" >';				
				//_html += _fGetImage({src:_player.image,  caption: _player.title});				
				_html += '<img onerror="this.style.display=\'none\'" src="' + _player.image + '" alt="' +_player.image + '" style="width:50%; height: auto; float:left; padding:5px;"  />';
				
				_html += _player.datacontent;
		 		_html += '</div>';								
			}
		});
		
		/*_html += '<div class="col-md-12" >';
		_html += '<span style="font-weight:bold;">' +_copyright + '</span>';
		_html += '</div>';*/
	
		_html += '</div>';

		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
		myScroll2.scrollTo(0,0,0);

	};

	var _fRenderInitP = function() {
	
		var _html = '<div class="row" >';
				
		$.each(_jPlayers, function(_index,_player) {
			_html += '<div class="col-md-12 player" data-url="' + encodeURI(_player.url) + '">';					
			_html += '<span>' +  _player.title + '</span>';
		 	_html += '</div>';
		});

		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	$(document).on('click','.player', function(e) {	
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});

	_fRenderInitP();

			
			
			