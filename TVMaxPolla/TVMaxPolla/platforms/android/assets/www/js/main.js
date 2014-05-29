//variables globales

var  _mTimeout;
var _jData = {	id_country:8,  id_business: 17,  app_id: 1, origin: 'app'};
var _jClient = false;

var _homeWasShowed = false;

var _jAfpTeamsIds={"teams":[{"id_tvmax":"1","name":"Alemania","shortname":"GER","flag":"gm-lgflag.png","ext_id":"1500"},
                          {"id_tvmax":"2","name":"Argelia","shortname":"ALG","flag":"ag-lgflag.png","ext_id":"3041"},
                          {"id_tvmax":"3","name":"Argentina","shortname":"ARG","flag":"ar-lgflag.png","ext_id":"3029"},
                          {"id_tvmax":"4","name":"Australia","shortname":"AUS","flag":"as-lgflag.png","ext_id":"3059"},
                          {"id_tvmax":"5","name":"B&eacute;lgica","shortname":"BEL","flag":"be-lgflag.png","ext_id":"3004"},
                          {"id_tvmax":"6","name":"Bosnia y Hna.","shortname":"BIH","flag":"bk-lgflag.png","ext_id":"3100"},
                          {"id_tvmax":"7","name":"Brasil","shortname":"BRA","flag":"br-lgflag.png","ext_id":"1035"},
                          {"id_tvmax":"8","name":"Camer&uacute;n","shortname":"CMR","flag":"cm-lgflag.png","ext_id":"3075"},
                          {"id_tvmax":"9","name":"Chile","shortname":"CHI","flag":"ci-lgflag.png","ext_id":"3015"},
                          {"id_tvmax":"10","name":"Colombia","shortname":"COL","flag":"co-lgflag.png","ext_id":"3037"},
                          {"id_tvmax":"11","name":"Corea del Sur","shortname":"KOR","flag":"ks-lgflag.png","ext_id":"3068"},
                          {"id_tvmax":"12","name":"Costa de Marfil","shortname":"CIV","flag":"iv-lgflag.png","ext_id":"3038"},
                          {"id_tvmax":"13","name":"Costa Rica","shortname":"CRC","flag":"cs-lgflag.png","ext_id":"3090"},
                          {"id_tvmax":"14","name":"Croacia","shortname":"CRO","flag":"hr-lgflag.png","ext_id":"523"},
                          {"id_tvmax":"15","name":"Ecuador","shortname":"ECU","flag":"ec-lgflag.png","ext_id":"3065"},
                          {"id_tvmax":"16","name":"Espa&ntilde;a","shortname":"ESP","flag":"sp-lgflag.png","ext_id":"413"},
                          {"id_tvmax":"17","name":"Usa","shortname":"USA","flag":"us-lgflag.png","ext_id":"3019"},
                          {"id_tvmax":"18","name":"Francia","shortname":"FRA","flag":"fr-lgflag.png","ext_id":"461"},
                          {"id_tvmax":"19","name":"Ghana","shortname":"GHA","flag":"gh-lgflag.png","ext_id":"3025"},
                          {"id_tvmax":"20","name":"Grecia","shortname":"GRE","flag":"gr-lgflag.png","ext_id":"3012"},
                          {"id_tvmax":"21","name":"Honduras","shortname":"HON","flag":"ho-lgflag.png","ext_id":"3048"},
                          {"id_tvmax":"22","name":"Inglaterra","shortname":"ENG","flag":"en-lgflag.png","ext_id":"436"},
                          {"id_tvmax":"23","name":"Ir&aacute;n","shortname":"IRN","flag":"ir-lgflag.png","ext_id":"3033"},
                          {"id_tvmax":"24","name":"Italia","shortname":"ITA","flag":"it-lgflag.png","ext_id":"445"},
                          {"id_tvmax":"25","name":"Jap&oacute;n","shortname":"JPN","flag":"ja-lgflag.png","ext_id":"3062"},
                          {"id_tvmax":"26","name":"M&eacute;xico","shortname":"MEX","flag":"mx-lgflag.png","ext_id":"3010"},
                          {"id_tvmax":"27","name":"Nigeria","shortname":"NGA","flag":"ni-lgflag.png","ext_id":"3084"},
                          {"id_tvmax":"28","name":"Pa&iacute;ses Bajos","shortname":"NED","flag":"nl-lgflag.png","ext_id":"411"},
                          {"id_tvmax":"29","name":"Portugal","shortname":"POR","flag":"po-lgflag.png","ext_id":"450"},
                          {"id_tvmax":"30","name":"Rusia","shortname":"RUS","flag":"rs-lgflag.png","ext_id":"1063"},
                          {"id_tvmax":"31","name":"Suiza","shortname":"SUI","flag":"sz-lgflag.png","ext_id":"408"},
                          {"id_tvmax":"32","name":"Uruguay","shortname":"URU","flag":"uy-lgflag.png","ext_id":"3024"}]};


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
	_time[0] = _aTime[_time[0] * 1];
	
	
	
	return _year + ' ' + _time[0] + ':' + _time[1] + ((_time[0] > 12) ? ' pm' : ' am');
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
	$('.share, .menu-group').addClass('hidden');
	$('.share, .menu-group').removeAttr('onclick');
				
	$('#wrapperM').attr('class','page transition left');	
	$('#wrapper2 .scroller .container').empty();
	$('footer').empty();				
	$('#wrapper2').attr('class','page transition right');
	$('header .container .row .menu span').removeClass('icon-back');		
	$('.tv').removeClass('hidden');	
};


