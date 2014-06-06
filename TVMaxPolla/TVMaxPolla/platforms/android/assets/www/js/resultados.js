	//_fRenderGetInitTime('icon-minutoaminuto');

	var _aMonth = ['January', 'February', 'March', 'April', 'May', 'Jun','Jul', 'August', 'September', 'October', 'November', 'December'];
	var _lastMinute = 0;
	var _lastEvent = 0;

	var _jTeamMaM = {team_a:0, team_b:0}; 

	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="img/flags/'+_image.src+'" alt="' +_image.src + '"  />';		
		if (_image.caption) _html += '<figcaption>' + _image.caption + '</figcaption>';
		_html += '</figure>';
		return _html;
	};


	var _fRenderEvent = function(_match) {

		var _html = '';
		
		_oAjax = $.fGetAjaXJSONMaM('http://api.hecticus.com/KrakenAfp/v1/matches/events/get/fifa/1');
		if (_oAjax) {
					
			_oAjax.done(function(_json) {
					
							
				$.each(_json.response, function(_index,_event) {
					
					
					if (_lastEvent != _event.id_game_matc_events) {
						
						_html += '<div class="row event" >';
		 					 			
		 				_html += '<div class="col-xs-5 col-sm-5 col-md-5 col-lg-5" style="text-align: right; padding-top:5px; padding-bottom:5px;">';
		 			
			 				if (_jTeamMaM.team_a == _event.team.ext_id ) {
			 					_html += '<span>' + _event.player_a + '</span>';
			 					_html += '<span>' + _event.player_b + '</span>';
			 					_html += '<p>' + _event.action.description + '</p>';	
			 				} 
			 					
		 				_html += '</div>';
		 				
		 				_html += '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2" style="text-align: center; padding-top:5px; ">'; 				
		 				_html += '<span style="color:red; font-wight:bold;">' + _event.action_minute + '&#39;</span>';
		 				_html += '</div>';
		 						 				
		 				_html += '<div class="col-xs-5 col-sm-5 col-md-5 col-lg-5" style="text-align: left; padding-top:5px; padding-bottom:5px;">';
		 				
		 					if (_jTeamMaM.team_b == _event.team.ext_id ) {
			 					_html += '<span>' + _event.player_a + '</span>';
			 					_html += '<span>' + _event.player_b + '</span>';
			 					_html += '<p>' + _event.action.description + '</p>';	
			 				} 

		 				_html += '</div>';
		 						 						 				
		 				_html += '</div>';
						
					}
					
		 			
		 			
		 		});	
		 		
		 		_lastMinute = _json.response[0].action_minute;
		 		_lastEvent	= _json.response[0].id_game_matc_events;
		 		
			});
		}
	
	
		$('#wrapperMaM2 .scroller .container').prepend(_html);	
		myScroll2.scrollTo(0,0,0);
	
	};
	
	
	var _fRenderDataContent = function(_match) {
	
		var _html = '';
		var _return= false;
		$.each(_jGet.item, function(_index,_item) {
		
			if (_item.id_del_partido == _match) {
			
				_jTeamMaM.team_a = _item.equipo_local_ext_id;
				_jTeamMaM.team_b = _item.equipo_visitante_ext_id;
			
				_html += '<div class="row" style="border-bottom: solid #FFD455;" >';
				
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style=" background:#3E79C4; height:40px; line-height:40px; text-align:left; color:#FFD455">';
				_html += '<span style="font-size:1em; ">' +  _item.fecha_de_partido + '</span>';
				_html += '</div>';
								
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="background:#3E79C4; height:40px; line-height:40px; text-align:right; color:#FFD455">';
				_html += '<span style="font-size:1em; margin-right:5px;">' +  _item.fase + '</span>';
				_html += '</div>';
				
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 " style="font-size:1em; color:#1E5733; height:40px; line-height:40px; text-align:center;">';
				_html += '<span>' +  _item.sede + ' </span>';
				_html += '</div>';

				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; height:100px;  line-height:20px; padding:5px;">';				
				_team = _fGetAfpTeam(_item.equipo_local_ext_id);
				 
				if (_team.shortname) {
					_html += _fGetImage({src: _team.flag, caption: _team.shortname});
				} else {
					_html += '<span style="margin-left: 5px; font-weight:bold;">' + _item.equipo_local + '</span>';
				}
				
				_html += '</div>';
			
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style=" text-align: center; height:100px;  line-height:80px;">';
				_html += '<span style="font-size:1.4em; font-weight:bold; float:left;">' + _item.goles_equipo_local + '</span>';
				_html += '<span style="font-size:1.4em; font-weight:bold;">vs</span>';
				_html += '<span style="font-size:1.4em; font-weight:bold; float:right;">' + _item.goles_equipo_visitante + '</span>';			
				_html += '</div>';
				
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; height:100px; line-height:20px; padding:5px;">';												
				_team = _fGetAfpTeam(_item.equipo_visitante_ext_id);
				 
				if (_team.shortname) {
					_html += _fGetImage({src: _team.flag, caption: _team.shortname});	
				} else {
					_html += '<span style="margin-right: 5px; font-weight:bold;">' + _item.equipo_visitante + '</span>';
				}
								
				_html += '</div>';		
								
				_html += '</div>';

				
				_return = true;
			
			}
		
			if (_return) return false;

		});	


		$('#wrapperMaM .container.header').empty();
		$('#wrapperMaM .container.header').removeClass('hidden');
		$('#wrapperMaM .container.header').append(_html);
		$('#wrapperMaM').attr('class','page transition left');
		$('#wrapperMaM2 .scroller .container').empty();
		$('header .container .row .menu span').addClass('icon-back');
		
		_fRenderEvent(_match);
		
		
	};

	var _fRenderMaM = function() {
	
		var _html = '';
		var _oDate = new Date();
		var _day = _oDate.getDate();
		var _month = _oDate.getMonth();
		
		_day = 12;

		$.each(_jGet.item, function(_index,_item) {
			
			var _iDate = _item.fecha_de_partido.split('/');
			var _iMonth = _iDate[1].toString().split(' ');			
			_iMont = _iMonth[0];						
			_iDate = parseInt(_iDate[0]);
			

			
			if ((_iDate == _day) && (_iMont == _aMonth[_month])) {

				_html += '<div class="row data-match" data-match="' + _item.id_del_partido + '" >';
				
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style=" background:#3E79C4; height:40px; line-height:40px; text-align:left; color:#FFD455">';
				_html += '<span style="font-size:1em; ">' +  _item.fecha_de_partido + '</span>';
				_html += '</div>';
								
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="background:#3E79C4; height:40px; line-height:40px; text-align:right; color:#FFD455">';
				_html += '<span style="font-size:1em; margin-right:5px;">' +  _item.fase + '</span>';
				_html += '</div>';
				
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 " style="font-size:1em; color:#1E5733; height:40px; line-height:40px; text-align:center;">';
				_html += '<span>' +  _item.sede + ' </span>';
				_html += '</div>';

				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; height:100px;  line-height:20px; padding:5px;">';				
				_team = _fGetAfpTeam(_item.equipo_local_ext_id);
				 
				if (_team.shortname) {
					_html += _fGetImage({src: _team.flag, caption: _team.shortname});	
				} else {
					_html += '<span style="margin-left: 5px; font-weight:bold;">' + _item.equipo_local + '</span>';
				}
				
				_html += '</div>';
			
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style=" text-align: center; height:100px;  line-height:80px;">';
				_html += '<span style="font-size:1.4em; font-weight:bold; float:left;">' + _item.goles_equipo_local + '</span>';
				_html += '<span style="font-size:1.4em; font-weight:bold;">vs</span>';
				_html += '<span style="font-size:1.4em; font-weight:bold; float:right;">' + _item.goles_equipo_visitante + '</span>';			
				_html += '</div>';
				
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; height:100px; line-height:20px; padding:5px;">';												
				_team = _fGetAfpTeam(_item.equipo_visitante_ext_id);
				 
				if (_team.shortname) {
					_html += _fGetImage({src: _team.flag, caption: _team.shortname});	
				} else {
					_html += '<span style="margin-right: 5px; font-weight:bold;">' + _item.equipo_visitante + '</span>';
				}
								
				_html += '</div>';		
								
				_html += '</div>';

			}
			
		});
			
		if (_html == '') {
			_html = '<div class="row" >';
			_html += '<div class="col-md-12" style="text-align:center;" >';
			_html += '<h4>&#161;Para hoy no hay juegos programados!</h4>';
			_html += '<span class="icon-resultados" style="font-size: 12em;"></span>';
			_html += '</div>';
			_html += '</div>';
		}			

				
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
		
	};

	_oAjax = $.fGetAjaXJSON('http://polla.tvmax-9.com/tvmaxfeeds/calendar/today/results',false,false,true);	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			_jGet = _json.partidos_mundial;					
			_fRenderMaM();				
		});
	}