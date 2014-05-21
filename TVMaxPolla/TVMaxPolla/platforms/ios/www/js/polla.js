	var _jPrediction = [];
	var _iClient = 22;

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
	
	
	$(document).on('touchend','.save', function() {
			
		 
		var _this = $(this).html(_fGetButton('LOADING...'));
		var _jSave = {idClient:_iClient,clientPrediction:{matches:[]}};
		var _phase = $('.phase:visible').data('phase');

		$('.row.phase:visible .group .game').each(function(index) {	
			var _goal = {team_a:0,team_b:0};
			_goal.team_a = $(this).find('.score .team.team-a .goal').data('goal');
			_goal.team_b = $(this).find('.score .team.team-b .goal').data('goal');	
			var _game =  $(this).data('game');
			_jSave.clientPrediction.matches.push({'id_match': _game ,'score_team_a': _goal.team_a,'score_team_b': _goal.team_b});			
		});


		alert(JSON.stringify(_jSave));
		
		_oAjax = $.fPostAjaXJSON('http://10.0.1.125:9009/matchesapi/v1/prediction/save',JSON.stringify(_jSave));	
		if (_oAjax) {
		
			_oAjax.always(function () {
				_this.html(_fGetButton('GUARDAR'));	
			});	
		
			_oAjax.done(function(_msg) {
				if (_msg.error==0) {
					alert('Bien! Tu pronostico se ha guardado con exito.');
				} else {
					alert('Error! Tu pronostico no se ha logrado guardar; Vuelve a intentarlo.');	
				}
			});
			
			_oAjax.fail(function() {
				_this.html(_fGetButton('ERROR'));
			});	
			
		} else {
			_this.html(_fGetButton('GUARDAR'));
		}
		

	

	});
	

	$(document).on('touchend','.back', function(e) {	
											
		var _group = $('.group:visible').data('group');
																	
		if (_group >= 2) {
			$('.group').addClass('hidden');
			$('.group[data-group="'+_group+'"]').prev().removeClass('hidden');	
		}
		
		_group = $('.group:visible').data('group');						
		if (_group == 1) $('.back').addClass('hidden');																
		myScroll.scrollTo(0,0,0);
						
	});
	
	$(document).on('touchend','.next', function(e) {
											
		var _group = $('.group:visible').data('group');									
		$('.group').addClass('hidden');
		$('.group[data-group="'+_group+'"]').next().removeClass('hidden');
		$('.back').removeClass('hidden');
								
		myScroll.scrollTo(0,0,0);	
		e.preventDefault();
		
		
	});
	
	$(document).on('touchend','.add', function(e) {
		var _tGoal = $(this).parent().data('goal');
		_tGoal = parseInt(_tGoal + 1);
		$(this).parent().data('goal',_tGoal);
		$(this).parent().find('.score').html(_tGoal);
	});
	
	$(document).on('touchend','.sub', function(e) {
		var _tGoal = $(this).parent().data('goal');
		_tGoal = parseInt(_tGoal - 1);					
		if (_tGoal <= 0)  _tGoal = 0;					
		$(this).parent().data('goal',_tGoal);
		$(this).parent().find('.score').html(_tGoal);
	});	


	$(document).on('tap','.flag', function(e) {
						
		$('.goal').removeClass('gol');
		$('.add, .sub').addClass('hidden');
		
		var _team = $(this).parent().data('team');
		var _game = $(this).parents('.row.game').data('game');
		var _goal = $('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').data('goal');
		
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .add').removeClass('hidden');
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .sub').removeClass('hidden');
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').addClass('gol');

	});

	$(document).on('tap','.goal', function(e) {
						
		$('.goal').removeClass('gol');
		$('.add, .sub').addClass('hidden');
		
		var _team = $(this).parents('.team').data('team');
		var _game = $(this).parents('.row.game').data('game');
		var _goal = $('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').data('goal');
		
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .add').removeClass('hidden');
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .sub').removeClass('hidden');
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').addClass('gol');


	});

	
	_oAjax = $.fPostAjaXJSON('http://10.0.1.125:9009/matchesapi/v1/phase/get/client/matches/current',{idClient:_iClient});	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			_jPrediction = _json;		
			_fRenderPrediction();
		});
	}

	