var _fGetLoading = function() {
	
	var _html = '<div class="row" >';
		_html += '<div class="col-md-12" style="font-size:1.2em; font-weight:bold; text-align:center; ">';
		_html += '<span>Loading...</span>';
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

$.fGetAjaXJSON = function(_url, _dataType, _contentType, _async) {

	try {	
		
			
	  	return $.ajax({
			url: _url,			
			type: 'GET',	
			async: (_async) ? _async : false,            		
			dataType: (_dataType) ? _dataType : 'json',
			contentType: (_contentType) ? _contentType : 'application/json; charset=utf-8',
			beforeSend : function () {				
				_fGetLoading();					
		}}).always(function () {
			//always		
		}).fail(function(jqXHR, textStatus, errorThrown) {		
			//alert('jqXHR -> ' + jqXHR + ' textStatus -> ' + textStatus + ' errorThrown -> ' + errorThrown);
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
			//alert(' -> ' + jqXHR + ' - ' + textStatus + ' - ' + errorThrown);
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
		
		
		/*sec = (secondsRound == 1) ? " segundo" : " segundos";
		min = (minutesRound == 1) ? " minuto" : " minutos ";
		hr = (hoursRound == 1) ? " hora" : " horas ";
		dy = (daysRound == 1) ? " d�a" : " d&iacute;as ";*/

		sec = "ss";
		min = "mm";
		hr = "hh";
		dy = "dd";

		var _html = '<div class="row">';		
			_html += '<div class="table-responsive">';
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
			//var urlVersion = "http://192.168.1.128:9002/tvmax/appversion/check/1/android";
			var version = 1;
			var osName = "android";
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
							console.log("URL "+updateURL);
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
		
	

	function _fGetLoginStatus(_jData) {
		
		
		_jData.id_country = 8;
		_jData.id_business = 17;
		_jData.app_id = 1;

							
		_oAjax = $.fPostAjaXJSON('http://api.hecticus.com/KrakenSocialClients/v1/client/login',_jData);	
		if (_oAjax) {
	
			_oAjax.always(function () {					
				//always				
			});	
		
			_oAjax.done(function(_json) {			
				if (_json.response.length == 0) {
					//alert('No existe');
					navigator.notification.alert("No existe el cliente, debe registrarse primero", doNothing, "Alerta", "OK");
				} else {
					saveClientData(_json.response[0]);					
					_fSetLoadInit();												
				}
				navigator.notification.activityStop();
			});
			
			_oAjax.fail(function() {
				//fail	
				//ERROR
				navigator.notification.activityStop();
			});	
		
		}
		
	};
	
	function backFromRegister(){
		$('header .container .row .menu span').removeClass();
		if(_homeWasShowed){
			$('header .container .row .menu span').addClass('icon-menuhome');
			_fSetLoadInit();
		}else{
			_fSetLoadDefault();	
		}
	}
	
	function doNothing(){
		
	}

