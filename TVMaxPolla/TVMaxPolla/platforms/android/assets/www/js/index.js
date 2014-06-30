/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var _aTime = [0,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11];
var _jImageFeatured = false;
var _jSchedule = false;
//Push things
var pushInterval;
var newsPushInterval;
var newsReadyForPush = false;
var _jActive = false;


				 
var _urlCloud = 'http://1053e587fa1a3ea08428-6ed752b9d8baed6ded0f61e0102250e4.r36.cf1.rackcdn.com';
var _date = new Date();
var _day = _date.getDate();
var _month = (_date.getMonth()+1);
var _year = _date.getFullYear();
var _copyright= 'Copyright &copy; Televisora Nacional S.A. ' + _year;

var _jGet = false;	
var _oAjax;

var _tap = false;
/*{index:5,class:'content-clasificacion',title:'Clasificaci&oacute;n',load:'calendario.html', glyphicon:'icon-clasificacion', json:false, view:'phase'},*/
var _jMenu=[
	{index:0,class:'content-home',title:'Portada',load:'home.html', glyphicon:'icon-home_menu', json:false},
	{index:1,class:'content-resultados',title:'Resultados',load:'resultados.html', glyphicon:'icon-resultados', json:false},
	{index:2,class:'content-goles',title:'Goles',load:'goles.html', glyphicon:'icon-goles_menu', json:false},
	{index:3,class:'content-mam',title:'Minuto a Minuto',load:'mam.html', glyphicon:'icon-minutoaminuto', json:false},
	{index:4,class:'content-noticias',title:'Noticias',load:'noticias.html', glyphicon:'icon-noticias_menu', json:false},
	{index:5,class:'content-calendario',title:'Clasificaci&oacute;n',load:'calendario.html', glyphicon:'icon-clasificacion', json:false, view:'phase'},
	{index:6,class:'content-calendario',title:'Calendario',load:'calendario.html', glyphicon:'icon-fechas', json:false, view:'normal'},	
	{index:7,class:'content-polla',title:'Polla',load:'polla.html', glyphicon:'icon-polla_menu', json:false},
	{index:8,class:'content-leaderboard',title:'Leaderboard',load:'leaderboards.html', glyphicon:'icon-fases', json:false},
	{index:9,class:'content-pronosticos',title:'Pron&oacute;sticos',load:'pronosticos.html', glyphicon:'icon-pronosticos_menu', json:false},  	  	
  	{index:10,class:'content-polemicas',title:'P&oacute;lemicas',load:'polemicas.html', glyphicon:'icon-polemicas_menu', json:false},
  	{index:11,class:'content-alertas',title:'Alertas',load:'alertas.html', glyphicon:'icon-alertas', json:false},  	
	{index:12,class:'content-stadiums',title:'Estadios',load:'stadiums.html', glyphicon:'icon-estadios_menu', json:false},
  	{index:13,class:'content-teams',title:'Equipos',load:'teams.html', glyphicon:'icon-equipo', json:false},
  	{index:14,class:'content-players',title:'Leyendas',load:'players.html', glyphicon:'icon-biografia_menu', json:false},  	
  	{index:15,class:'content-history',title:'Historia',load:'history.html', glyphicon:'icon-historia_menu', json:false},  	
  	{index:16,class:'content-signin',title:'Ingresar',load:'SignIn.html', glyphicon:'glyphicon glyphicon-cloud-download', json:false},
	{index:17,class:'content-signup',title:'Registro',load:'SignUp.html', glyphicon:'glyphicon glyphicon-cloud-upload', json:false}
];




function exitApp(){
	try{clearInterval(newsRefreshInterval);}catch(e){}
	gaPlugin.exit(successGAHandler, successGAHandler);
	if (navigator.app) {					
        navigator.app.exitApp();				            
    } else if (navigator.device) {			        	
        navigator.device.exitApp();				            				          
    }
}

var app = {
	
    initialize: function() {this.bindEvents();},
    bindEvents: function() {document.addEventListener('deviceready', this.onDeviceReady, false);},
    onDeviceReady: function() {
    	
    	//set timeout para init data
    	window.setTimeout(initAllAppData(),100);

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	if(id == 'deviceready'){
	    	//init things
			setIOSSplashes();
	    	initPage();
	    	checkVersion();
	    	initPush();
	    	initGA();
    	}
    }
};

