	//var basePollaURL = "http://10.0.1.125:9009";
	var basePollaURL = "http://10.0.3.142:9002";

	var _jPrediction = [];
	//var _iClient = 22;
	var _iClient = 3;

	var _fGetFlag = function(_team){ 
		var _html = '<figure class="flag">';					     		
		_html += '<img onerror="this.style.display=\'none\'" src="img/flags/'+_team.flag_file+'" alt="'+_team.name+'" />';
		_html += '<figcaption>'+_team.shortName+'</figcaption>';
		_html += '</figure>';
		return _html;
	};
		
		
	var _fGetButton= function(_caption){
		return '<h2 style="padding:5px; text-align:center;">' + _caption + '</h2>';	
	};	
			
	var _fGetGoal = function(_team){						
		var _html = '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 team '+ _team.class +'" data-team="' + _team.id + '" >';
 		_html += '<div class="row" >';
 		
		_html += '<div class="goal" data-goal="' + _team.score + '" >';
		_html += '<div class="add hidden" >+</div>';
		_html += '<div class="score">' + _team.score + '</div>';
		_html += '<div class="sub hidden" >-</div>';						
		_html += '</div>';
								
		_html += '</div>';						
 		_html += '</div>';
 		
 		return _html;
	};
		
		
	var _fRenderPrediction = function(){

		$.each(_jPrediction, function(index,phase) {

	    	if (phase.id != 5) {
	    	
				var _hidden;
				if (phase.id != 1) { _hidden = ' hidden ';}
			
	    	
		    	var _html = '<!-- <phase> -->';
			   	_html += '<div class="row phase ' + _hidden + '" data-phase="'+phase.id+'" >';
			    
		    	_html += '<div class="col-md-12" style="background-color:brown;">';
				_html += '<h3>' + phase.name + '</h3>';
				_html += '</div>';
	
				_html += '<div class="col-md-12">';
		
	
				 $.each(phase.groups, function(index, group) {
				 	
				 	_hidden =  '';
				 	if (group.id != 1) { _hidden = ' hidden ';}
				 	
			     	_html += '<!-- <group> -->';
			     	_html += '<div class="row group ' + _hidden + '" data-group="'+group.id+'" >';
	
			     	_html += '<div class="col-md-12" style="background-color:yellow;">';
					_html += '<h3>GRUPO ' + group.name + '</h3>';
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
	
	
		    		var _class = 'next';
		    		var _caption = 'CONTINUAR';
		    		if ((phase.groups.length-1) == index) {
		    			_caption = 'GUARDAR';
		    			_class = 'save';	
		    		}						    		 
		    		
					_html += '<div id=""  class="col-md-12 '+ _class +'" style="background:white;">';
		    		_html += _fGetButton(_caption);	
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
	    		myScroll.scrollTo(0,0,0);
	
	    	}

		});
		
		
	};
	
	
	var _cRenderGame = function(_game){
		this.game = _game;
		
	    this.fGetAvenue = function() {
	        
	        var _date = String(this.game.date);
			var _html = '<!-- <venue> -->';
			
     		_html += '<div class="row venue" data-venue="'+this.game.venue.id+'" >';
     							     		
     		_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';					     		
   	 		_html += '<span>' + _date.substring(6, 8) +'/' + _date.substring(4, 6) + '</span> ';
   	 		_html += '<span>' + _date.substring(8,10) +':' + _date.substring(11, 13) + '</span> ';
   	 		_html += '</div>';
   	 		
			_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
			_html += '<span>'+this.game.venue.name+'</span>';
   	 		_html += '</div>';
   	 		
     		_html += '</div>';					     							     	
     		_html += '<!-- </venue> -->';
			
			return _html;
	        
	        
		};
		
		this.fGetGame = function() {
	        
	        var _html = '<div class="row">';
 		
     		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 team" data-team="'+this.game.team_a.id+'"  style="background-color: green;" >';
				_html += _fGetFlag(this.game.team_a);
     		_html += '</div>';
     		
     		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 score"  >';
	     		_html += '<div class="row">';
	     			_html += _fGetGoal({id:this.game.team_a.id,score:this.game.score_team_a, class:'team-a'}); 			     	
	     			_html += _fGetGoal({id:this.game.team_b.id,score:this.game.score_team_b, class:'team-b'}); 			
	     		_html += '</div>';			     		
     		_html += '</div>';
     		
     		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 team" data-team="'+this.game.team_b.id+'" style="background-color: red;" >';			     		
     			_html += _fGetFlag(this.game.team_b);
     		_html += '</div>';
     		
     		
     		_html += '</div>';
     		
     		return _html;
	        
		};
	};

	
	_oAjax = $.fPostAjaXJSON(basePollaURL+'/matchesapi/v1/clientbet/get/current',{idClient:_iClient});	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			console.log("HTTP Complete");
			_jPrediction = _json;		
			_fRenderPrediction();
		});
	}

	