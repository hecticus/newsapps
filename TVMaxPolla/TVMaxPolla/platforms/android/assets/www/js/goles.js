	

	
	var _fRenderInit = function() {
	
		var _html = '<div class="row" >';

		$.each(_jGet.item, function(_index,_item) {				
		 	if (_index <= 10) {		 	
				_html += '<div class="col-md-12 item" data-item="'+_item.id_gol+'" data-game="'+_item.numero_partido+'" >';
				_html += '<p>' + _item.equipo + '</p>';
				_html += '<p>' + _item.goleador + '</p>';
				_html += '<p>' + _item.fase + '</p>';
				_html += '<p>' + _item.tiempo_anotacion + ' : ' + _item.minuto_anotacion + '</p>'; 
				_html += '<p> Activo -> ' + _item.activo +'</p>'; 
				_html += '</div>';
			}		 			
		});
		 
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};


	_oAjax = $.fGetAjaXJSON('http://mundial.tvmax-9.com/_modulos/json/goles_mundial.php');	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			_jGet = _json.goles_mundial;		
			_fRenderInit();
		});
	}
