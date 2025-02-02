var APP_ID = '647787605309095'; // <----( this is the PhoneGap-Facebook app id

function initFacebookManager(){
	try {
		//alert('Device is ready! Make sure you set your app_id below this alert.');
		FB.init({ appId: APP_ID, nativeInterface: CDV.FB, useCachedDialogs: false });

		//INIT OTHER STUFF
		/*These are the notifications that are displayed to the user through pop-ups if the above JS files does not exist in the same directory
		if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
		if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
		if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');*/

		FB.Event.subscribe('auth.login', function(response) {
			//console.log('auth.login event: '+JSON.stringify(response));
			//alert('auth.login event: '+response);
		});

		FB.Event.subscribe('auth.logout', function(response) {
			//alert('auth.logout event: '+JSON.stringify(response));
			//alert('auth.logout event: '+response);
		});

		FB.Event.subscribe('auth.sessionChange', function(response) {
			//alert('auth.sessionChange event: '+JSON.stringify(response));
			//alert('auth.sessionChange event: '+response);
		});

		FB.Event.subscribe('auth.statusChange', function(response) {
			//alert('auth.statusChange event: '+JSON.stringify(response));
			//alert('auth.statusChange event: '+response);
		});

	} catch (e) {
		//alert(e);
	}
}


function getLoginStatus() {
	try{
		FB.getLoginStatus(function(response) {
			if (response.authResponse.session_key) {
	     		FB.api('/me', function(response) {
	     			/*console.log("Obteniendo Info de FACEBOOK");
	     			var temp = {socialId: response.id, email:response.email, userNick:response.name, push_id:response.email}:
	     			console.log("JSON INFO "+temp);
	     			_fGetLoginStatus({socialId: response.id, email:response.email, userNick:response.name, push_id:response.email});*/
				});
	     	} else {
	     		//alert('not logged in');
	     		navigator.notification.alert("Falló el login con Facebook", doNothing, "Alerta", "OK");
	     	}
		});
	}catch(e){
		navigator.notification.alert("Error durante el login con Facebook", doNothing, "Alerta", "OK");
	}
}



var friendIDs = [];
var fdata;


function getFacebookFriends() {
	FB.api('/me/friends', { fields: 'id, name, picture, installed' },  function(response) {
		if (response.error) {
			failedToLoadFriendsLeaderboard();
			//alert(JSON.stringify(response.error));
		   //navigator.notification.alert("Error obteniendo información de Facebook", doNothing, "Alerta", "OK");
		   if(response.error){
					FB.login(
					function(response) {
					if (response.authResponse.session_key) {
							 getFacebookFriends();
					} else {
							 //alert('not logged in');
							 failedToLoadFriendsLeaderboard();
							 navigator.notification.alert("Falló el login con Facebook", doNothing, "Alerta", "OK");
					}
					},{ scope: "email" }
					);
		   }
			
		} else {
			//console.log("fdata: "+fdata);
			var friendList = [];
			response.data.forEach(function(item) {
				/*var d = document.createElement('div');
				d.innerHTML = "<img src="+item.picture+"/>"+item.name;
				data.appendChild(d);*/
				//alert("name "+item.name+" ID:"+item.id+" installed:"+item.installed);
				if(item.installed == true){
					//ese es un cliente a buscar
					friendList.push(item);
				}
			});
			getSocialLeaderboard(friendList);
		}
		/*var friends = response.data;
		//console.log(friends.length); 
		for (var k = 0; k < friends.length && k < 200; k++) {
			var friend = friends[k];
			var index = 1;

			friendIDs[k] = friend.id;
			//friendsInfo[k] = friend;
		}*/
		//console.log("friendId's: "+friendIDs);
	});
}

function logout() {
	FB.logout(function(response) {
		//alert('logged out');
	});
}

function loginByFacebook() {
    FB.login(
     function(response) {
     	if (response.authResponse.session_key) {
     		FB.api('/me', function(response) {
  				_fGetLoginStatus({socialId: response.id, email:response.email, userNick:response.name, push_id:response.email});
			});
     	} else {
     		//alert('not logged in');
     		navigator.notification.activityStop();
     		navigator.notification.alert("Falló el login con Facebook", doNothing, "Alerta", "OK");
     	}
     },{ scope: "email" }
	);
};

function loginToFacebookForFriends() {
	//FB.init({ appId: APP_ID, nativeInterface: CDV.FB, useCachedDialogs: false });
    /*FB.login(
     function(response) {
     	if (response.authResponse.session_key) {
     		getFacebookFriends();
     	} else {
     		//alert('not logged in');
     		failedToLoadFriendsLeaderboard();
     		navigator.notification.alert("Falló el login con Facebook", doNothing, "Alerta", "OK");
     	}
     },{ scope: "email" }
	);*/
	getFacebookFriends();
};

