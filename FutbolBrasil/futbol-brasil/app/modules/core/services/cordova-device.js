'use strict';

/**
 * @ngdoc service
 * @name core.Services.CordovaDevice
 * @description CordovaDevice Factory
 */
angular
    .module('core')
    .factory('CordovaDevice',['$window',
        function($window) {
            var realWidth = 0;
            var realHeight = 0;
//            var device = device? device : false;
            return {
                touchType : 'click',

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaDevice#method1
                 * @methodOf core.Services.CordovaDevice
                 * @return {boolean} Returns a boolean value
                 */
                method1: function() {
                    return true;
                },

                getPlatform: function (){
                    if(typeof device !== "undefined"){
                        return device.platform;
                    } else {
                        return "Android";
                    }
                },

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaDevice#isAndroidPlatform
                 * @methodOf core.Services.CordovaDevice
                 * @return {boolean} Returns true if running on Android Platform
                 */
                isAndroidPlatform: function (){
                    if(typeof device !== "undefined"){
                        return device.platform === "Android";
                    } else {
                        return false;
                    }
                },

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaDevice#isAndroidPlatform
                 * @methodOf core.Services.CordovaDevice
                 * @return {boolean} Returns true if running on iOS Platform
                 */
                isIosPlatform: function (){
                    if(typeof device !== "undefined"){
                        return device.platform === "iOS";
                    } else {
                        return false;
                    }
                },

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaDevice#getUpstreamChannel
                 * @methodOf core.Services.CordovaDevice
                 * @return {String} Returns UpstreamChannel for Platform
                 */
                getUpstreamChannel: function (){
                    if(this.isAndroidPlatform()){
                        return 'Android';
                    } else if(this.isIosPlatform()){
                        return 'IOS';
                    } else {
                        //TODO handle error
                        return 'Android';
                    }
                },

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaDevice#getDeviceId
                 * @methodOf core.Services.CordovaDevice
                 * @return {Integer} Returns Device Id for Platform
                 */
                getDeviceId: function (){
                    if(this.isAndroidPlatform()){
                        return 1;
                    } else if(this.isIosPlatform()){
                        return 2;
                    } else {
                        return 1;
                    }
                },

                checkBadTouch: function (e, onClickEvent){
                    if(this.isIosPlatform()){
                        if(onClickEvent){
                            return e.type == "touchstart" || e.type == "touchend";
                        }else{
                            return e.type == "touchstart";
                        }
                    }else if(this.isAndroidPlatform){
                        return e.type == "touchstart" || e.type == "touchend";
                    } else {
                        return e.type == "touchstart" || e.type == "touchend";
                    }
                },

                setTouchType: function (){
                    if(this.isIosPlatform()){
                        this.touchType = "touchend";
                    }else if(this.isAndroidPlatform){
                        this.touchType = "click";
                    }else{
                        this.touchType = "click";
                    }
                },

                phonegapIsOnline: function (){
                    if(navigator.connection){
                        var networkState = navigator.connection.type;
                        return !(networkState == Connection.NONE || networkState == Connection.UNKNOWN);
                    } else {
                        return true;
                    }
                },

                setRealWidth: function (val){
                    try{
                        if(val != null && val != "" && !isNaN(val)){
                            realWidth = parseInt(val);
                        }
                    }catch(e){
                        console.log("Bad width: " + e);
                    }
                },

                getRealWidth: function (){
                    if(realWidth != 0){
                        return realWidth;
                    }else{
                        return $window.innerWidth;
                    }
                },

                setRealHeight: function (val){
                    try{
                        if(val != null && val != "" && !isNaN(val)){
                            realHeight = parseInt(val);
                        }
                    }catch(e){
                        console.log("Bad height: " + e);
                    }
                },

                getRealHeight: function (){
                    if(realHeight != 0){
                        return realHeight;
                    }else{
                        return $window.innerHeight;
                    }
                }
            };
        }
    ]);
