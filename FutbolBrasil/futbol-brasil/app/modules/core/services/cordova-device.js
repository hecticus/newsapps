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
            return {
                touchType : 'click',
                real_width : 0,
                real_height : 0,

                /**
                 * @ngdoc function
                 * @name core.Services.CordovaDevice#method1
                 * @methodOf core.Services.CordovaDevice
                 * @return {boolean} Returns a boolean value
                 */
                method1: function() {
                    return true;
                },

                getDevice: function (){
                    var devicePlatform = device.platform;
                    //IOS
                    if(devicePlatform == "iOS"){
                        return "iOS";
                    }else{
                        return "android";
                    }
                },

                checkBadTouch: function (e, onClickEvent){
                    if(device.platform == "iOS"){
                        if(onClickEvent){
                            return e.type == "touchstart" || e.type == "touchend";
                        }else{
                            return e.type == "touchstart";
                        }
                    }else{
                        return e.type == "touchstart" || e.type == "touchend";
                    }
                },

                setTouchType: function (){
                    if(device.platform == "iOS"){
                        this.touchType = "touchend";
                    }else{
                        this.touchType = "click";
                    }
                },

                phonegapIsOnline: function (){
                    var networkState = navigator.connection.type;
                    return !(networkState == Connection.NONE || networkState == Connection.UNKNOWN);
                },

                setRealWidth: function (val){
                    try{
                        if(val != null && val != "" && !isNaN(val)){
                            this.real_width = parseInt(val);
                        }
                    }catch(e){
                        console.log("Bad width: "+e);
                    }
                },

                setRealHeight: function (val){
                    try{
                        if(val != null && val != "" && !isNaN(val)){
                            this.real_height = parseInt(val);
                        }
                    }catch(e){
                        console.log("Bad height: "+e);
                    }
                },

                getRealWidth: function (){
                    if(this.real_width != 0){
                        return this.real_width;
                    }else{
                        return $window.width();
                    }
                },

                getRealHeight: function (){
                    if(this.real_height != 0){
                        return this.real_height;
                    }else{
                        return $window.height();
                    }
                }
            };
        }
    ]);
