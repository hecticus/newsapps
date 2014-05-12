var jPrediction = [];
var arrPhase = [];
var arrGroup = [];
var arrTeamGame = [];
var arrTeam = [];			
var arrGame = [];
var arrDataTeam = [];

	$( document ).ready(function() {
					
					var _fGetFlag = function(team){ 
						var _html = '<figure>';					     		
						_html += '<img class="flag"  onerror="this.style.display=\'none\'" src="img/flags/'+team.flag_file+'" alt="'+team.name+'" />';
						_html += '<figcaption>'+team.name+'</figcaption>';
						_html += '</figure>';
						return _html;
					};
					
					
					var _fGetGoal = function(team){						
						var _html = '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 team team-a" data-team="'+team.id+'" >';
			     		_html += '<div class="row" >';
						_html += '<div class="goal" data-goal="'+team.score+'" >'+team.score+'</div>';
						_html += '</div>';						
			     		_html += '</div>';
			     		
			     		return _html;
					};
					
					
					var _fRenderPrediction = function(){

						$.each(jPrediction, function(index,phase) {	
	
					    if (phase.id != 5) {
					    	
							var _display =  (phase.id == 1) ? 'display:block;' : 'display:none;';
					    	
					    	var _html = '<!-- <phase> -->';
						   	_html += '<div class="row phase" data-phase="'+phase.id+'" style="'+_display+'" >';
						    
					    	_html += '<div class="col-md-12">';
							_html += '<h3>' + phase.name + '</h3>';
							_html += '</div>';

							_html += '<div class="col-md-12">';
						

						 $.each(phase.groups, function(index, group) {
						 	
						 	_display =  (group.id == 1) ? 'display:block;' : 'display:none;';
						 	
					     	_html += '<!-- <group> -->';
					     	_html += '<div class="row group" data-group="'+group.id+'" style="'+_display+'">';

					     	_html += '<div class="col-md-12">';
							_html += '<h3>' + group.name + '</h3>';
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
					    
					    
				     	_html += '<div class="row >';
				    	_html += '<div class="col-md-12">';
				    	


				    	_html += '</div>';					    	
				    	_html += '</div>';

				
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
						
			     		_html += '<div class="row venue" data-venue="'+this.game.venue.id+'">';
			     							     		
			     		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">';					     		
			   	 		_html += '<span>' + _date.substring(6, 8) +' / ' + _date.substring(4, 6) + '</span>';
			   	 		_html += '</div>';
		
			   	 		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">';
			   	 		_html += '<span>' + _date.substring(8,10) +':' + _date.substring(11, 13) + '</span>';
			   	 		_html += '</div>';
			   	 		
						_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">';
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
				     			_html += _fGetGoal({id:this.game.team_a.id,score:this.game.score_team_a}); 			     	
				     			_html += _fGetGoal({id:this.game.team_b.id,score:this.game.score_team_b}); 			
				     		_html += '</div>';			     		
			     		_html += '</div>';
			     		
			     		_html += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 team" data-team="'+this.game.team_b.id+'" style="background-color: red;" >';			     		
			     			_html += _fGetFlag(this.game.team_b);
			     		_html += '</div>';
			     		
			     		
			     		_html += '</div>';
			     		
			     		return _html;
				        
				        
				        
					};
				};
				
				
			

				
				$.ajax({
            		url: 'http:/polla.tvmax-9.com/matchesapi/v1/prediction/get',
            		type: 'POST',	            		
            		dataType: 'json',
            		data: {idClient:177},
            	}).always(function () {
				}).done(function(json) {

					$.each(json.response.prediction[0].matches, function(index,phase) {
						
						if (phase.id != 5) jPrediction.push(phase);	

						$.each(phase.groups, function(index,group) {
							$.each(group.games, function(index, game) {
								
								arrTeamGame.push({id:game.team_a.id,goals:{f:0,a:0},points:0},{id:game.team_b.id,goals:{f:0,a:0},points:0});
			  					arrGame.push({id:game.id,team:arrTeamGame});		
								arrTeamGame = [];
								
								if (index == 0) {
									
									arrTeam.push({id:game.team_a.id, name:game.team_a.name, shortName: game.team_a.shortname, flag:game.team_a.flag, goals:{f:0,a:0,d:0},points:0});								
									arrTeam.push({id:game.team_b.id, name:game.team_b.name, shortName: game.team_b.shortname, flag:game.team_b.flag, goals:{f:0,a:0,d:0},points:0});
									
																																			
									arrDataTeam.push({id:game.team_a.id, name:game.team_a.name, shortName: game.team_a.shortname, flag:game.team_a.flag});
									arrDataTeam.push({id:game.team_b.id, name:game.team_b.name, shortName: game.team_b.shortname, flag:game.team_b.flag});
									
								}

							});
							
							arrGroup.push({id:group.id, name:group.name,team:arrTeam,game:arrGame,classified:[], active:false});
							arrGame = [];
							arrTeam = [];
							
						});

						arrPhase.push({id:phase.id,name:phase.name,group:arrGroup, active:false});
						arrGroup = [];
						
					});	

					
					_fRenderPrediction();
					
				}).fail(function(jqXHR, textStatus, errorThrown) {
				});

					
		});			
		
	
