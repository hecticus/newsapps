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
    	//window.setTimeout(initAllAppData(),100);	
    	app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	if(id == 'deviceready'){
	    	//init things
    		initAllAppData();
			/*setIOSSplashes();
	    	initPage();
	    	checkVersion();
	    	initPush();
	    	initGA();*/
	    	
	    	
	    	
	    	//Image Cache
	    	ImgCache.options.debug = true;
	    	ImgCache.options.localCacheFolder = 'TvMax';
	      	ImgCache.options.usePersistentCache = true;       	        	    	
			ImgCache.options.cacheClearSize = 5;
			ImgCache.init();	
	    	
    	}
    }
};

function _fPushMenu(_json) {
	_jMenu = [];
	
	$.each(_json.news_categories.item, function(_index,_item) {
		_storeKey = 'newscategories_' + _item.id_news_category;				
		if (_item.status == 1) {			
			_jMenu.push({
				index:_index,						
				class: 'content-noticias', //class: (_index == 0) ? 'content-home' : 'content-noticias',
				title:_item.display_name,
				load: 'noticias.html', //load: (_index == 0) ? 'home.html' : 'noticias.html',
				glyphicon:_item.cssClass,								
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
	
	_jMenu.push({index:_jMenu.length,class:'content-alertas',title:'Alertas',load:'alertasV2.html', glyphicon:'icon-alertas', json:false, session:false});
	/*signinPageIndex = _jMenu.length;
	_jMenu.push({index:signinPageIndex,class:'content-signin',title:'Ingresar',load:'SignIn.html', glyphicon:'glyphicon glyphicon-cloud-download', session:false});
	signupPageIndex = _jMenu.length;
	_jMenu.push({index:signupPageIndex,class:'content-signup',title:'Registro',load:'SignUp.html', glyphicon:'glyphicon glyphicon-cloud-upload', session:false});*/
};

var firstTime = true;

function _fRequestCategories() {
	
	var _json = false;
	var _storeKey = 'newscategories';
	var _catergoriesSame = false;
	
	//Ahora en las categorias se va a enviar toda la informacion relevante de la app para eso necesitamos enviar info extra
	var osName;
	var devicePlatform = device.platform;
	//IOS
	if(devicePlatform == "iOS"){
		osName = "ios";
	}else{
		//ANDROID
		osName = "android";
	}
	var version = 6;
	
	_oAjax = $.fGetAjaXJSON(_urlHecticus + 'tvmaxfeeds/newscategories/get/'+version+'/'+osName,false,true,false);	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			//sacamos la info extra
			try{getExtraInfoFromInitWS(_json);}catch(e){}
			if(typeof(window.localStorage) != 'undefined') {
				//revisamos si las categorias son las mismas
				//_jsonOld = JSON.parse(window.localStorage.getItem(_storeKey));
				_jsonOld = window.localStorage.getItem(_storeKey);
				//console.log("VA A REQUEST CAT 1");
				if (_jsonOld) {
					var jsonString = JSON.stringify(_json);
					if (jsonString == _jsonOld){
						_catergoriesSame = true;
					}else{
						_catergoriesSame = false;
					}
				}else{
					_catergoriesSame = false;
				}
				window.localStorage.setItem(_storeKey,JSON.stringify(_json));
			}
		});
	}
	
	if(typeof(window.localStorage) != 'undefined') {
		if (window.localStorage.getItem(_storeKey)) {
			_json = JSON.parse(window.localStorage.getItem(_storeKey));	
		}	
	}	 
	
	if(firstTime){
		firstTime = false;
		if (_json) {
			try{setPushList(_json,false);}catch(e){}
			_fPushMenu(_json);
		}
	}else{
		if (_json && _catergoriesSame == false) {
			try{setPushList(_json,true);}catch(e){}
			_fPushMenu(_json);
			setMenuView();
		}
	}
}

//UPDATE APP y Extra config params
var updateURL;
var isLiveTV = false;
var liveTVURL = "http://mundial.tvmax-9.com/UA_APP.php";
var wifiOnly = false;
var browserPlay = false;
var bannerFiles = [];
function getExtraInfoFromInitWS(_json){
	var updateVerion = _json.updateUrl;
	//hay una nueva version y hay que llamar al dialogo para actualizar
	if(updateVerion!= null && updateVerion.length>0){
		updateURL = updateVerion;
		//console.log("URL "+updateURL);
		navigator.notification.alert("Hay una nueva versi&óacute;n de la aplicaci&óacute;n", goToUpdatePage, "Actualizaci&óacute;n", "Descargar");
	}
	
	if(_json.live){
		isLiveTV = true;
	}
	
	//IOS
	if(device.platform == "iOS"){
		if(_json.live_ios != null && _json.live_ios != ""){
			liveTVURL = _json.live_ios;
		}
	}else{
		//ANDROID
		if(_json.live_android != null && _json.live_android != ""){
			liveTVURL = _json.live_android;
		}
	}
	
	if(_json.wifiOnly){
		wifiOnly = true;
	}else{
		wifiOnly = false;
	}
	
	if(_json.browserPlay){
		browserPlay = true;
	}else{
		browserPlay = false;
	}
}
function goToUpdatePage(){
	window.open(updateURL, '_system', 'closebuttoncaption=regresar');
}

var signupPageIndex;
var signinPageIndex;

function _fSetNewsHome() {
	_oAjax = $.fGetAjaXJSON(_jMenu[0].stream,false,false,true,false);	
	if (_oAjax) {
		_oAjax.done(function(_json) {

			if(typeof(window.localStorage) != 'undefined') {
				_jMenu[0].update = false;
				window.localStorage.setItem(_jMenu[0].storeKey, JSON.stringify(_json.noticias_deportes));
			}
					
			$.each(_json.noticias_deportes.item, function(_index,_item) {		
				var _oIimg = $('img #img').attr('src',_item.image);				
			});
			
		});
	}
};

function initAllAppData() {
			
	_fRequestCategories();
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
	
	//app.receivedEvent('deviceready');    	
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false); 
	
	setIOSSplashes();
	initPage();
	//checkVersion();
	initPush();
	initGA();
	categoriesLoaded = true;

}


var _bUpdateNews = window.setInterval(function(){	
	//buscamos si hay un cambio en las categorias para refrescar eso primero
	_fRequestCategories();
	$(_jMenu).each(function(_index,_menu) {
		_menu.update = true ;
	});
	
	_fSetNewsHome();
	
},300000);


var pushHasExecuted = false;
var categoriesLoaded = false;
function executePushInit(extra_params){
	pushInterval = window.setInterval(function(){
		if(_homeWasShowed && categoriesLoaded){
			if(pushHasExecuted){return;}
			pushHasExecuted = true;
			clearTimeout(_mTimeout);			
			
			if(_oAjax && _oAjax.readystate != 4) {
				_oAjax.abort();
	    	}

			_fSetBack();
			var index = 0;
			var action = -1;
			var newsID = 0;
			var isNewsAction = false;
			
			/*
			 * '0','Anuncios','Anuncios','0'
				'16','Noticias','Noticia','1'
			 */
			
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
			if(action == 0){
				if(extra_params.msg != null && extra_params.msg != ""){
					navigator.notification.alert(extra_params.msg, doNothing, "Mensaje", "OK");
				}
				stopPushInterval();
				return false;
			}else{
				try{
					for(var i=0;i<_jMenu.length;i++){
						if(_jMenu[i].json != null && _jMenu[i].json.id_action == action){
							index = i;
							isNewsAction = true;
							break;
						}
					}
				}catch(e){
					
				}
			}
			

			if(_jMenu[index].class == 'content-polla' 
				|| _jMenu[index].class == 'content-alertas'
				|| _jMenu[index].class == 'content-leaderboard') {
				//revisamos si esta hay client data
				if(loadClientData() == null){
					navigator.notification.alert("Para entrar a esta secci&óacute;n debes estar registrado, entra en Men&úacute;/Ingresar", doNothing, "Alerta", "OK");
					return;
				}
			}

			if(isNewsAction){
				$('body').removeClass();
				$('body').addClass(_jMenu[index].class);
				$('main').empty();
				$('main').data('index',index);	
				$('.title').html('<span>' + _jMenu[index].title + '</span>');						
				$('main').load(_jMenu[index].load);	
				$('#wrapperM').attr('class','page transition left');
				//console.log("EXTRA "+JSON.stringify(extra_params));
				
				//abrimos la noticia como tal
				newsPushInterval = window.setInterval(function(){
					if(newsReadyForPush){
						stopNewsInterval();
						window.setTimeout(function(){
							try{
								if(checkIfDataContentExists(newsID)){
									_fRenderDataContent(newsID);
								}else{
									//buscamos la noticia en el servidor y la mostramos directamente
									var _oAjaxTemp = $.fGetAjaXJSONNews("http://polla.tvmax-9.com/tvmaxfeeds/simplenews/get/id/"+newsID);
									if (_oAjaxTemp) {
										_oAjaxTemp.done(function(_json) {
											if(_json != null && _json.noticias_deportes != null && _json.noticias_deportes.items != null){
												var newsJsonObj = _json.noticias_deportes.items[0];
												addPushNews(newsJsonObj);
												_fRenderDataContent(newsID);
											}
																
										});
									}
								}
							}catch(ex){}
						}, 500);
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

	setMenuView();
	_fSetLoadInit();
	
	/*_jClient = loadClientData();
	
	initFacebookManager();
	
	if (_jClient != null) {
		_fSetLoadInit();		
	} else {
		//getLoginStatus();
		_fSetLoadDefault();	
	}*/




}

function setMenuView(){
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

