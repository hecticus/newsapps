
	var _height =  parseInt(($(window).height() * 40)/100);
	
	var lastTimeDownloaded = 0;
	

	var _fGetImage = function(_image) {
			
		var _html = '<figure>';				     		
		_html += '<img onerror="this.src=\'img/splash/splash_not_image.png\'" src="' + _image.src + '"  alt="' +_image.src + '" style="width:100%; height:' + parseInt(($(window).height() * 40)/100) + 'px;" />';		
		
		if (_image.caption) {

			_html += '<figcaption>';

			_html += '<div class="block-ellipsis title" >';
				_html += _image.caption;
			_html += '</div>';
		
			_html += '<div class="date" >';				
				_html += _image.date;
			_html += '</div>';

			_html += '</figcaption>';		

		}
	
		_html += '</figure>';
		return _html;
		
	};
	
	function checkIfDataContentExists(_id) {
		var found = false;
		for(var i=0; i<_jGet.item.length; i++){
			if (_jGet.item[i].id == _id) {
				found = true;
				return found;
			}
		}
		return found;
	}
	
	function addPushNews(json){
		_jGet.item.push(json);
	}
	
	//SI se cambia el render hay que cambiar este tambien, esto se tuvo que hacer porque la pagina no se sabe cuando esta cargada y cuando llega un push hay que forzar esto
	var _fRenderDataContentSimple = function(_id, _item) {
		//este es el codigo que muestra una noticia asi que aqui es donde colocaremos el evento
		gaPlugin.trackEvent(successGAHandler, errorGAHandler, "Noticias", "Detalle_"+_jMenu[_iIndex].title, "section", 0);
		//console.log("noticias detalle "+_id);
		
		var _html = '<div class="row" >';
		var _image = false;
		var _return = false;

		_html += '<div class="col-md-12">';
		_image = _item.image;
		_html += _fGetImage({src:_item.image,caption:false});
		_html += '</div>';


		_html += '<div class="col-md-12">';
		_html += '<p class="title">' + _item.titulo + '</p>';				
		_html += '</div>';

		_html += '<div class="col-md-12" >';				
		_html += '<p class="date">' + _fGetFormatDate(_item.fecha) + '</p>';				
		_html += '</div>';
								
		_html += '<div class="col-md-12" >';
		_html += '<p class="fullstory">' + _item.texto + '</p>'; 
		_html += '</div>';				
		
		$('.tv').addClass('hidden');		
		$('.share').removeClass('hidden');						
		//$('.share').attr('onclick','window.plugins.socialsharing.share(\'' + _item.titulo.replace(/["']/g, "") + '\',\'TvMax-9\',null,\'' + _item.shareURL + '\');');
		$('.share').attr('onclick','shareLink(\'' + _item.titulo.replace(/["']/g, "") + '\',\'' + _item.shareURL + '\');');

			
		_html += '</div>';
		
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
		$('header .container .row .menu span').addClass('icon-back');
		myScroll2.scrollTo(0,0,0);
		_fUseImageCache(_image);
		_fInitSwipeContent();
	};

	var _fRenderDataContent = function(_id) {
		//este es el codigo que muestra una noticia asi que aqui es donde colocaremos el evento
		gaPlugin.trackEvent(successGAHandler, errorGAHandler, "Noticias", "Detalle_"+_jMenu[_iIndex].title, "section", 0);
		//console.log("noticias detalle "+_id);
		
		var _html = '<div class="row" >';
		var _image = false;
		var _return = false;
		
		$.each(_jGet.item, function(_index,_item) {
			
			if (_item.id == _id) {

			 
				_html += '<div class="col-md-12">';
				_image = _item.image;
				_html += _fGetImage({src:_item.image,caption:false});
				_html += '</div>';


				_html += '<div class="col-md-12">';
				_html += '<p class="title">' + _item.titulo + '</p>';				
				_html += '</div>';

				_html += '<div class="col-md-12" >';				
				_html += '<p class="date">' + _fGetFormatDate(_item.fecha) + '</p>';				
				_html += '</div>';
										
				_html += '<div class="col-md-12" >';
				_html += '<p class="fullstory">' + _item.texto + '</p>'; 
				_html += '</div>';				
				
				$('.tv').addClass('hidden');		
				$('.share').removeClass('hidden');						
				//$('.share').attr('onclick','window.plugins.socialsharing.share(\'' + _item.titulo.replace(/["']/g, "") + '\',\'TvMax-9\',null,\'' + _item.shareURL + '\');');
				$('.share').attr('onclick','shareLink(\'' + _item.titulo.replace(/["']/g, "") + '\',\'' + _item.shareURL + '\');');
				
				_return = true;
				
			}
			
			if (_return) return true; 
			
		});
			
		_html += '</div>';
		
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
		$('header .container .row .menu span').addClass('icon-back');
		myScroll2.scrollTo(0,0,0);
		_fUseImageCache(_image);
		_fInitSwipeContent();
	};

	var _fRenderInit = function() {

		var _html = '<div class="row" >';
		var _return = false;

		$.each(_jGet.item, function(_index,_item) {				
		 	
			_html += '<div class="col-md-12 news" data-item="'+_item.id+'"  >';
			_html += _fGetImage({src:_item.image,caption:_item.titulo, date:_item.fecha});
			_html += '</div>';
			   
			_fUseImageCache(_item.image);
					 			
		});
		 
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
		_return = false;
		
		_fInitSwipe();
		
		
		var _banner = "";
		var _bHeight = parseInt(($(window).height() * 10)/100);
		var isBanner = false;
		if (bannerImages != null && bannerImages[currentBannerIndex] != null){
			_banner = bannerImages[currentBannerIndex];
			isBanner = true;
		}
		_html = '<img id="banner-main" src="' + _banner + '" style=" display: block; max-width:100%; max-height:' + _bHeight + 'px; margin:0 auto;" >';
		
		
		$('footer').css('height',_bHeight + 'px');
		$('footer').empty();
		$('footer').append(_html);
		
		if(isBanner){
			$('footer').css('visibility','visible');
		}else{
			$('footer').css('visibility','hidden');
		}
		
		_homeWasShowed = true;
	};
	
	
	
	var _iIndex = $('main').data('index');
	var _jGet = false;
	
	_fGetLoadingNews();
		
	if(typeof(window.localStorage) != 'undefined') {
		if (window.localStorage.getItem(_jMenu[_iIndex].storeKey)) {
			_jGet = JSON.parse(window.localStorage.getItem(_jMenu[_iIndex].storeKey));
			_fRenderInit();	
		}	
	} 		
				
	if (_jMenu[_iIndex].update || _jGet == false) {
		_oAjax = $.fGetAjaXJSONNews(_jMenu[_iIndex].stream);
		if (_oAjax) {
			_oAjax.done(function(_json) {

				if(typeof(window.localStorage) != 'undefined') {
					_jMenu[_iIndex].update = false;
					window.localStorage.setItem(_jMenu[_iIndex].storeKey, JSON.stringify(_json.noticias_deportes));
				}
				
				_jGet = _json.noticias_deportes;
				_fRenderInit();
				
				if(_homeWasShowed == true){
					window.setTimeout(function(){newsReadyForPush = true;},500);
				}
									
			});
		} else {
			if (_jGet) {
				_fRenderInit();
			} else{
				_fGetLoadingErrorNews(); 
			}			
		};			
	};
	

	
	if (_iIndex == 0) {
		
		$('footer').removeClass();
		
		//banner
		var bannerImages = new Array();
		var bannerLink = new Array();
		var currentBannerIndex = 0;
		var currentBannerInterval = 60000;
		var bannerChangeInterval = null;
		getBannerSpecial();
		function getBannerSpecial(){
			var urlBanner = 'http://polla.tvmax-9.com/tvmax/v1/banners/get/all';
			//console.log("VA AL Banners");
			$.ajax({
				url : urlBanner,
				timeout : 120000,
				cache : false,
				success : function(data, status) {
					if(typeof data == "string"){
						data = JSON.parse(data);
					}
					var error = data["error"];
					if(error == 0){
						if(data["response"] != null){
							bannerImages = new Array();
							bannerLink = new Array();
							currentBannerIndex = 0;
							if(data["response"]["interval-banner"] != null){
								currentBannerInterval = data["response"]["interval-banner"];
								//console.log("Interval! "+currentBannerInterval);
							}
							if(bannerChangeInterval != null){
								clearInterval(bannerChangeInterval);
							}
							bannerChangeInterval = window.setInterval(function(){
								currentBannerIndex = currentBannerIndex+1;
								if(currentBannerIndex >= bannerImages.length){
									currentBannerIndex = 0;
								}
								if($('#banner-main').length != 0){
									$('footer').css('visibility','visible');
									$('#banner-main').attr('src', bannerImages[currentBannerIndex]);
								}
								
							},currentBannerInterval);
							
							var results = data["response"]["banners"];
							//console.log("Banners results: "+JSON.stringify(results));
							if(results != null && results.length > 0){
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
								
								if($('#banner-main').length != 0){
									$('footer').css('visibility','visible');
									$('#banner-main').attr('src', bannerImages[currentBannerIndex]);
								}
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
		

		
	} else {
		 $('footer').addClass('hidden');
	}
	
	
	
	
	
	
	
