


	//var _jPhase = ['Grupo A','Grupo B','Grupo C','Grupo D','Grupo E','Grupo F','Grupo G','Grupo H','Octavos','Cuartos','Semifinales','3er Lugar','Final'];
	
	var _jPhase = [];
	
	/*var _jCountries = [
		{name:'Alemania', shortname: 'GER', flag:'gm-lgflag.png'},
		{name:'Argelia', shortname: 'ALG', flag:'ag-lgflag.png'},
		{name:'Argentina', shortname: 'ARG', flag:'ar-lgflag.png'},
		{name:'Australia', shortname: 'AUS', flag:'as-lgflag.png'},
		{name:'Bélgica', shortname: 'BEL', flag:'be-lgflag.png'},
		{name:'Bosnia', shortname: 'BIH', flag:'bk-lgflag.png'},
		{name:'Brasil', shortname: 'BRA', flag:'br-lgflag.png'},
		{name:'Camerún', shortname: 'CMR', flag:'cm-lgflag.png'},
		{name:'Chile', shortname: 'CHI', flag:'ci-lgflag.png'},
		{name:'Colombia', shortname: 'COL', flag:'co-lgflag.png'},
		{name:'Corea del Sur', shortname: 'KOR', flag:'ks-lgflag.png'},
		{name:'Costa de Marfil', shortname: 'CIV', flag:'iv-lgflag.png'},				
		{name:'Costa Rica', shortname: 'CRC', flag:'cs-lgflag.png'},
		{name:'Croacia', shortname: 'CRO', flag:'hr-lgflag.png'},		
		{name:'Ecuador', shortname: 'ECU', flag:'ec-lgflag.png'},
		{name:'Estados Unidos', shortname: 'USA', flag:'us-lgflag.png'},
		{name:'España', shortname: 'ESP', flag:'sp-lgflag.png'},
		{name:'Francia', shortname: 'FRA', flag:'fr-lgflag.png'},
		{name:'Ghana', shortname: 'GHA', flag:'gh-lgflag.png'},
		{name:'Grecia', shortname: 'GRE', flag:'gr-lgflag.png'},		
		{name:'Holanda', shortname: 'NED', flag:'nl-lgflag.png'},
		{name:'Honduras', shortname: 'HON', flag:'ho-lgflag.png'},
		{name:'Inglaterra', shortname: 'ENG', flag:'en-lgflag.png'},
		{name:'Irán', shortname: 'IRN', flag:'ir-lgflag.png'},
		{name:'Italia', shortname: 'ITA', flag:'it-lgflag.png'},
		{name:'Japón', shortname: 'JPN', flag:'ja-lgflag.png'},		
		{name:'México', shortname: 'MEX', flag:'mx-lgflag.png'},
		{name:'Nigeria', shortname: 'NGA', flag:'ni-lgflag.png'},
		{name:'Portugal', shortname: 'POR', flag:'po-lgflag.png'},
		{name:'Rusia', shortname: 'RUS', flag:'rs-lgflag.png'},
		{name:'Suiza', shortname: 'SUI', flag:'sz-lgflag.png'},
		{name:'Uruguay', shortname: 'URU', flag:'uy-lgflag.png'}							
	];*/
	

	 
	//var _jCountry = ['Alemania','Argelia','Argentina','Australia','Bélgica','Bosnia','Brasil','Camerún','Chile','Colombia','Corea del Sur','Costa de Marfil','Costa Rica','Croacia','Ecuador','Estados Unidos','España','Francia','Ghana','Grecia','Holanda','Honduras','Inglaterra','Irán','Italia','Japón','México','Nigeria','Portugal','Rusia','Suiza','Uruguay'];
	var _jCountry = [];
	var _jFlag = ['gm-lgflag.png','ag-lgflag.png'
	,'ar-lgflag.png','as-lgflag.png','be-lgflag.png','bk-lgflag.png','br-lgflag.png','cm-lgflag.png'
	,'ci-lgflag.png','co-lgflag.png','ks-lgflag.png','iv-lgflag.png','cs-lgflag.png','hr-lgflag.png'
	,'ec-lgflag.png','us-lgflag.png','sp-lgflag.png','fr-lgflag.png','gh-lgflag.png','gr-lgflag.png'
	,'nl-lgflag.png','ho-lgflag.png','en-lgflag.png','ir-lgflag.png','it-lgflag.png','ja-lgflag.png'
	,'mx-lgflag.png','ni-lgflag.png','po-lgflag.png','rs-lgflag.png','sz-lgflag.png','uy-lgflag.png'];


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


				_html += '<div class="row" >';
				_html += '<div class="col-md-12" style="text-align:center; font-weight:bold;">';
				_html += '<span>' +  _item.fecha_de_partido + '</span>';
				_html += '</div>';
				_html += '</div>';
				
				_html += '<div class="row" >';
				
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; line-height:40px; padding:5px;">';
				_html += '<span>' +  _item.equipo_local + '</span>';
				_html += '</div>';
			
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; line-height:40px; padding:5px;">';
				_html += '<span> - </span>';
				_html += '</div>';
				
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style="text-align: center; line-height:40px; padding:5px;">';
				
								
				_html += '<span>' + _item.equipo_visitante + '</span>';
				_html += '</div>';
				
				_html += '</div>';
				
				_html += '<div class="row" >';
				_html += '<div class="col-md-12" style="text-align:center; font-weight:bold;">';
				_html += '<span>' +  _item.sede + '</span>';
				_html += '</div>';
				_html += '<div class="col-md-12" style="text-align:center; font-weight:bold;">';
				_html += '<span>' +  _item.fase + '</span>';
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
			_html +='<tr><td colspan="7">Junio</td></tr>';		  		
			_day = new Date('June 01, 2014').getDay();
		} 

		if (_month == 'jul') {
			_html +='<tr><td colspan="7">Julio</td></tr>';
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
				_html += '<td class="match" data-date="' + _date + '" ><span  style="font-weight:bold;">' + _i.toString() +'</span></td>';
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
		$.each(_jCountry, function(_index) {			
			_html += '<div class="col-md-12 match" data-country="' + _jCountry[_index] + '" >';
			_html += '<span>' + _jCountry[_index].toString()  + '</span>';
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
			_html += '<span>' + _jPhase[_index] + '</span>';
			_html += '</div>';
		});
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	var _fRenderCalendar = function() {

		var _html = '<div class="row" >';
		_html += '<div class="col-md-12">';

		_html += '<div class="table-responsive">';
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

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};


	$(document).on('touchend','.calendar', function(e) {						
		eval($(this).data('function'));		
		$('.calendar').css('color','#000');
		$(this).css('color','blue');
		$('#wrapper2').attr('class','page transition right');
		myScroll.scrollTo(0,0,0);
		myScroll2.scrollTo(0,0,0);		
	});


	$(document).on('tap','.match', function(e) {	
		
		if ($(this).data('phase')) {
			_fRenderDataContent('_item.fase.search("' + $(this).data('phase') + '") >= 0');		
		} else if ($(this).data('country')){
			_fRenderDataContent('(_item.equipo_local.search("' + $(this).data('country') + '") >= 0  ) || ( _item.equipo_visitante.search("' + $(this).data('country') + '") >= 0)');	
		} else {			
			_fRenderDataContent('_iDate == "' + $(this).data('date') + '"');
		}
		
		myScroll.scrollTo(0,0,0);
		myScroll2.scrollTo(0,0,0);

	});

	_oAjax = $.fGetAjaXJSON('http://mundial.tvmax-9.com/_modulos/json/partidos_mundial.php');	
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

