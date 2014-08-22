
	var _height =  parseInt(($(window).height() * 40)/100);
	
	var lastTimeDownloaded = 0;
	

	var _fGetImage = function(_image) {
			
		var _html = '<figure>';				     		
		_html += '<img src="' + _image.src + '"  alt="' +_image.src + '" style="width:100%; height:' + parseInt(($(window).height() * 40)/100) + 'px;" />';		
		
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

	var _fRenderDataContent = function(_id) {
		//este es el codigo que muestra una noticia asi que aqui es donde colocaremos el evento
		gaPlugin.trackEvent(successGAHandler, errorGAHandler, "noticias", "detalle", "section", _id);
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
				$('.share').attr('onclick','window.plugins.socialsharing.share(\'' + _item.titulo.replace(/["']/g, "") + '\',\'TvMax-9\',null,\'http://tvmax-9.com/deportes/noticias_detalle.asp?id=' + _item.id + '\');');
				
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

		var _html = '<div class="row" >';
		var _return = false;

		$.each(_jGet.item, function(_index,_item) {				
		 	
		 	if (_index <= 10) {
				_html += '<div class="col-md-12 news" data-item="'+_item.id+'"  >';
				_html += _fGetImage({src:_item.image,caption:_item.titulo, date:_item.fecha});
				_html += '</div>';
				_return = true;
			}
			
			if (_return) return true; 
					 			
		});
		 
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
		_return = false;
		
		 
		$.each(_jGet.item, function(_index,_item) {
							
		 	if (_index <= 10) {
		 		_fUseImageCache(_item.image);
		 		_return = true;
			};
			
			if (_return) return true;
					 			
		});
		

		window.setTimeout(function(){newsReadyForPush = true;},500);		
		_fInitSwipe();
		
		
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
									
			});
		} else {
			if (_jGet) {
				_fRenderInit();
			} else{
				_fGetLoadingErrorNews(); 
			}			
		};			
	};
	
	
	
	
	
	
	
	
