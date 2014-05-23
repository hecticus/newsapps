	
	
	
	
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
