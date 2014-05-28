	
	var _height =  parseInt(($(window).height() * 20)/100);

	var _fRenderInit = function() {
	

		//row
		var _html = '<div class="row">';
		_html += '<div class="col-md-12 metro load" data-index="4" >';					
			_html += '<img onerror="this.style.display=\'none\'" src="img/home/polla.png" alt="La polla de TvMax" style="width:100%; height:' + _height + 'px;"  />';						
		_html += '</div>';		
		_html += '</div>';	
		//row

		
		//row
		_html += '<div class="row">';
			_html += '<div class="col-md-12 metro load" data-index="5" >';
					
				_html += '<figure>';									     		
					_html += '<img onerror="this.style.display=\'none\'" src="' + _jImageFeatured.src + '" alt="' +_jImageFeatured.src + '" style="width:100%;  height: height:auto; "  />';
					_html += '<figcaption>';
					
						_html += '<div style="width:20%; height: 40px; line-height: 20px; font-size:1.6em; float:left; ">';
							_html += '<span class="icon-noticias"></span>';
						_html += '</div>';
												
						/*_html += '<div style="width:80%; height: 40px; line-height: 20px; ">';										
							if (_jImageFeatured.caption) _html += '<span>'+_jImageFeatured.caption+'</span>';
						_html += '</div>';*/
						
					_html += '</figcaption>';
				_html += '</figure>';

			_html += '</div>';		
		_html += '</div>';
		//row


		//row
		_html += '<div class="row">';

		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro load" data-index="12" >';		
			

		_html += '<figure style="height:' + _height + 'px;">';
			
			var _length = (_jPlayers.length - 1);
			var _aRandom = [
							Math.floor((Math.random() * _length) + 0), 
							Math.floor((Math.random() * _length) + 0),
							Math.floor((Math.random() * _length) + 0)
						];
									     		
			_html += '<img onerror="this.style.display=\'none\'" src="' + _jPlayers[_aRandom[0]].image + '" alt="Estrellas"  style=" width:33%; height:' + _height + 'px; float:left;" />';
			_html += '<img onerror="this.style.display=\'none\'" src="' + _jPlayers[_aRandom[1]].image + '" alt="Estrellas"  style="width:34%; height:' + _height + 'px; float:left;" />';
			_html += '<img onerror="this.style.display=\'none\'" src="' + _jPlayers[_aRandom[2]].image + '" alt="Estrellas" style="width:33%; height:' + _height + 'px; float:right;" />';

			
		_html += '<figcaption>';			
		_html += '<div style="width:100%;  height: 20px; line-height: 20px; font-size:1em;">';
			_html += '<span class="icon-estrellas"></span><span class="caption-icon"> Leyendas</span>';
		_html += '</div>';						
		_html += '</figcaption>';		
		
		_html += '</figure>';

					
		_html += '</div>';	

		
		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro load" data-index="9">';
			_html += '<div style="background: #1E5733;  height:' + _height + 'px; text-align:center;" >';			
				_html += '<span class="icon-calendario" style="font-size:4em; color:#ffffff;"></span>';
				_html += '<p class="caption-icon" >Calendario</p>';
			_html += '</div>';	
		_html += '</div>';

			
		_html += '</div>';
		//row


		//row						
		_html += '<div class="row">';						
	
		_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 load metro" data-index="11" >';
			_html += '<div style="background: #d9534f; text-align:center;" >';
				_html += '<span class="icon-equipo" style="font-size:1.6em; color:#ffffff;"></span>';
				_html += '<span class="caption-icon" style="margin-left:5px;">Equipos</span>';	
			_html += '</div>';	
		_html += '</div>';
	
		_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 load metro" data-index="14">';
			_html += '<div style="background: #1E5733;  text-align:center;" >';
				_html += '<span class="icon-alertas" style="font-size:1.6em; color:#ffffff;"></span>';		
				_html += '<span class="caption-icon" style="margin-left:5px;">Alertas</span>';
			_html += '</div>';	
		_html += '</div>';
				
		_html += '</div>';		
		//row



		

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	
	_fRenderInit();
	
	
	
	
