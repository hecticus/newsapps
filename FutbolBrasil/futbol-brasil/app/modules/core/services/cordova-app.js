'use strict';

/**
 * @ngdoc service
 * @name core.Services.CordovaApp
 * @description CordovaApp Factory
 */
angular
    .module('core')
    .factory('CordovaApp',
    function() {
        return {

            /**
             * @ngdoc function
             * @name core.Services.CordovaApp#method1
             * @methodOf core.Services.CordovaApp
             * @return {boolean} Returns a boolean value
             */
            method1: function() {
                return true;
            },

            exitApp: function (){
//               try{sendUpstreamEvent("APP_CLOSE");}catch(e){console.log("FALLA UPSTREAM");}
                try{
                    clearInterval(newsRefreshInterval);
                } catch(e){

                }

                if (navigator.app) {
                    navigator.app.exitApp();
                } else if (navigator.device) {
                    navigator.device.exitApp();
                }
            },

            startAppOffline: function (){
                alert("OFFLINE APP");
            },

            startApp: function (isActive, status){
                console.log("START APP: "+isActive+"/"+status);
            },
            errorStartApp: function (){
                console.log("START APP ERROR");
            },

            doneCreating: function (){
                console.log("DONE CREATING!!!!");
            },

            errorCreating: function (){
                console.log("ERROR CREATING!!!!");
            }
        };
    });
