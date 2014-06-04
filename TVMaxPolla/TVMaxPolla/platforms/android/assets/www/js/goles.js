	
	var _height =  parseInt(($(window).height() * 40)/100);

	var _fGetImage = function(_image) {
		
		var _html = '<figure style="background:#E6E6E6;">';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="' + _image.src + '" alt="' +_image.src + '" style="width:100%; height:' + _height + 'px;"  />';
		
		if (_image.caption) {
			
			_html += '<figcaption>';
			
			_html += '<div style="width:80%;  height: 40px; line-height: 20px; float:left; ">';
			_html += '<span>'+_image.caption+'</span>';
			_html += '</div>';
			
			_html += '<div style="width:20%;  height: 40px; line-height: 40px; float:right; text-align: right; font-size:1.6em; font-weight:bold;">';
				_html += '<span class="glyphicon glyphicon-facetime-video"></span>';
			_html += '</div>';
						
			_html += '</figcaption>';		

		}
		
		_html += '</figure>';
		return _html;
	};
	
	var _fRenderListMatch = function() {
		
		/*
		var _html = '<div class="row" >';	
		_oAjax = $.fGetAjaXJSON('http://polla.tvmax-9.com/tvmaxfeeds/calendar/getAll',false,false,false);	
		if (_oAjax) {
			_oAjax.done(function(_json) {
				
				$.each(_json.response, function(_index,_item) {
					
				});
				
				
			});
		}				
		_html += '</div>';
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
		
		*/
		
	};
	
	
	var _fRenderDataContent = function(_expression) {
	
		var _html = '<div class="row" >';	
		_oAjax = $.fGetAjaXJSON2('http://polla.tvmax-9.com/tvmaxfeeds/goals/sorted/team/25',false,false,true);

		if (_oAjax) {
			_oAjax.done(function(_json) {
				
				$.each(_json.response, function(_index,_item) {
					
					$.each(eval('_item.Brasil'), function(_index,_goal) {
						alert(_goal.id_video_kaltura);
					});

					/*$.each(_item, function(_index,_country) {
						alert(_country.id_video_kaltura);
					});*/
						
										 
      				/*	var _aKeys = [];
      					for(var _index in _item) {
      						_aKeys.push(_index);	
      					}*/ 
						
					
      
					
					/*$.each(_item, function(__index,_country) {
						alert(JSON.stringify(_country));	
					});*/
					
					//alert(_index + ' - ' + _item.name);
	 				//for(var _index in _item){ keys.push(kiss); }
	 
					/*$.each(_item, function(__index,_country) {
						alert(_country[__index]);	
					});*/
					
					
					/*var _src = 'http://www.kaltura.com/p/1199011/sp/0/playManifest/entryId/' + _item.id_video_kaltura + '/format/url/flavorParamId/0/video.mp4';
					_html += '<div class="col-md-12 video"  data-src="' + _src + '" >';
					//_html += _fGetImage({src:_item.imagen_gol,caption:_item.player});
					//_html += _fGetImage({src:'http://www.kaltura.com/p/1199011/thumbnail/entry_id/0_xv04xodu/width/610/height/400/type/1/quality/100',caption:_item.player});
					_html += '<span>dddd</span>';
					_html += '</div>';*/
					
				});	
			});
		}
		_html += '</div>';

	
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');

	};
	
	
	
	var _fRenderPhase = function() {

		var _html = '<div class="row" >';	
		$.each(_jPhase, function(_index, _phase) {			
			_html += '<div class="col-md-12 goal" data-phase="' + _phase.name + '" >';
			_html += '<span>' + _phase.name + '</span>';
			_html += '</div>';
		});
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};
	
	
	var _fRenderCountry = function() {
		
		
		
		var _html = '<div class="row" >';
		_oAjax = $.fGetAjaXJSON('http://polla.tvmax-9.com/tvmaxfeeds/goals/sorted/team/25',false,false,true);

		if (_oAjax) {
			_oAjax.done(function(_json) {
				$.each(_json.response, function(_index, _country) {
					
					var _aCountry = [];					
					for(var _index in _country) {
						_aCountry.push(_index); 
					} 																						
					var _name = _aCountry[0];
 
				 	_html += '<div class="col-md-12 " data-country="' + _name + '" >';			
					_html += '<span>' + _name + '</span>';			
					_html += '</div>';

				});
			});
		}

		_html += '</div>';
		

		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
	};
	
	var _fRenderPlayer = function() {
		var _html = '<div class="row" >';
		_jCountry.sort();	
		$.each(_jCountry, function(_index) {			
			
			var _name = _jCountry[_index];
			var _flag = _fgetFlag(_name.toString());
						
			_html += '<div class="col-md-12 data-goal player" data-country="' + _name + '" >';
			//_html += '<img onerror="this.style.display=\'none\'" src="img/flags/' + _flag + '" alt="' + _name + '" style="width:25px; height:auto; margin-left:15px; margin-right:10px; vertical-align: sub;"  />';
			_html += '<span>' + _name + '</span>';		
			_html += '</div>';
			
			
		});
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
	};
	
	
	_fRenderPhase();

