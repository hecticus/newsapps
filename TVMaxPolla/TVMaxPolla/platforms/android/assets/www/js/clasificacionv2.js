	

	
	var _team = false;

	var _cToday = new Date().getDate();			
	var _cMonth = new Date().getMonth();	
	var _cDate = _cToday + '/' + _aMonth[_cMonth];
	_cDate =_cDate.toString().toLowerCase();



	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="img/flags/'+_image.src+'" alt="' +_image.src + '"  />';		
		if (_image.caption) _html += '<figcaption>' + _image.caption + '</figcaption>';
		_html += '</figure>';
		return _html;
	};

	


	var _fRenderDataContent = function(_expression) {
	
		var _html = '';
		
		$.each(_jGet.item, function(_index,_item) {
			
			_iDate = _item.fecha_de_partido.split(' ');
			_iDate = _iDate[0].toString().toLowerCase();
			var _class = '';		
			
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

						
				if (_item.estado_del_partido != 'Finalizado en penales' ) {
					if (_item.goles_equipo_local < _item.goles_equipo_visitante) {
						_class =  'opacity';
					}
				} else {
					if (_item.penales_equipo_local < _item.penales_equipo_visitante) {
						_class =  'opacity';
					}
				}
				
				
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 ' + _class + '" style="text-align: center; height:100px;  line-height:20px; padding:5px;">';				
				_team = _fGetAfpTeam(_item.equipo_local_ext_id);
				 
				if (_team.shortname) {
					_html += _fGetImage({src: _team.flag, caption: _team.shortname});	
				} else {
					_html += '<span style="margin-left: 5px; font-weight:bold;">' + _item.equipo_local + '</span>';
				}
				
				_html += '</div>';
			
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 " style=" text-align: center; height:100px;  line-height:80px;">';				
				_html += '<span style="font-size:1.2em; font-weight:bold; float:left;">' + _item.goles_equipo_local;				
				if (_item.estado_del_partido == 'Finalizado en penales' ) _html += '(' + _item.penales_equipo_local + ')';
				_html += '</span>';
				
				
								
				_html += '<span style="font-size:1.2em; font-weight:bold;">vs</span>';
				_html += '<span style="font-size:1.2em; font-weight:bold; float:right;">' + _item.goles_equipo_visitante;				
				if (_item.estado_del_partido == 'Finalizado en penales' ) _html += '(' + _item.penales_equipo_visitante + ')';
				_html += '</span>';				
				_html += '</div>';
				
				_class = '';
				if (_item.estado_del_partido != 'Finalizado en penales' ) {
					if (_item.goles_equipo_visitante < _item.goles_equipo_local) {
					_class =  'opacity';
					}
				} else {
					if (_item.penales_equipo_visitante < _item.penales_equipo_local) {
						_class =  'opacity';
					}
				}
				
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 ' + _class + '" style="text-align: center; height:100px; line-height:20px; padding:5px;">';												
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
			
			
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);				
			
		

	};





	_oAjax = $.fGetAjaXJSON('http://polla.tvmax-9.com/tvmaxfeeds/calendar/getAll',false,false,true);	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			
			_jGet = _json.partidos_mundial;						
			var _find = false;				
			$.each(_jPhase, function(_index, _phase) {
					
				if (_phase.date) {
					
					_iMonthBegin = _phase.date.begin.split('/');
					_iMonthEnd = _phase.date.end.split('/');
			
					if (_iMonthEnd[1].toString().toLowerCase() != _aMonth[_cMonth].toString().toLowerCase()) {
						_find = _phase.name; 
					} else {
						 if (_iMonthBegin[0] >= _cToday) {
						 	_find = _phase.name;
						 }
					}
		
				}
				
				if (_find) return false;
	
			});
			
			_fRenderDataContent('_item.fase.search("' + _find + '") >= 0');
				
		});
	}








	

