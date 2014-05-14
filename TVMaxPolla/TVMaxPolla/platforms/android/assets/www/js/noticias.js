	


	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '"  />';		
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
		_html += '</figure>';
		return _html;
	};

	var _fRenderDataContent = function(_id) {
	
		var _html = '<div class="row" >';
		
		$.each(_jGet.item, function(_index,_item) {
			if (_item.id == _id) {
			
				_html += '<div class="col-md-12">';
				_html += _fGetImage({src:_item.imagen,caption:false});
				_html += '</div>';

				_html += '<div class="col-md-12" >';
				_html += '<h4>' + _item.titulo + '</h4>';
				_html += '<h5>' + _item.fecha + '</h5>'; 
				_html += '</div>';
			
				_html += '<div class="col-md-12" >';
				_html += '<p style="color:#BDBDBD;">' + _item.descripcion + '</p>'; 
				_html += '</div>';
				
				_html += '<div class="col-md-12" >';
				_html += '<p>' + _item.fullstory + '</p>'; 
				_html += '</div>';
				
				_html += '<div class="col-md-12" >';
				_html += '<span style="font-weight:bold;">' +_copyright + '</span>';
				_html += '</div>';

			}
		});
			
		_html += '</div>';
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');

	};

	var _fRenderInit = function() {
	
		var _html = '<div class="row" >';

		$.each(_jGet.item, function(_index,_item) {				
		 	if (_index <= 10) {		 	
				_html += '<div class="col-md-12 item" data-item="'+_item.id+'"  >';
				_html += _fGetImage({src:_item.imagen,caption:_item.titulo});
				_html += '</div>';
			}		 			
		});
		 
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	$(document).on('tap','.item', function(e) {
		_fRenderDataContent($(this).data('item'));
	});


	_oAjax = $.fGetAjaXJSON('http://mundial.tvmax-9.com/_modulos/json/noticias_mundial.php');	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			_jGet = _json.noticias_mundial;		
			_fRenderInit();
		});
	}

