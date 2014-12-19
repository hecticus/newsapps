var APP_ID = '320314531485580'; // <----( this is the PhoneGap-Facebook app id
var FB_USER_ID = "";
var FRIENDS_LOADER;
var FRIENDS_LOADER_TIMER = 3000

function initFacebookManager(){
	console.log("initFacebookManager");
	try {
		if (!window.cordova) {
			facebookConnectPlugin.browserInit(APP_ID);
			console.log("facebookConnectPlugin.browserInit("+APP_ID+");");
		}
	} catch (e) {
		//alert(e);
	}
}

function getFBLoginStatus() {
	console.log("getFBLoginStatus");
	try{
		loadFBClientID();
		if(typeof FB_USER_ID === 'undefined' || FB_USER_ID == null ||FB_USER_ID === ""){
			facebookConnectPlugin.login( ["email", "user_friends"],
				function (response) { 
					var authResponse = response.authResponse;
					FB_USER_ID = authResponse.userID;
					saveFBClientID(FB_USER_ID);
					getFBFriends();
					FRIENDS_LOADER = setInterval(getFBFriends(), FRIENDS_LOADER_TIMER);
				},
				function (response) { 
					navigator.notification.alert("Error durante el login con Facebook", doNothing, "Alerta", "OK");
				}
			);
		} else {
			getFBFriends();
			FRIENDS_LOADER = setInterval(getFBFriends(), FRIENDS_LOADER_TIMER);	
		}
	}catch(e){
		navigator.notification.alert("Error durante el login con Facebook", doNothing, "Alerta", "OK");
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
	  	navigator.notification.alert("Error durante el login con Facebook", doNothing, "Alerta", "OK");
	  }
  );
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

