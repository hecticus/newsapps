//variables globales

var  _mTimeout;
var _jData = {	id_country:8,  id_business: 17, id_carrier : 19, app_id: 1, origin: 'APP'};

var _jClient = false;

var _homeWasShowed = false;



var _fGetAfpTeam = function(_id) {		
	var _return = false;	
	$.each(_jAfpTeamsIds.teams, function(_index,_team) {		
		if (_team.ext_id == _id) _return = _team;
		if (_return) return true;		
	});	
	return _return;	
};

var _fGetFormatDate = function(_date) {
	
	_date = _date.toString().split(' ');
	var _year = _date[0].toString();
	var _time = '00:00:00';
	
	if (_date[1]) {
		_time = _date[1].toString();	
	}
	
	_time = _time.toString().trim();			
	_time = _time.toString().split(':');	
	_meridian = ((_time[0] > 12) ? ' pm' : ' am');	
	_time[0] = _aTime[_time[0] * 1];		
	return _year + ' ' + _time[0] + ':' + _time[1] + _meridian;
	
};

var _fSetLoadDefault = function() {
	clearTimeout(_mTimeout);
	$('body').removeClass();
	$('body').addClass('content-default');
	$('main').data('index',-1);		
	$('main').load('default.html');
	$('.title').html('<span>Inicio</span>'); 
};

var _fSetLoadInit = function() {	
	clearTimeout(_mTimeout);
	$('body').removeClass();
	$('body').addClass(_jMenu[0].class);
	$('main').data('index',0);		
	$('main').load(_jMenu[0].load);
	$('.title').html('<span>' + _jMenu[0].title + '</span>');
		
};
	
	
var _fSetBack = function() {
	

	clearTimeout(_mTimeout);

	$('.share, .menu-group, .refresh').addClass('hidden');
	$('.share, .menu-group, .refresh').removeAttr('onclick');
	
	$('#wrapperMaM').attr('class','page transition right');
	$('#wrapperMaM .container.header').empty();	
	$('#wrapperMaM2 .scroller .container').empty();
	
				
	$('#wrapperM').attr('class','page transition left');	
	$('#wrapper2 .scroller .container').empty();
	$('footer').empty();				
	$('#wrapper2').attr('class','page transition right');
	$('header .container .row .menu span').removeClass('icon-back');
	
	if (_jActive) {
		
		if (_jActive.live) {
			$('header .container .row .tv').removeClass('hidden');
		} else {
			$('header .container .row .tv').addClass('hidden');
		} 	
		 	
		if (_jActive.worldCupStarted) {
			$('.worldcup').removeClass('hidden');
			$('.preview').addClass('hidden');
		}
		
	}	
	
	

						

	$('.menu-group').addClass('hidden');		
	
};

var _fGetLoadingRefreshBefore = function() {	
	$('#refresh').addClass('loading');
};

var _fGetLoadingRefreshEnd = function() {	
	$('#refresh').removeClass('loading');
};

var _fGetLoadingRefreshError = function() {	
	$('#refresh').addClass('Error');
};


var _fGetLoading = function() {
	
	var _html = '<div class="row" >';
		_html += '<div class="col-md-12" style="font-size:1.2em; font-weight:bold; text-align:center; ">';
		_html += '<span>Cargando...</span>';
		_html += '</div>';
		_html += '</div>';
		
	$('#wrapper .scroller .container').empty();
	$('#wrapper .scroller .container').append(_html);
	
};


var _fGetLoadingError = function() {
	
	var _html = '<div class="row" >';
		_html += '<div class="col-md-12" style="font-size:1.2em; font-weight:bold; text-align:center; ">';
		_html += '<span>Error...</span>';
		_html += '</div>';
		_html += '</div>';
		
	$('#wrapper .scroller .container').empty();
	$('#wrapper .scroller .container').append(_html);
	
};



