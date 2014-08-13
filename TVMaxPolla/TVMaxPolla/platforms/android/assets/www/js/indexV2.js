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

//var _urlHecticus = 'http://10.0.1.125:9002/';
var _urlHecticus = 'http://polla.tvmax-9.com/';
var _urlCloud = 'http://1053e587fa1a3ea08428-6ed752b9d8baed6ded0f61e0102250e4.r36.cf1.rackcdn.com';
var _date = new Date();
var _day = _date.getDate();
var _month = (_date.getMonth()+1);
var _year = _date.getFullYear();
var _copyright= 'Copyright &copy; Televisora Nacional S.A. ' + _year;

var _jGet = false;	
var _oAjax;

var _tap = false;
var _jMenu=[];
  
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

function _fPushMenu(_json) {
	$.each(_json.news_categories.item, function(_index,_item) {
		_storeKey = 'newscategories_' + _item.id_news_category;				
		if (_item.status == 1) {
			_jMenu.push({
				index:_jMenu.length,						
				class: 'content-noticias',
				title:_item.display_name,
				load:'noticias.html',
				glyphicon:'',								
				json:_item,
				update:true,
				stream: _item.stream,
				storeKey: 'newscategories_' + _item.id_news_category,
				session:null
			});	
							
		} else {
			if(typeof(window.localStorage) != 'undefined') {
				window.localStorage.removeItem(_storeKey);	
			};
		};
	});
};

function _fRequestCategories() {
	
	var _json = false;
	var _storeKey = 'newscategories';
	
	_oAjax = $.fGetAjaXJSON(_urlHecticus + 'tvmaxfeeds/newscategories/getsimple',false,true,false);	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			if(typeof(window.localStorage) != 'undefined') {		
				window.localStorage.setItem(_storeKey,JSON.stringify(_json));
			}
		});
	}
	
	if(typeof(window.localStorage) != 'undefined') {
		if (window.localStorage.getItem(_storeKey)) {
			_json = JSON.parse(window.localStorage.getItem(_storeKey));	
		}	
	}	 

	if (_json) {
		try{setPushList(_json);}catch(e){}
		_fPushMenu(_json);
	}

}

var signupPageIndex;
var signinPageIndex;

function _fSetNewsHome() {
	_oAjax = $.fGetAjaXJSON(_jMenu[1].stream,false,false,false);	
	if (_oAjax) {
		_oAjax.done(function(_json) {

			if(typeof(window.localStorage) != 'undefined') {
				_jMenu[1].update = false;
				window.localStorage.setItem(_jMenu[1].storeKey, JSON.stringify(_json.noticias_deportes));
			}
					
			$.each(_json.noticias_deportes.item, function(_index,_item) {		
				var _oIimg = $('img #img').attr('src',_item.image);				
			});
			
		});
	}
};

function initAllAppData() {
		
	_jMenu.push({index:0,class:'content-home',title:'Portada',load:'home.html',glyphicon:'icon-home_menu', session:null});
	_fRequestCategories();
	_jMenu.push({index:_jMenu.length,class:'content-alertas',title:'Alertas',load:'alertasV2.html', glyphicon:'icon-alertas', json:false, session:true});
	signinPageIndex = _jMenu.length;
	_jMenu.push({index:signinPageIndex,class:'content-signin',title:'Ingresar',load:'SignIn.html', glyphicon:'glyphicon glyphicon-cloud-download', session:false});
	signupPageIndex = _jMenu.length;
	_jMenu.push({index:signupPageIndex,class:'content-signup',title:'Registro',load:'SignUp.html', glyphicon:'glyphicon glyphicon-cloud-upload', session:false});

	_fSetNewsHome();
	

	document.addEventListener('backbutton', function(e) {
				
		if ($('#wrapper2').hasClass('left')) {	
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
							
	}, false);
	
	app.receivedEvent('deviceready');    	
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false); 

}


var _bUpdateNews = window.setInterval(function(){	
	
	$(_jMenu).each(function(_index,_menu) {
		_menu.update = true ;
	});
	
	_fSetNewsHome();
	
},100000);


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
	var _session = null;
	
	if (loadClientData() == null) {
		_session = false;
	} else {
		_session = true;
	}

	$(_jMenu).each(function(_index,_menu) {

		if ((_menu.session == null) || (_menu.session == _session)) {
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







