'use strict';

/**
 * @ngdoc service
 * @name core.Services.FacebookManager
 * @description FacebookManager Factory
 */
angular
    .module('core')
    .factory('FacebookManager',['$localStorage',
        function($localStorage) {
            var that = this;
            var fbUserId = '';
            var intervalFriendsLoaderId = '';
            var localStorage = $localStorage;

            return {

                getFbUserId : function(){
                    return fbUserId;
                },
                getIntervalFriendsLoader : function(){
                    return intervalFriendsLoaderId;
                },
                setIntervalFriendsLoader : function(){
                    intervalFriendsLoaderId = setInterval(
                        that.getFBStatus(), this.INTERVAL_FRIENDS_LOADER_TIMER
                    );
                },
                clearIntervalFriendsLoader : function(){
                    clearInterval(intervalFriendsLoaderId);
                },
                INTERVAL_FRIENDS_LOADER_TIMER : 30000,
                FILE_KEY_FB_CLIENT_ID : "APPDATAFBCLIENTID",
                FILE_KEY_FB_FRIENDS : "APPDATAFBFRIENDS",

                /**
                 * @ngdoc function
                 * @name core.Services.FacebookManager#method1
                 * @methodOf core.Services.FacebookManager
                 * @return {boolean} Returns a boolean value
                 */
                method1: function() {
                    return true;
                },

                /**
                 * @ngdoc function
                 * @name core.Services.FacebookManager#getFBLoginStatus
                 * @methodOf core.Services.FacebookManager
                 * @return {boolean} Returns a boolean value
                 */
                getFBLoginStatus : function () {
                    console.log("getFBLoginStatus");
                    try {
                        this.loadFBClientID();
                        if(!fbUserId){
                            facebookConnectPlugin.login(
                                ["email", "user_friends", "public_profile", "user_friends"]
                                , function (response) {
                                    var authResponse = response.authResponse;
                                    fbUserId = authResponse.userID;
                                    that.saveFBClientID(fbUserId);
                                    that.setIntervalFriendsLoader();
                                }
                                , function (response) {
                                    alert("Error durante el login con Facebook: "+response
                                        , function(){}, "Alerta", "OK");
                                }
                            );
                        } else {
                            this.setIntervalFriendsLoader();
                        }
                    } catch(e) {
                        //TODO revisar, alerts no deben existir
                        alert("Error durante el login con Facebook exp: "+e
                            , function(){}, "Alerta", "OK");
                    }
                },

                logout: function () {
                    facebookConnectPlugin.logout(
                        function (response) {},
                        function (response) {}
                    );
                },

                getFBStatus : function (){
                    facebookConnectPlugin.getLoginStatus(
                        function (result) {
                            try{
                                if(result.status == "connected"){
                                    this.getFBFriends();
                                }else{
                                    this.deleteFBClientID();
                                    this.getFBLoginStatus();
                                }

                            }catch(e){
                                //TODO revisar, alerts no deben existir
                                alert("ERROR FACEBOOK STATUS: " + e, function(){}, "Alerta", "OK");
                            }
                        },
                        function (error) {
                            this.deleteFBClientID();
                            this.getFBLoginStatus();
                        });
                },

                saveFBClientID : function (_fbUserId) {
                    try{
                        fbUserId = _fbUserId;
                        localStorage[this.FILE_KEY_FB_CLIENT_ID] = fbUserId;
                        return true;
                    }catch(err){
                        return false;
                    }
                },

                loadFBClientID : function () {
                    fbUserId = localStorage[this.FILE_KEY_FB_CLIENT_ID];
                },

                deleteFBClientID : function () {
                    fbUserId = null;
                    delete localStorage[this.FILE_KEY_FB_CLIENT_ID];
                },

                getFBFriends : function () {
                    facebookConnectPlugin.api('/me/friends?fields=picture,name'
                        , ["public_profile", "user_friends"],
                        function (result) {
                            var friends = result.data;
                            var more = 'next' in result.paging;
                            while(more){
                                $.ajax({
                                    url : result.paging.next,
                                    type: 'GET',
                                    contentType: "application/json; charset=utf-8",
                                    dataType: 'json',
                                    timeout : 60000,
                                    async: false,
                                    success : function(data, status) {
                                        result = data;
                                        more = 'next' in result.paging;
                                        friends = friends.concat(result.data);
                                    },
                                    error : function(xhr, ajaxOptions, thrownError) {
                                        more = false;
                                    }
                                });
                            }
                            this.saveFBFriends(friends);
                        },
                        function (error) {
                            //TODO revisar, alerts no deben existir
                            alert("Error durante el login con Facebook, friends: "+JSON.stringify(error)
                                , function(){}, "Alerta", "OK");
                        }
                    );
                },

                getLocalFBFriends : function () {
                    return localStorage[this.FILE_KEY_FB_FRIENDS];
                },

                saveFBFriends : function (friends) {
                    try{
                        delete localStorage[this.FILE_KEY_FB_FRIENDS];
                        localStorage[this.FILE_KEY_FB_FRIENDS] = JSON.stringify(friends);
                        return true;
                    }catch(err){
                        return false;
                    }
                }
            }
        }
    ]);
