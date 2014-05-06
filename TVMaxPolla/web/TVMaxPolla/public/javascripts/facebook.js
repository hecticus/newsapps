window.fbAsyncInit = function() {
  FB.init({
    appId      : '647787605309095',
    status     : false, // check login status
    cookie     : false, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
}; 
			  
(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/es_ES/all.js#xfbml=1&appId=647787605309095";
		  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var login_event = function(response) {
		
  if (response.status == 'connected') {
  	FB.api('/me', function(response) {
      	document.getElementById("socialid").value = response.id ;			      	
      	document.forms[0].submit();
    });
  } else if (response.status === 'not_authorized') {
  	fReplace();
  } else {
  	fReplace();
  }
};

var logout_event = function(response) {
  //console.log("logout_event");
  //console.log(response.status);
  //console.log(response);
};


function init()
{
	FB.Event.subscribe('auth.login', login_event);
	FB.Event.subscribe('auth.logout', logout_event);
}


var fejemplo = function() {
	
	FB.getLoginStatus(function(response) {
	  if (response.status === 'connected') {

			FB.api('/me', function(response) {							
		      	document.getElementById("socialid").value = response.id ;					      	
		      	document.getElementById("socialname").value = response.name;					      	
		      	document.getElementById("socialemail").value = response.email;
	      		document.forms[0].submit();
		    });

	  } else if (response.status === 'not_authorized') {
	    // the user is logged in to Facebook, 
	    // but has not authenticated your app
	    FB.login();
	  } else {
	    // the user isn't logged in to Facebook.
	    FB.login();
	  }
	});

};


function fbs_click(width, height,id_social) {
	var leftPosition, topPosition;
	//Allow for borders.
	leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
	//Allow for title and status bars.
	topPosition = (window.screen.height / 2) - ((height / 2) + 50);
	var windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";

	u='http://mundial.tvmax-9.com/share/' + id_social;			
	window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(u),'sharer', windowFeatures);
	return false;
}
