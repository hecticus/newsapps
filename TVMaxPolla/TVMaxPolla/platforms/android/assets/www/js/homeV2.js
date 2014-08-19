
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

			_html += '<div class="block-ellipsis" style="width:100%;  height: 40px; line-height: 20px; float:left; color:#000000; font-size:0.9em; font-weight:bold;">';
				_html += _image.caption;
			_html += '</div>';
		
			_html += '<div style="width:100%; height: 20px; line-height: 20px; float:left; color:#787B7F; font-size:0.7em; ">';				
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
				_html += '<p class="title">' + _item.titulo + '</p>';				
				_html += '</div>';
			 
				_html += '<div class="col-md-12">';
				_image = _item.image;
				_html += _fGetImage({src:_item.image,caption:false});
				_html += '</div>';

				_html += '<div class="col-md-12" >';				
				_html += '<p class="date">' + _fGetFormatDate(_item.fecha) + '</p>';				
				_html += '</div>';

										
				_html += '<div class="col-md-12" >';
				_html += '<p class="fullstory">' + _item.texto + '</p>'; 
				_html += '</div>';				
				
				$('.tv').addClass('hidden');		
				$('.share').removeClass('hidden');						
				$('.share').attr('onclick','window.plugins.socialsharing.share(\'' + _item.titulo.replace(/["']/g, "") + '\',\'TvMax-9\',null,\'http://mundial.tvmax-9.com/noticias/' + _item.id + '/' + _item.id + '\');');
				
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


		var _banner = 'img/claro/banner_640.png';
		if (_width >= 720) _banner = 'img/claro/banner_720.png';
		if (_width >= 1056)  _banner = 'img/claro/banner_grande.png';
		if (_width >= 1325)  _banner = 'img/claro/banner-claro-1325.png';
		_html = '<img id="banner-claro" src="' + _banner + '" style=" display: block; width:auto; height:' + parseInt((_height * 10)/100) + 'px; margin:0 auto;" >';
		
		
		$('footer').css('height',parseInt((_height * 10)/100) + 'px');
		$('footer').empty();
		$('footer').append(_html);

	};

	
	_fRenderInit();
	
	
	//banner
	function getBannerSpecial(){
		var urlBanner = urlServices+'/newsapi/v1/banners/get';
		//var urlBanner = 'http://10.0.3.142:9007/newsapi/v1/banners/get';
		//console.log("VA AL Banners");
		$.ajax({
			url : urlBanner,
			timeout : 120000,
			success : function(data, status) {
				loadFirstPage();
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				//console.log("Banners DATA: "+JSON.stringify(data));
				var error = data["error"];
				if(error == 0){
					var results = data["response"]["banners"];
					//console.log("Banners results: "+JSON.stringify(results));
					if(results != null){
						if(results.length>0){
							var banner = results[0];
							//Guardamos las imagenes del banner y el link
							bannerImages = new Array();
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
							bannerLink = banner["link"];
						}
					}
				}
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log("ERROR Banners DATA: "+thrownError);
				loadFirstPage();
			}
		});
	}
	
	
	
	
	
