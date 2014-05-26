var APP_ID = '647787605309095'; // <----( this is the PhoneGap-Facebook app id

function initFacebookManager(){
	try {
		//alert('Device is ready! Make sure you set your app_id below this alert.');
		FB.init({ appId: APP_ID, nativeInterface: CDV.FB, useCachedDialogs: false });

		//INIT OTHER STUFF
		/*These are the notifications that are displayed to the user through pop-ups if the above JS files does not exist in the same directory*/
		if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
		if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
		if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');

		FB.Event.subscribe('auth.login', function(response) {
			console.log('auth.login event: '+JSON.stringify(response));
			//alert('auth.login event: '+response);
		});

		FB.Event.subscribe('auth.logout', function(response) {
			//alert('auth.logout event: '+JSON.stringify(response));
			alert('auth.logout event: '+response);
		});

		FB.Event.subscribe('auth.sessionChange', function(response) {
			//alert('auth.sessionChange event: '+JSON.stringify(response));
			alert('auth.sessionChange event: '+response);
		});

		FB.Event.subscribe('auth.statusChange', function(response) {
			//alert('auth.statusChange event: '+JSON.stringify(response));
			alert('auth.statusChange event: '+response);
		});

	} catch (e) {
		alert(e);
	}
}


function getLoginStatus() {
	FB.getLoginStatus(function(response) {
		if (response.authResponse.session_key) {
     		FB.api('/me', function(response) {
     			_fGetLoginStatus({socialId: response.id});
			});
     	} else {
     		alert('not logged in');
     	}
	});
}



var friendIDs = [];
var fdata;


function me() {
	FB.api('/me/friends', { fields: 'id, name, picture' },  function(response) {
		if (response.error) {
			alert(JSON.stringify(response.error));
		} else {
			var data = document.getElementById('data');
			fdata=response.data;
			console.log("fdata: "+fdata);
			response.data.forEach(function(item) {
				var d = document.createElement('div');
				d.innerHTML = "<img src="+item.picture+"/>"+item.name;
				data.appendChild(d);
			});
		}
		var friends = response.data;
		console.log(friends.length); 
		for (var k = 0; k < friends.length && k < 200; k++) {
			var friend = friends[k];
			var index = 1;

			friendIDs[k] = friend.id;
			//friendsInfo[k] = friend;
		}
		console.log("friendId's: "+friendIDs);
	});
}

function logout() {
	FB.logout(function(response) {
		alert('logged out');
	});
}

function login() {
    FB.login(
     function(response) {
     	if (response.authResponse.session_key) {
     		FB.api('/me', function(response) {
  				_fGetLoginStatus({socialId: response.id});
			});
     	} else {
     		alert('not logged in');
     	}
     },{ scope: "email" }
	);
};