var _fGetLoadingNews = function() {
	
	var _html = '<div class="row" >';
		_html += '<div class="col-md-12" style="font-size:1em; font-weight:normal; text-align:center; ">';
		_html += '<span>Cargando...</span>';
		_html += '</div>';
		_html += '</div>';
		
	$('#wrapper .scroller .container').empty();
	$('#wrapper .scroller .container').append(_html);
	
};


var _fGetLoadingErrorNews = function() {
	
	var _html = '<div class="row" >';
		_html += '<div class="col-md-12" style="font-size:1em; font-weight:normal; text-align:center; ">';
		_html += '<span>No se puede obtener el resultado de las noticias. Por favor, int&eacute;ntalo de nuevo m&aacute;s tarde.</span>';
		_html += '</div>';
		_html += '</div>';
		
	$('#wrapper .scroller .container').empty();
	$('#wrapper .scroller .container').append(_html);
	
};




$.fGetAjaXJSONMaM = function(_url) {

	try {
		
	  	return $.ajax({
			url: _url,			
			type: 'GET',	
			async : false,            		
			dataType : 'json',
			contentType : 'application/json; charset=utf-8',
			beforeSend :  function () {
				_fGetLoadingRefreshBefore();
			}}).always(function () {
				_fGetLoadingRefreshEnd();	
			}).fail(function(jqXHR, textStatus, errorThrown) {
				_fGetLoadingRefreshError();		
				return false;
			});
				   
	} catch (e) {
		_fGetLoadingRefreshEnd();
		return false;
	}
	
};




$.fGetAjaXJSON2 = function(_url, _dataType, _contentType, _async,_loading) {

	try {	
		
			
	  	return $.ajax({
			url: _url,			
			type: 'GET',	
			async: (_async) ? _async : false,            		
			dataType: (_dataType) ? _dataType : 'json',
			contentType: (_contentType) ? _contentType : 'application/json; charset=utf-8',
		}).always(function () {
			//always		
		}).fail(function(jqXHR, textStatus, errorThrown) {		
			//alert('jqXHR -> ' + jqXHR + ' textStatus -> ' + textStatus + ' errorThrown -> ' + errorThrown);			
			return false;
		});
		   
	} catch (e) {
		// statements to handle any exceptions
		// pass exception object to error handler
		// alert(e);
		return false;
	}
	
};



$.fGetAjaXJSONNews = function(_url) {
	try {		
		if (isOnLine()) {
			return $.ajax({
				url: _url,			
				type: 'GET',          		
				dataType : 'json',
				contentType: 'application/json; charset=utf-8',		
			}).fail(function(jqXHR, textStatus, errorThrown) {		
				return false;
			});
		}
	} catch (e) {
		return false;
	}	
};



$.fGetAjaXJSON = function(_url, _dataType, _contentType, _async,_loading) {
	try {		
		if (isOnLine()) {	
			return $.ajax({
				url: _url,			
				type: 'GET',			
				//timeout: 100,
				async: (_async) ? _async : false,            		
				dataType: (_dataType) ? _dataType : 'json',
				contentType: (_contentType) ? _contentType : 'application/json; charset=utf-8',		
			}).fail(function(jqXHR, textStatus, errorThrown) {		
				//alert('jqXHR -> ' + jqXHR + ' textStatus -> ' + textStatus + ' errorThrown -> ' + errorThrown);
				//_fGetLoadingError();
				return false;
			});
		}
	} catch (e) {
		// statements to handle any exceptions
		// pass exception object to error handler
		// alert(e);
		_fGetLoadingError();
		return false;
	}	
};


$.fPostAjaXJSONSave = function(_url, _data) {
	
	try {				
	  	return $.ajax({
			url: _url,		
			data: JSON.stringify(_data),	
			type: 'POST',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			beforeSend : function () {
				//_fGetLoading();
		}}).always(function () {
			//always		
		}).fail(function(jqXHR, textStatus, errorThrown) {		
			_fGetLoadingError();
			return false;
		});
		   
	} catch (e) {
		// statements to handle any exceptions
		// pass exception object to error handler
		// alert(e);
		_fGetLoadingError();
		return false;
	}
	
};

