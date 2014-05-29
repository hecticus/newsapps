
	var _fRenderDataContent = function(_url) {
	
		var _html = '<div class="row" >';

		$.each(_jTeams, function(_index,_team) {			
			if (_team.gene == _url) {							
				_html += '<div class="col-md-12" >';
				_html += '<img id="teampreview"  onerror="this.style.display=\'none\'" src="' + _team.image + '" alt="' +_team.title + '" style="width:100%; height:auto; marging-top:5px;  marging-bottom:5px; margin-top:5px;"  />';
				_html += '<h2>' + _team.title + '</h2>';
			 	_html += _team.datacontent.fiche;
			 	_html += '</div>';
			}
		});

	
		_html += '</div>';
		
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
		$('header .container .row .menu span').addClass('icon-back');
		myScroll2.scrollTo(0,0,0);
	};
	
	var _fRenderInitT = function() {

		var _html = '<div class="row" >';

	
		$.each(_jTeams, function(_index,_team) {	
			_html += '<div class="col-md-12 teams" data-gene="' + encodeURI(_team.gene) + '" >';	
			_html += '<span>' + _team.title + '</span>';				    		
		 	_html += '</div>';		
		});

		_html += '</div>';

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};
	
	
	_fRenderInitT();

			
			
			