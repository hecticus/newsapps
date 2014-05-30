	
	var _height =  parseInt(($(window).height() * 40)/100);

	var _fGetImageList = function(_image) {
		var _html = '<figure>';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '" style="width:100%; height:' + _height + 'px;" />';		
		
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



	var _fGetImage = function(_image) {
		var _html = '<figure>';					     					
		if (_image.caption) _html += '<figcaption>'+_image.caption+'</figcaption>';
		_html += '</figure>';
		return _html;
	};
	
	var _fRenderDataContent = function(_url) {
	
		var _html = '<div class="row" >';

		$.each(_jStadiums, function(_index,_stadium) {			
			if (_stadium.url == _url) {							
				_html += '<div class="col-md-12" >';
				_html += '<h2>' + _stadium.title + '</h2>';
				_html += '<img onerror="this.style.display=\'none\'" src="' + _stadium.image + '" alt="' +_stadium.title + '" style="width:100%; height:auto; marging-top:10px;  marging-bottom:10px; "  />';						    
			 	_html += _stadium.datacontent;
			 	_html += '</div>';			
			}
		});

		/*_html += '<div class="col-md-12" >';
		_html += '<span style="font-weight:bold;">' +_copyright + '</span>';
		_html += '</div>';*/
	
		_html += '</div>';
		
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
		$('header .container .row .menu span').addClass('icon-back');
		myScroll2.scrollTo(0,0,0);

	};	
	
	
	var _fRenderInitE = function() {
	
		var _html = '<div class="row" >';
		$.each(_jStadiums, function(_index,_stadium) {
			_html += '<div class="col-md-12 stadium" data-url="' + encodeURI(_stadium.url) + '"  >';
			_html += _fGetImageList({src:_stadium.image,caption:_stadium.title});
			_html += '</div>';
		});		 
		_html += '</div>';
	
	
		/*var _html = '<div class="row" >';
		
		$.each(_jStadiums, function(_index,_stadium) {	
			_html += '<div class="col-md-12 stadium" data-url="' + encodeURI(_stadium.url) + '">';
			_html += '<span>' + _stadium.title + '</span>';				    		
		 	_html += '</div>';		
		});

		_html += '</div>';*/
		
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};

	_fRenderInitE();
			
			
			
			