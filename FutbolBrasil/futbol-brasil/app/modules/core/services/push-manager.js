'use strict';

/**
 * @ngdoc service
 * @name core.Services.PushManager
 * @description PushManager Factory
 */
angular
    .module('core')
    .factory('PushManager', ['$window', 'ClientManager', 'CordovaDevice',
        function($window, ClientManager, CordovaDevice) {
            var pushNotification = {};

            return {
                /**
                 * @ngdoc function
                 * @name core.Services.PushManager#init
                 * @methodOf core.Services.PushManager
                 * @return {boolean} Returns a boolean value
                 */
                init : function (){
                    try {
                        pushNotification = $window.plugins.pushNotification;
                        if (CordovaDevice.isAndroidPlatform()) {
                            pushNotification.register(this.successPushHandler, this.errorPushHandler
                                , {
                                    "senderID":"961052813400",
                                    "ecb":"onNotificationGCM"
                                }
                            );
                        } else if(CordovaDevice.isIosPlatform()){
                            pushNotification.register(this.tokenHandler, this.errorPushHandler
                                , {
                                    "badge":"false",
                                    "sound":"true",
                                    "alert":"true",
                                    "ecb":"onNotificationAPN"
                                }
                            );
                        }
                    } catch(err) {
                        console.log("PushManager. init. Error. " + err);
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
                        //executePushInit(e["extra_params"]);
                    }
                },

                // handle GCM notifications for Android
                onNotificationGCM : function (e) {
                    //$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
                    //console.log("EVENT -> RECEIVED:" + e.event);

                    switch( e.event )
                    {
                        case 'registered':
                            if ( e.regid.length > 0 )
                            {
                                //console.log('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                                // Your GCM push server needs to know the regID before it can push
                                // to this device here is where you might want to send it the regID
                                // for later use.
                                console.log("PushManager. regID = " + e.regid);
                                ClientManager.saveRegId(e.regid);
                                this.updateDeviceToServer();
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

                tokenHandler : function (result) {
                    //console.log('<li>token: '+ result +'</li>');
                    ClientManager.saveRegId(result);
                    this.updateDeviceToServer();
                    // Your iOS push server needs to know the token before it can push to this device
                    // here is where you might want to send it the token for later use.
                },

                successPushHandler : function (result) {
                    console.log('<li>success:'+ result +'</li>');
                    if(result != null && result != ""){
                        ClientManager.saveRegId(result);
                        this.updateDeviceToServer();
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
                    console.log("revisando version");
                    //TODO: despues de guardar el regID en el servidor se llama a esta funcion
                    if(CordovaDevice.isAndroidPlatform()){
                        pushNotification.registerOnServer(this.successPushHandlerServer
                            , this.errorPushHandler, true);
                    }

                    //Una vez tengamos el regID y este todo listo tenemos que revisar si ya existe
                    // el cliente
                    // o si hay que crear uno generico
                    this.updateRegistrationID();

                    var doneCreating = function(arg1, arg2){
                        console.log("arg1 = " + arg1);
                        console.log("arg2 = " + arg2);
                    };

                    var errorCreating = function(){
                        console.log("ERROR");
                    };

                    //TEMP PRUEBAS
                    console.log("VA A LLAMAR");
                    ClientManager.createOrUpdateClient("40766666613", "1234", true
                        , doneCreating, errorCreating);
                    console.log("LLAMO");
                }
            };
        }
    ]);
