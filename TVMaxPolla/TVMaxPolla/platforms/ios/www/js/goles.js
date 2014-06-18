	
	var _height =  parseInt(($(window).height() * 40)/100);
	
	var _team = false;

	
	var _cToday = new Date().getDate();			
	var _cMonth = new Date().getMonth();						
	var _cDate = _cToday + '/' + _aMonth[_cMonth];
	_cDate =_cDate.toString().toLowerCase();




	var _fGetMatch = function(_id) {

		var _return = false;
		 
		if (_jSchedule) {
			$.each(_jSchedule.item, function(_index,_item) {
				if (_item.numero_de_partido == _id) {
					_return = _item;
				}
				
				if (_return) return false;
				
			});
		}
		
		
		return _return;
		
	};
	
	var _fGetColorPhase = function(_name) {

		var _return = false;
			_name = _name.toString().toLowerCase();
			_name = _name.replace(/\s/g,'');
	
	
		$.each(_jPhase, function(_index,_phase) {
			if (_phase.name.toString().toLowerCase().replace(/\s/g,'') == _name) _return =  _phase.bgcolor;			
			if (_return) return true;
		});
		
		return _return;
	};

	var _fGetImage = function(_image) {
		
		var _html = '<figure style="background:#E6E6E6;">';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '" style="width:100%; height:' + _height + 'px;"  />';
		
		if (_image.caption) {
			
			_html += '<figcaption>';
			
			_html += '<div style="width:80%;  height: 40px; line-height: 20px; float:left; ">';
			_html += '<span>'+_image.caption+'</span>';
			_html += '</div>';
			
			_html += '<div style="width:20%;  height: 40px; line-height: 40px; float:right; text-align: right; font-size:1.6em; font-weight:bold;">';
				_html += '<span class="glyphicon glyphicon-facetime-video"></span>';
			_html += '</div>';
						
			_html += '</figcaption>';		

		}
		
		_html += '</figure>';
		return _html;
	};


	var _fGetCountry = function(_name) {
				
		var _return  = false;		
		$.each(_jCountries, function(_index,_country) {
			
			if (_country.name == _name) {
				_return = _country;
			}
			
			if (_return)  return _country;
		});
		
		return _return;
		
	};


	var _fRenderDataContent = function(_expression) {
		
		_jGol = false; 
		_oAjax = $.fGetAjaXJSON2('http://mundial.tvmax-9.com/_modulos/json/goles_mundial.php',false,false,false);	
		if (_oAjax) {
			_oAjax.done(function(_json) {
				_jGol = _json.goles_mundial;
				
				var _gol = false;
				var _html = '<div class="row" >';
				
				$.each(_jGol.item, function(_index,_item) {					
					if (_item.activo == 'Si') {
					
						_iDate = _item.fecha_anotacion.split(' ');
						_iDate = _iDate[0].split('-');
						_iDate = _iDate[2] + '/' + _aMonth[(_iDate[1]-1)];
						_iDate = _iDate.toString().toLowerCase();
						
						if (eval(_expression)) {
							
							_gol = true;
							var _jMatch = _fGetMatch(_item.numero_partido);
				 			var _sTeamLocal = _fgetTeamData(_jMatch.equipo_local_ext_id);
							var _sTeamVisit = _fgetTeamData(_jMatch.equipo_visitante_ext_id);
		
				 			
			 				var _caption = ''; 
				 			
				 			if (_jSchedule) {
				 				_caption = '<img onerror="this.style.display=\'none\'" src="img/flags/' + _sTeamLocal.flag + '" alt="' + _jMatch.equipo_local + '" style="width:auto; height:20px; margin-right:5px; vertical-align:middle;"  />';
				 				_caption += '-';
				 				_caption += '<img onerror="this.style.display=\'none\'" src="img/flags/' + _sTeamVisit.flag + '" alt="' + _jMatch.equipo_visitante + '" style="width:auto; height:20px; margin-left:5px; margin-right:5px; vertical-align:middle;"  />';	
				 			} 
				 					 			
				 			_caption += _item.equipo;			
				 			_caption += ', ' + _item.goleador;		 			
				 			_caption += 'al minuto ' + _item.minuto_anotacion;
				 			_caption += ' del ' + _item.tiempo_anotacion.toLowerCase(); 
		
					 		var _src = 'http://www.kaltura.com/p/1199011/sp/0/playManifest/entryId/' + _item.id_video_kaltura + '/format/url/flavorParamId/0/video.mp4';
							_html += '<div class="col-md-12 video" data-src="' + _src + '"  >';
							_html += _fGetImage({src:_item.imagen_gol,caption:_caption});
							_html += '</div>';
							
							
						}

			 			
		 			
		 			}

				});
				
				_html += '</div>';
				

				if (!_gol) {
					_html = '<div class="row" >';
					_html += '<div class="col-md-12" style="text-align:center;" >';
					_html += '<h4>&#161; EL criterio de la b&uacute;squeda no gener&oacute; ning&uacute;n resultado!</h4>';
					_html += '<span class="icon-goles_menu" style="font-size: 12em;"></span>';
					_html += '</div>';
					_html += '</div>';
				}			



				$('#wrapper2 .scroller .container').empty();
				$('#wrapper2 .scroller .container').append(_html);
				$('#wrapper2').attr('class','page transition left');
				
			});
		}


		

		
			
		

	};




	var _fGetMonth = function(_month) {
		
		
		
		var _html = '';
		var _length = 0;

		
		if (_month == 'jun') {			
			_length = new Date(2014, 6, 0).getDate();				
		} else if (_month == 'jul') {			
			_length = new Date(2014, 7, 0).getDate();
		}

		var _day = 0;
		
		if (_month == 'jun') {			
			_html +='<tr><td class="name-month" colspan="7">Junio</td></tr>';		  		
			_day = new Date('June 01, 2014').getDay();
		} 

		if (_month == 'jul') {
			_html +='<tr><td class="name-month" colspan="7">Julio</td></tr>';
			_day = new Date('July 01, 2014').getDay();	
		}	
		
		var __i = 0;
		
		 __i = _day;
	
		if (_day > 0) {
			
			for (var _i = 0 ; _i < _day; _i++) {
						
				if (_i == 0) {
					_html += '<tr>';
				}
					
				_html += '<td style="background:#ffffff;"><span style="background:#ffffff;">&nbsp;</span></td>';
				
				if (__i%7 == 6) {
				_html += '</tr>';
			}
				
			}
			
		}
		

		
		for (var _i = 1 ; _i <= _length; _i++) {	

			if (__i%7 == 0) {
				_html += '<tr>';
			}
		
			var _date = ((_i < 10 ) ? '0' + _i.toString() : _i.toString()) + '/' + _month;
			
			var _jMatch = _fGetJsonMatchDate(((_i < 10 ) ? '0' + _i.toString() : _i.toString()) + '/' + _month);
						
			if (_jMatch) {


				console.log('_date ->' + _date + '-> _cDate' + _cDate);

				if (_date == _cDate) {
					_html += '<td class="goal-match" data-date="' + _date + '" style="border-bottom: solid ' + _fGetColorPhase(_jMatch.fase) + ' !important; font-size:1.8em;" >' + _i.toString() +'</td>';	
				} else{

					_html += '<td class="goal-match" data-date="' + _date + '" style="border-bottom: solid ' + _fGetColorPhase(_jMatch.fase) + ' !important;" >' + _i.toString() +'</td>'; 
				}

			} else {
				_html += '<td style="background:#ffffff;"><span style=" background:#ffffff; color:gray;">' + _i.toString() +'</span></td>';
			}

			if ((__i%7 == 6) || (_i == _length)) {
				_html += '</tr>';
			}

			__i = __i+1;
			
		}

		return _html;
		
	};
	
	var _fGetJsonMatchDate = function(_date) {

		var _return = false;	
		$.each(_jGet.item, function(_index,_item) {
		
			var _iDate = _item.fecha_de_partido.split(' ');			
			_iDate = _iDate[0].toString().toLowerCase();

			if (_iDate == _date) {
			 	_return = _item;
			}
			
			if (_return) return true;
			
		});
		
		return _return;
	
	};
	
	var _fRenderCountry = function() {
		var _html = '<div class="row" >';			
		$.each(_jCountry, function(_index) {	
			
			var _name = _jCountry[_index];
			var _flag = _fgetFlag(_name.toString());
								
			_html += '<div class="col-md-12 goal-match" data-country="' + _name + '" >';
		
			_html += '<span style="margin-left:15px;">' + _name + '</span>';	
			_html += '</div>';
			
		});
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
	};


	var _fRenderPhase = function() {

		var _html = '<div class="row" >';	
		$.each(_jPhase, function(_index, _phase) {			
			_html += '<div class="col-md-12 goal-match" data-phase="' + _phase.name + '" >';
			_html += '<span style="margin-left:15px;">' + _phase.name + '</span>';
			_html += '</div>';
		});
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	var _fRenderCalendar = function() {

		var _html = '<div class="row" >';
		_html += '<div class="col-md-12">';
		_html += '<div class="table-responsive" style="border:0;">';		
		_html += '<table class="table">';
				
		_html += '<thead>';
		_html += '<tr>';           
		_html += '<th>D</th>';
		_html += '<th>L</th>';
		_html += '<th>M</th>';
		_html += '<th>M</th>';
		_html += '<th>J</th>';
		_html += '<th>V</th>';
		_html += '<th>S</th>';
		_html += '</tr>';
		_html += '</thead>';
		_html += '<tbody>';
		
		_html += _fGetMonth('jun');	
		_html += _fGetMonth('jul');

		_html += '</tbody>';
		_html += '</table>';
		_html += '</div>';
		_html += '</div>';
		_html += '</div>';


		_html += '<div class="row" >';
			_html += '<div class="col-md-12">';
				_html += '<ul>';		
					$.each(_jPhaseL, function(_index,_phase) {
						_html += '<li data-phase="' + _phase.name.toString().toLowerCase().replace(/\s/g,'') + '"><span style="font-size:1.4em;">' + _phase.name + '</span></li>';
					});					
				_html += '</ul>';				
			_html += '</div>';
		_html += '</div>';
 

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

		$('#wrapper .scroller .container table > tbody > tr').each(function(_index) {
			if ((_index == 1) || (_index == 10)  || (_index == 11)) {
				$(this).remove();
			}			
		});

	

	};



	_oAjax = $.fGetAjaXJSON('http://polla.tvmax-9.com/tvmaxfeeds/calendar/getAll',false,false,true);	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			_jGet = _json.partidos_mundial;					
			_fRenderCalendar();	
			_fRenderDataContent('_iDate == "' + _cDate + '"');				
		});
	}








	

