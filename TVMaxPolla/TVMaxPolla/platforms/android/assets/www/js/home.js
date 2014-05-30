	
	
	var _width = 	$(window).width();		
	var _height = 	$(window).height();
	_height =  parseInt(_height - 18);
	
	var _heightPolla =  parseInt((_height * 20)/100);
	var _heightNoticia =  parseInt((_height * 40)/100);
	var _heightBotones =  parseInt((_height * 20)/100);
	var _heightBanner =  parseInt((_height * 10)/100);
	
	var _fRenderInit = function() {
		_homeWasShowed = true;

		//row
		var _html = '<div class="row" >';

		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro load" data-index="9" >';

			_html += '<div style="background: #1E5733; height:' + (_heightPolla - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-fechas" style="font-size:5em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:30px; text-align:center;" >';							
				_html += '<span class="caption-icon" >Calendario</span>';
			_html += '</div>';	
				
		_html += '</div>';
		
		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro load" data-index="4" >';	
			_html += '<div  id="banner-claro" style="background-image:url(img/home/polla.jpg); background-size:cover; height:' + _heightPolla +'px;" >&nbsp;</div>';						
		_html += '</div>';
				
		_html += '</div>';	
		//row

		
		//row		
		if (_jImageFeatured) {
			//row
			_html += '<div class="row" >';
				_html += '<div class="col-md-12 metro load" data-index="5" >';						
						_html += '<figure>';	
							_html += '<div style="background-image:url(' + _jImageFeatured.src + '); background-size:cover; height:' + _heightNoticia +'px;" >&nbsp;</div>';
						_html += '<figcaption>';						
							_html += '<div style="width:15%; height:40px; line-height: 40px; float:left; text-align: center; font-size:1.6em; font-weight:bold;">';
								_html += '<span class="icon-noticias"></span>';
							_html += '</div>';												
							_html += '<div style="width:85%; height: 40px; line-height: 20px; float:right;  ">';										
								_html += '<span>'+_jImageFeatured.caption+'</span>';																									
							_html += '</div>';							
						_html += '</figcaption>';
					_html += '</figure>';
				_html += '</div>';		
			_html += '</div>';
			//row
		}


		//row						
		_html += '<div class="row">';						

		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="14"  >';

			_html += '<div style="background: #1E5733; height:' + (_heightBotones - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-alertas" style="font-size:5em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:30px; text-align:center;" >';							
				_html += '<span class="caption-icon" >Alertas</span>';
			_html += '</div>';	

		_html += '</div>';


		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="12"  >';
		
			_html += '<div style="background: #1E5733; height:' + (_heightBotones - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-estrellas" style="font-size:5em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:30px; text-align:center;" >';							
				_html += '<span class="caption-icon" >Leyendas</span>';
			_html += '</div>';	

		_html += '</div>';


		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="11" >';	
		
			_html += '<div style="background: #1E5733; height:' + (_heightBotones - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-equipo" style="font-size:5em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:30px; text-align:center;" >';							
				_html += '<span class="caption-icon" >Equipos</span>';
			_html += '</div>';	
						
		_html += '</div>';
	
		

		_html += '</div>';	
		//row

		_html += '<div class="row" >';
			_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 load metro">';
			
				var _banner = 'img/claro/540x54.jpg';		
				if (_width >= 720) _banner = 'img/claro/720x72.jpg';			
				if (_width >= 800)  _banner = 'img/claro/800x80.jpg';
				if (_width >= 1080)  _banner = 'img/claro/1080x108.jpg';
				if (_width >= 1280)  _banner = 'img/claro/1280x128.jpg';
				if (_width >= 1600)  _banner = 'img/claro/1600x160.jpg';

				_html += '<div  id="banner-claro" style="background-image:url(' + _banner + '); background-size:cover; height:' + _heightBanner +'px;" >&nbsp;</div>';
							
			_html += '</div>';
		_html += '</div>';

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	
	_fRenderInit();
	
	
	
	
