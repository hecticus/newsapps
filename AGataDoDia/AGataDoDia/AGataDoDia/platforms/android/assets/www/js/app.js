	
	var _url = 'http://gatadodia.hecticus.com';
	var _jParameters = {};
	var _jMenu = [];
	var _jData = [];
	var _oAjax = false;
	var currentScreen = 0;
	var referer = 0;
	var scrollPosition = 0;
	
	//navigation
	var navigation = [];
	
	_jMenu.push({index:_jMenu.length, class:'content-home', title:'Inicio', load:'home.html', glyphicon:'icon-home', data:false, session:false, exitFromApp:true, returnsTo:-1});
	_jMenu.push({index:_jMenu.length, class:'content-favorites', title:'Meu favorito', load:'favorites.html', glyphicon:'icon-favorites', data:false, session:false, exitFromApp:false, returnsTo:0});
	_jMenu.push({index:_jMenu.length, class:'content-posts', title:'Posts', load:'posts.html', glyphicon:'icon-posts', data:false, session:false, exitFromApp:false, returnsTo:0});
	_jMenu.push({index:_jMenu.length, class:'content-categories', title:'Categories', load:'categories.html', glyphicon:'icon-category', data:false, session:false, exitFromApp:false, returnsTo:0});
	_jMenu.push({index:_jMenu.length, class:'content-woman', title:'Woman', load:'woman.html', glyphicon:'icon-woman', data:false, session:false, exitFromApp:false, returnsTo:0});
	_jMenu.push({index:_jMenu.length, class:'content-signin touch-disable', title:'', load:'signin.html', glyphicon:'icon-signin', data:false, session:false, exitFromApp:true, returnsTo:-1});
	_jMenu.push({index:_jMenu.length, class:'content-signup touch-disable', title:'', load:'signup.html', glyphicon:'icon-signup', data:false, session:false, exitFromApp:false, returnsTo:5});
	_jMenu.push({index:_jMenu.length, class:'content-terms touch-disable', title:'', load:'terms.html', glyphicon:'icon-terms', data:false, session:false, exitFromApp:false, returnsTo:5});
	_jMenu.push({index:_jMenu.length, class:'content-halloffame', title:'', load:'halloffame.html', glyphicon:'icon-halloffame', data:false, session:false, exitFromApp:false, returnsTo:0});
	
	//Punto de entrada de la aplicacion una vez que carguemos la info del cliente
	function startApp(isActive, status){
		
		_oAjax = _fGetAjaxJson(_url + '/garotas/loading');
		if (_oAjax) {
			_oAjax.done(function(_json) {					
				_jMenu[5].data = _json;
			});
		};

		_oAjax = _fGetAjaxJson(_url + '/garotas/v1/posts/get/client/up/' + clientID + '/0');
		if (_oAjax) {
			_oAjax.done(function(_json) {
				_jMenu[0].data = _json;					
			});
		};
					
		/*_oAjax = _fGetAjaxJson(_url + '/garotas/v1/clients/favorites/' + clientID);
		if (_oAjax) {
			_oAjax.done(function(_json) {					
				_jMenu[1].data = _json;
			});
		};*/
		_jMenu[1].data = womenList;
	
		_oAjax = _fGetAjaxJson(_url + '/garotas/v1/women/halloffame');
		if (_oAjax) {
			_oAjax.done(function(_json) {					
				_jMenu[8].data = _json;
			});
		};
		
		
		
		
		if(isActive){
			_jApp.load(6);
		}else{
			if(status == 2){
				//_jApp.load(5); //asi deberia ir
				_jApp.load(5);
			}else{
				//ir a la ventana de signup o mostrar un mensaje y eliminar el boton de prueba
				_jApp.load(6);
			}
		}
	}
	//Si ocurrio un error con la carga del cliente se informa aqui
	function errorStartApp(){
		alert("Error en la app");
		_jApp.back();
	}
	
	var _jApp = {
		
		refresh: function() {
			
			$('[data-touch="menu"]').removeClass('glyphicon glyphicon-remove');
			$('[data-touch="menu"]').addClass('icon-menu');
			$('.row.menu').addClass('hidden');	
			
			if (_oAjax.state() === 'resolved') {			
				$('div.plus i').addClass('icon-material-add-circle');
				$('div.plus i').empty();	
			}
		},
		
		loading: function(_index) {
			
			
		
			
			var _html =  "<div class='container' style='text-align:center;'>";
				_html += '<div class="row" style="margin-top:100px !important;" >';
					_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="height:' + ($(window).height() - 55) + 'px;" >';
						_html += '<i class="icon icon-material-more-horiz" data-touch="plus" ></i>';
					_html += '</div>';
				_html += '</div>';
			_html += '</div>';
		
			
			
			$('main').empty();
			$('main').append(_html);
		},
		
		load: function(_index) {
			pushNavigation(_index);

			referer = currentScreen;
			currentScreen = _index;
			if(currentScreen == 2){
				scrollPosition = _scroll.y;
			}
			try {

				this.refresh();				
				$('body').removeClass();
				$('body').addClass(_jMenu[_index].class);
				$('main').empty();				
				$('main').data('referer', referer);				
				$('main').data('index',_index);
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
	  		var currentPage = popNavigation();
	  		
	  		if ($('#wrapper2').hasClass('left')) {						
				$('#wrapper2').attr('class','page transition right');							
			} else {
				if(currentPage == -1){
					exitApp();
				}else{
					$('main').empty();				
					$('main').data('index', _jMenu[currentScreen].returnsTo);
					$('main').data('referer', currentScreen);
					this.load(_jMenu[currentScreen].returnsTo);
				}
			}
				
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


	$(document).on('click','[data-touch="post"]', function(e) {
	
		if(_fPreventDefaultClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		$('#wrapper2').attr('class','page transition left');
						
		var _load = $(this).data('target');
		var _param = $(this).data('param');
		var _value = $(this).data('value');
		
		if ((_param) || (_value)) {
			eval('_jParameters.'+ _param +' = ' + _value);			
			_fRenderPost();	
		}

	});


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
		
		var _woman = $(this).data('woman');
		var _data = {'add_woman': [],'remove_woman': []};
		var _json = _jMenu[0].data;
		
		var index = -1;
		
		if($(this).hasClass('on')) {
			
			$('[data-touch="favorite"][data-woman="' + _woman + '"]').removeClass('on');
			_data.remove_woman.push(_woman);
			
			$.each(_json.response, function(_index,_item) {
				if (_item.woman.id_woman == _woman) {
					//_item.starred = false;
					index = _index;
				};
			});
			if(index != -1){
				removeWoman(_json.response[index].woman);
			}
			

		} else {
			
			$('[data-touch="favorite"][data-woman="' + _woman + '"]').addClass('on');
			_data.add_woman.push(_woman);
							
			$.each(_json.response, function(_index,_item) {			
				if (_item.woman.id_woman == _woman) {
					//_item.starred = true;
					index = _index;
				};
			});
			if(index != -1){
				addWoman(_json.response[index].woman);
			}
		}

		//_fPostAjaxJson(_url + '/garotas/v1/clients/update/' + clientID,_data);									
		
	});

	//SIMPLE NAVIGATION MANAGER
	function pushNavigation(_index){
		if(_index == 0){
			//home screen
			navigation = [];
		}
		navigation.push(_index);
	}
	
	function popNavigation(){
		var currentPage = -1;
		if(navigation.length > 1){
  			currentPage = navigation[navigation.length-1];
  			navigation.pop();
  		}
		return currentPage;
	}
	
	
	$(document).on('click','[data-touch="plus"]', function(e) {	
		if(_fPreventDefaultClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}									
		_fTouchPlus($(this));
	});

	
	
	var _fRenderHtmlListPost = function(_json,_push) {

		_html = '';
		
		$.each(_json.response, function(__index,_item) {

			if (_push) _jMenu[_index].data.response.push(_item);
			

			_html += '<div class="row post" data-value="' + _item.id_post + '">';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 figure">';					
					_html += '<img onerror="this.onerror=null;this.src=\''+ _item.woman.default_photo + '\'" src="' + _item.files[0] + '" alt="' +_item.woman.name + '" class="img-rounded"  data-touch="load" data-target="2" data-param="post" data-value="' + _item.id_post+ '" />';
					//_html += '<img style="height:' + _item.resolutions[0].height + 'px;" onerror="this.onerror=null;this.src=\''+ _item.woman.default_photo + '\'" src="' + _item.files[0] + '" alt="' +_item.woman.name + '" class="img-rounded"  data-touch="load" data-target="2" data-param="post" data-value="' + _item.id_post+ '" />';
				_html += '</div>';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 caption">';
					_html += '<h5 style="text-transform: capitalize;">' + _fGetMoment(_item.date).format('MMMM, DD YYYY / hh:mm a') + '</h5>';
					_html += '<p>' + _item.content + '</p>';
				_html += '</div>';
			_html += '</div>';
			
			_html += '<div class="row">';
				_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style="height:40px; line-height:40px;" >';										
					_html += '<i class="icon icon-material-camera-alt" data-touch="post" data-param="post" data-target="2" data-value="' + _item.id_post + '" ></i><span class="badge">' + _item.files.length + '</span>';
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
	
					//_html += '<i class="icon icon-material-favorite ' + (_item.starred ? 'on' : '') + '" data-touch="favorite" data-woman="' + _item.woman.id_woman + '"></i>';
					_html += '<i class="icon icon-material-favorite ' + (isWomanFavorite(_item.woman) ? 'on' : '') + '" data-touch="favorite" data-woman="' + _item.woman.id_woman + '"></i>';
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
			
			_html += '<hr style="margin-bottom:0 !important;" />';

		});


	
		if (_json.response.length == 0) {
			_html += '<div class="row" >';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center;" >';
					_html += '<h4>El resultado de la b&uacute;squeda no gener&oacute; ning&uacute;n resultado</h4>';
				_html += '</div>';
			_html += '</div>';
		} else {
			_html += '<div class="row plus" >';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center; margin-top:10px !important; margin-bottom:10px !important;" >';		
					_html += '<i class="icon icon-material-add-circle" data-touch="plus" data-direction="down" ></i>';
				_html += '</div>';
			_html += '</div>';
		}
		
		
		return _html;
		
		
	};
	
	
	
	
	
	
