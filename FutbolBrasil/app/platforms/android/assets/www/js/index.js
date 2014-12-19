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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	
    	if (id == 'deviceready') {
    			    	
	    	//Image Cache
	    	ImgCache.options.debug = true;
	    	ImgCache.options.localCacheFolder = 'FutebolBrasil';
	      	ImgCache.options.usePersistentCache = true;       	        	    	
			ImgCache.options.cacheClearSize = 5;
			ImgCache.init();
		   
		   document.addEventListener('backbutton', function(e) {
            	_app.get('utilities').backbuttom();							
			}, false);
		
		   app.initAllAppData();
    	}

    },
    
    initAllAppData: function() {
    	StatusBar.hide();

    	//window.plugins.sharedConfigurations.getSharedConfigEntry("device_width",setRealWidth,errorShareConfigs);
    	//window.plugins.sharedConfigurations.getSharedConfigEntry("device_height",setRealHeight,errorShareConfigs);
    	
    	//revisamos que la data que esta guardada este bien
    	checkStoredData();
    	if (_fPhonegapIsOnline()) {
    		//cargamos las configuraciones iniciales al comienzo
    		loadServerConfigs();
    		
    		//init Push manager
    		initPush();
    	}else{
    		startAppOffline();
    	}
    }
};

var _url = 'http://brazil.footballmanager.hecticus.com';

function loadServerConfigs(){
	//primero cargamos la configuracion inicial de la app
	enableCerts(true);
	console.log("LOADING: "+_url + '/api/loading/'+getRealWidth()+'/'+getRealHeight());
	_oAjax = _fGetAjaxJson(_url + '/api/loading/'+getRealWidth()+'/'+getRealHeight());
	if (_oAjax) {
		_oAjax.done(function(_json) {
			_jMenu[5].data = _json;
			upstreamAppKey = _json.response.upstreamAppKey;
			upstreamAppVersion = _json.response.upstreamAppVersion;
			upstreamServiceID = _json.response.upstreamServiceID;
			upstreamURL = _json.response.upstreamURL;
			companyName = _json.response.company_name;
			buildVersion = _json.response.build_version;
			serverVersion = _json.response.server_version;
			console.log("FINISH LOADING");
			//cuando tengamos todo esto mandamos a inicial los clientes
			//init client manager
    		initClientManager(startApp, errorStartApp);
		});
	};
}

app.initialize();

//offline
function startAppOffline(){
	alert("OFFLINE APP");
}

function startApp(isActive, status){
	console.log("START APP: "+isActive+"/"+status);
}
function errorStartApp(){
	console.log("START APP ERROR");
}