function initAllAppData(){
	_oAjax = $.fGetAjaXJSON('http://polla.tvmax-9.com/tvmaxfeeds/calendar/getActive',false,false,false);	
	if (_oAjax) {
		_oAjax.done(function(_json) {				
			_jActive = _json;				
		});
	}
	
	
	_oAjax = $.fGetAjaXJSON('http://polla.tvmax-9.com/tvmaxfeeds/calendar/getAll',false,false,false);	
	if (_oAjax) {
		_oAjax.done(function(_json) {				
			_jSchedule = _json.partidos_mundial;				
		});
	}

	_oAjax = $.fGetAjaXJSON('http://polla.tvmax-9.com/tvmaxfeeds/news/latest/',false,false,false);	
	if (_oAjax) {
		_oAjax.done(function(_json) {					
			_jMenu[0].json = _json.noticias_mundial;						
			$.each(_json.noticias_mundial.item, function(_index,_item) {
				if (_index == 0) _jImageFeatured = {src:_item.imagen,caption:_item.titulo};
				var _img = $('img #img').attr('src',_item.imagen);
				return false;
			});				
		});
	}
	    	
	$.each(_jPlayers, function(_index,_player) {
		_oAjax = $.fGetAjaXJSON(_player.url, 'xml', 'text/xml charset=utf-8', false);
		if (_oAjax) {
			_oAjax.done(function(_xml) {
													
				var _title = $(_xml).find('NewsItem > NewsComponent > NewsLines > HeadLine').text();
				
				var _id = $(_xml).find('NewsItem > Identification > NameLabel').text();
					_id = _id.split('-');
					_id = _id[1];
					
				var _data = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent').clone();
    				_data = $('<div>').append(_data).remove().html();

    			_player.title = _title;
    			//_player.xml = _xml;
    			_player.id = _id;	    	
    			_player.image = 'img/players/' + _id +'.jpg';	    								
				_player.datacontent =  _data;
				
				var _img = $('img #img').attr('src',_player.image);

				
			});
		}
	});	

	$.each(_jStadiums, function(_index,_stadium) {
		_oAjax = $.fGetAjaXJSON(_stadium.url, 'xml', 'text/xml charset=utf-8', false);
		if (_oAjax) {
			_oAjax.done(function(_xml) {
				
				var _title = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent > hl2').text();
				
				var _data = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent > dl').clone();
		    		_data = $('<div>').append(_data).remove().html();
		    		
		    		
				var _id = $(_xml).find('NewsItem > Identification > NameLabel').text();
					_id = _id.split('-');
					_id = _id[2];
					
				_stadium.title = _title;
    			//_stadium.xml = _xml;
    			_stadium.image = _urlCloud + '/stdvisu/' + _id +'-in.jpg';	    								
				_stadium.datacontent =  _data;
										
				var _img = $('img #img').attr('src',_stadium.image);
				 

					
			});
		}		
	});


	$.each(_jTeams, function(_index,_team) {
		
		_oAjax = $.fGetAjaXJSON(_team.fiche, 'xml', 'text/xml charset=utf-8', false);
		if (_oAjax) {
			_oAjax.done(function(_xml) {
				
				var _title = $(_xml).find('NewsItem > NewsComponent > NewsLines > ul').text();
					_title = _title.split('-');
					_title =  _title[1];		
								
	    		var _data = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent').clone();
					_data = $('<div>').append(_data).remove().html();
							
				var _id = $(_xml).find('NewsItem > Identification > NameLabel').text();
					_id = _id.split('-');
					_id = _id[1];
													
				_team.id = _id;						
				_team.title = _title;
    			//_team.xml.fiche = _xml;
    			_team.image = _urlCloud + '/teams/' + _id +'.jpg';	  
				_team.datacontent.fiche = _data;							
				var _img = $('img #img').attr('src', _team.image);

			});
		}

	});



	$.each(_jHistory, function(_index,_history) {	
		_oAjax = $.fGetAjaXJSON(_history.url, 'xml', 'text/xml charset=utf-8', false);
		if (_oAjax) {
			_oAjax.done(function(_xml) {
				
				var _title = $(_xml).find('NewsItem > NewsComponent > NewsLines > HeadLine').text();
		    	var _data = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent').clone();
		    		_data = $('<div>').append(_data).remove().html();
		    		
				var _id = $(_xml).find('NewsItem > Identification > NameLabel').text();
					_id = _id.split('-');
					_id = _id[1];
					
				_history.title = _title;
    			//_history.xml = _xml;
    			_history.image = _urlCloud + '/histmain/' + _id +'-1.jpg';	    								
				_history.datacontent =  _data;							
				var _img = $('img #img').attr('src', _history.image);
				
			});
		}		
	});


	document.addEventListener('backbutton', function(e) {
		
		if ($('body').hasClass('content-polla')) {
			if ($('#wrapperM').hasClass('right')) {
				$('#wrapperM').attr('class','page transition left');	
			} else if ($('#wrapper2').hasClass('left')) {
				$('#wrapper2').attr('class','page transition right');
			} else {			
				_fSetBack();	
				_fSetLoadInit();
			}
		} else {
		
			if ($('#wrapper2').hasClass('left') || $('#wrapperMaM').hasClass('left'))  {	
				_fSetBack();												
			} else {
				
				if ($('#wrapperM').hasClass('right')) {
			 		_fSetBack();
				} else if ($('body').hasClass('content-home')) {							
					exitApp();				
				} else if ($('body').hasClass('content-default')) {							
					exitApp();				
				} else if ($('body').hasClass('content-signin')) {	
					backFromRegister();		
				} else if ($('body').hasClass('content-signup')) {							
					backFromRegister();				
				} else {						
					_fSetLoadInit();
				}					
			}
			
		}	
		
		
									
	}, false);
	
	app.receivedEvent('deviceready');    	
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false); 
}

