
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
	var homeTextSmaller = 0.8;
	
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
				homeTextSmaller = 1.8;
			}else{
				homeIconSize = 4;
				homeSmallIconsSize = 1.6;
				homeTextClass = "caption-icon";
				homeTextSmaller = 0.8;
			}
		}else{
			if(getScreenHeight()>2000 || (getPixelDensity() != PD_EXHI && getScreenHeight()>1000)){
				homeIconSize = 8;
				homeSmallIconsSize = 3.3;
				homeTextClass = "caption-icon-tablets";
				homeLineHeight = 0;
				homeTextSmaller = 1.6;
			}else if(getScreenHeight()>1000){
				homeIconSize = 5;
				homeSmallIconsSize = 1.6;
				homeTextClass = "caption-icon";
				homeTextSmaller = 0.8;
			}else{
				homeIconSize = 5;
				homeSmallIconsSize = 1.6;
				homeTextClass = "caption-icon";
				homeTextSmaller = 0.8;
			}
		}

		
		var _html = '';
		var _index = 1; 

		//row
		_html += '<div class="row" >';
			_html += '<div class="col-md-12 metro load" data-index="' + _index + '" >';
				_html += '<div id="wrapperx" style="width:' + _width + 'px; height: ' + _heightNoticia  + 'px; ">';
																						
					var _json = _getJsonNews(_index);
					if (_json) {
						
						var _limit =  _json.item.length;
						if (_limit > 3) _limit = 3;						 
						
						_html += '<div class="scrollerx" style="width:' + (_width * _limit) + 'px;  height: ' + _heightNoticia  + 'px;">';
							$.each(_json.item, function(_index, _item) {
							 	if (_index <= (_limit-1)) {
									if (!_item.imagen) _item.imagen = ''; 													
									_html += '<div class="slide" style="width:' + (_width - 2) + 'px; height: ' + _heightNoticia  + 'px; line-height: 20px; ">';								
										_html += '<figure>';																												
											_html += '<div id="home_news_image" style="background-image:url(' + _item.imagen + '); background-size:cover; height:' + _heightNoticia +'px;" >&nbsp;</div>';
											_html += '<figcaption>';						
												_html += '<div style="width:15%; height:40px; line-height: 40px; float:left; text-align: center; font-size:'+homeSmallIconsSize+'em; font-weight:bold;">';
													_html += '<span class="icon-noticias"></span>';
												_html += '</div>';												
												_html += '<div style="width:85%; height: 40px; line-height: 20px; float:right;  ">';										
													_html += '<span id="home_news_caption">'+_item.titulo+'</span>';																									
												_html += '</div>';							
											_html += '</figcaption>';
										_html += '</figure>';
									_html += '</div>';				
								};
							});
						_html += '</div>';
						
					};
																	
				_html += '</div>';				
			_html += '</div>';		
		_html += '</div>';
		//row


		_html += '<div class="row" >';
			_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 load metro" style=" text-align: center;">';
			
				var _banner = 'img/claro/banner_640.png';		
				if (_width >= 720) _banner = 'img/claro/banner_720.png';			
				if (_width >= 1056)  _banner = 'img/claro/banner_grande.png';
				if (_width >= 1325)  _banner = 'img/claro/banner-claro-1325.png';
			
				_html += '<img id="banner-claro" src="' + _banner + '" style=" display: block; width:auto; height:' + _heightBanner +'px; margin:0 auto;" >';							
			_html += '</div>';
		_html += '</div>';
		
		if(isLiveTV){
			$('header .container .row .tv').removeClass('hidden');
		}else{
			$('header .container .row .tv').addClass('hidden');
		}

		
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

		var myScrollX = new IScroll('#wrapperx', {scrollX:true, scrollY:false, snap: true, snapSpeed: 400, momentum: false, keyBindings: true,click:true,preventDefault:true});
		
	};

	
	_fRenderInit();
	
	
	
	
	
