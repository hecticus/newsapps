'use strict';

/**
 * @ngdoc service
 * @name core.Services.PushManager
 * @description PushManager Factory
 */
angular
    .module('core')
    .factory('PushManager', ['$window', 'ClientManager', 'Client', 'CordovaDevice',
        function($window, ClientManager, Client, CordovaDevice) {
            var pushNotification = {};
            var that = '';

            return {

                tokenHandler : function (result) {
                    //console.log('<li>token: '+ result +'</li>');
                    Client.setRegId(result);
                },

                successPushHandler : function (result) {
                    console.log('<li>success:'+ result +'</li>');
                    if(result != null && result != ""){
                        Client.setRegId(result);
                    }
                },

                errorPushHandler : function (error) {
                    console.log('<li>error:'+ error +'</li>');
                },

                successPushHandlerServer : function (result) {
                    console.log('<li>success Server:'+ result +'</li>');
                },

                //Ahora tratamos de obtener el cliente con el device id para que si no existe se cree y
                // luego vamos al proceso normal
                updateDeviceToServer : function (){
                    console.log("updateDeviceToServer. revisando version");
                    //TODO: despues de guardar el regID en el servidor se llama a esta funcion
                    if(CordovaDevice.isAndroidPlatform()){
                        pushNotification.register(this.successPushHandlerServer
                            , this.errorPushHandler, true);
                    }

                    ClientManager.updateRegistrationID();
                },

                // handle GCM notifications for Android
                onNotificationGCM : function (e) {
                    console.log('onNotificationGCM.');

                    switch( e.event )
                    {
                        case 'registered':
                            if ( e.regid.length > 0 )
                            {
                                console.log('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                                console.log("PushManager. regID = " + e.regid);
                                Client.setRegId(e.regid);
                            }
                            break;

                        case 'message':
                            // notification happened while we were in the foreground
                            if (e.foreground) {
                                //console.log('<li>--INLINE NOTIFICATION--' + '</li>');
                            } else {
                                // otherwise we were launched because the user touched a notification
                                if (e.coldstart){
                                    //console.log('<li>--COLDSTART NOTIFICATION--' + '</li>');
                                }else{
                                    //console.log('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                                }
                            }
                            //TODO executePushInit no esta implementado
//                            executePushInit(e.payload["extra_params"]);
                            break;

                        case 'error':
                            console.log('<li>ERROR -> MSG:' + e.msg + '</li>');
                            break;

                        default:
                            console.log(
                                '<li>EVENT -> Unknown, an event was received and we do not know what it is</li>'
                            );
                            break;
                    }
                },

                // handle APNS notifications for iOS
                onNotificationAPN : function (e) {
                    /*if (e.alert) {
                     //$("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
                     //console.log('push-notification: ' + e.alert);
                     alert(e.alert);
                     }

                     if (e.sound) {
                     var snd = new Media(e.sound);
                     snd.play();
                     }

                     if (e.badge) {
                     pushNotification.setApplicationIconBadgeNumber(successPushHandler, e.badge);
                     }*/
                    console.log("LLEGO INFO PUSH");
                    console.log(JSON.stringify(e));
                    if(e["extra_params"] != null && e["extra_params"] != ""){
                        //TODO executePushInit no esta implementado
                        //executePushInit(e["extra_params"]);
                    }
                },

                /**
                 * @ngdoc function
                 * @name core.Services.PushManager#init
                 * @methodOf core.Services.PushManager
                 * @return {boolean} Returns a boolean value
                 */
                init : function (){
                    that = this;
                    try {
                        pushNotification = $window.plugins.pushNotification;
                        if (CordovaDevice.isAndroidPlatform()) {
                            console.log('PushManager. isAndroid');
                            pushNotification.register(
                                function(result){
                                    that.successPushHandler(result);
                                }, function(result){
                                    that.errorPushHandler(result);
                                },
                                {
                                    "senderID":"961052813400",
                                    "ecb":"angular.element('body').injector().get('PushManager').onNotificationGCM"
                                }
                            );
                        } else if(CordovaDevice.isIosPlatform()){
                            console.log('PushManager. isIOS');
                            pushNotification.register(
                                function(){
                                    that.tokenHandler();
                                }, function(){
                                    that.errorPushHandler();
                                },
                                {
                                    "badge":"false",
                                    "sound":"true",
                                    "alert":"true",
                                    "ecb":"angular.element('body').injector().get('PushManager').onNotificationAPN"
                                }
                            );
                        }
                    } catch(err) {
                        console.log("PushManager. init. Error. " + err);
                    }
                }
            };
        }
    ]);
