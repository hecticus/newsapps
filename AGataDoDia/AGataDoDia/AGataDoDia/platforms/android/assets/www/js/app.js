	
	var _url = 'http://gatadodia.hecticus.com';
	var _jParameters = {};
	var _jMenu = [];
	var _jData = [];
	var _oAjax = false;
	var currentScreen = 0;
	var referer = 0;
	var scrollPosition = 0;
	var _background = false;
	//navigation
	var navigation = [];
	
	_jMenu.push({index:_jMenu.length, class:'content-home', title:'Inicio', load:'home.html', glyphicon:'icon-home', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-favorites', title:'Meu favorito', load:'favorites.html', glyphicon:'icon-favorites', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-posts', title:'Posts', load:'posts.html', glyphicon:'icon-posts', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-categories', title:'Categories', load:'categories.html', glyphicon:'icon-category', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-woman', title:'Woman', load:'woman.html', glyphicon:'icon-woman', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-init not-header', title:'', load:'init.html', glyphicon:'icon-init', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'', title:'', load:'', glyphicon:'', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-terms not-header', title:'', load:'terms.html', glyphicon:'icon-terms', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-halloffame', title:'', load:'halloffame.html', glyphicon:'icon-halloffame', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-offline not-header', title:'', load:'offline.html', glyphicon:'icon-offline', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-error not-header', title:'', load:'error.html', glyphicon:'icon-error', data:false, session:false});
	
	
	//offline
	function startAppOffline(){
		_jApp.offLine();
	}
	
	//Punto de entrada de la aplicacion una vez que carguemos la info del cliente
	function startApp(isActive, status){



		console.log("LOADING: "+_url + '/garotas/loading/'+getRealWidth()+'/'+getRealHeight());
		_oAjax = _fGetAjaxJson(_url + '/garotas/loading/'+getRealWidth()+'/'+getRealHeight());
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
					
		_jMenu[1].data = womenList;
	
		_oAjax = _fGetAjaxJson(_url + '/garotas/v1/women/halloffame');
		if (_oAjax) {
			_oAjax.done(function(_json) {					
				_jMenu[8].data = _json;
			});
		};

		if(isActive){
			_jApp.load(0,true);
		}else{
			if(status == 2){
				//_jApp.load(5); //asi deberia ir
				_jApp.load(5,true);
			}else{
				//ir a la ventana de signup o mostrar un mensaje y eliminar el boton de prueba
				_jApp.load(6,true);
			}
		}
	}
	//Si ocurrio un error con la carga del cliente se informa aqui
	function errorStartApp(){		
		_jApp.error();
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
		
		loading: function() {
				
			var _html =  "<div class='container' style='text-align:center;'>";
				_html += '<div class="row" style="margin-top:100px !important;" >';
					_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="height:' + ($(window).height() - 55) + 'px;" >';
						//_html += '<i class="icon icon-material-more-horiz" data-touch="plus" ></i>';
					_html += '</div>';
				_html += '</div>';
			_html += '</div>';
		
			
			
			$('main').empty();
			$('main').append(_html);
		},
		
		load: function(_index, pushing) {
			console.log("GOTO: "+_index);

			if(pushing) pushNavigation(_index);

			referer = currentScreen;
			currentScreen = _index;
			if(currentScreen == 2){
				scrollPosition = _scroll.y;
			}
			try {
				
				document.body.style.backgroundImage="none";
				
				if (_fPhonegapIsOnline()) {
					
					this.refresh();				
					$('body').removeClass();
					$('body').addClass(_jMenu[_index].class);
					$('main').empty();				
					$('main').data('referer', referer);				
					$('main').data('index',_index);
					this.loading();	
					$('main').load(_jMenu[_index].load).fadeIn(1000);
	
					if (!$('body').hasClass('content-home')) {					
						if (!$('body').hasClass('touch-disable')) {
							$('[data-touch="menu"]').removeClass('icon-menu');
							$('[data-touch="menu"]').addClass('glyphicon glyphicon-remove'); 
						}
					}

				} else {
					this.offLine();	
				}

			} catch(err) {    	
	  			this.error();
			}
			 		      			
	  	},
	  	
	  	offLine: function() {
	  		$('body').removeClass();
			$('body').addClass(_jMenu[9].class);
			$('main').empty();				
			$('main').data('referer', 0);				
			$('main').data('index',9);
			$('main').load(_jMenu[9].load).fadeIn(1000);
	  	},
	  	
	  	error: function() {
	  		
	  		$('body').removeClass();
			$('body').addClass(_jMenu[10].class);
			$('main').empty();				
			$('main').data('referer', 0);				
			$('main').data('index',10);
			$('main').load(_jMenu[10].load).fadeIn(1000);
	  	},
	  	
	  	back: function() {
	  		var currentPage = popNavigation();
	  		
	  		if ($('#wrapper').hasClass('left')) {						
				$('#wrapper').attr('class','page transition right');									
			} else {
				if(currentPage == -1){
					exitApp();
				}else{
					$('main').empty();				
					$('main').data('index', currentPage);
					$('main').data('referer', currentScreen);
					this.load(currentPage,false);
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

	$(document).on('click','[data-touch="exit"]', function(e) {
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,true)) {return false;}
		exitApp();
	});


	$(document).on('click','[data-touch="post"]', function(e) {
	
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,true)) {return false;}
		$('#wrapper2').attr('class','page transition left');
						
		var _load = $(this).data('target');
		var _param = $(this).data('param');
		var _value = $(this).data('value');
		
		if ((_param) || (_value)) {
			eval('_jParameters.'+ _param +' = ' + _value);			
			_fRenderPost();	
		}

	});

	$(document).on('click','[data-touch="page"]', function(e) {
		
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,false)) {return false;}
		$('#wrapper').attr('class','page transition left');	
		_scroll.scrollTo(0,0,0);	
	});


	$(document).on('click','[data-touch="load"]', function(e) {
	
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,true)) {return false;}
			 
		if (!_fValidateTouch(this)) return false;
		
		loadNextPage($(this)); 
		
	});
	//IOS ONLY
	$(document).on('touchend','[data-touch="load-touchend"]', function(e) {
			   
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,false)) {return false;}
		   
		if (!_fValidateTouch(this)) return false;
		   
		loadNextPage($(this));  	   
	});
	function loadNextPage(obj){
		var _load = obj.data('target');
		var _param = obj.data('param');
		var _value = obj.data('value');
		var _woman = obj.data('woman');
		var _womanName = obj.data('woman-name');
		   
		if (_woman) _jParameters.woman =  _woman;
		if (_womanName) _jParameters.womanName =  _womanName;
		if ((_param) || (_value)) eval('_jParameters.'+ _param +' = ' + _value);
		   
		_jApp.load(_load,true);
	}
	
	
	$(document).on('click','[data-touch="menu"]', function(e) {

		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,false)) {return false;}

		if (!$('body').hasClass('content-home')) {
			_jApp.back();
		} else {
		
			if (!_fValidateTouch(this)) return false;	
					
			if($(this).hasClass('icon-menu')) {		
				$(this).removeClass('icon-menu');
				$(this).addClass('glyphicon glyphicon-remove');
				$('.row.menu').removeClass('hidden');
			} else{
				_jApp.refresh();
			}
		
			
		}
	});
	
	
	$(document).on('click','[data-touch="favorite"]', function(e) {
				   
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,true)) {return false;}
		
		setFavorite($(this),"favorite");
		
	});
	//IOS ONLY
	$(document).on('touchend','[data-touch="favorite-touchend"]', function(e) {
			   
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,false)) {return false;}
			   
		setFavorite($(this),"favorite-touchend");
			   
	});

	function setFavorite(favObj,type){
		var _woman = favObj.data('woman');
		var _data = {'add_woman': [],'remove_woman': []};
		var _json = _jMenu[0].data;
		
		var index = -1;
		
		if(favObj.hasClass('on')) {
			
			$('[data-touch="'+type+'"][data-woman="' + _woman + '"]').removeClass('on');
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
			
			$('[data-touch="'+type+'"][data-woman="' + _woman + '"]').addClass('on');
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
		

	}

	$(document).on('click','[data-touch="back"]', function(e) {
		
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,false)) {return false;}
			 
		if (!_fValidateTouch(this)) return false;
	
		_jApp.back();
		
	});
	
	//signup clicks
	$(document).on('click','[data-touch="send_msisdn"]', function(e) {
		
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,false)) {return false;}
		
		var _btn = $(this).button('loading');		
		var _msisdn = $('#msisdnInput').val();
		
		if(saveClientMSISDN(""+_msisdn)){
			if (sendInfoSignup(null, true)) {				
				setTimeout(function(){					
					_btn.button('reset');	
				}, 5000);
			} else {
				setTimeout(function(){					
					_btn.button('reset');	
				}, 5000);
			}							
		}else{
			_fAlert('MSISDN incorreto, Inst&acirc;ncia: #########');
			_btn.button('reset');			
		}

	});
	
	$(document).on('click','[data-touch="send_pass"]', function(e) {
		
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,false)) {return false;}

		var _btn = $(this).button('loading');	
		var _pass = $('#passwordInput').val();
		
		if(_pass != null && _pass != ""){
			if  (sendInfoSignup(_pass, false)) {
				setTimeout(function(){					
					_btn.button('reset');	
				}, 5000);	
			} else {
				setTimeout(function(){					
					_btn.button('reset');	
				}, 5000);
			}		
		}else{
			_fAlert('Senha incorreta');
			_btn.button('reset');	
		}
		
		
	});

	//SIMPLE NAVIGATION MANAGER
	function pushNavigation(_index){
		if(_index == 0){
			//home screen
			navigation = [];
		}
		if(navigation[navigation.length-1] != _index){
			navigation.push(_index);
		}
	}
	
	function popNavigation(){
		var currentPage = -1;
		if(navigation.length > 1){
			navigation.pop();
  			currentPage = navigation[navigation.length-1];
  		}
		return currentPage;
	}
	
	
	$(document).on('click','[data-touch="plus"]', function(e) {	
		if(_fPreventDefaultClick(e)){return false;}
		if(checkBadTouch(e,false)) {return false;}
		_fTouchPlus($(this));
	});

	var _fRenderHtmlListPostError = function() {
		var _html = '<div class="row" >';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center;" >';
					_html += '<h4>Nenhum resultado encontrado para a sua pesquisa</h4>';
				_html += '</div>';
			_html += '</div>';
		
		return _html;
	};

	var _fRenderHtmlListPostNone = function() {
		var _html = '<div class="row plus" >';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center; margin-top:10px !important; margin-bottom:10px !important;" >';		
					_html += '<i class="icon icon-material-add-circle" data-touch="plus" data-direction="down" ></i>';
				_html += '</div>';
			_html += '</div>';
		
		return _html;
	};
	
	var _fRenderHtmlListPost = function(_json,_push) {

		var _html = '';
		var _index = $('main').data('index');
	
		$.each(_json.response, function(__index,_item) {

			if (_push) {											
				_jMenu[_index].data.response.push(_item);				
			}
	
			

			_html += '<div class="row post" data-value="' + _item.id_post + '" style="border-bottom: 3pt solid #777777 !important;" >';

				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 figure" style="border-bottom: 3pt solid #777777 !important;" >';					
					_html += '<img  data-woman="' + _item.woman.id_woman + '" data-woman-name="' + _item.woman.name + '"  onerror="this.onerror=null;this.src=\''+ _item.woman.default_photo + '\'" data-src="' + _item.files[0] + '" alt="" class="img-rounded"  data-touch="load" data-target="2" data-param="post" data-value="' + _item.id_post + '"  />';									
				_html += '</div>';

				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 caption" style="padding:10px !important; border-bottom: 1pt solid #777777 !important;">';

					_html += '<h3 style="margin-top:0px !important;">' + _item.woman.name + '</h3>';
					_html += '<h5>' + _item.content + '</h5>';
					
					_html += '<p>';
						_html += '<i class="icon icon-material-access-time" style="font-size:1.2em; margin-left: 0px !important; text-transform: capitalize;"></i>' + _fGetMoment(_item.date, "YYYYMMDD").fromNow();
						_html += ' | <i class="icon icon-material-camera-alt" style="font-size:1.2em; margin-left: 0px !important; text-transform: capitalize;"></i><span class="badge">' + _item.files.length + '</span>';
						_html += ' | <i class="icon icon-material-favorite-outline" style="font-size:1.2em; margin-left: 0px !important; text-transform: capitalize;"></i><span class="badge">' + _item.woman.clients + '</span>';												
					_html += '</p>';

				_html += '</div>';
				
				
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 caption" style="padding:10px !important; ">';
					
					_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" >';
						_html += '<p>';					
							$.each(_item.woman.categories, function(_index,_item) {
								_html += '<span class="label label-default" data-touch="load" data-target="3" data-param="category" data-value="' + _item.category.id_category + '" >' + _item.category.name + '</span>';
							});					
						_html += '</p>';
					_html += '</div>';
					
					_html += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"  >';
					
						_html += '<p style="text-align:right;">';
						
							var socialClass = "";
							switch(_item.social_network.name) {
							    case 'instagram': socialClass = "icon-material-post-instagram";	
							       break;
							    case 'facebook': socialClass = "icon-material-post-facebook";	
							       break;
							    case 'twitter': socialClass = "icon-material-post-twitter";	
							       break;
							    default: socialClass = "icon-material-launch";	
							       break;
							}
							
							var fileImage = _item.woman.default_photo;
							if(_item.files[0] != null && _item.files[0] != ""){
								fileImage = _item.files[0];
							}
						
							_html += '<i class="icon '+socialClass+'" style="font-size:1.8em; margin-left:22px;" onclick="openSocialApp(\''+_item.social_network.name+'\',\''+ _item.source + '\');"></i>';	
							_html += '<i class="icon icon-material-favorite ' + (isWomanFavorite(_item.woman) ? 'on' : '') + '" style="font-size:1.8em; margin-left:22px;" data-touch="favorite" data-woman="' + _item.woman.id_woman + '"></i>';
							_html += '<i class="icon icon-material-share-alt" style="font-size:1.8em; margin-left:22px;" onclick="sharePost(\'' + _item.title + '\', \'' + fileImage + '\', \'' + _item.source + '\');"></i>';
		
						_html += '</p>';
					
					_html += '</div>';
					
				_html += '</div>';

			_html += '</div>';


			$.each(_item.files, function(_index,_file) {
				var _img = new Image();
    			_img.src =  _file;        		        		         		
		    	_img.onload = function() {		    				    
		    		//console.log(_file);
		    	};
			});


		});

		
		if (_json.response.length == 0) {
			_infinite = false;
			if ($('div.post').length == 0) _html += _fRenderHtmlListPostError();
		} else {
			_html += _fRenderHtmlListPostNone();
		}
		
		
		
		return _html;
		
		
	};
	
	
	
	
	
	