function reloadNewsMain(){
	_oAjaxRefresh = $.fGetAjaXJSON2('http://polla.tvmax-9.com/tvmaxfeeds/news/latest/',false,true,false);	
	if (_oAjaxRefresh) {
		_oAjaxRefresh.done(function(_json) {					
			_jMenu[0].json = _json.noticias_mundial;						
			$.each(_json.noticias_mundial.item, function(_index,_item) {
				if (_index == 0){
					try{
						_jImageFeatured = {src:_item.imagen,caption:_item.titulo};
						$('#home_news_caption').html(_item.titulo);
						$('#home_news_image').css('background-image','url('+_item.imagen+')');
						return false;
					}catch(e){
						
					}
				}
			});				
		});
	}
}

var newsRefreshInterval = window.setInterval(function(){
	reloadNewsMain();
},300000);

var pushHasExecuted = false;
function executePushInit(extra_params){
	pushInterval = window.setInterval(function(){
		if(_homeWasShowed){
			if(pushHasExecuted){return;}
			pushHasExecuted = true;
			clearTimeout(_mTimeout);			
			
			if(_oAjax && _oAjax.readystate != 4) {
				_oAjax.abort();
	    	}

			_fSetBack();
			var index = 4;
			var action = -1;
			var newsID = 0;
			
			/*
			 * '0','Anuncios','Anuncios','0'
				'1','GOL','Gol de #TEAM1# anota #PLAYER1# ','1'
				'2','CAMBIO','Cambio en #TEAM1# entra #PLAYER2# por #PLAYER1#','0'
				'3','INICIO','Arranca el partido entre #TEAM1# y #TEAM2#','1'
				'4','Final','Termina el partido entre #TEAM1# y #TEAM2#','0'
				'5','Tarjeta Amarilla','Amarilla para #PLAYER1# de #TEAM1#','0'
				'6','Tarjeta Roja Directa','Roja directa para #PLAYER1# de #TEAM1#','1'
				'7','Tarjeta Roja Acumulada','Segunda Amarilla, Roja para #PLAYER1# de #TEAM1#','1'
				'8','Parada del Portero','Paradon #PLAYER1# de #TEAM1#','0'
				'9','Autogol','En propia puerta! Gol de #TEAM1# anota #PLAYER1# ','1'
				'10','Tanda de Penales','Incian los Penales entre #TEAM1# y #TEAM2#','0'
				'11','Penal detenido','Paradon del portero de #TEAM1#','0'
				'12','Penal fallado','#PLAYER1# manda a volar su penalti','0'
				'13','Inicio de tiempo','Saltan los equipos a la cancha #TEAM1# vs #TEAM2#','1'
				'14','Final de tiempo','Los equipos se retiran a los vestidores #TEAM1# vs #TEAM2#','1'
				'15','Previa','El partido entre #TEAM1# y #TEAM2# esta por comenzar!','1'
				'16','Noticias','Noticia','1'
			 */
			
			var NEWS_ACTION = 16;
			var END_MATCH_ACTION = 4;
			
			//revisamos que tipo de aacion llego
			try{
				if(extra_params != null){
					var temp = extra_params.externalId;
					newsID = parseInt(temp);
					var tempAction = extra_params.action;
					action = parseInt(tempAction);
				}
				
			}catch(ex){
				console.log("ERROR push "+ex);
			}
			
			if(action == NEWS_ACTION){
				index = 4;
			}else{
				if(action == END_MATCH_ACTION){
					index = 1;
				}else if(action == 0){
					if(extra_params.msg != null && extra_params.msg != ""){
						navigator.notification.alert(extra_params.msg, doNothing, "Mensaje", "OK");
					}
					stopPushInterval();
					return false;
				}else{
					index = 3;
				}
			}
			
			
			if(_jMenu[index].class == 'content-polla' 
				|| _jMenu[index].class == 'content-alertas'
				|| _jMenu[index].class == 'content-leaderboard') {
				//revisamos si esta hay client data
				if(loadClientData() == null){
					navigator.notification.alert("Para entrar a esta sección debes estar registrado, entra en Menú/Ingresar", doNothing, "Alerta", "OK");
					return;
				}
			}
				
			$('body').removeClass();
			$('body').addClass(_jMenu[index].class);
			$('main').empty();
			$('main').data('index',index);	
			$('.title').html('<span>' + _jMenu[index].title + '</span>');						
			$('main').load(_jMenu[index].load);	
			$('#wrapperM').attr('class','page transition left');
			//console.log("EXTRA "+JSON.stringify(extra_params));
			
			
			
			if(action == NEWS_ACTION){
				//abrimos la noticia como tal
				newsPushInterval = window.setInterval(function(){
					if(newsReadyForPush){
						stopNewsInterval();
						window.setTimeout(function(){try{if(checkIfDataContentExists(newsID)){_fRenderDataContent(newsID);}}catch(ex){}}, 500);
					}
				},500);
			}
			
			stopPushInterval();
		}
		
	},500);
}
function stopPushInterval(){
	clearInterval(pushInterval);
}
function stopNewsInterval(){
	clearInterval(newsPushInterval);
}


