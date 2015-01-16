'use strict';

/**
 * @ngdoc service
 * @name core.Services.FacebookManager
 * @description FacebookManager Factory
 */
angular
    .module('core')
    .factory('FacebookManager',['Utilities',
        function(Utilities) {
            return {

                FB_USER_ID : '',
                INTERVAL_FRIENDS_LOADER : '',
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
                    try{
                        this.loadFBClientID();
                        if(!FB_USER_ID){
                            var that = this;
                            facebookConnectPlugin.login( ["email", "user_friends","public_profile"
                                    , "user_friends"],
                                function (response) {
                                    var authResponse = response.authResponse;
                                    that.FB_USER_ID = authResponse.userID;
                                    that.saveFBClientID(FB_USER_ID);
                                    that.INTERVAL_FRIENDS_LOADER = setInterval(getFBStatus
                                        , that.INTERVAL_FRIENDS_LOADER_TIMER);
                                },
                                function (response) {
                                    alert("Error durante el login con Facebook: "+response
                                        , Utilities.doNothing, "Alerta", "OK");
                                }
                            );
                        } else {
                            this.INTERVAL_FRIENDS_LOADER = setInterval(getFBStatus
                                , this.INTERVAL_FRIENDS_LOADER_TIMER);
                        }
                    }catch(e){
                        alert("Error durante el login con Facebook exp: "+e
                            , Utilities.doNothing, "Alerta", "OK");
                    }
                },

                logout: function () {
                    facebookConnectPlugin.logout(
                        function (response) {},
                        function (response) {}
                    );
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
                            saveFBFriends(friends);
                        },
                        function (error) {
                            alert("Error durante el login con Facebook, friends: "+JSON.stringify(error)
                                , Utilities.doNothing, "Alerta", "OK");
                        }
                    );
                },

                //get status of facebook account
                getFBStatus : function (){
                    facebookConnectPlugin.getLoginStatus(
                        function (result) {
                            try{
                                if(result.status == "connected"){
                                    //alert("getFriends", doNothing, "Alerta", "OK");
                                    this.getFBFriends();
                                }else{
                                    //try to login again
                                    //alert("No login Facebook try again", doNothing, "Alerta", "OK");
                                    this.deleteFBClientID();
                                    this.getFBLoginStatus();
                                }

                            }catch(e){
                                alert("ERROR FACEBOOK STATUS: "+e, Utilities.doNothing, "Alerta", "OK");
                            }
                        },
                        function (error) {
                            //alert("Error durante el getStatus con Facebook:
                            // "+JSON.stringify(error), doNothing, "Alerta", "OK");
                            this.deleteFBClientID();
                            this.getFBLoginStatus();
                        });
                },

                saveFBClientID : function (_clientID) {
                    try{
                        this.clientID = _clientID;
                        window.localStorage.setItem(this.FILE_KEY_FB_CLIENT_ID,""+clientID);
                        return true;
                    }catch(err){
                        return false;
                    }
                },

                loadFBClientID : function () {

                    this.FB_USER_ID = window.localStorage.getItem(this.FILE_KEY_FB_CLIENT_ID);
                },

                deleteFBClientID : function () {
                    //TODO ngStorage
                    window.localStorage.removeItem(this.FILE_KEY_FB_CLIENT_ID);
                },

                saveFBFriends : function (friends) {
                    try{
                        //TODO ngStorage
                        window.localStorage.removeItem(this.FILE_KEY_FB_FRIENDS);
                        window.localStorage.setItem(this.FILE_KEY_FB_FRIENDS, JSON.stringify(friends));
                        return true;
                    }catch(err){
                        return false;
                    }
                },

                getLocalFBFriends : function () {
                        //TODO ngStorage
                        return window.localStorage.getItem(this.FILE_KEY_FB_FRIENDS);
                    }
                }
        }
    ]);
