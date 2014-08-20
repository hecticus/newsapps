
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
		var _limit = 0; 
		var _return = false; 
		
		//row
		_html += '<div class="row" >';
			_html += '<div class="col-md-12 metro load" data-index="1" >';
				_html += '<div id="wrapperx" style="width:' + _width + 'px; height: ' + _heightNoticia  + 'px; ">';
					
					try{
						_json = JSON.parse(window.localStorage.getItem(_jMenu[1].storeKey));
					}catch(e){}
					
				
					if (_json) {
						
						 _limit =  _json.item.length;
						if (_limit > 3) _limit = 3;						 

						_html += '<div class="scrollerx" style="width:' + (_width * _limit) + 'px;  height: ' + _heightNoticia  + 'px;">';
							$.each(_json.item, function(_index, _item) {
							 	if (_index <= (_limit-1)) {
									if (!_item.image) _item.image = '';
									_html += '<div class="slide" style="width:' + (_width - 2) + 'px; height: ' + _heightNoticia  + 'px; line-height: 20px; ">';								
										_html += '<figure>';																												
											//_html += '<div id="home_news_image" style="background-image:url(' + _item.image + '); background-size:cover; height:' + _heightNoticia +'px;" >&nbsp;</div>';
											
											_html += '<img src="' + _item.image + '"  alt="' + _item.titulo + '" style="width:100%; height:' + _heightNoticia +'px;" />';	
											
											_html += '<figcaption>';						
												_html += '<div style="width:15%; height:40px; line-height: 40px; float:left; text-align: center; font-size:'+homeSmallIconsSize+'em; font-weight:bold;">';
													_html += '<span class="icon-noticias"></span>';
												_html += '</div>';												
												_html += '<div style="width:85%; height: 40px; line-height: 20px; float:right;  ">';										
													_html += '<span id="home_news_caption">' + _item.titulo + '</span>';																									
												_html += '</div>';							
											_html += '</figcaption>';
										_html += '</figure>';
									_html += '</div>';	
									
									
									if (_index >= (_limit-1)) {
										_return = true;
									} 
												
								};
								
								if (_return) return true;
								
							});
						_html += '</div>';
						
					};
																	
				_html += '</div>';				
			_html += '</div>';		
		_html += '</div>';
		//row


		_html += '<div class="row" >';
			_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 load metro" style=" text-align: center;">';
			
				/*var _banner = 'img/claro/banner_640.png';		
				if (_width >= 720) _banner = 'img/claro/banner_720.png';			
				if (_width >= 1056)  _banner = 'img/claro/banner_grande.png';
				if (_width >= 1325)  _banner = 'img/claro/banner-claro-1325.png';*/
				var _banner = "";
				if (bannerImages != null && bannerImages[0] != null){
					_banner = bannerImages[0];
				}
				_html += '<img id="banner-main" src="' + _banner + '" style=" display: block; width:width:100%; max-height:' + _heightBanner +'px; margin:0 auto;" >';							
			_html += '</div>';
		_html += '</div>';
		
		if(isLiveTV){
			$('header .container .row .tv').removeClass('hidden');
		}else{
			$('header .container .row .tv').addClass('hidden');
		}

				
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
		_return = false;
		$.each(_json.item, function(_index, _item) {
			if (_index <= (_limit-1)) {
				_fUseImageCache(_item.image);
				if (_index >= (_limit-1)) {
					_return = true;
				} 	
			}
			if (_return) return true;
		});
		
		var myScrollX = new IScroll('#wrapperx', {scrollX:true, scrollY:false, snap: true, snapSpeed: 400, momentum: false, keyBindings: true,click:true,preventDefault:true});
				
		
	};

	
	_fRenderInit();
	
	
	//banner
	var bannerImages = new Array();
	var bannerLink = new Array();
	var currentBannerIndex = 0;
	var currentBannerInterval = 60000;
	getBannerSpecial();
	function getBannerSpecial(){
		var urlBanner = 'http://polla.tvmax-9.com/tvmax/v1/banners/get/all';
		//var urlBanner = 'http://10.0.3.142:9002/tvmax/v1/banners/get/all';
		//console.log("VA AL Banners");
		$.ajax({
			url : urlBanner,
			timeout : 120000,
			success : function(data, status) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				//console.log("Banners DATA: "+JSON.stringify(data));
				var error = data["error"];
				if(error == 0){
					if(data["response"] != null){
						if(data["response"]["interval-banner"] != null){
							currentBannerInterval = data["response"]["interval-banner"];
							console.log("Interval! "+currentBannerInterval);
						}
						var results = data["response"]["banners"];
						//console.log("Banners results: "+JSON.stringify(results));
						bannerImages = new Array();
						bannerLink = new Array();
						currentBannerIndex = 0;
						if(results != null){
							for(var j=0; j<results.length; j++){
								var banner = results[j];
								//Guardamos las imagenes del banner y el link
								var imagesArray = banner["fileList"];
								var indexToUse = 0;
								var minSize = 70000;
								for(var i=0;i<imagesArray.length;i++){
									var diff = getScreenWidth() - imagesArray[i]["width"];
									//console.log("BANNERS: "+getScreenWidth()+" BS: "+imagesArray[i]["width"]);
									if(diff < 0){
										diff = diff*(-1);
									}
									if(diff < minSize){
										minSize = diff;
										indexToUse = i;
									}
								}
								bannerImages.push(imagesArray[indexToUse]["location"]);
								bannerLink.push(banner["link"]);
							}
							if($('#banner-main').length != 0)$('#banner-main').attr('src', bannerImages[currentBannerIndex]);
						}
					}
				}
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log("ERROR Banners DATA: "+thrownError);
			}
		});
	}
	
	//refresh banners
	setInterval(function(){
		getBannerSpecial();
	}, 600000);
	
	
	
	
	
