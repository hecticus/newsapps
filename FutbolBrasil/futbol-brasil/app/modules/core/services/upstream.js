'use strict';

/**
 * @ngdoc service
 * @name core.Services.Upstream
 * @description Upstream Factory
 */
angular
    .module('core')
    .factory('Upstream',['$http', 'Client', 'Moment', 'CordovaDevice', 'App',
        function($http, Client, Moment, CordovaDevice, App) {
            var appKey = '';
            var appVersion = '';
            var guestPassword = '';
            var guestUser = '';
            var guestToken = '';
            var serviceId = '';
            var url = '';
            var eventUrl = '';
            var passwordUrl = '';
            var eventSuffix = '/game/user/event';
            var passwordSuffix = '/game/user/password';
            var guestUserId = '';
            var headers = {};
            var AUTH_TOKEN_PREFIX = 'Basic ';
            var TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss.SSS[UTC]';

            var events = {
                'app_launch' : 'APP_LAUNCH',
                'app_close' : 'APP_CLOSE',
                'login' : 'LOGIN',
                'viewed_subscription' : 'VIEW_SP',
                'clicked_subscription' : 'CLICK_SP'
            };

            function setUp(config){
                appKey = config.upstream_app_key;
                appVersion = config.upstream_app_version;

                guestPassword = config.upstream_guest_password;
                guestUser = config.upstream_guest_user;
                guestUserId = config.upstream_guest_user_id;
                guestToken = config.upstream_guest_auth_token;

                serviceId = config.upstream_service_id;
                url = config.upstream_url;
                eventUrl = url + eventSuffix;
                passwordUrl = url + passwordSuffix;
                updateHeaders();
            }

            function getAppResponseCodeString(code){
                switch(code){
                    case 0:
                        return 'Success';
                    case 1:
                        return 'User already subscribed';
                    case 2:
                        return 'User cannot be identified';
                    case 3:
                        return 'User not subscribed';
                    case 4:
                        return 'Push_notification_id missing';
                    case 5:
                        return 'Invalid MSISDN';
                    case 6:
                        return 'Push_notification_id already exists';
                    case 7:
                        return 'Upstream’s Service no longer available';
                    default:
                        return 'Unhandled Application Response Code';
                }
            }

            function updateHeaders(){
                /*
                * Headers Example:
                * Content-Type: application/json //Added by default
                * Accept: application/gamingapi.v1+json
                * x-gameapi-app-key: DEcxvzx98533fdsagdsfiou
                * Authorization : Basic OTk5MDAwMDIzMzE1OlNSUTcyRktT //Should come from server
                * */
                headers = {
                    'Accept': 'application/'+ appVersion + '+json',
                    'x-gameapi-app-key' : appKey
                };
            }


            //TODO ask for device_id
            function getBody(event, extras){
                var metadata = extras? extras : {};
                metadata.channel = CordovaDevice.getUpstreamChannel();
                metadata.app_version = App.getBundleVersion();
                var body = {
                    'event' : event,
                    'service_id' : serviceId,
                    'timestamp' : Moment.today(TIMESTAMP_FORMAT),
                    'device_id' : Client.getRegId(),
                    'push_notification_id' : Client.getRegId(),
                    'metadata' : metadata
                };

                if(Client.isGuest()){
                    body['user_id'] = guestUserId;
                } else{
                    body['user_id'] = Client.getClientId();
                }

                return body;
            }

            function sendEvent(event){
                var data = getBody(event);
                var token = Client.getUpstreamAuthToken();
                if(token){
                    headers['Authorization'] = AUTH_TOKEN_PREFIX + token;
                } else {
                    headers['Authorization'] = AUTH_TOKEN_PREFIX + guestToken;
                }
                var config = {
                    headers: headers
                };

//                console.log('sendEvent:');
                var obj = {
                  "headers" : headers,
                  "body" : data
                };
//                console.log(JSON.stringify(obj));

//                return $http.post(eventUrl, data, config).then(success, error);

                function success(data){
                    return getAppResponseCodeString(data.result);
                }

                function error(data){
                    console.log('Error sending ' + events.app_launch
                        + ' Event. Result: ' + getAppResponseCodeString(data.result));
                    return 'error';
                }
            }

            function appLaunchEvent (){
                return sendEvent(events.app_launch);
            }

            function appCloseEvent(){
                return sendEvent(events.app_close);
            }

            function loginEvent(){
                return sendEvent(events.login);
            }

            function viewSubscriptionPromptEvent(){
                return sendEvent(events.viewed_subscription);
            }

            function clickedSubscriptionPromptEvent(){
                return sendEvent(events.clicked_subscription);
            }

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.Upstream#setUp
                 * @methodOf core.Services.Upstream
                 * @description Sets Up Upstream configuration from server. Example content:
                 * <ul>
                 *   <li>upstreamAppKey: "DEcxvzx98533fdsagdsfiou"</li>
                 *   <li>upstreamAppVersion: "gamingapi.v1"</li>
                 *   <li>upstreamGuestPassword: "guesth"</li>
                 *   <li>upstreamGuestUser: "guesth"</li>
                 *   <li>upstreamServiceID: "prototype-app -SubscriptionDefault"</li>
                 *   <li>upstreamURL: "http://brazil.footballmanager.hecticus.com/futbolbrasil/v1/clients/upstream"</li>
                 *   <li>upstreamUserID: "100"</li>
                 * </ul>
                 */
                setUp : setUp,

                appLaunchEvent : appLaunchEvent,

                appCloseEvent : appCloseEvent,

                loginEvent : loginEvent,

                viewSubscriptionPromptEvent : viewSubscriptionPromptEvent,

                clickedSubscriptionPromptEvent : clickedSubscriptionPromptEvent
            };
        }
    ]);
