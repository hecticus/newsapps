	var _ClientObj = loadClientData();
	var _iClient = _ClientObj.id_social_clients;
	var currentRanking;
	
	var isSocialClient = false;
	if(_ClientObj.id_social != null && _ClientObj.id_social != ""){
		isSocialClient = true;
	}
	
	if(!isSocialClient){
		$('#leaderboard_social_menu').hide();
		//col-xs-6 col-sm-6 col-md-6 col-lg-6
		$('#leaderboard_global_menu').removeClass("col-xs-6");
		$('#leaderboard_global_menu').addClass("col-xs-12");
		$('#leaderboard_global_menu').removeClass("col-sm-6");
		$('#leaderboard_global_menu').addClass("col-sm-12");
		$('#leaderboard_global_menu').removeClass("col-md-6");
		$('#leaderboard_global_menu').addClass("col-md-12");
		$('#leaderboard_global_menu').removeClass("col-lg-6");
		$('#leaderboard_global_menu').addClass("col-lg-12");
	}
	
	function loadAndShowFriends(){
		_fGetLoading();
		loginToFacebookForFriends();
	}
	
	function failedToLoadFriendsLeaderboard(){
		_fGetLoadingError();
	}
	
	var _jLeaderboardItemsSocial;
	
	function getSocialLeaderboard(friendList){
		//Obtenemos toda la lista de clientes para pasarla al WS
		var socialIDs = "";
		for(var i=0;i<friendList.length;i++){
			var social_id = friendList[i].id;
			socialIDs+=social_id+",";
		}
		
		//KrakenSocialLeaderboards/v1/leaderboard/facebook/1/2/699300099,1079599281,880505327
		//192.168.1.128
		//http://api.hecticus.com/KrakenSocialLeaderboards/v1/leaderboard/facebook/1/
		_oAjax2 = $.fGetAjaXJSON('http://api.hecticus.com/KrakenSocialLeaderboards/v1/leaderboard/facebook/1/'+_iClient+"/"+socialIDs,false,false,true);	
		if (_oAjax2) {
			_oAjax2.done(function(_json) {
				if(_json!=null && _json.response != null){
					currentRanking = _json.response.rank;
					if(_json.response.leaderboard != null){
						_jLeaderboardItemsSocial = _json.response.leaderboard;			
						_fRenderFriendsLeaderboard(friendList);	
					}
				}	
			});
		}
	}
	
	var _fRenderFriendsLeaderboard = function(friendList) {
		//console.log("RenderFriends!!! FRIENDS?");
		//console.log("RenderFriends!!! "+JSON.stringify(friendList));
		
		var _html = '<div class="row" style="margin:5%;">';
		
		$.each(_jLeaderboardItemsSocial, function(_index,_player) {
			
			var clientData=_player.client;
			var login = clientData.nick;
			var idSocial = clientData.id_social;
			var emailIndex = login.indexOf("@");
			var rank = (_index+1);
			var score = _player.score;
			if(emailIndex >= 0){
				//cortamos el correo para que no salga en pantalla
				login = login.substring(0,emailIndex);
			}
			/*_html += '<div class="col-md-12 player">';
			_html += '<span>' +  rank + '</span>';
			_html += '<img src="img/leaderboard_noimage.png">';					
			_html += '<span>' +  login + '</span>';
			_html += '<span>' +  score + '</span>';
		 	_html += '</div>';*/
			var image = getImageFromFacebookList(friendList,idSocial);
			
			_html += '<div class="media" style="background-color:#cbcbcd; padding:5px;">';
			_html += '<a href="#" class="pull-left">';
			_html += '<p style="color:#000; line-height: 60px; margin-left:10px;margin-right:5px;">' +  rank + '</p>';
			_html += '</a>';
			_html += '<a href="#" class="pull-left">';
			if(image != null){
				_html += '<img src="'+image+'" class="media-object" alt="img/leaderboard_noimage.png" style="width:52px; height: 68px;">';
			}else{
				_html += '<img src="img/leaderboard_noimage.png" class="media-object" alt="img/leaderboard_noimage.png" style="width:52px; height: 68px;">';
			}
			_html += '</a>';
			_html += '<div class="media-body">';
			_html += '<h4 class="media-heading">' +  login + '</h4>';
			_html += '<p>PUNTOS: '+score+'</p>';
			_html += '</div>';
			_html += '</div>';
		 	
		 	//console.log('LEYENDAS' + _player.title );
		});

		_html += '</div>';
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
	}
	
	function getImageFromFacebookList(friendList, social_id){
		for(var i=0;i<friendList.length; i++){
			//console.log("Va a revisar: "+friendList[i].id+" / "+social_id);
			if(friendList[i].id == social_id){
				//console.log("Encontro out: "+JSON.stringify(friendList[i]));
				if(friendList[i].picture!= null && friendList[i].picture.data != null && friendList[i].picture.data.url != null){
					//console.log("Encontro "+friendList[i].picture.data.url);
					return friendList[i].picture.data.url;
				}else{
					return null;
				}
			}
		}
		return null;
	}
	
	var _fRenderGlobalLeaderboard = function() {

		var _html = '<div class="row" style="margin:5%;">';
		
		$.each(_jLeaderboardItems, function(_index,_player) {
			var clientData=_player.client;
			var login = clientData.nick;
			var emailIndex = login.indexOf("@");
			var rank = (_index+1);
			var score = _player.score;
			if(emailIndex >= 0){
				//cortamos el correo para que no salga en pantalla
				login = login.substring(0,emailIndex);
			}
			/*_html += '<div class="col-md-12 player">';
			_html += '<span>' +  rank + '</span>';
			_html += '<img src="img/leaderboard_noimage.png">';					
			_html += '<span>' +  login + '</span>';
			_html += '<span>' +  score + '</span>';
		 	_html += '</div>';*/
			
			_html += '<div class="media" style="background-color:#cbcbcd; padding:5px;">';
			_html += '<a href="#" class="pull-left">';
			_html += '<p style="color:#000; line-height: 60px; margin-left:10px;margin-right:5px;">' +  rank + '</p>';
			_html += '</a>';
			_html += '<a href="#" class="pull-left">';
			_html += '<img src="img/leaderboard_noimage.png" class="media-object" alt="img/leaderboard_noimage.png" style="width:52px; height: 68px;">';
			_html += '</a>';
			_html += '<div class="media-body">';
			_html += '<h4 class="media-heading">' +  login + '</h4>';
			_html += '<p>PUNTOS: '+score+'</p>';
			_html += '</div>';
			_html += '</div>';
		 	
		 	//console.log('LEYENDAS' + _player.title );
		});

		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
	};
	
	var _jLeaderboardItems;
	
	//cargamos leaderboard global primero
//http://127.0.0.1:9000/KrakenSocialLeaderboards/v1/leaderboard/rank/1/2935
//http://api.hecticus.com/KrakenSocialLeaderboards/v1/leaderboard/rank/1/'+_iClient
	_oAjax = $.fGetAjaXJSON('http://api.hecticus.com/KrakenSocialLeaderboards/v1/leaderboard/rank/1/'+_iClient,false,false,true);	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			if(_json!=null && _json.response != null){
				currentRanking = _json.response.rank;
				if(_json.response.leaderboard != null){
					_jLeaderboardItems = _json.response.leaderboard;			
					_fRenderGlobalLeaderboard();	
				}
			}	
		});
	}