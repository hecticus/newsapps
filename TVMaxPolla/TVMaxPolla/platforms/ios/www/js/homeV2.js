
	$('#splash').hide();
	$('#mloading').remove();
	$('header').removeClass('hidden');	
	$('.menu').removeClass('hidden');
	
	var _width = 	$(window).width();		
	var _height = 	$(window).height();
	var _json = false;
	_height =  parseInt(_height - 18);
	

	var _fGetImage = function(_image) {
			
		var _html = '<figure>';				     		
		_html += '<img src="' + _image.src + '"  alt="' +_image.src + '" style="width:100%; height:' + parseInt(($(window).height() * 40)/100) + 'px;" />';		
		
		if (_image.caption) {

			_html += '<figcaption>';

			_html += '<div class="block-ellipsis title">';
				_html += _image.caption;
			_html += '</div>';
		
			_html += '<div class="date">';				
				_html += _image.date;
			_html += '</div>';

			_html += '</figcaption>';		

		}
	
		_html += '</figure>';
		return _html;
		
	};



	var _fRenderDataContent = function(_id) {
		
		var _html = '<div class="row" >';
		var _image = false;
		var _return = false;
		
		$.each(_json.item, function(_index,_item) {
			
			if (_item.id == _id) {
			 
				_html += '<div class="col-md-12">';
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
				$('.share').attr('onclick','window.plugins.socialsharing.share(\'' + _item.titulo.replace(/["']/g, "") + '\',\'TvMax-9\',null,\'' + _item.shareURL + '\');');
				
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

	};


	
	var _fRenderInit = function() {

		var _html = '';
		 
		_json = JSON.parse(window.localStorage.getItem(_jMenu[1].storeKey));
		if (_json) {
			_html += '<div class="row" >';
				$.each(_json.item, function(_index, _item) {
					_fUseImageCache(_item.image);
					_html += '<div class="col-md-12 news" data-item="'+_item.id+'"  >';
					_html += _fGetImage({src:_item.image,caption:_item.titulo, date:_item.fecha});
					_html += '</div>';	
				});
			_html += '</div>';
		}


		
		if(isLiveTV){
			$('header .container .row .tv').removeClass('hidden');
		}else{
			$('header .container .row .tv').addClass('hidden');
		}


				
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);


		/*var _banner = 'img/claro/banner_640.png';
		if (_width >= 720) _banner = 'img/claro/banner_720.png';
		if (_width >= 1056)  _banner = 'img/claro/banner_grande.png';
		if (_width >= 1325)  _banner = 'img/claro/banner-claro-1325.png';*/
		var _banner = "";
		var isBanner = false;
		if (bannerImages != null && bannerImages[currentBannerIndex] != null){
			_banner = bannerImages[currentBannerIndex];
			isBanner = true;
		}
		_html = '<img id="banner-main" src="' + _banner + '" style=" display: block; max-width:100%; max-height:' + parseInt((_height * 10)/100) + 'px; margin:0 auto;" >';
		
		
		$('footer').css('height',parseInt((_height * 10)/100) + 'px');
		$('footer').empty();
		$('footer').append(_html);
		if(isBanner){
			$('footer').css('visibility','visible');
		}else{
			$('footer').css('visibility','hidden');
		}


		if (_json) {		
			$.each(_json.item, function(_index, _item) {
				_fUseImageCache(_item.image);
			});		
		}


		_fInitSwipe();


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
							//console.log("Interval! "+currentBannerInterval);
						}
						var results = data["response"]["banners"];
						//console.log("Banners results: "+JSON.stringify(results));
						bannerImages = new Array();
						bannerLink = new Array();
						currentBannerIndex = 0;
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
	
	
	
	
	
