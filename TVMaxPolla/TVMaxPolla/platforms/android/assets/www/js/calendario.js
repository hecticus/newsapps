	
	var _jPhase = [];
	var _jCountry = [];

	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="img/flags/'+_image.src+'" alt="' +_image.src + '"  />';		
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
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

				_html += '<div class="row data-match" >';
				
				_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8" style="background-color:#3E79C4; height:40px; line-height:40px; text-align:left; color:#FFD455">';
				_html += '<span style="font-size:1em; font-style:italic;  ">' +  _item.fecha_de_partido + '</span>';
				_html += '</div>';
								
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4" style="background-color:#3E79C4; height:40px; line-height:40px; text-align:left; color:#FFD455">';
				_html += '<span style="font-size:1.4em; font-weight:bold; ">' +  _item.fase + '</span>';
				_html += '</div>';
				
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 " style="font-size:1em; color:#1E5733; height:40px; line-height:40px; text-align:center;">';
				_html += '<span>' +  _item.sede + ', </span>';
				_html += '</div>';

				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; height:60px;  line-height:20px; padding:5px;">';
				_html += '<span style="margin-left:15px; font-weight:bold; text-align: center; ">' +  _item.equipo_local + '</span>';
				_html += '</div>';
			
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; height:60px;  line-height:40px; padding:5px;">';
				_html += '<span> - </span>';
				_html += '</div>';
				
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; height:60px;  line-height:20px; padding:5px;">';												
				_html += '<span style="margin-right:15px; font-weight:bold; text-align: center; ">' + _item.equipo_visitante + '</span>';
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
				_html += '<td class="match" data-date="' + _date + '" ><span style="color:red;">' + _i.toString() +'</span></td>';
			} else {
				_html += '<td><span>' + _i.toString() +'</span></td>';
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
		$.each(_jPhase, function(_index) {			
			_html += '<div class="col-md-12 match" data-phase="' + _jPhase[_index] + '" >';
			_html += '<span style="margin-left:15px;">' + _jPhase[_index] + '</span>';
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

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	_oAjax = $.fGetAjaXJSON('http://mundial.tvmax-9.com/_modulos/json/partidos_mundial.php',false,false,true);	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			
			_jGet = _json.partidos_mundial;	
		
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
		});
	}

