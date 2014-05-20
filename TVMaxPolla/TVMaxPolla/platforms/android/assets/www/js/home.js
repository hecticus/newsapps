	var _height =  parseInt(($(window).height() * 20)/100);

	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '" style="width:100%; height:auto" />';		
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
		_html += '</figure>';
		return _html;
	};


	var _fGetImageNews = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '"  />';		
		
		if (_image.caption) {
			
			_html += '<figcaption>';
			
			_html += '<div style="width:80%;  height: 40px; line-height: 20px; float:left; ">';
			_html += '<span>'+_image.caption+'</span>';
			_html += '</div>';
			
			_html += '<div style="width:20%;  height: 40px; line-height: 20px; float:right; text-align: right; font-size:1.4em;">';
			_html += '<span class="glyphicon glyphicon-search"></span>';
			_html += '</div>';
						
			_html += '</figcaption>';		

		}
		
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
							
		/*_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro">';	
			_html += '<div style="background: #FFFFFF; height:' + _height + 'px;" >';
				_html += '<img onerror="this.style.display=\'none\'" src="img/home/icon/tvmax.png" alt="TV Max" style="width:100%; height:' + _height + 'px;" />';
			_html += '</div>';	
		_html += '</div>';*/


		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro">';
			_html += '<div style="background: #1E5733;  height:' + _height + 'px; line-height:' + _height + 'px; text-align:center;" >';
				_html += '<img onerror="this.style.display=\'none\'" src="img/home/icon/alertas.png" alt="Alertas" style="width:50%; height: auto;"  />';
			_html += '</div>';	
		_html += '</div>';
		
		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="10" >';
			_html += '<div style="background: #d9534f;  height:' + _height + 'px; line-height:' + _height + 'px; text-align:center;" >';
				_html += '<img onerror="this.style.display=\'none\'" src="img/home/icon/equipos.png" alt="Equipos" style="width:50%; height: auto;"  />';
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
		
		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro">';
		
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
		
		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro">';
		_html += '</div>';
				
		_html += '</div>';
		//row
		
		//row
		_html += '<div class="row">';
		_html += '<div class="col-md-12 metro load" data-index="2" >';		
			$.each(_jGet.item, function(_index,_item) {
				if (_index == 0) _html += _fGetImageNews({src:_item.imagen,caption:_item.titulo});
				return true;
			});						
		_html += '</div>';		
		_html += '</div>';		
		//row


		//row
		_html += '<div class="row">';

		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro load" data-index="9">';	
			_html += '<div style="background: #FFFFFF; height:' + _height + 'px;" >';

				_html += '<img class="gray" onerror="this.style.display=\'none\'" src="' +  _urlCloud + '/7001.jpg" alt="" style="width:33%; height:' + _height + 'px; float:left;" />';
				_html += '<img class="gray" onerror="this.style.display=\'none\'" src="' +  _urlCloud + '/20599.jpg" alt="" style="width:33%; height:' + _height + 'px; float:left;" />';
				_html += '<img class="gray" onerror="this.style.display=\'none\'" src="' +  _urlCloud + '/17353.jpg" alt="" style="width:33%; height:' + _height + 'px;" />';
				
			_html += '</div>';	
		_html += '</div>';
		
		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro load" data-index="6">';
			_html += '<div style="background: #1E5733;  height:' + _height + 'px; line-height:' + _height + 'px; text-align:center;" >';
				_html += '<img onerror="this.style.display=\'none\'" src="img/home/icon/calendarios.png" alt="Calendario" style="width:50%; height: auto;"  />';
			_html += '</div>';	
		_html += '</div>';
			
		_html += '</div>';
		//row

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