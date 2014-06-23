	var socialfriends = [];
	
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
	  	FB.api('/me/?fields=name,email', function(response) {
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

	var fgetFriends = function(user) {
		

		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
								
			   	FB.api('/me/friends', { fields: 'id, name, picture, installed' }, function(response) {  		

					$.each(response.data, function(index,friend) {
						if (friend.installed) {							
							socialfriends.push(friend.id);															
						};
					});

					$.ajax({
			    		url: '/wsleaderboardfb',
			    		type: 'POST',	            		
			    		dataType: 'json',
			    		data: JSON.stringify({"friends":socialfriends}),
			    		contentType: "application/json; charset=utf-8"
			    	}).always(function () {
						//always    		
					}).done(function(json) {
		
						var _html = '';
						var _rank = 0;
						$.each(json.leaderboard, function(index,leader) {
							
								_rank = (index+1);								
								if (user == leader.id_client) _rank = json.social_client.rank;
								 
								_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: 5px;">';

									if (user == leader.id_client) {
										_html += '<div style="background: #C5E4F6; height: 78px; width:100%; padding: 5px; margin: 0 auto;">';	
									} else {									
										if(index == 0) _html += '<div style="background: #C7DB60; height: 78px; width:100%; padding: 5px; margin: 0 auto;">';				
										else _html += '<div style="background: #CBCBCD; height: 78px; width:100%; padding: 5px; margin: 0 auto;">';																				
									}

									_html += '<div style="background: url(assets/images/usuario3.png) no-repeat left center; height: 73px; width:100%;">';
								
										_html += '<div style=" line-height:73px; height: 73px; width: 30px; float: left; text-align: center; ">';																	
										_html += '</div>';
										
										_html += '<div style="float: left; margin-left: 45px; padding-top: 15px;">';
										_html += '<p>';
										_html += '<span style="font-size: 2em; font-weight:bold; color:#173169; text-transform:uppercase;">' + _rank + '</span><br />';
										_html += '</p>';
										_html += '</div>';
											
										_html += '<div style="float: left; margin-left: 10px; padding-top: 15px;">';
											_html += '<p>';												
												_html += '<span style="font-size: 1em; font-weight:bold; color:#173169; text-transform:uppercase;">' + leader.client.nick + '</span><br />';
												_html += '<span style="font-size: 1em; font-weight:bold;">' + leader.score + ' puntos</span>';
											_html += '</p>';
										_html += '</div>';
																			
									_html += '</div>';
								_html += '</div>';
							
							_html += '</div>';
							_html += '</div>';
							
						});
		
					$('.row.content').html(_html);
													
					}).fail(function( jqXHR, textStatus ) {
						//fail 							
					});		

				});

			};
		});
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
