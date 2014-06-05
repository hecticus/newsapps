
	$('#splash').hide();
	$('#mloading').remove();
	$('header').removeClass('hidden');	
	$('.menu').removeClass('hidden');
	
	var _width = 	$(window).width();		
	var _height = 	$(window).height();
	_height =  parseInt(_height - 18);
	
	var _heightPolla =  parseInt((_height * 20)/100);
	var _heightNoticia =  parseInt((_height * 40)/100);
	var _heightBotones =  parseInt((_height * 20)/100);
	var _heightBanner =  parseInt((_height * 10)/100);

	var homeIconSize = 5;
	var homeSmallIconsSize = 1.6;
	var homeTextClass = "caption-icon";
	var homeLineHeight = 30;
	
	var _fRenderInit = function() {
		_homeWasShowed = true;
		
		var devicePlatform = device.platform;
		//IOS
		if(devicePlatform == "iOS"){
			//CAMBIO SOLO IOS
			if(getIfItsIpad()){
				homeIconSize = 8;
				homeSmallIconsSize = 3.3;
				homeTextClass = "caption-icon-ipad";
				homeLineHeight = 0;
			}else{
				homeIconSize = 4;
				homeSmallIconsSize = 1.6;
				homeTextClass = "caption-icon";
			}
		}else{
			if(getScreenHeight()>1500){
				homeIconSize = 8;
				homeSmallIconsSize = 3.3;
				homeTextClass = "caption-icon-tablets";
				homeLineHeight = 0;
			}else{
				homeIconSize = 5;
				homeSmallIconsSize = 1.6;
				homeTextClass = "caption-icon";
			}
		}

		//row
		var _html = '<div class="row" >';

		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 metro load" data-index="6" >';

			_html += '<div style="background: #1E5733; height:' + (_heightPolla - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-fechas" style="font-size:'+homeIconSize+'em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:'+homeLineHeight+'px; text-align:center;" >';
				_html += '<span class="'+homeTextClass+'" >Calendario</span>';
			_html += '</div>';	
				
		_html += '</div>';
		
		_html += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 metro load" data-index="7" >';	
			_html += '<div style="background-image:url(img/home/polla.jpg); background-size:cover; height:' + _heightPolla +'px;" >&nbsp;</div>';						
		_html += '</div>';
				
		_html += '</div>';	
		//row

		
		//row		
		if (_jImageFeatured) {
			//row
			_html += '<div class="row" >';
				_html += '<div class="col-md-12 metro load" data-index="4" >';						
						_html += '<figure>';	
							_html += '<div style="background-image:url(' + _jImageFeatured.src + '); background-size:cover; height:' + _heightNoticia +'px;" >&nbsp;</div>';
						_html += '<figcaption>';						
							_html += '<div style="width:15%; height:40px; line-height: 40px; float:left; text-align: center; font-size:'+homeSmallIconsSize+'em; font-weight:bold;">';
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

		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="10"  >';

			_html += '<div style="background: #1E5733; height:' + (_heightBotones - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-alertas" style="font-size:'+homeIconSize+'em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:'+homeLineHeight+'px; text-align:center;" >';
				_html += '<span class="'+homeTextClass+'" >Alertas</span>';
			_html += '</div>';	

		_html += '</div>';


		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="13"  >';
		
			_html += '<div style="background: #1E5733; height:' + (_heightBotones - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-estrellas" style="font-size:'+homeIconSize+'em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:'+homeLineHeight+'px; text-align:center;" >';
				_html += '<span class="'+homeTextClass+'" >Leyendas</span>';
			_html += '</div>';	

		_html += '</div>';


		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="12" >';	
		
			_html += '<div style="background: #1E5733; height:' + (_heightBotones - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-equipo" style="font-size:'+homeIconSize+'em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:'+homeLineHeight+'px; text-align:center;" >';
				_html += '<span class="'+homeTextClass+'" >Equipos</span>';
			_html += '</div>';	
						
		_html += '</div>';
	
		

		_html += '</div>';	
		//row



		//row						
		_html += '<div class="row">';

		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="5"  >';

			_html += '<div style="background: #1E5733; height:' + (_heightBotones - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-clasificacion" style="font-size:'+homeIconSize+'em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:'+homeLineHeight+'px; text-align:center;" >';
				_html += '<span class="'+homeTextClass+'" style="font-size:0.8em" >Clasificaci&oacute;n</span>';
			_html += '</div>';	

		_html += '</div>';


		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="1"  >';
		
			_html += '<div style="background: #1E5733; height:' + (_heightBotones - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-resultados" style="font-size:'+homeIconSize+'em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:'+homeLineHeight+'px; text-align:center;" >';
				_html += '<span class="'+homeTextClass+'" >Resultados</span>';
			_html += '</div>';	

		_html += '</div>';


		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 load metro" data-index="2" >';	
		
			_html += '<div style="background: #1E5733; height:' + (_heightBotones - 30) + 'px; text-align:center;" >';			
				_html += '<span class="icon-goles_menu" style="font-size:'+homeIconSize+'em; color:#ffffff;"></span>';
			_html += '</div>';
		
			_html += '<div style="background: #1E5733;  height:30px; line-height:'+homeLineHeight+'px; text-align:center;" >';
				_html += '<span class="'+homeTextClass+'" >Goles</span>';
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

				//_html += '<div  id="banner-claro" style="background-image:url(' + _banner + '); background-size:cover; height:' + _heightBanner +'px;" >&nbsp;</div>';
				_html += '<img id="banner-claro" src="' + _banner + '" style="width:100%; height:' + _heightBanner +'px;" >';							
			_html += '</div>';
		_html += '</div>';

		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	
	_fRenderInit();
	
	
	
	
