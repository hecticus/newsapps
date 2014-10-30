	
	var _url = 'http://gatadodia.hecticus.com/garotas';
	var _jParameters = {client:1};
	var _jMenu = [];

	_jMenu.push({index:_jMenu.length, class:'content-home', title:'Inicio', load:'home.html', glyphicon:'icon-home', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-favorites', title:'Meu favorito', load:'favorites.html', glyphicon:'icon-favorites', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-posts', title:'Posts', load:'posts.html', glyphicon:'icon-posts', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-categories', title:'Categories', load:'categories.html', glyphicon:'icon-category', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-woman', title:'Woman', load:'woman.html', glyphicon:'icon-woman', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-signin touch-disable', title:'', load:'signin.html', glyphicon:'icon-signin', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-signup touch-disable', title:'', load:'signup.html', glyphicon:'icon-signup', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-terms touch-disable', title:'', load:'terms.html', glyphicon:'icon-terms', data:false, session:false});
	
	var _jApp = {
		
		refresh: function() {
			
			$('[data-touch="menu"]').removeClass('glyphicon glyphicon-remove');
			$('[data-touch="menu"]').addClass('icon-menu');
			$('.row.menu').addClass('hidden');	

		},
		
		loading: function(_index) {
			var _html =  "<div class='container' style='text-align:center;'>";
				_html += '<div class="row" style="margin-top:100px !important;" >';
					_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="height:' + ($(window).height() - 55) + 'px;" >';
						_html += '<h1 style="margin: 0 auto;">Loading...</h1>';		
					_html += '</div>';
				_html += '</div>';
			_html += '</div>';
			$('main').empty();
			$('main').append(_html);
		},
		
		load: function(_index) {
			
			
			try {

				this.refresh();
				$('body').removeClass();
				$('body').addClass(_jMenu[_index].class);
				$('main').empty();
				$('main').data('',_index);
				this.loading();		
				$('main').load(_jMenu[_index].load);
	
				

			} catch(err) {    	
	  			this.error();
			}
			 		      			
	  	},
	  	
	  	offLine: function() {
	  		
	  	},
	  	
	  	error: function() {
	  		
	  	},
	  	
	  	back: function() {
	  		
	  		if ($('#wrapper2').hasClass('left')) {						
				$('#wrapper2').attr('class','page transition right');							
			}	
			
			this.load(0);
	  	}

	  	   
	};

	var _fValidateTouch = function(_this) {
		if (!$(_this).hasClass('touch-enable')) {
			if($('body').hasClass('touch-disable'))  {
				return false;
			}	
		}
		
		return true;	
	};


	$(document).on('click','[data-touch="load"]', function(e) {
	
		if(_fPreventDefaultClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
			 
		if (!_fValidateTouch(this)) return false;
		
		
		var _load = $(this).data('target');
		var _param = $(this).data('param');
		var _value = $(this).data('value');
		
		
		if ((_param) || (_value)) {
			eval('_jParameters.'+ _param +' = ' + _value);	
		}
		
		_jApp.load(_load);
		
	});

	
	
	$(document).on('click','[data-touch="menu"]', function(e) {

		if(_fPreventDefaultClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}

		if (!_fValidateTouch(this)) return false;	
				
		if($(this).hasClass('icon-menu')) {		
			$(this).removeClass('icon-menu');
			$(this).addClass('glyphicon glyphicon-remove');
			$('.row.menu').removeClass('hidden');
		} else{
			_jApp.refresh();
		}

	});
	
	$(document).on('click','[data-touch="favorite"]', function(e) {
				
		if(_fPreventDefaultClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		
		alert('HELLO!');
		
		var _woman = $(this).data('woman');
		var _data = {'add_woman': [],'remove_woman': []};
		
		if($(this).hasClass('on')) {
			$('[data-touch="favorite"][data-woman="' + _woman + '"]').removeClass('on');
			_data.remove_woman.push(_woman);		
		} else {
			$('[data-touch="favorite"][data-woman="' + _woman + '"]').addClass('on');
			_data.add_woman.push(_woman);		
		}

		_fPostAjaxJson(_url + '/v1/clients/update/' + _jParameters.client,_data) ;
		
	});
	


	var _fRenderListPost =  function(_url) {
		
		var _oAjax = _fGetAjaxJson(_url);
	
		if (_oAjax) {		
			_oAjax.done(function(_json) {

				_html = '';
				$.each(_json.response, function(_index,_item) {
						
					_html += '<div class="row">';
						_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 figure">';
							_html += '<img onerror="this.style.display=\'none\'" src="' + _item.woman.default_photo + '" alt="' +_item.woman.name + '" class="img-rounded"  data-touch="load" data-target="2" data-param="post" data-value="' + _item.id_post+ '" />';									
						_html += '</div>';
						_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 caption">';
							_html += '<h5 style="text-transform: capitalize;">' + _fGetMoment(_item.date).format('MMMM, DD YYYY / hh:mm a') + '</h5>';
							_html += '<p>' + _item.content + '</p>';
						_html += '</div>';
					_html += '</div>';
					
					_html += '<div class="row">';
						_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="height:40px; line-height:40px;" >';
							_html += '<i class="icon icon-material-camera-alt" data-touch="post" data-post="' + _item.id_post + '"></i><span class="badge">' + _item.woman.posts + '</span>';
							_html += '<i class="icon icon-material-group" ></i><span class="badge">' + _item.woman.clients + '</span>';
						_html += '</div>';		
			
						_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="text-align:right; height:40px; line-height:40px;">';
			
							switch(_item.social_network.name) {
							    case 'instagram': _html += '<i class="icon icon-material-post-instagram" style="margin-left:2px;"  onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
							       break;
							    case 'facebook': _html += '<i class="icon icon-material-post-facebook" style="margin-left:2px;" onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
							       break;
							    case 'twitter': _html += '<i class="icon icon-material-post-twitter" style="margin-left:2px;" onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
							       break;
							    default: _html += '<i class="icon icon-material-launch" style="margin-left:2px;" onclick="window.open(\'' + _item.source + '\', \'_blank\', \'location=yes\');"></i>';	
							       break;
							}
			
							_html += '<i class="icon icon-material-favorite ' + (_item.starred ? 'on' : '') + '" data-touch="favorite" data-woman="' + _item.woman.id_woman + '"></i>';
							_html += '<i class="icon icon-material-share-alt" style="margin-left:2px; vertical-align:middle;" onclick="window.plugins.socialsharing.share(\'' + _item.title + '\', null, \'' + _item.woman.default_photo + '\', \'' + _item.source + '\');"></i>';
			
						_html += '</div>';
					_html += '</div>';
					
					_html += '<div class="row">';
						_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" >';
							$.each(_item.woman.categories, function(_index,_item) {
								_html += '<span class="label label-default" data-touch="load" data-target="3" data-param="category" data-value="' + _item.category.id_category + '" style="margin-left:2px; margin-right:2px;">' + _item.category.name + '</span>';
							});
						_html += '</div>';
					_html += '</div>';
					
					_html += '<br />';
						
					$.each(_item.files, function(_index,_file) {					
						var _img = $('img #img').attr('src',_file);				
					});												
						
									
				});		
				
							
				$('#wrapper .scroller .container').empty();
				$('#wrapper .scroller .container').append(_html);


			});
		}
		
		
	};
