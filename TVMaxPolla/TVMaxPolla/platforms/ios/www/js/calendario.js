	

	
	var _team = false;


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
			_iDate = _iDate[0].toString().toLowerCase();

			
			if (eval(_expression)) {

				_html += '<div class="row" >';
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="background:#3E79C4;  height:40px; line-height:40px; text-align:left; color:#FFD455">';
				_html += '<span style="font-size:1em; ">' +  _fgetFormatDateMatch(_item.fecha_de_partido) + '</span>';
				_html += '</div>';
								
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="background:#3E79C4;  height:40px; line-height:40px; text-align:right; color:#FFD455">';
				_html += '<span style="font-size:1em; ">' +  _item.fase + '</span>';
				_html += '</div>';
				
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 " style="font-size:1em; color:#1E5733; height:40px; line-height:40px; text-align:center;">';
				_html += '<span>' +  _item.sede + ' </span>';
				_html += '</div>';


				if ((_item.transmision_por_TVMAX) && (_item.currentlyLive))  {
					_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 tv" style="height:50px; line-height:50px; text-align:center;">';
						_html += '<img  src="img/live.png" alt="En vivo" style="width:25%; max-width:145px; max-height:50px; height:auto;"  />';		
					_html += '</div>';	
				}


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
				_html += '<td class="match" data-date="' + _date + '" style="background:#ffffff; border-bottom: solid ' + _fGetColorPhase(_jMatch.fase) + ' !important;" ><span style="background:#ffffff; color:#000000;">' + _i.toString() +'</span></td>';
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
								
			_html += '<div class="col-md-12 match" data-country="' + _name + '" >';
		
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
		});
	}








	

