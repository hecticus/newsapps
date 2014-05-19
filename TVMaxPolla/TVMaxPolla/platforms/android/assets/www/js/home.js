	var _height =  parseInt(($(window).height() * 20)/100);

	var _fGetImage = function(_image) {
		var _html = '<figure  style="width:100%; height:' + ((_height * 2) - 20) + 'px;">';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '" style="width:100%; height:' + ((_height * 2) - 20) + 'px;" />';		
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
		_html += '</figure>';
		return _html;
	};


	var _fRenderInit = function() {
	
		
		
		
		//row
		var _html = '<div class="row">';				

		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro menu">';
			_html += '<div style="background: #3E79C4; height:' + _height + 'px; line-height:' + _height + 'px; text-align:center;">';
				_html += '<img onerror="this.style.display=\'none\'" src="img/home/icon/menu.png" alt="Menu" style="width:50%; height: auto;" />';
			_html += '</div>';
		_html += '</div>';

		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro">';
			_html += '<div style="background: #FFFFFF; height:' + _height + 'px;" >';		
				_html += '<img onerror="this.style.display=\'none\'" src="img/home/icon/tvmax.png" alt="TV Max" style="width:100%; height:' + _height + 'px;" />';
			_html += '</div>';
		_html += '</div>';
				
		_html += '</div>';		
		//row
		
		//row						
		_html += '<div class="row">';
							
		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro">';	
			_html += '<div style="background: #FFFFFF; height:' + _height + 'px;" >';
				_html += '<img onerror="this.style.display=\'none\'" src="img/home/icon/tvmax.png" alt="TV Max" style="width:100%; height:' + _height + 'px;" />';
			_html += '</div>';	
		_html += '</div>';

		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro">';
			_html += '<div style="background: #1E5733;  height:' + _height + 'px; line-height:' + _height + 'px; text-align:center;" >';
				_html += '<img onerror="this.style.display=\'none\'" src="img/home/icon/tvenvivo.png" alt="TV En vivo" style="width:50%; height: auto;"  />';
			_html += '</div>';	
		_html += '</div>';
						
		_html += '</div>';		
		//row

		
	
	
	
	
	
	
	
	
	
	
	
		//row
		_html += '<div class="row">';
		
		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro" style=" height:' + (_height * 2) + 'px; line-height:' + (_height * 2) + 'px;">';
		
			_html += '<div class="row" >';			
				_html += '<div class="col-md-12 metro" style="background: #1E5733; height:' + _height + 'px; line-height:' + _height + 'px; text-align:center;">';
					_html += '<img src="img/home/icon/alertas.png" alt="Alertas" style="width:50%; height: auto;" />';
				_html += '</div>';				
			_html += '</div>';	
			
			_html += '<div class="row" >';
				_html += '<div class="col-md-12 metro load" data-index="10" style="background: #3E79C4; height:' + _height + 'px; line-height:' + _height + 'px; text-align:center;">';
					_html += '<img src="img/home/icon/equipos.png" alt="Equipos" style="width:50%; height: auto;"  />';									
				_html += '</div>';
			_html += '</div>';										
		
		_html += '</div>';
		
		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro" style=" height:' + (_height * 2) + 'px; line-height:' + (_height * 2) + 'px;">';
				
	
				$.each(_jGet.item, function(_index,_item) {
					if (_index == 0) _html += _fGetImage({src:_item.imagen,caption:_item.titulo});
					return true;
				});
		
		_html += '</div>';
		_html += '</div>';
		//row

		/*_html += '<div class="row" style=" height:' + _height + 'px; line-height:' + _height + 'px;">';
		
		
		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro">';	
			_html += '<div style="background: #FFFFFF; line-height:' + _height + 'px; text-align:center;">';
			
				$.each(_jGet.item, function(_index,_item) {
					if (_index == 1) {					
						_html += '<img onerror="this.style.display=\'none\'" src="' +  _item.imagen + '" alt="' + _item.titulo + '" style="width:100%; height:' + _height + 'px;" />';						
					}			
				});

			_html += '</div>';	
		_html += '</div>';
		
		
		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4  metro load" data-index="6" >';
			_html += '<div style="background: #1E5733; line-height:' + _height + 'px; text-align:center;">';
				_html += '<img onerror="this.style.display=\'none\'" src="img/home/icon/calendarios.png" alt="Calendario" style="width:50%; height: auto;"  />';
			_html += '</div>';	
		_html += '</div>';
		
		_html += '</div>';*/
	
	
	
	
	
	
		
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	
	var _iIndex = $('main').data('index');
	_jGet = _jMenu[_iIndex].json;
	
	if (_jGet) {
		_fRenderInit();
	} else {
	
		_oAjax = $.fGetAjaXJSON('http://mundial.tvmax-9.com/_modulos/json/noticias_mundial.php',false,false,true);	
		if (_oAjax) {
			_oAjax.done(function(_json) {
				_jMenu[_iIndex].json = _json.noticias_mundial;	
				_jGet = _json.noticias_mundial;		
				_fRenderInit();
			});
		}
	
	}	