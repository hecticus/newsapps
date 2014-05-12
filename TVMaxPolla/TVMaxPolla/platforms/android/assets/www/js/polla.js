var jPrediction = [];
var arrPhase = [];
var arrGroup = [];
var arrTeamGame = [];
var arrTeam = [];			
var arrGame = [];
var arrDataTeam = [];

	$( document ).ready(function() {
					
					var _fGetFlag = function(team){ 
						var _html = '<figure class="flag">';					     		
						_html += '<img onerror="this.style.display=\'none\'" src="img/flags/'+team.flag_file+'" alt="'+team.name+'" />';
						_html += '<figcaption>'+team.shortName+'</figcaption>';
						_html += '</figure>';
						return _html;
					};
					
					
					var _fGetGoal = function(team){						
						var _html = '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 team '+ team.class +'" data-team="'+team.id+'" >';
			     		_html += '<div class="row" >';
			     		
						_html += '<div class="goal" data-goal="'+team.score+'" >';
						_html += '<div class="add hidden" >+</div>';
						_html += '<div class="score">' + team.score + '</div>';
						_html += '<div class="sub hidden" >-</div>';						
						_html += '</div>';
												
						_html += '</div>';						
			     		_html += '</div>';
			     		
			     		return _html;
					};
					
					
					var _fRenderPrediction = function(){

						$.each(jPrediction, function(index,phase) {	
	
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
						    		_html += '<h2 style="padding:5px; text-align:center;">' + _caption + '</h2>';	
						    		_html += '</div>';					    	
						    		
		
							     	_html += '</div>';
									_html += '<!-- </group> -->';
							     	
							     	
							     	
							    	
							    	
							     	
		
							     });
					     
						
								_html += '</div>';
		
							    _html += '</div>';
							    _html += '<!-- </phase> -->';
							    
							    
							   
						     	
		
						
						    	_html += '</div>';
						
						    
						     	$('#container').append(_html);
					    		myScroll.scrollTo(0,0,0);

					    	}
	
					});
					
					
				};
				
				
				var _cRenderGame = function(game){
    				this.game = game;
    				
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
				});
								
				$(document).on('touchend','.save', function(e) {										
					alert('La predicción se ha guardado con éxito');						
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
			
			
				$(document).on('touchend','.flag', function(e) {
									
					$('.goal').removeClass('gol');
					$('.add, .sub').addClass('hidden');
					
					var _team = $(this).parent().data('team');
					var _game = $(this).parents('.row.game').data('game');
					var _goal = $('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').data('goal');
					
					$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .add').removeClass('hidden');
					$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .sub').removeClass('hidden');
					$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').addClass('gol');
	
				});
			

				
				$.ajax({
            		url: 'http:/polla.tvmax-9.com/matchesapi/v1/prediction/get',
            		type: 'POST',	            		
            		dataType: 'json',
            		data: {idClient:177},
            	}).always(function () {
				}).done(function(json) {

					//alert(JSON.stringify(json));

					$.each(json.response.prediction[0].matches, function(index,phase) {						
						if (phase.id != 5) jPrediction.push(phase);			
					});	
					
					_fRenderPrediction();
					
				}).fail(function(jqXHR, textStatus, errorThrown) {
				});

					
		});			
		
	
