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
  	FB.api('/me?fields=name,email', function(response) {
      	document.getElementById("socialid").value = response.id;				      	
		document.getElementById("socialname").value = response.name;					      	
		document.getElementById("socialemail").value = response.email;
      	document.forms[0].submit();
    });
  } else if (response.status === 'not_authorized') {
  	return false;
  } else {
  	return false;
  }
  
};



	var fejemplo = function() {
		
		FB.getLoginStatus(function(response) {
		  if (response.status === 'connected') {
			   login_event(response);	
		  } else if (response.status === 'not_authorized') {
		    // the user is logged in to Facebook, 
		    // but has not authenticated your app
		    //FB.login();
		    
		    FB.login(function(response) {
	          if (response.authResponse){
	            login_event(response);
	          }
	        },{scope: 'email'});
		    	
		  } else {
		    // the user isn't logged in to Facebook.
		   	FB.login(function(response) {
	          if (response.authResponse){
	            login_event(response);
	          }
	        },{scope: 'email'});
		  }
		});
	
	};


	function fbs_click(width, height,id_social) {
	 	
	        // calling the API ...
    	var obj = {
	      method: 'feed',
	      redirect_uri: 'http://mundial.tvmax-9.com/polla/',
	      link: 'http://mundial.tvmax-9.com/polla/?page=share&id=' + id_social,
	      picture: 'http://polla.tvmax-9.com/assets/images/thumbnail_logo.png',
	      name: 'La Polla Mundial TvMax - Brasil 2014',
	      description: 'Ya armé La Polla Mundial TvMax - Brasil 2014, elige al próximo campeón del mundo y a quiénes le tiene que ganar para levantar la copa. Te toca a ti, arma el tuyo y compártelo.'
        };
	 
       	function callback(response) {
         //	alert('La polla se ha publicado con éxito');
         	return true;
        }
 
        FB.ui(obj, callback);
}