function initPage(){

	var _html = '';	
	$(_jMenu).each(function(_index,_menu) {
		

		if (_index == 16 || _index == 17) {
			
			if(loadClientData() == null) {			
				_html += '<div class="row content-menu">';		
				_html += '<div class="col-xs-10 col-sm-10 col-md-10 col-lg-10  load" data-index="' +  _menu.index + '" data-visible= >';
					_html += '<span class="' + _menu.glyphicon + '" ></span>';
					_html += '<span>' + _menu.title + '</span>';
				_html += '</div>';		
				_html += '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2  load" data-index="' +  _menu.index + '">';
					_html += '<span class="icon-flechaazul"></span>';		
				_html += '</div>';			
				_html += '</div>';
			
			}

		}  else {
		
			_html += '<div class="row content-menu">';		
			_html += '<div class="col-xs-10 col-sm-10 col-md-10 col-lg-10  load" data-index="' +  _menu.index + '" data-visible= >';
				_html += '<span class="' + _menu.glyphicon + '" ></span>';
				_html += '<span>' + _menu.title + '</span>';
			_html += '</div>';		
			_html += '<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2  load" data-index="' +  _menu.index + '">';
				_html += '<span class="icon-flechaazul"></span>';		
			_html += '</div>';			
			_html += '</div>';
			
		}
		
		
		
		
			
	});         	
	

	$('#wrapperM .scroller .container').html(_html);
	_jClient = loadClientData();
	
	initFacebookManager();
	
	if (_jClient != null) {
		_fSetLoadInit();
	} else {
		//getLoginStatus();
		_fSetLoadDefault();	
	}




}

function setIOSSplashes(){
	var devicePlatform = device.platform;
	//IOS
	if(devicePlatform == "iOS"){
		if(getScreenWidth() == 640 || getScreenWidth() == 320){
			if(getScreenHeight() > 480){
				//console.log("iphone 5");
				$("#splash").attr("src", "img/splashIOS/splash_iphone5.png");
			}else{
				//console.log("iphone");
				$("#splash").attr("src", "img/splashIOS/splash_iphone.png");
			}
		}else{
			//console.log("ipad");
			$("#splash").attr("src", "img/splashIOS/splash_ipad.png");
		}
			
	}else{
		
	}
	
}







