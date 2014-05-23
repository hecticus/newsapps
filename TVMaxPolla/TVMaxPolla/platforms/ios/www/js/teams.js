	
	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '"  />';		
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
		_html += '</figure>';
		return _html;
	};



	var _fRenderDataContent = function(_url) {
	
		var _html = '<div class="row" >';

		$.each(_jTeams, function(_index,_team) {			
			if (_team.gene == _url) {							
				_html += '<div class="col-md-12" >';
				_html += '<h2>' + _team.title + '</h2>';
			 	_html += _team.datacontent.fiche;
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
	
	var _fRenderInitT = function() {

		var _html = '<div class="row" >';

	
		$.each(_jTeams, function(_index,_team) {	
			_html += '<div class="col-md-12 team" data-gene="' + encodeURI(_team.gene) + '" >';	
			_html += '<span>' + _team.title + '</span>';				    		
		 	_html += '</div>';		
		});

		_html += '</div>';

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};
	
	
	_fRenderInitT();

			
			
			