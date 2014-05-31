
	var _fRenderDataContent = function(_url) {
	
		var _html = '<div class="row" >';
		//_jTeams.sort();
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

		var _html = '';

	
		$.each(_jTeams, function(_index,_team) {
			_html += '<div class="row" >';
			var lineHeight=40;
			var devicePlatform = device.platform;
			//IOS
			if(devicePlatform == "iOS"){
			   if(getScreenHeight() > 700){
					lineHeight=60;
			   }else{
					lineHeight=40;
			   }
			   
			}else{
			}

			_html += '<div class="col-md-12 teams" data-gene="' + encodeURI(_team.gene) + '" style="height:'+lineHeight+'px; line-height:'+lineHeight+'px;" >';
				_html += '<img onerror="this.style.display=\'none\'" src="img/flags/afp/' + _team.id + '.png" alt="' +_team.title + '" style="width:10%;  height:auto; max-width:67px; max-height:45px; vertical-align:middle;"  />';	
				_html += '<span>' + _team.title + '</span>';							    	
		 	_html += '</div>';
		 	
		 	_html += '</div>';		
		});

		

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};
	
	
	_fRenderInitT();

			
			
			