$.fPostAjaXJSON = function(_url, _data) {
	
	try {				
	  	return $.ajax({
			url: _url,		
			data: JSON.stringify(_data),	
			type: 'POST',
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			beforeSend : function () {
				_fGetLoading();
		}}).always(function () {
			//always		
		}).fail(function(jqXHR, textStatus, errorThrown) {		
			_fGetLoadingError();
			return false;
		});
		   
	} catch (e) {
		// statements to handle any exceptions
		// pass exception object to error handler
		 //alert(e);
		_fGetLoadingError();
		return false;
	}
	
};



	var _fGetTime = function() {
		
		now = new Date();
		y2k = new Date("Jun 12 2014 15:00:00");
		
		days = (y2k - now) / 1000 / 60 / 60 / 24;
		daysRound = Math.floor(days);
		
		hours = (y2k - now) / 1000 / 60 / 60 - (24 * daysRound);				
		hoursRound = Math.floor(hours);
		
		minutes = (y2k - now) / 1000 /60 - (24 * 60 * daysRound) - (60 * hoursRound);
		minutesRound = Math.floor(minutes);
		seconds = (y2k - now) / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
		secondsRound = Math.round(seconds);
		
		
		secondsRound = (secondsRound < 10) ? "0" + secondsRound : secondsRound;
		minutesRound = (minutesRound < 10) ? "0" + minutesRound : minutesRound;
		hoursRound = (hoursRound < 10) ? "0" + hoursRound : hoursRound;
		daysRound = (daysRound < 10) ? "0" + daysRound : daysRound;
		
	
		var _html = '<div class="table-responsive">';
				_html += '<table class="table time">';
					_html += '<tr>';			
						_html += '<td style="background:#ffffff url(img/barra.jpg) no-repeat right bottom; background-size:2px 50px;" >' + daysRound +'</td>';
						_html += '<td style="background:#ffffff url(img/barra.jpg) no-repeat right bottom; background-size:2px 50px;">' + hoursRound +'</td>';
						_html += '<td style="background:#ffffff url(img/barra.jpg) no-repeat right bottom; background-size:2px 50px;">' + minutesRound +'</td>';
						_html += '<td>' + secondsRound +'</td>';			
					_html += '</tr>';
					
					_html += '<tr>';		
						_html += '<td class="caption" style="background:#ffffff url(img/barra.jpg) no-repeat right top; background-size:2px 10px;">D&iacute;as</td>';
						_html += '<td class="caption" style="background:#ffffff url(img/barra.jpg) no-repeat right top; background-size:2px 10px;">Horas</td>';
						_html += '<td class="caption" style="background:#ffffff url(img/barra.jpg) no-repeat right top; background-size:2px 10px;">Minutos</td>';
						_html += '<td class="caption">Segundos</td>';					
					_html += '</tr>';
				
				_html += '</table>';
			_html += '</div>';



		return _html;
		
	};


	var _fRenderGetInitTime = function(_class) {

		var _html = '<div class="row">';

		_html += '<div class="col-md-12" style="font-size: 1.4em; height:40px; line-height:40px; font-weight:bold; background:#E6E6E6; color:#3E79C4; text-align:center; " >';
		_html += '<span>Faltan:</span>';
		_html += '</div>';
		
		_html += '<div class="col-md-12" >';		
		_html +=  _fGetTime();
		_html += '</div>';
		
		_html += '<div class="col-md-12" style="font-size: 1.4em; height:40px; line-height:40px; font-weight:bold; background:#E6E6E6; color:#3E79C4; text-align:center; border-bottom: solid #FFD455; " >';
		_html += '<span>&#161;Para el Mundial!</span>';
		_html += '</div>';
	

		
		_html += '<div class="col-md-12" style="font-size: 1.6em; color:#4D4D4D; text-align:center;" >';
		_html += '<h4>&#161;Pronto disfrutar&aacute;s de esta secci&oacute;n!</h4>';
		_html += '<span class="' + _class  + '" style="font-size: 6em;"></span>';
		_html += '</div>';
		
		
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
				
		_mTimeout = setTimeout(function() {
			_fRenderGetInitTime(_class);	
		}, 1000);
		
	};
	
	
	//VERSION CONTROLLER
	//revisamos cada 10 min por una nueva version
	var versionInterval = window.setInterval(function(){
		checkVersion();
	},300000);
	
	var updateURL;
	function checkVersion(){
		//console.log("revisando version");
		try {	
			var osName;
			//var urlVersion = "http://192.168.1.128:9002/tvmax/appversion/check/1/android";
			var devicePlatform = device.platform;
			//IOS
			if(devicePlatform == "iOS"){
				osName = "ios";
			}else{
				//ANDROID
				osName = "android";
			}
			var version = 6;
			
			var urlVersion = "http://polla.tvmax-9.com/tvmax/appversion/check/"+version+"/"+osName;
			updateURL = "";
		  	$.ajax({
				url : urlVersion,
				timeout : 60000,
				success : function(data, status) {
					if(typeof data == "string"){
						data = JSON.parse(data);
					}
					var code = data.error;
					var response = data.response;
					if(code == 0 && response != null){
						var results = data.response.updateUrl;
						//hay una nueva version y hay que llamar al dialogo para actualizar
						if(results!= null && results.length>0){
							updateURL = results;
							//console.log("URL "+updateURL);
							navigator.notification.alert("Hay una nueva versión de la aplicación", goToUpdatePage, "Actualización", "Descargar");
						}
					}
				},
				error : function(xhr, ajaxOptions, thrownError) {
					console.log("error version");
				}
			});
			   
		} catch (e) {
		}
	};
	function goToUpdatePage(){
		window.open(updateURL, '_system', 'closebuttoncaption=regresar');
	}
		
		
	var _fgetTeamData = function(_id) {		
		var _jTeam = false;
		$.each(_jAfpTeamsIds.teams, function(_index,_team) {
			if (_team.ext_id ==  _id) _jTeam = _team;
			if (_jTeam) return false;
		});		
		return _jTeam;
	};		
		
	
	var _fgetFlag = function(_name, _id) {
		
		var _flag = false;
		
		$.each(_jAfpTeamsIds.teams, function(_index,_team) {
			
			if (_id) {
				if (_team.ext_id ==  _id) {
					_flag = _team.flag;
				}	
			} 
			
			if (_name) {
				if (_team.name.search(_name) >= 0  ) {
					_flag = _team.flag;
				}	
			}
			
			
			if (_flag) return false;
		});
		
		return _flag;
	};
	

	function _fGetLoginStatus(_jData) {
		
		_jData.id_country = 8;
		_jData.id_business = 17;
		_jData.app_id = 1;
		_jData.id_carrier = 19;
		_jData.origin = 'APP';
							
		_oAjax = $.fPostAjaXJSON('http://api.hecticus.com/KrakenSocialClients/v1/client/login',_jData);	
		if (_oAjax) {
	
			_oAjax.always(function () {					
				//always				
			});	
		
			_oAjax.done(function(_json) {			
				if (_json.response.length == 0) {
					//alert('No existe');
					//navigator.notification.alert("No existe el cliente, debe registrarse primero", doNothing, "Alerta", "OK");
					//viene por facebook asi que hay que crearlo 
					createClientForFacebook(_jData);
				} else {
					saveClientData(_json.response[0]);					
					//_fSetLoadInit();
					initPage();
					navigator.notification.activityStop();
				}
			});
			
			_oAjax.fail(function() {
				//fail	
				//ERROR
				navigator.notification.activityStop();
				navigator.notification.alert("Error consultando clientes, intente más tarde", doNothing, "Alerta", "OK");
			});	
		
		}
		
	};
	
	function createClientForFacebook(_jData){
		//console.log("Va a crear cliente");
		_oAjax = $.fPostAjaXJSON('http://api.hecticus.com/KrakenSocialClients/v1/client/create/facebook',_jData);	
		if (_oAjax) {
		
			_oAjax.always(function () {
				//alert('always');
				//$(this).html(_html);					
			});	
		
			_oAjax.done(function(_json) {
				navigator.notification.activityStop();			
				if (_json.response.length == 0) {
					//alert('No existe');
					navigator.notification.alert("El cliente no se pudo crear, intente más tarde", doNothing, "Alerta", "OK");
				} else {
					//console.log("Cliente creado");
					saveClientData(_json.response[0]);						
					//_fSetLoadInit();
					initPage();
				}
				
			});
			
			_oAjax.fail(function() {
				navigator.notification.activityStop();
				//alert('fail');
				navigator.notification.alert("El cliente no se pudo crear, intente más tarde", doNothing, "Alerta", "OK");
				//$(this).html(_html);
			});	
			
		}
	}
	
	function backFromRegister(){
		//$('header .container .row .menu span').removeClass();
		if(_homeWasShowed){
			//$('header .container .row .menu span').addClass('icon-menuhome');
			_fSetLoadInit();
		}else{
			_fSetLoadDefault();	
		}
	}
	
	
	function _fgetFormatDateMatch(_date) {

		var _sFormatDate = _date;			
		var _aDate= _sFormatDate.split('/');
		var _oDate = false;
		
		if (_aDate.length >= 1) {
			
			_oDate = new Date(2014, 6, _aDate[0]);
			if (_sFormatDate.search('Jul') >= 0  ) {
				_oDate = new Date(2014, 7, _aDate[0]);
			}
								
			_sFormatDate = _aDay[_oDate.getDay()];
			_sFormatDate += ', ' +  _aDate[0]; 
			_sFormatDate += ' de ' + _aMonthEs[_oDate.getMonth()];
			//_sFormatDate += ' de 2014';

		}
	
		return _date;
		
	}
	

	setInterval(function(){
		$(_jMenu).each(function(_index,_menu) {
			_menu.json = false;
		});
	}, 300000);
			
	var isMundialOn = false;
	var isLiveTV = false;
	var liveTVURL = "http://mundial.tvmax-9.com/UA_APP.php";
	var mundialInterval = setInterval(mundialIntervalFunc(),60000);
	function mundialIntervalFunc(){
		_oAjax = $.fGetAjaXJSON2('http://polla.tvmax-9.com/tvmaxfeeds/calendar/getActive',false,false,false);	
		if (_oAjax) {
			_oAjax.done(function(_json) {
				
				_jActive = _json;
				if (_jActive.worldCupStarted) {
					isMundialOn = true;
				}
				if(_jActive.live){
					isLiveTV = true;
					$('header .container .row .tv').removeClass('hidden');
				}
				if(_jActive.live_android != null && _jActive.live_android != ""){
					liveTVURL = _jActive.live_android;
				}
				if ($('body').hasClass('content-home')) {
					
					if (_jActive) {
						
						if (_jActive.live) {
							$('header .container .row .tv').removeClass('hidden');
						} else {
							$('header .container .row .tv').addClass('hidden');
						} 							
						
						if (_jActive.worldCupStarted) {
							$('.worldcup').removeClass('hidden');
							$('.preview').addClass('hidden');
						}
	
					}
				}
		
			});
		}
	}
	mundialIntervalFunc();
   	
	function _fsetTeamsAlerts() {	
		var  _html = '<div class="col-md-12"  >';	
		$.each(_jAlert.teams, function(_index,_id) {			
			var _team = _fgetTeamData(_id);			
			_html += '<img  data-id="' +  _id + '" onerror="this.style.display=\'none\'" src="img/flags/' + _team.flag + '" alt="' + _team.name + '" style="width:20%;  height:auto; max-width:67px; max-height:45px; float:left; margin:5px; "  />';					    			 						
		});			
		_html += '</div>';
		$('#equipos').html(_html);		
	}	
