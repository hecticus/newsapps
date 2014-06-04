	
	var _height =  parseInt(($(window).height() * 40)/100);

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
	
	
	var _fRenderInit = function() {
	
		var _html = '<div class="row" >';

		$.each(_jGet.item, function(_index,_item) {
		 	if (_index <= 15) {
		 		
		 		if (_item.activo == 'Si') {
		 		
		 			var _caption = _item.goleador;
		 			_caption += ' de ' + _item.equipo;
		 			_caption += ' al minuto ' + _item. minuto_anotacion;
		 			_caption += ' del ' + _item.tiempo_anotacion;
		 			
		 			
			 		var _src = 'http://www.kaltura.com/p/1199011/sp/0/playManifest/entryId/' + _item.id_video_kaltura + '/format/url/flavorParamId/0/video.mp4';
					_html += '<div class="col-md-12 video" data-src="' + _src + '"  >';
					_html += _fGetImage({src:_item.imagen_gol,caption:_caption});
					_html += '</div>';
		 			
		 		}
		 		
		 		
				
			}		 			
		});
		 
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};


	var _iIndex = $('main').data('index');
	_jGet = _jMenu[_iIndex].json;
	
	if (_jGet) {
		_fRenderInit();
	} else {
		_oAjax = $.fGetAjaXJSON('http://mundial.tvmax-9.com/_modulos/json/goles_mundial.php',false,false,true);	
		if (_oAjax) {
			_oAjax.done(function(_json) {
				_jMenu[_iIndex].json = _json.goles_mundial;
				_jGet = _json.goles_mundial;		
				_fRenderInit();
			});
		}
	}









