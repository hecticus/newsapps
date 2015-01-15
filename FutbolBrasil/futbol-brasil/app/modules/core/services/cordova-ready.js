'use strict';

/**
 * @ngdoc service
 * @name core.Services.CordovaReady
 * @description CordovaReady Factory
 */
angular
    .module('core')
    .factory('CordovaReady',['App', 'Device', 'Utilities', 'CordovaDevice', function(App, Device, Utilities, CordovaDevice) {
        return {
            upstreamAppKey : '',
            upstreamAppVersion : '',
            upstreamServiceID : '',
            upstreamURL : '',
            companyName : '',
            buildVersion : '',
            serverVersion : '',

            initialize : function() {
                console.log('Ready. initialize. ');
                this.bindEvents();
            },

            bindEvents : function() {
                document.addEventListener('deviceready', this.onDeviceReady, false);
                document.addEventListener('touchmove'
                    , function (e) {
                        e.preventDefault();
                    }
                    , false);
            },

            onDeviceReady : function() {
                app.receivedEvent('deviceready');
            },

            receivedEvent : function(id) {
                if (id == 'deviceready') {
                    document.addEventListener('backbutton', function(e) {
                        Utilities.back_button();
                    }, false);
                }

            },

            //Currently not being called
            initAllAppData : function() {
                StatusBar.hide();
                //revisamos que la data que esta guardada este bien
                checkStoredData();
                if (Device.phonegapIsOnline()) {
                    this.loadServerConfigs();
                    initPush(); //init Push manager
                }else{
                    startAppOffline();
                }
            },

            loadServerConfigs : function (){
                //TODO convertir a constante
                var _url = 'http://brazil.footballmanager.hecticus.com' + '/api/loading/'
                    + CordovaDevice.getRealWidth()
                    + '/' + CordovaDevice.getRealHeight();

                enableCerts(true); //Pertenece a WebManager
                console.log("LOADING: " + _url);
                Utilities._fGetAjaxJson(_url).done(function(_json) {
                        console.log("JSON LOAD: "+JSON.stringify(_json));
                        this.upstreamAppKey = _json.response.upstreamAppKey;
                        this.upstreamAppVersion = _json.response.upstreamAppVersion;
                        this.upstreamServiceID = _json.response.upstreamServiceID;
                        this.upstreamURL = _json.response.upstreamURL;
                        this.companyName = _json.response.company_name;
                        this.buildVersion = _json.response.build_version;
                        this.serverVersion = _json.response.server_version;
                        console.log("FINISH LOADING");
                        //cuando tengamos todo esto mandamos a inicial los clientes
                        //init client manager
                        initClientManager(App.startApp, App.errorStartApp);
                    });
                }
            }
        }
    ]);
