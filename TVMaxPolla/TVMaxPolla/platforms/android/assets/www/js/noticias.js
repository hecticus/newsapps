

	var _fGetImage = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '"  />';		
		
		if (_image.caption) {
			
			_html += '<figcaption>';
			
			_html += '<div style="width:80%;  height: 40px; line-height: 20px; float:left;  ">';
				_html += '<span>'+_image.caption+'</span>';
			_html += '</div>';
			
			_html += '<div style="width:20%;  height: 40px; line-height: 40px; float:right; text-align: right; font-size:1.6em; font-weight:bold;">';
				_html += '<span class="icon-lupa"></span>';
			_html += '</div>';
						
			_html += '</figcaption>';		

		}
	
		_html += '</figure>';
		return _html;
	};

	var _fRenderDataContent = function(_id) {
	
		var _html = '<div class="row" >';
		
		$.each(_jGet.item, function(_index,_item) {
			if (_item.id == _id) {
			
				_html += '<div class="col-md-12">';
				_html += '<p class="title">' + _item.titulo + '</p>';				
				_html += '</div>';
			 
				_html += '<div class="col-md-12">';
				_html += _fGetImage({src:_item.imagen,caption:false});
				_html += '</div>';

				_html += '<div class="col-md-12" >';				
				_html += '<p class="date">' + _fGetFormatDate(_item.fecha) + '</p>';

				
				_html += '</div>';
						
				_html += '<div class="col-md-12" style="" >';
				_html += '<p class="description" >' + _item.descripcion + '</p>';
				_html += '</div>';
										
				_html += '<div class="col-md-12" >';
				_html += '<p class="fullstory">' + _item.fullstory + '</p>'; 
				_html += '</div>';				
				
				$('.share').removeClass('hidden');		
				$('.share').attr('onclick','window.plugins.socialsharing.share(\'' + _item.titulo.replace(/["']/g, "") + '\',\'NoticiasTVN\',null,\'http://mundial.tvmax-9.com\');');
				
			}
		});
			
		_html += '</div>';
		
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
		$('header .container .row .menu span').addClass('icon-back');

	};

	var _fRenderInit = function() {
	
		var _html = '<div class="row" >';

		$.each(_jGet.item, function(_index,_item) {				
		 	if (_index <= 10) {		 	
				_html += '<div class="col-md-12 news" data-item="'+_item.id+'"  >';
				_html += _fGetImage({src:_item.imagen,caption:_item.titulo});
				_html += '</div>';
			}		 			
		});
		 
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	var _iIndex = $('main').data('index');
	_jGet = _jMenu[_iIndex].json;
	
	if (_jGet) {
		_fRenderInit();
	} else {
	
		_oAjax = $.fGetAjaXJSON('http://mundial.tvmax-9.com/_modulos/json/noticias_mundial.php',false,false,true);	
		if (_oAjax) {
			_oAjax.done(function(_json) {
				_jMenu[_iIndex].json = _json.noticias_mundial;	
				_jGet = _json.noticias_mundial;		
				_fRenderInit();
			});
		}
	
	}
	
	

	

