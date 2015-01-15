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
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('touchmove'
          , function (e) {
              e.preventDefault();
            }
          , false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {
    	if (id == 'deviceready') {
        document.addEventListener('backbutton', function(e) {
          _app.get('utilities').back_button();
        }, false);
    	}

    },

    initAllAppData: function() {
    	StatusBar.hide();
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
			console.log("JSON LOAD: "+JSON.stringify(_json));
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

function doneCreating(){
	console.log("DONE CREATING!!!!");
}
function errorCreating(){
	console.log("ERROR CREATING!!!!");
}

//EXIT
function exitApp(){
	try{
		clearInterval(INTERVAL_FRIENDS_LOADER);
	}catch(e){

	}
	if (navigator.app) {
        navigator.app.exitApp();
    } else if (navigator.device) {
        navigator.device.exitApp();
   }
}

