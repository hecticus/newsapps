	var lastClicked = 0;

	//CALENDARIO JS
	$(document).on('touchend','.calendar', function(e) {
		preventBadClick(e);
		eval($(this).data('function'));		
		$('.calendar').removeClass('active');	
		$(this).addClass('active');
		$('#wrapper2').attr('class','page transition right');
		myScroll.scrollTo(0,0,0);
		myScroll2.scrollTo(0,0,0);		
	});
	
	$(document).on('click','.match', function(e) {
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		if ($(this).data('phase')) {
			_fRenderDataContent('_item.fase.search("' + $(this).data('phase') + '") >= 0');		
		} else if ($(this).data('country')){
			_fRenderDataContent('(_item.equipo_local.search("' + $(this).data('country') + '") >= 0  ) || ( _item.equipo_visitante.search("' + $(this).data('country') + '") >= 0)');	
		} else {			
			_fRenderDataContent('_iDate == "' + $(this).data('date') + '"');
		}
		
		myScroll.scrollTo(0,0,0);
		myScroll2.scrollTo(0,0,0);

	});
	
	
	//HISTORY JS
	$(document).on('click','.history', function(e) {					
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});
	
	//INDEX JS
	$(document).on('touchend','.menu, .logo', function(e) {
		preventBadClick(e);

		if ($('header .container .row .menu span').hasClass('icon-back') && $('body').hasClass('content-signin')) {
			backFromRegister()			
		} else if ($('header .container .row .menu span').hasClass('icon-back') && $('body').hasClass('content-signup')) {
			backFromRegister()			
		} else if ($('header .container .row .menu span').hasClass('icon-back')) {
			_fSetBack();			
		} else if ($('#wrapperM').hasClass('right')) {
			$('#wrapperM').attr('class','page transition left');	
		} else {
			$('#wrapperM').attr('class','page transition right');
		}
		myScrollM.scrollTo(0,0,0);
		
		
	});
	$(document).on('click','.load', function(e) {
		
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		clearTimeout(_mTimeout);			
		
		if(_oAjax && _oAjax.readystate != 4) {
			_oAjax.abort();
    	}

		_fSetBack();
		var _this = $(this);
		
		
			
		if (_this.data('index') == 'fb') {
			loginByFacebook();
		} else {
								
			if(_jMenu[_this.data('index')].class == 'content-polla' 
				|| _jMenu[_this.data('index')].class == 'content-alertas'){
				//revisamos si esta hay client data
				if(loadClientData() == null){
					navigator.notification.alert("Para entrar a esta sección debes estar registrado, entra en Menú/Ingresar", doNothing, "Alerta", "OK");
					return false;
				}
			}
			
			
			$('body').removeClass();
			$('body').addClass(_jMenu[_this.data('index')].class);
			$('main').empty();
			$('main').data('index',_this.data('index'));	
			$('.title').html('<span>' + _jMenu[_this.data('index')].title + '</span>');						
			$('main').load(_jMenu[_this.data('index')].load);	
			$('#wrapperM').attr('class','page transition left');

			
		}
		
		return false;
	
	});
	$(document).on('click','.video', function(e) {
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		window.videoPlayer.play($(this).data('src'));
	});
	$(document).on('click','.tv', function(e) {
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		window.videoPlayer.play("http://urtmpkal-f.akamaihd.net/i/0s75qzjf5_1@132850/master.m3u8");
	});
	
	//NOTICIAS JS
	$(document).on('click','.news', function(e) {	
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		_fRenderDataContent($(this).data('item'));		
	});
	
	//PLAYERS JS
	$(document).on('click','.player', function(e) {	
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});
	

	//POLLA JS
	$(document).on('click','.content-polla-menu[data-group]', function(e) {
		if(preventBadClick(e)){return false;}	
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		var _group = $(this).data('group');
		$('.group').addClass('hidden');		
		$('.group[data-group="'+_group+'"]').removeClass('hidden');
		$('#wrapper2').attr('class','page transition right');
	});
	
	$(document).on('click','.content-polla-menu[data-group]', function(e) {
		if(preventBadClick(e)){return false;}	
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		var _group = $(this).data('group');
		$('.group').addClass('hidden');		
		$('.group[data-group="'+_group+'"]').removeClass('hidden');
		$('#wrapper2').attr('class','page transition right');
	});
	
	$(document).on('click','.menu-group', function(e) {	
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		$('#wrapper2').attr('class','page transition left');
		myScroll2.scrollTo(0,0,0);
	});


	$(document).on('touchend','.save', function() {
		//preventBadClick(e);
		 
		
		$('#polla-save').html('CARGANDO...');
		var _iClient = loadClientData().id_social_clients;
		var _jSave = {idClient:_iClient,idLeaderboard:1,clientBet:{matches:[]}};
		var _phase = $('.phase:visible').data('phase');

		$('.row.phase:visible .group .game').each(function(index) {	
			var _goal = {team_a:0,team_b:0};
			_goal.team_a = $(this).find('.score .team.team-a .goal').data('goal');
			_goal.team_b = $(this).find('.score .team.team-b .goal').data('goal');	
			var _game =  $(this).data('game');
			//revisamos quien fue el ganador y ajustar los datos
			var draw = false;
			var team_a_id = $(this).find('.score .team.team-a').data('team');
			var team_b_id = $(this).find('.score .team.team-b').data('team');
			if(_goal.team_a == _goal.team_b && _phase == 1){
				draw=true;
			}
			if(_goal.team_a < _goal.team_b){
				_jSave.clientBet.matches.push({'id_match': _game ,'id_team_winner':team_b_id, 'id_team_loser':team_a_id, 'score_winner': _goal.team_b,'score_loser': _goal.team_a, 'draw':draw});
			}else{
				_jSave.clientBet.matches.push({'id_match': _game ,'id_team_winner':team_a_id, 'id_team_loser':team_b_id, 'score_winner': _goal.team_a,'score_loser': _goal.team_b, 'draw':draw});
			}			
		});


		//alert(JSON.stringify(_jSave));
		//console.log(JSON.stringify(_jSave));
		
		_oAjax = $.fPostAjaXJSONSave(_basePollaURL+'/matchesapi/v1/clientbet/save',_jSave);	
		if (_oAjax) {
		
			_oAjax.always(function () {				
				//_this.html('GUARDAR');
				$('#polla-save').html('GUARDAR');	
			});	
		
			_oAjax.done(function(_msg) {
				if (_msg.error==0) {
					navigator.notification.alert("Bien! Tu pronostico se ha guardado con exito.", doNothing, "Guardar", "OK");
					//alert('Bien! Tu pronostico se ha guardado con exito.');
				} else {
					navigator.notification.alert("Error! Tu pronostico no se ha logrado guardar; Vuelve a intentarlo.", doNothing, "Alerta", "OK");
					//alert('Error! Tu pronostico no se ha logrado guardar; Vuelve a intentarlo.');	
				}
			});
			
			_oAjax.fail(function() {				
				$('#polla-save').html('ERROR');	
			});	
			
		} else {			
			$('#polla-save').html('GUARDAR');
		}

	});


	$(document).on('touchend','.add', function(e) {
		preventBadClick(e);	
		var _tGoal = $(this).parent().data('goal');
		_tGoal = parseInt(_tGoal + 1);
		$(this).parent().data('goal',_tGoal);
		$(this).parent().find('.score').html(_tGoal);
	});
	
	$(document).on('touchend','.sub', function(e) {
		preventBadClick(e);	
		var _tGoal = $(this).parent().data('goal');
		_tGoal = parseInt(_tGoal - 1);					
		if (_tGoal <= 0)  _tGoal = 0;					
		$(this).parent().data('goal',_tGoal);
		$(this).parent().find('.score').html(_tGoal);
	});	
	

	$(document).on('touchend','.back', function(e) {	
		preventBadClick(e);									
		var _group = $('.group:visible').data('group');
																	
		//if (_group >= 2) {
		if (_group >= _pollaMinGroup+1) {
			$('.group').addClass('hidden');
			$('.group[data-group="'+_group+'"]').prev().removeClass('hidden');	
		}
		
		_group = $('.group:visible').data('group');						
		//if (_group == 1) $('.back').addClass('hidden');																
		myScroll.scrollTo(0,0,0);
						
	});
	
	$(document).on('touchend','.next', function(e) {
		preventBadClick(e);									
		var _group = $('.group:visible').data('group');
		//if (_group <= 7) {
		if (_group <= _pollaMaxGroup-1) {
			$('.group').addClass('hidden');
			$('.group[data-group="'+_group+'"]').next().removeClass('hidden');
			myScroll.scrollTo(0,0,0);	
		}
	});
	
	$(document).on('click','.row.group', function(e) {
		if(preventBadClick(e)){return false;}	
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		$('.goal').removeClass('gol');
		$('.add, .sub').addClass('hidden');

	});
	
	$(document).on('click','.flag', function(e) {
		if(preventBadClick(e)){return false;}	
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		$('.goal').removeClass('gol');
		$('.add, .sub').addClass('hidden');
		
		var _team = $(this).parent().data('team');
		var _game = $(this).parents('.row.game').data('game');
		var _goal = $('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').data('goal');
		
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .add').removeClass('hidden');
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .sub').removeClass('hidden');
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').addClass('gol');

	});
	
	$(document).on('click','.goal', function(e) {
		if(preventBadClick(e)){return false;}	
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		$('.goal').removeClass('gol');
		$('.add, .sub').addClass('hidden');
		
		var _team = $(this).parents('.team').data('team');
		var _game = $(this).parents('.row.game').data('game');
		var _goal = $('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').data('goal');
		
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .add').removeClass('hidden');
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .sub').removeClass('hidden');
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').addClass('gol');


	});
	
	//BANNER
	$(document).on('click','#banner-claro', function(e) {
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		window.open("http://www.claro.com.pa/wps/portal/pa/pc/personas/tv/claro-tv/#info-02", '_system', 'closebuttoncaption=regresar');	
	});
	
	//STADIUMS JS
	$(document).on('click','.stadium', function(e) {
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});
	
	//TEAMS JS
	$(document).on('click','.teams', function(e) {
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		_fRenderDataContent(decodeURI($(this).data('gene')));	
	});
	
	//GENERAL
	/*function preventBadClick(e){
		try{e.preventDefault();}catch(ex){}
		try{e.stopPropagation();}catch(ex){}
		try{e.stopImmediatePropagation();}catch(ex){}
	}*/
	function preventBadClick(e){
		try{e.preventDefault();}catch(ex){}
		try{e.stopPropagation();}catch(ex){}
		try{e.stopImmediatePropagation();}catch(ex){}
		//console.log("getCurrentTimeMillis():"+getCurrentTimeMillis()+" lastClicked:"+lastClicked);
		if(lastClicked != 0 &&  getCurrentTimeMillis()-lastClicked  < 500){
			//lastClicked = getCurrentTimeMillis();
			return true;
		}else{
			lastClicked = getCurrentTimeMillis();
			return false;
		}
	}
	
	$(document).on('touchend','#signIn', function(e) {
		

		var _email = $('#form-signIn #email').val();
		var _password = $('#form-signIn #password').val();
		var _return = false;
		
		if (!_email.match(/[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/)) {
			navigator.notification.alert("El email es un campo obligatorio. Compruebe que es correcto.", doNothing, "Ingresar", "OK");
			_return = true;
		}
				
		if (_return) return false;		
		
		if (_password.length == 0 || /^\s+$/.test(_password)) {
    		navigator.notification.alert("El password es un campo obligatorio", doNothing, "Ingresar", "OK");
    		_return = true;
		}

		if (_return) return false;

		
		

		var _html = $('#signIn').html(); 
		$(this).html('Cargando...');
	
		_jData.push_id = _email;
		_jData.userLogin = _email;
		_jData.userPass =_password;

		
		_oAjax = $.fPostAjaXJSON('http://api.hecticus.com/KrakenSocialClients/v1/client/login',_jData);	
		if (_oAjax) {
		
			_oAjax.always(function () {					
				$('#signIn').html(_html);					
			});	
		
			_oAjax.done(function(_json) {			
				if (_json.response.length == 0) {
					//alert('No existe');
					navigator.notification.alert("El cliente no existe, debe registrarse primero", doNothing, "Ingresar", "OK");
				} else {
					saveClientData(_json.response[0]);						
					_fSetLoadInit();						
				}			   
			});
			
			_oAjax.fail(function() {
				$('#signIn').html(_html);
			});	
			
		}
			
	
		

		
		
					
					
		
	});

	$(document).on('click','#facebookLoginButton', function(e) {	
		navigator.notification.activityStart("Cargando informacion", "Cargando...");
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		loginByFacebook();
	});


	$(document).on('touchend','#signUp', function(e) {
		

		var _email = $('#form-signUp #email').val();
		var _password = $('#form-signUp #password').val();
		var _name = $('#form-signUp #name').val();
		var _surName = $('#form-signUp #surname').val();
		var _nick = _name + ' ' + _surName;
		var _return = false;

		
		if (!_email.match(/[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/)) {
    		navigator.notification.alert("El email es un campo obligatorio. Compruebe que es correcto.", doNothing, "Registro", "OK");
    		_return = true;
		}

		if (_return) return false;
		
		if (_name.length == 0 || /^\s+$/.test(_name)) {
    		navigator.notification.alert("El nombre es un campo obligatorio", doNothing, "Registro", "OK");
    		_return = true;
		}
		
		if (_return) return false;
		
		if (_surName.length == 0 || /^\s+$/.test(_surName)) {
    		navigator.notification.alert("El apellido es un campo obligatorio", doNothing, "Registro", "OK");
    		_return = true;
		}

		if (_return) return false;
				
		//if (_password.length == 0 || /^\s+$/.test(_password)) {
		if (!_password.match(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,10})$/)) {
    		navigator.notification.alert("El password, debe contener entre 6 y 10 caracteres, por lo menos un digito y un alfanum&eacute;rico, y no puede contener caracteres espaciales", doNothing, "Registro", "OK");
    		_return = true;
		}
	
		if (_return) return false;

		var _html = $('#signUp').html(); 
		$('#signUp').html('Cargando...');
	
		_jData.push_id = _email;
		_jData.userLogin = _email;
		_jData.userPass =_password;
		_jData.userNick= _email;
		_jData.email =_email;
							
		_oAjax = $.fPostAjaXJSON('http://api.hecticus.com/KrakenSocialClients/v1/client/create/loginpass',_jData);	
		if (_oAjax) {
		
			_oAjax.always(function () {
				$('#signUp').html(_html);					
			});	
		
			_oAjax.done(function(_json) {

				if (_json.response.length == 0) {
					navigator.notification.alert("El cliente no se pudo crear, intente m&aacute;s tarde", doNothing, "Registro", "OK");
				} else {
					saveClientData(_json.response[0]);						
					_fSetLoadInit();
				}			   
			});
			
			_oAjax.fail(function() {
				navigator.notification.alert("El cliente no se pudo crear, intente m&aacute;s tarde", doNothing, "Registro", "OK");
				$('#signUp').html(_html);
			});	
			
		}

	});
	
	$(document).on('click','.content-mam .row[data-match], .content-resultados .row[data-match]', function(e) {
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		_fRenderDataContent($(this).data('match'));			
	});


	$(document).on('click','.refresh', function(e) {			
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		clearTimeout(_mTimeout);
		_fRenderEvent($(this).data('match'));
	});

