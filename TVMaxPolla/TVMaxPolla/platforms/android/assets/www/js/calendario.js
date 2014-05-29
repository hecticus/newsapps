	
	var  _aDay = new Array("Domingo", "Lunes", "Martes", "Mi&eacute;rcoles", "Jueves", "Viernes", "S&aacute;bado", "Domingo");
	
	

	var _jPhase = [
		{name:'Grupo A', bgcolor:'#64C2BC'},
		{name:'Grupo B', bgcolor:'#64C2BC'},
		{name:'Grupo C', bgcolor:'#64C2BC'},
		{name:'Grupo D', bgcolor:'#64C2BC'},
		{name:'Grupo E', bgcolor:'#64C2BC'},
		{name:'Grupo F', bgcolor:'#64C2BC'},
		{name:'Grupo G', bgcolor:'#64C2BC'},
		{name:'Grupo H', bgcolor:'#64C2BC'},
		{name:'Octavos', bgcolor:'#EB008C'},
		{name:'Cuartos', bgcolor:'#5F207F'},
		{name:'Semifinales', bgcolor:'#ED2A24'},
		{name:'3er Lugar', bgcolor:'#037677'},
		{name:'Final', bgcolor:'#F9A11A'}
	];

	var _jPhaseL = [
		{name:'Grupos', bgcolor:'#64C2BC'},		
		{name:'Octavos', bgcolor:'#EB008C'},
		{name:'Cuartos', bgcolor:'#5F207F'},
		{name:'Semifinales', bgcolor:'#ED2A24'},
		{name:'3er Lugar', bgcolor:'#037677'},
		{name:'Final', bgcolor:'#F9A11A'}
	];

	var _jCountry = [
	'Alemania','Argelia','Argentina','Australia','Bosnia','Brasil','B&eacute;lgica',
	'Camer&uacute;n', 'Chile', 'Colombia', 'Corea del Sur', 'Costa Rica', 'Costa de Marfil',
	'Croacia', 'Ecuador', 'Espa&ntilde;a', 'Estados Unidos', 'Francia', 'Ghana', 'Grecia',
	'Holanda', 'Honduras', 'Inglaterra', 'Ir&aacute;n', 'Italia', 'Jap&oacute;n', 'M&eacute;xico', 'Nigeria',
	'Portugal', 'Rusia', 'Suiza', 'Uruguay'
	];
	
	//var _jPhase = [];
	//var _jCountry = [];
	var _team = false;


	var _fGetColorPhase = function(_name) {

		var _return = false;
			_name = _name.toLowerCase();
			_name = _name.replace(/\s/g,'');
	
		$.each(_jPhase, function(_index,_phase) {
			if (_phase.name.toLowerCase().replace(/\s/g,'') == _name) _return =  _phase.bgcolor;			
			if (_return) return true;
		});
		
		return _return;
	};


	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="img/flags/'+_image.src+'" alt="' +_image.src + '"  />';		
		if (_image.caption) _html += '<figcaption>' + _image.caption + '</figcaption>';
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
	
		var _html = '';
		$.each(_jGet.item, function(_index,_item) {
			
			_iDate = _item.fecha_de_partido.split(' ');
			_iDate = _iDate[0].toLowerCase();

			
			if (eval(_expression)) {

				_html += '<div class="row data-match" >';
				
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="background-color:#3E79C4; height:40px; line-height:40px; text-align:left; color:#FFD455">';
				_html += '<span style="font-size:1.2em; margin-left:10px;">' +  _item.fecha_de_partido + '</span>';
				_html += '</div>';
								
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="background-color:#3E79C4; height:40px; line-height:40px; text-align:right; color:#FFD455">';
				_html += '<span style="font-size:1.2em; margin-right:10px;">' +  _item.fase + '</span>';
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
			
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; height:100px;  line-height:20px; padding:5px;">';
				_html += '<span> - </span>';
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
			
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');

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
					
				_html += '<td><span>&nbsp;</span></td>';
				
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
				_html += '<td class="match" data-date="' + _date + '" style="border-bottom: solid ' + _fGetColorPhase(_jMatch.fase) + ' !important;" ><span style="color:#000000;">' + _i.toString() +'</span></td>';
			} else {
				_html += '<td><span style="color:gray;">' + _i.toString() +'</span></td>';
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
		_jCountry.sort();	
		$.each(_jCountry, function(_index) {			
			_html += '<div class="col-md-12 match" data-country="' + _jCountry[_index] + '" >';
			_html += '<span style="margin-left:15px;">' + _jCountry[_index].toString()  + '</span>';
			_html += '</div>';
		});
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
	};


	var _fRenderPhase = function() {

		var _html = '<div class="row" >';	
		$.each(_jPhase, function(_index, _phase) {			
			_html += '<div class="col-md-12 match" data-phase="' + _phase.name + '" >';
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
		
		_html += '<table class="table table-striped">';
				
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



	var _iIndex = $('main').data('index');
	_jGet = _jMenu[_iIndex].json;
	
	if (_jGet) {
		
		$.each(_jGet.item, function(_index,_item) {
			
			if (_item.fase.indexOf('Grupo') >= 0) {
				if (_jCountry.indexOf(_item.equipo_local) < 0) {					
					_jCountry.push(_item.equipo_local);
				}	
			}
			
			if (_jPhase.indexOf(_item.fase) < 0) {
				_jPhase.push(_item.fase);	
			}

		});
								
		
		_fRenderCalendar();
		
	} else {
	
		_oAjax = $.fGetAjaXJSON('http://polla.tvmax-9.com/tvmaxfeeds/calendar/getAll',false,false,true);	
		if (_oAjax) {
			_oAjax.done(function(_json) {
				
				_jMenu[_iIndex].json =  _json.partidos_mundial;					
				_jGet = _json.partidos_mundial;
								
				/*$.each(_jGet.item, function(_index,_item) {
					
					if (_item.fase.indexOf('Grupo') >= 0) {
						if (_jCountry.indexOf(_item.equipo_local) < 0) {
							_jCountry.push(_item.equipo_local);
						}	
					}
					
					if (_jPhase.indexOf(_item.fase) < 0) {
						_jPhase.push(_item.fase);	
					}
	
				});*/
								
				_fRenderCalendar();
				
			});
		}
	
	}









	

