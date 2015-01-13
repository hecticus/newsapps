var FB_USER_ID = "";
var INTERVAL_FRIENDS_LOADER;
var INTERVAL_FRIENDS_LOADER_TIMER = 30000;

function getFBLoginStatus() {
	console.log("getFBLoginStatus");
	try{
		loadFBClientID();
		if(typeof FB_USER_ID === 'undefined' || FB_USER_ID == null ||FB_USER_ID === ""){
			facebookConnectPlugin.login( ["email", "user_friends","public_profile", "user_friends"],
				function (response) { 
					var authResponse = response.authResponse;
					FB_USER_ID = authResponse.userID;
					saveFBClientID(FB_USER_ID);
					INTERVAL_FRIENDS_LOADER = setInterval(getFBStatus, INTERVAL_FRIENDS_LOADER_TIMER);
				},
				function (response) { 
					alert("Error durante el login con Facebook: "+response, doNothing, "Alerta", "OK");
				}
			);
		} else {
			INTERVAL_FRIENDS_LOADER = setInterval(getFBStatus, INTERVAL_FRIENDS_LOADER_TIMER);
		}
	}catch(e){
		alert("Error durante el login con Facebook exp: "+e, doNothing, "Alerta", "OK");
	}
}

function logout() { 
	facebookConnectPlugin.logout( 
		function (response) {},
		function (response) {}
	);
}

function getFBFriends() { 
	facebookConnectPlugin.api('/me/friends?fields=picture,name', ["public_profile", "user_friends"],
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
	  	alert("Error durante el login con Facebook, friends: "+JSON.stringify(error), doNothing, "Alerta", "OK");
	  }
  );
}

//get status of facebook account
function getFBStatus(){
	facebookConnectPlugin.getLoginStatus(
			function (result) {
				try{
					if(result.status == "connected"){
						//alert("getFriends", doNothing, "Alerta", "OK");
						getFBFriends();
					}else{
						//try to login again
						//alert("No login Facebook try again", doNothing, "Alerta", "OK");
						deleteFBClientID();
						getFBLoginStatus();
					}
					
				}catch(e){
					alert("ERROR FACEBOOK STATUS: "+e, doNothing, "Alerta", "OK");
				}
			}, 
			function (error) {
				//alert("Error durante el getStatus con Facebook: "+JSON.stringify(error), doNothing, "Alerta", "OK");
				deleteFBClientID();
				getFBLoginStatus();
			});
}

var FILE_KEY_FB_CLIENT_ID = "APPDATAFBCLIENTID";
var FILE_KEY_FB_FRIENDS = "APPDATAFBFRIENDS";

function saveFBClientID(_clientID) {
	try{
		clientID = _clientID;
		window.localStorage.setItem(FILE_KEY_FB_CLIENT_ID,""+clientID);
		return true;
	}catch(err){
		return false;
	}
}

function loadFBClientID() {
	FB_USER_ID = window.localStorage.getItem(FILE_KEY_FB_CLIENT_ID);
}

function deleteFBClientID() {
	window.localStorage.removeItem(FILE_KEY_FB_CLIENT_ID);
}

function saveFBFriends(friends) {
	try{
		window.localStorage.removeItem(FILE_KEY_FB_FRIENDS);
		window.localStorage.setItem(FILE_KEY_FB_FRIENDS, JSON.stringify(friends));
		return true;
	}catch(err){
		return false;
	}
}

function getLocalFBFriends() {
	return window.localStorage.getItem(FILE_KEY_FB_FRIENDS);
}

