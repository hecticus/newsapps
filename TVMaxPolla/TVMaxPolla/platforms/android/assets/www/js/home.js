	var _height =  parseInt(($(window).height() * 20)/100);

	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '" style="width:100%; height:auto" />';		
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
		_html += '</figure>';
		return _html;
	};

	
	var _fRenderInit = function() {
	

		//row
		var _html = '<div class="row">';				

		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro menu">';
			_html += '<div style="background: #3E79C4; height:' + _height + 'px;  text-align:center;">';
				_html += '<span class="icon-menuhome" style="font-size:4em; color:#ffffff;"></span>';
				_html += '<br />';
				_html += '<span class="caption-icon" >Men&uacute;</span>';
			_html += '</div>';
		_html += '</div>';

		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro">';
			_html += '<div style="background: #FFFFFF; height:' + _height + 'px;" >';		
				_html += '<img onerror="this.style.display=\'none\'" src="img/home/tvmax.png" alt="TV Max" style="width:100%; height:' + _height + 'px;" />';
			_html += '</div>';
		_html += '</div>';
				
		_html += '</div>';		
		//row
		
		

		//row
		_html += '<div class="row">';
		_html += '<div class="col-md-12 metro load" data-index="1" >';					
			_html += '<img onerror="this.style.display=\'none\'" src="img/home/polla.png" alt="La polla de TvMax" style="width:100%; height:auto; "  />';						
		_html += '</div>';		
		_html += '</div>';	
		//row

		
		//row
		_html += '<div class="row">';
			_html += '<div class="col-md-12 metro load" data-index="2" >';
					
				_html += '<figure>';					     		
					_html += '<img onerror="this.style.display=\'none\'" src="' + _jImageFeatured.src + '" alt="' +_jImageFeatured.src + '"  />';		
					_html += '<figcaption>';			
						_html += '<div style="width:80%;  height: 40px; line-height: 20px; float:left;">';
							_html += '<span>'+_jImageFeatured.caption+'</span>';

						_html += '</div>';				
						_html += '<div style="width:20%;  height: 40px; line-height: 40px; float:right; text-align: right; font-size:1.6em; font-weight:bold;">';
							_html += '<span class="icon-noticias"></span>';
						_html += '</div>';
					_html += '</figcaption>';
				_html += '</figure>';

			_html += '</div>';		
		_html += '</div>';
		//row


		//row
		_html += '<div class="row">';

		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro load" data-index="9" >';		
			

		_html += '<figure style="height:' + _height + 'px;">';
			
			var _length = (_jPlayers.length - 1);
			var _aRandom = [
							Math.floor((Math.random() * _length) + 0), 
							Math.floor((Math.random() * _length) + 0),
							Math.floor((Math.random() * _length) + 0)
						];
									     		
			_html += '<img onerror="this.style.display=\'none\'" src="' + _jPlayers[_aRandom[0]].image + '" alt="Estrellas"  style=" width:32%; height:' + _height + 'px; float:left;" />';
			_html += '<img onerror="this.style.display=\'none\'" src="' + _jPlayers[_aRandom[1]].image + '" alt="Estrellas"  style="width:36%; height:' + _height + 'px; float:left;" />';
			_html += '<img onerror="this.style.display=\'none\'" src="' + _jPlayers[_aRandom[2]].image + '" alt="Estrellas" style="width:33%; height:' + _height + 'px; " />';

			
		_html += '<figcaption>';			
		_html += '<div style="width:100%;  height: 20px; line-height: 20px; ">';
			_html += '<span class="icon-estrellas" style="font-size:1.2em; font-weight:bold;"></span> <span class="caption-icon">Estrellas</span>';
		_html += '</div>';						
		_html += '</figcaption>';		
		
		_html += '</figure>';

					
		_html += '</div>';	

		
		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro load" data-index="6">';
			_html += '<div style="background: #1E5733;  height:' + _height + 'px; text-align:center;" >';			
				_html += '<span class="icon-calendario" style="font-size:4em; color:#ffffff;"></span>';
				_html += '<span class="caption-icon" >Calendario</span>';								
			_html += '</div>';	
		_html += '</div>';

			
		_html += '</div>';
		//row


		//row						
		_html += '<div class="row">';						
	
		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro">';
			_html += '<div style="background: #1E5733;  height:' + _height + 'px;  text-align:center;" >';
				_html += '<span class="icon-alertas" style="font-size:4em; color:#ffffff;"></span>';
				_html += '<br />';
				_html += '<span class="caption-icon">Alertas</span>';	
			_html += '</div>';	
		_html += '</div>';
		
		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="10" >';
			_html += '<div style="background: #d9534f;  height:' + _height + 'px; text-align:center;" >';
				_html += '<span class="icon-equipo" style="font-size:4em; color:#ffffff;"></span>';	
				_html += '<br />';
				_html += '<span class="caption-icon" >Equipos</span>';	
			_html += '</div>';	
		_html += '</div>';

		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 livetv metro">';
			_html += '<div style="background: #1E5733;  height:' + _height + 'px; text-align:center;" >';
				_html += '<span class="icon-tvenvivo" style="font-size:4em; color:#ffffff;"></span>';
				_html += '<br />';
				_html += '<span class="caption-icon">TV en Vivo</span>';	
			_html += '</div>';	
		_html += '</div>';
						
		_html += '</div>';		
		//row



		

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	
	_fRenderInit();
	
	
	
	
