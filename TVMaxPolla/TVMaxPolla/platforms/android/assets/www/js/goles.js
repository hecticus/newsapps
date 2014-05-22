	var _fGetTime = function() {
		
		now = new Date();
		y2k = new Date("Jun 12 2014 15:00:00");
		
		days = (y2k - now) / 1000 / 60 / 60 / 24;
		daysRound = Math.floor(days);
		
		hours = (y2k - now) / 1000 / 60 / 60 - (24 * daysRound);				
		hoursRound = Math.floor(hours);
		
		minutes = (y2k - now) / 1000 /60 - (24 * 60 * daysRound) - (60 * hoursRound);
		minutesRound = Math.floor(minutes);
		seconds = (y2k - now) / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
		secondsRound = Math.round(seconds);
		
		
		secondsRound = (secondsRound < 10) ? "0" + secondsRound : secondsRound;
		minutesRound = (minutesRound < 10) ? "0" + minutesRound : minutesRound;
		hoursRound = (hoursRound < 10) ? "0" + hoursRound : hoursRound;
		daysRound = (daysRound < 10) ? "0" + daysRound : daysRound;
		
		
		/*sec = (secondsRound == 1) ? " segundo" : " segundos";
		min = (minutesRound == 1) ? " minuto" : " minutos ";
		hr = (hoursRound == 1) ? " hora" : " horas ";
		dy = (daysRound == 1) ? " día" : " d&iacute;as ";*/

		sec = "ss";
		min = "mm";
		hr = "hh";
		dy = "dd";

		var _html = '<div class="row" style="padding:25px;" >';
		
		_html += '<div class=col-md-12" style="text-align:center; font-size: 2em; font-weight:bold; color:#4D4D4D;" >';	
			_html += '<span>' + daysRound + ' : </span>';
			_html += '<span>' + hoursRound + ' : </span>';
			_html += '<span>' + minutesRound + ' : </span>';
			_html += '<span>' + secondsRound +'</span>';
		_html += '</div>';

		

		return _html;
		
	};


	var _fRenderGetInitTime = function(_class) {

		var _html = '<div class="row" style="padding:25px;" >';
		
		_html += '<div class="col-md-12" style="font-size: 2em; font-weight:bold; color:#4D4D4D; text-align:center; " >';
		_html += '<h3>Para el Mundial faltan</h3>';
		_html += '</div>';
		
		_html += '<div class="col-md-12" >';		
		_html +=  _fGetTime();
		_html += '</div>';
		
		_html += '<div class="col-md-12" style="font-size: 2em; font-weight:bold; color:#4D4D4D; text-align:center;" >';
		_html += '<h4>&#161;Pronto disfrutar&aacute;s de esta secci&oacute;n!</h4>';
		_html += '<span class="' + _class  + '" style="font-size: 4em;"></span>';
		_html += '</div>';
		
		
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
				
		_mTimeout = setTimeout(function() {
			_fRenderGetInitTime(_class);	
		}, 1000);
		
	};
	
	
	
	var _fRenderInit = function() {
	
		var _html = '<div class="row" >';

		$.each(_jGet.item, function(_index,_item) {				
		 	if (_index <= 10) { 	
		 		if (_item.activo.toLowerCase() == 'si') {
		 			
		 			var _src = 'http://www.kaltura.com/p/1199011/sp/0/playManifest/entryId/' + _item.id_video_kaltura + '/format/url/flavorParamId/0/video.mp4';		 				 		

		 			_html += '<div class="col-md-12 video" data-src="' + _src + '" style="overflow:hidden; white-space:nowrap; text-overflow: ellipsis; " >';
					_html += '<span class="icon-goles_menu"></span>';
					//_html += '<span>' + _item.equipo + '</span>';
					//_html += '<span>' + _item.fase  + '</span>';
					_html += '<span> '  + _item.goleador + '<span> <span> (' + _item.tiempo_anotacion + ' - ' + _item.minuto_anotacion + ')</span>';					    		
		 			_html += '</div>';	
		 			
		 		}

			}
		});


		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};
	
	_fRenderGetInitTime('icon-goles_menu');
	
	
	/*var _iIndex = $('main').data('index');
	_jGet = _jMenu[_iIndex].json;
	
	if (_jGet) {
		_fRenderInit();
	} else { 
	
		_oAjax = $.fGetAjaXJSON('http://mundial.tvmax-9.com/_modulos/json/goles_mundial.php',false,false,true);	
		if (_oAjax) {
			_oAjax.done(function(_json) {
				_jGet = _json.goles_mundial;		
				_fRenderInit();
			});
		}
		
	}*/
