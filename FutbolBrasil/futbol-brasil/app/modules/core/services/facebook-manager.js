'use strict';

/**
 * @ngdoc service
 * @name core.Services.FacebookManager
 * @description FacebookManager Factory
 */
angular
    .module('core')
    .factory('FacebookManager',['$localStorage', '$http', 'Client',
        function($localStorage, $http, Client) {
            var INTERVAL_FRIENDS_LOADER_TIMER = 30000;
            var FILE_KEY_FB_USER_ID = "APPDATAFBUSERID";
            var FILE_KEY_FB_FRIENDS = "APPDATAFBFRIENDS";
            var fbUserId = '';
            var intervalFriendsLoaderId = '';
            var localStorage = $localStorage;

            var saveUserId = function (_fbUserId) {
                try{
                    fbUserId = _fbUserId;
                    localStorage[FILE_KEY_FB_USER_ID] = fbUserId;
                    return true;
                }catch(err){
                    return false;
                }
            };

            var loadUserId = function () {
                fbUserId = localStorage[FILE_KEY_FB_USER_ID];
            };

            var deleteUserId = function () {
                fbUserId = null;
                delete localStorage[FILE_KEY_FB_USER_ID];
            };

            var getLocalFriends = function () {
                return JSON.parse(localStorage[FILE_KEY_FB_FRIENDS]);
            };

            var saveFriends = function (friends) {
                if(!!friends){
                    delete localStorage[FILE_KEY_FB_FRIENDS];
                    localStorage[FILE_KEY_FB_FRIENDS] = JSON.stringify(friends);
                    Client.setFriends(friends);
                    return true;
                } else {
                    console.log('FacebookManager. saveFriends. error. Invalid friends');
                    return false;
                }
            };

            var getMoreFriends = function(url, callback){
                $http.get(url, {timeout: 60000}).success(function(result, status) {
                    var more = result.paging.hasOwnProperty('next');
                    var friends = result.data;
                    if(friends.length > 0){
                        console.log('FacebookManager. getMoreFriends. Got more Friends. Persisting.');
                        friends = getLocalFriends().concat(friends);
                        saveFriends(friends);
                        if(more){
                            console.log('FacebookManager. getMoreFriends. Got still more Friends. Retrieving.');
                            getMoreFriends(callback);
                        } else {
                            console.log('FacebookManager. getMoreFriends. No more friends. Executing Callback');
                            typeof callback == 'function' && callback(friends);
                        }
                    } else {
                        console.log('FacebookManager. getMoreFriends. No more friends. Executing Callback');
                        typeof callback == 'function' && callback(getLocalFriends());
                    }
                });
            };

            return {

                getUserId : function(){
                    return fbUserId;
                },

                getIntervalFriendsLoader : function(){
                    return intervalFriendsLoaderId;
                },

                setIntervalFriendsLoader : function(){
                    var that = this;
                    intervalFriendsLoaderId = setInterval(
                        that.getStatus(), INTERVAL_FRIENDS_LOADER_TIMER
                    );
                },

                clearIntervalFriendsLoader : function(){
                    try {
                        clearInterval(intervalFriendsLoaderId);
                    } catch(e){}
                },

                /**
                 * @ngdoc function
                 * @name core.Services.FacebookManager#login
                 * @methodOf core.Services.FacebookManager
                 * @return {boolean} Returns a boolean value
                 */
                login : function () {
                    var that = this;

                    facebookConnectPlugin.login(
                        ["email", "user_friends", "public_profile", "user_friends"]
                        , function (response) {
                            console.log(JSON.stringify(response, undefined, 1));
                            var authResponse = response.authResponse;
                            fbUserId = authResponse.userID;
                            saveUserId(fbUserId);
                            that.setIntervalFriendsLoader();
                            that.getFriends();
                        }
                        , function (response) {
                            console.log("FacebookManager. login. Error: "
                                + JSON.stringify(response, undefined, 1));
                        }
                    );
                },

                login2 : function (response) {
                    var that = this;
                    var authResponse = response.authResponse;
                    fbUserId = authResponse.userID;
                    saveUserId(fbUserId);
                    that.setIntervalFriendsLoader();
                    that.getFriends();
                },



                logout: function (successCallback, errorCallback) {
                    facebookConnectPlugin.logout(successCallback, errorCallback);
                },


                /**
                 * @ngdoc function
                 * @name core.Services.FacebookManager#login
                 * @description Posible status values:
                 * - connected: The person is logged into Facebook, and has logged into your app.
                 * - not_authorized: The person is logged into Facebook, but has not logged into your app.
                 * - unknown: The person is not logged into Facebook, so
                 * you don't know if they've logged into your app.
                 * @methodOf core.Services.FacebookManager
                 * @return {boolean} Returns a boolean value
                */
                getStatus : function (callback){
                    console.log("FacebookManager. getStatus.");
                    facebookConnectPlugin.getLoginStatus(
                        function (result) {
                            typeof callback == 'function' && callback(result);
                        },
                        function (error) {
                            deleteUserId();
                            typeof callback == 'function' && callback(null);
                        });
                },

                getFriends : function (callback) {
                    facebookConnectPlugin.api('/me/friends?fields=picture,name'
                        , ["public_profile", "user_friends"],
                        function (result) {
                            var friends = result.data;
                            console.log('FacebookManager.getFriends. result: ');
                            console.log(friends);
                            saveFriends(friends);
                            var more = result.paging.hasOwnProperty('next');
                            console.log('more: ' + more);
                            if(more == true){
                                console.log('more. true');
                                getMoreFriends(result.paging.next, callback);
                            } else if (more == false){
                                console.log('getFriends: more. false. calling callback: ' + (typeof callback == 'function'));
                                typeof callback == 'function' && callback(friends);
                            }
                        },
                        function (error) {
                            console.log("FacebookManager. getFriends. Error: "
                                + JSON.stringify(error, undefined, 1));
                            typeof callback == 'function' && callback(null);
                        }
                    );
                },

                getLocalFriends : getLocalFriends
            }
        }
    ]);
