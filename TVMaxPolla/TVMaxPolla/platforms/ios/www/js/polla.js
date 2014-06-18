	//var _basePollaURL = "http://10.0.1.125:9009";
	//var _basePollaURL = "http://10.0.3.144:9002";
	var _basePollaURL = 'http://polla.tvmax-9.com';
	
	var _jPrediction = [];

	//_iClient = _jClient.id_social_clients;
	var _iClient = loadClientData().id_social_clients;

	var _pollaMinGroup = 99;
	var _pollaMaxGroup = 0;
	
	var isPollaPhaseRunning = false;

	var _fGetFlag = function(_team){ 
		var _html = '<figure class="flag">';
		if(_team.flag_file != null){
			_html += '<img onerror="this.style.display=\'none\'" src="img/flags/'+_team.flag_file+'" alt="'+_team.name+'" />';
			_html += '<figcaption>'+_team.shortName+'</figcaption>';
		}else{
			_html += '<span>'+_team.name+'</span>';
		}
		
		_html += '</figure>';
		return _html;
	};
		
		
	
	var _fGetGoal = function(_team){						
		var _html = '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 team '+ _team.class +'" data-team="' + _team.id + '" >';
 		_html += '<div class="row" >';
 		
		_html += '<div class="goal" data-goal="' + _team.score + '" >';
		_html += '<div class="add hidden">+</div>';
		_html += '<div class="score">' + _team.score + '</div>';
		_html += '<div class="sub hidden">-</div>';				
		
		/*_html += '<div class="add hidden">+</div>';
		_html += '<div class="score">' + _team.score + '</div>';
		_html += '<div class="sub hidden">-</div>';*/
		
				
		_html += '</div>';
								
		_html += '</div>';						
 		_html += '</div>';
 		
 		return _html;
	};
		
		
	var _fRenderPrediction = function(){

		$.each(_jPrediction, function(index,phase) {
	    	if (phase.id < 7) {
	    	
				var _hidden;
				//if (phase.id != 1) { _hidden = ' hidden ';}
			
	    	
		    	var _html = '<!-- <phase> -->';
			   	_html += '<div class="row phase ' + _hidden + '" data-phase="'+phase.id+'" >';
			    
		    	_html += '<div class="col-md-12" style="height:40px; line-height:40px; background:#E6E6E6; color: #004117; text-align:center;">';
				_html += '<span style="font-size:1.4em;">' + phase.name + '</span>';
				_html += '</div>';
	
				_html += '<div class="col-md-12">';
		
				var first = true;
				 $.each(phase.groups, function(index, group) {
				 	
				 	_hidden =  '';
				 	//if (group.id != 1) { _hidden = ' hidden ';}
				 	if (!first) { _hidden = ' hidden ';}
				 	first = false;
				 	
				 	//establecemos los maximos y minimos
				 	if(group.id > _pollaMaxGroup){
				 		_pollaMaxGroup = group.id;
				 	}
				 	if(group.id < _pollaMinGroup){
				 		_pollaMinGroup = group.id;
				 	}
				 	
			     	_html += '<!-- <group> -->';
			     	_html += '<div class="row group' + _hidden + '" data-group="'+group.id+'" >';
	
			     	_html += '<div class="col-md-12" style="height:40px; line-height:40px; background:#FFFFFF; color: #3F7AC6; text-align:center; border-bottom: solid #FFD455;">';
					_html += '<span style="font-size:1.4em;">Grupo ' + group.name + '</span>';
					_html += '</div>';
												
					_html += '<div class="col-md-12">';
			     	
			     	
			     	$.each(group.games, function(index, game) {
	
						var _oRenderGame = new _cRenderGame(game);
	
			     		_html += '<!-- <game> -->';
			     		_html += '<div class="row game" data-game="'+game.id+'">';
			     							     					
			     							     					
								     		
			     		_html += '<div class="col-md-12">';
			     		_html += _oRenderGame.fGetAvenue(game);
			     		_html += '</div>';
			     							     		
			     		_html += '<div class="col-md-12">';						     		
			     		_html += _oRenderGame.fGetGame(game);				     							     		
			     		_html += '</div>';
	
			     		_html += '</div>';
			     		_html += '<!-- </game> -->';
	
			     	});
			     	
			     	_html += '</div>';			
		    		
		    		
	
			     	_html += '</div>';
					_html += '<!-- </group> -->';

			     });
	     
				_html += '</div>';
	
			    _html += '</div>';
			    _html += '<!-- </phase> -->';

		    	_html += '</div>';
		
		    	$('#wrapper .scroller .container').empty();
		     	$('#wrapper .scroller .container').append(_html);
		     	
		     	
		     	_html = '<div class="container">';
				
	     		_html = '<div class="row">';
	     		
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 back" style="color:#4D4D4D; background:#ffffff; height:50px; line-height:50px; text-align:left; ">';
				_html += '<span class="icon-polla-back" style="font-size:1.4em; margin-left:5px;"></span>';
				_html += '</div>';
			
				_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 save" style="color:#4D4D4D; background:#ffffff;  height:50px; line-height:50px; text-align:center;">';
				_html += '<span id="polla-save" style="font-size:1.2em;">GUARDAR</span>';
				_html += '</div>';
			
	    		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 next" style="color:#4D4D4D; background:#ffffff; height:50px; line-height:50px; text-align:right; ">';
				_html += '<span class="icon-polla-forward" style="font-size:1.4em; margin-right:5px;"></span>';
				_html += '</div>';
				
				_html += '<div>';
				
				_html += '<div>';	
				
		     	$('footer').html(_html);


						     			     	
		     	$('header .container .row .menu-group').removeClass('hidden');		     	

		     	myScroll.scrollTo(0,0,0);
		     	
		     	_html = '<div class="row">';
		     	
		     	$.each(_jPrediction, function(index,phase) {
		     		 $.each(phase.groups, function(index, group) {				
						_html += '<div class="col-md-12 content-polla-menu" data-group="'+group.id+'"  >';
						_html += '<span>Grupo ' + group.name + '</span>';
						_html += '</div>';
		     		 });
		     	});
		     	
				_html += '</div>';
				$('#wrapper2 .scroller .container').html(_html);
		     	
	    		
	
	    	}else{
	    		navigator.notification.alert("Ya no se pueden realizar más cambios", doNothing, "Alerta", "OK");
	    	}

		});
		
		
	};
	
	
	
	
	
	var _cRenderGame = function(_game){
		this.game = _game;
		
	    this.fGetAvenue = function() {
	        
	        var _date = String(this.game.date);
			var _html = '<!-- <venue> -->';
			
     		_html += '<div class="row venue" data-venue="'+this.game.venue.id+'" >';
     							
				_html += '<div class="col-md-12" style="background-color:#3E79C4; height:40px; line-height:40px; text-align:left; color:#FFD455">';	
				_html += '<span style="font-size:1em;">' + _date.substring(6, 8) +'/' + _date.substring(4, 6) + '</span> ';
   	 			_html += '<span style="font-size:1em;">' + _date.substring(8,10) +':' + _date.substring(11, 13) + '</span> ';				
				_html += '</div>';
				     							
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 " style="font-size:1em; color:#1E5733; height:40px; line-height:40px; text-align:center;">';
				_html += '<span>' +  this.game.venue.name + ' </span>';
				_html += '</div>';
				
     		_html += '</div>';					     							     	
     		_html += '<!-- </venue> -->';
			
			return _html;
	        
	        
		};
		
		this.fGetGame = function() {
	        
	        var _html = '<div class="row">';
 		
     		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 team" data-team="'+this.game.team_a.id+'" >';
				_html += _fGetFlag(this.game.team_a);
     		_html += '</div>';
     		
     		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 score"  >';
	     		_html += '<div class="row">';
	     			_html += _fGetGoal({id:this.game.team_a.id,score:this.game.score_team_a, class:'team-a'}); 			     	
	     			_html += _fGetGoal({id:this.game.team_b.id,score:this.game.score_team_b, class:'team-b'}); 			
	     		_html += '</div>';			     		
     		_html += '</div>';
     		
     		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 team" data-team="'+this.game.team_b.id+'" >';			     		
     			_html += _fGetFlag(this.game.team_b);
     		_html += '</div>';
     		
     		
     		_html += '</div>';
     		
     		return _html;
	        
		};
	};


	$('header .container .row .tv').addClass('hidden');	
	_oAjax = $.fPostAjaXJSON(_basePollaURL+'/matchesapi/v1/clientbet/get/current',{idClient:_iClient});	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			_jPrediction = _json;
			if(_jPrediction!=null && _jPrediction.phase != null && _jPrediction.phase.isRunning != null && _jPrediction.phase.isRunning != ""){
				isPollaPhaseRunning = _jPrediction.phase.isRunning;
				//console.log("POLLA RUNNING "+isPollaPhaseRunning);
			}
			_fRenderPrediction();
		});
	}

	
	


	
	
	










