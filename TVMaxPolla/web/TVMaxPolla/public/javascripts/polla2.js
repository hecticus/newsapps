var arrPhase = [];
var arrGroup = [];
var arrGame	= [];
var arrTeamGame = [];
var arrTeam	= [];
var arrDataTeam	= [];


$(function() {

		$.fCompare = function(_groupTeams,_eval) {
			
			var aux = 0;
			var othersTeams= [];
			var afirts = [];
			var asecond = [];
		
			for ( var i = 0; i < 2; i++ ) {
					
					$.each(_groupTeams, function(index,team) { if (eval(_eval)>aux) aux = eval(_eval); });						
					$.each(_groupTeams, function(index,team) {
					
									
						if (eval(_eval) == aux) {
							if (i == 0) {
								afirts.push(team);
							} else {
								asecond.push(team);
							}
						} else {
							othersTeams.push(team);
						}							
					});
					
					aux = 0;
					_groupTeams = othersTeams;
					othersTeam = [];
		
			}
		
			return {firts:afirts,second:asecond};

		};

		$.fgetPhaseActive = function() {
		
			var _return	= false;
			
			$.each(arrPhase, function(index,phase) {
									
				if (phase.active) {
					_return = phase;
					return true;
				}	
				
				if (_return)  {
					return false;
				} 								
			});
			
			return _return;
			
		};


		$.fgetGroupActive = function() {
		
			var _phase = $.fgetPhaseActive();
			var _return	= false;

			$.each(_phase.group, function( index, group) {						
				if (group.active) {
					_return = group;
					return true;
				}
				
				if (_return)  {
					return false;
				}										
			});
			
			return _return;
			
		};

		$.fUpdateStandingGroup2 = function() {

			
			var groupTeams = [];
			var winners= [];	
			var firts;
			var second;

			var points;
			var condition = ['team.points','team.goals.d','team.goals.f'];


			var _group = $.fgetGroupActive();
			_group.classified = [];
			firts = _group.team;


			for (var i = 0; i < 2; i++ ) {
														
				for (var c = 0; c < condition.length ; c++ ) {
			
					points = $.fCompare(firts,condition[c]);
					firts = points.firts;
					second = points.second;

					if (firts.length==1) {								
						winners.push(points.firts);
						firts = points.second;
						c = 3;								
					} else {
						firts = points.firts;
					}
					
				}
			}

			if (winners.length <= 1) {
				
				if (winners.length == 0) {							
					$('[data-index="'+(_group.name+1)+'"]').html(_group.name+1);
					$('[data-index="'+(_group.name+2)+'"]').html(_group.name+2);
					$.fUpdateBrackets(2,_group.name,true);
				} else if (winners.length == 1) {							
					$('[data-index="'+(_group.name+2)+'"]').html(_group.name+2);																					
					$.fUpdateBrackets(2,_group.name,true);
				}
				
				
				var deleteTeam = [];
				var deleted = true;
				var gameswinners = [];
				
				/*Busco los eliminados*/
				$.each(_group.team, function(index,team) {
																					
					deleted = true;
					$.each(firts, function(index,value) {											
						if (team.id == value.id) {
							deleted = false;
						}
					});
					
					if (deleted) {
						deleteTeam.push(team);
					}
					
				});
				
				$.each(_group.game, function(index,game) {
													
					deleted = true;
					$.each(deleteTeam, function(index,value) {								
						if ((value.id == game.team[0].id) || (value.id == game.team[1].id)) {
							deleted = false;
						}
					});					
			
					if (deleted) {
						gameswinners.push(game);
					}
															
				});
				

				$.each(firts, function(index,team) {
						
						team.goals.f = 0;
						team.goals.a = 0;
						team.points = 0;
						
						$.each(gameswinners, function(index,game) {								
							$.each(game.team, function( index, value ) {										
								if (team.id == value.id) {
									team.goals.f += value.goals.f;
									team.goals.a += value.goals.a;
									team.goals.d = 	(team.goals.f - team.goals.a);
									team.points += value.points;
								};
							});
						});

				});

				for (var i = 0; i < 2; i++ ) {	
															
					for (var c = 0; c < condition.length ; c++ ) {
				
						points = $.fCompare(firts,condition[c]);
						firts = points.firts;
						second = points.second;

						if (firts.length==1) {								
							winners.push(points.firts);
							firts = points.second;
							c = 3;								
						} else {
							firts = points.firts;
						}
						
					}
				}
				
				if (winners.length == 0) {							
					$('[data-index="'+(_group.name+1)+'"]').html(_group.name+1);
					$('[data-index="'+(_group.name+2)+'"]').html(_group.name+2);
					$.fUpdateBrackets(2,_group.name,true);
				} else if (winners.length == 1) {						
					$('[data-index="'+(_group.name+2)+'"]').html(_group.name+2);														
					$.fUpdateBrackets(2,_group.name,true);
				}

			} 


			var classified = [];
						
			$.each(winners, function(index,team) {
				team = team[0];	
				classified.push(team);						
			});

			_group.classified = classified;

			$.each(_group.classified, function( index, team ) {
				
				$.fUpdate(_group.name+(index+1),team,2);						
				var _team = $.fgetTeam( _group.name+(index+1));
				 
				$('.phase[data-phase="2"] .group .game .team[data-team="'+_team.id+'"] .flag').attr('src',team.flag);
				$('.phase[data-phase="2"] .group .game .team[data-team="'+_team.id+'"] .flag').removeAttr('style');
				$('.phase[data-phase="2"] .group .game .team[data-team="'+_team.id+'"] .name').html(team.name);						
				$('[data-index="'+_group.name+(index+1)+'"]').html('<figure><img class="flag"  src="'+team.flag+'" alt="Camerún" /><figcaption>'+team.shortName+'</figcaption></figure>');
					
				
			});	


		};


		$.fUpdateBrackets = function(_phase, _name, _group) {
			
		
			
			$.each(arrPhase, function(index, phase) {
				if (phase.id>=_phase) {
						
					
					$.each(phase.group, function(index, group) {							
						if (group.name.indexOf(_name) >= 0) {
							

							if ((_group) || (phase.id > _phase)) {									
								$.each(group.game, function( index, game ) {
									$.each(game.team, function( index, team ) {
										$('.phase[data-phase="'+phase.id+'"] .group[data-group="'+group.id+'"] .game .score .team[data-team="'+team.id+'"] .goal').data('goal',0);
										$('.phase[data-phase="'+phase.id+'"] .group[data-group="'+group.id+'"] .game .score .team[data-team="'+team.id+'"] .goal').html(0);
									});
								});
							}
							
							$.each(group.game, function( index, game ) {
																														
								
								
								game.team[0].goals.f =0; 
								game.team[1].goals.f =0;
								
								game.team[0].goals.a =0; 
								game.team[1].goals.a =0;
								
								game.team[0].goals.d = 0;
								game.team[1].goals.d = 0;
								
								game.team[0].points = 0;
								game.team[1].points = 0;
								
								
		
							});
							
							
							$.each(group.team, function(index, team) {
								
								
								
								team.goals.f = 0;
								team.goals.a = 0;
								team.goals.d = 0;
								team.points=0;
							});

							

						}
					});	
				}
			});
		};


		$.fUpdateStandingPhase22 = function() {
			
			var winners= [];
			var wclassifiedinners= [];		
			var firts;
			var second;
			var points;
			var condition = ['team.points','team.goals.d','team.goals.f'];


			
			
			$.each(arrPhase, function(index, phase) {
				
				if (phase.id > 1) {

					$.each(phase.group, function(index, group) {

						group.classified = [];
																						
						points = $.fCompare(group.team,condition[0]);
						firts = points.firts;
						second = points.second;	
									
						if (firts.length==1) {						
							winners.push(points.firts);
							firts = points.second;												
						} else {
							firts = points.firts;																		
							$.fUpdateBrackets(phase.id, group.name);
							$('[data-index="'+group.name+'"]').html('-');
						}

						$.each(winners, function(index,team) {									
							team = team[0];
							group.classified.push(team);
						});
					
						winners = [];					
						
						$.each(group.classified, function(index, team) {	

							var _phase = (phase.id+1);		
							if (phase.id == 4) {
								_phase = 6;
								if (group.name.indexOf('W') < 0) {
									group.name = group.name+'W';
								}
							} 

							$.fUpdate(group.name,team.placeholder,_phase);
							var _team = $.fgetTeam(group.name);
									
							if (team.placeholder != null) {
							
								if (phase.id == 6) {
									$('[data-index="WIN"]').attr('data-index',group.name);
									$('[data-index="'+group.name+'"]').html('<figure><img class="flag"  src="'+team.placeholder.flag+'" alt="" /><figcaption>'+team.placeholder.shortName+'</figcaption></figure>');	
								} else {							
								
									

									$('.phase[data-phase="'+arrPhase[phase.id].id+'"] .group .game .team[data-team="'+_team.id+'"] .flag').attr('src',team.placeholder.flag);
									$('.phase[data-phase="'+arrPhase[phase.id].id+'"] .group .game .team[data-team="'+_team.id+'"] .flag').removeAttr('style');
									$('.phase[data-phase="'+arrPhase[phase.id].id+'"] .group .game .team[data-team="'+_team.id+'"] .name').html(team.placeholder.name);																					
									$('[data-index="'+group.name+'"]').html('<figure><img class="flag"  src="'+team.placeholder.flag+'" alt="" /><figcaption>'+team.placeholder.shortName+'</figcaption></figure>');

								}
								
							}

						});
					
					});

				}

			});

		};



				$.fgetTeam = function(_name) {
					
					$.each(arrDataTeam, function(index,team) {				
						if (team.name==_name){
							_return = team;	
							return false;
						}
					});
					
					return _return;				
						
				};

				$.fgetTeamId = function(_id) {
					
					$.each(arrDataTeam, function(index,team) {				
						if (team.id==_id){
							_return = team;	
							return false;
						}
					});
					
					return _return;				
						
				};


				$.fUpdate = function(_name,_team,_phase) {
					$.each(arrPhase, function(index,phase) {
						if (phase.id == _phase) {						
							$.each(phase.group, function(index,group) {						
								$.each(group.team, function(index,team) {
									if (team.name == _name) {
										team.placeholder = _team;
									}
								});
							});
						}
					});	
				};

	
				
				$.fgetPhaseActive2 = function(_this) {
				
					var _return	= false;
					var _phase = _this.parents('.phase').data('phase');
					
					$.each(arrPhase, function(index,phase) {
											
						if (phase.id == _phase) {
							_return = phase;
							return true;
						}	
						
						if (_return)  {
							return false;
						} 								
					});
					
					return _return;
					
				};


				$.fgetGroupActive2 = function(_this) {
				
					var _phase = $.fgetPhaseActive2(_this);
					var _return	= false;
					var _group = _this.parents('.group').data('group');

					$.each(_phase.group, function( index, group) {						
						if (group.id == _group) {
							_return = group;
							return true;
						}
						
						if (_return)  {
							return false;
						}										
					});
					
					return _return;
					
				};



				$(document).on('click','.up, .down', function() {
					

					var _this = $(this);
					var _phase = _this.parents('.phase').data('phase');					
					var _game = _this.parents('.game');
					
					$('.phase[data-phase="'+_phase+'"] .group .game').removeClass('shadow');	
					
					_game.attr('data-set','true');
					_game = _game.data('game');
					

					/*Oculto menu superior*/
					$.each(arrPhase, function( index,phase) {						
						if (phase.id > _phase) {													
							$('.menu[data-phase="'+phase.id+'"].large').addClass('hidden');									
							$('.phase[data-phase="'+phase.id+'"].large').addClass('hidden');
						}
					});
					

					var _team =  _this.parents('.team').data('team');

	
					var group = $.fgetGroupActive2(_this);
					var _eGoal = _this.parents('.team[data-team="'+_team+'"]').find('.goal');
					var _iGoal = _eGoal.data('goal');
					var _aGoal  = 0;

					
					_iGoal = parseInt(_iGoal);
					
					if ($(this).hasClass('up')) {
						_iGoal = _iGoal + 1;					
					} else {
						if (_iGoal>=1) {
							_iGoal = _iGoal - 1;
						}
					}	



					_eGoal.data('goal',_iGoal);
					_eGoal.html(_iGoal);

				

					$.each(group.game, function( index, game ) {

						if (_game == game.id) {							
							$.each(game.team, function( index, team ) {										
								if (_team == team.id) {
									team.goals.f = _iGoal;
								} else {								
									team.goals.f = $('.phase[data-phase="'+_phase+'"] .group[data-group="'+group.id+'"] .game[data-game="'+game.id+'"] .score .team[data-team="'+team.id+'"] .goal').data('goal');
								}
							});
						};
						


						if (game.team[0].goals.f > game.team[1].goals.f) {
							game.team[0].points = 3;
							game.team[1].points = 0;																								
						} else if (game.team[1].goals.f > game.team[0].goals.f) {									
							game.team[0].points = 0;									
							game.team[1].points = 3;		
						} else {
							game.team[0].points = 1;
							game.team[1].points = 1;
						};
						
						game.team[0].goals.a = game.team[1].goals.f;
						game.team[1].goals.a = game.team[0].goals.f;

					});



					$.each(group.team, function( a, team ) {
						
						team.goals.f = 0;
						team.goals.a = 0;
						team.points = 0;	

						$.each(group.game, function( b, game ) {
							$.each(game.team, function( inbdex, value ) {
								if (team.id == value.id) {
									team.goals.f += value.goals.f;
									team.goals.a += value.goals.a;
									team.goals.d = 	(team.goals.f - team.goals.a);
									team.points += value.points;
								};
							});
						});

						


					});
					
					if (_phase == 1) {									
						$.fUpdateStandingGroup2();
						$.fUpdateStandingPhase22();						
					} else {
						$.fUpdateStandingPhase22();
					}

					var _total = 0;
					$.each(arrPhase, function( index,phase) {						
						if (phase.id == _phase) {							
							$.each(phase.group, function( index,group) {
								_total += group.classified.length;
							});								
						}
					});
						

					if ((_phase == 1) && (_total == 16)) {
						$('.menu[data-phase="'+arrPhase[_phase].id+'"].large').removeClass('hidden');																		
					} else if ((_phase == 2) && (_total == 8)) {						
						$('.menu[data-phase="'+arrPhase[_phase].id+'"].large').removeClass('hidden');							
					} else if ((_phase == 3) && (_total == 4)) {
						$('.menu[data-phase="'+arrPhase[_phase].id+'"].large').removeClass('hidden');							
					} else if ((_phase == 4) && (_total == 2)) {
						$('.menu[data-phase="'+arrPhase[_phase].id+'"].large').removeClass('hidden');	
						
					}

					var _length =0;
					var _hidden = 0;
					
					if (_phase != 6) {
						 _length = $('.phase[data-phase="'+_phase+'"] .group .game[data-set="true"]').length;
						 _hidden = $('.menu[data-phase="'+arrPhase[_phase].id+'"]').hasClass('hidden') ;
					}
					
					
					if ((_phase == 2) && (_length == 8)) {						
						
						if (_hidden) {
							
							$('.phase[data-phase="'+_phase+'"] .group .game').each(function(index) {
								var _team_a =  $(this).find('.score .team-a .goal').data('goal');
								var _team_b =  $(this).find('.score .team-b .goal').data('goal');
								if (_team_a == _team_b) {
									$(this).addClass('shadow');	
								}							  
							});

						}
												
					} else if ((_phase == 3) && (_length == 4)) {
						
						if (_hidden) {
							$('.phase[data-phase="'+_phase+'"] .group .game').each(function(index) {
								var _team_a =  $(this).find('.score .team-a .goal').data('goal');
								var _team_b =  $(this).find('.score .team-b .goal').data('goal');
								if (_team_a == _team_b) {
									$(this).addClass('shadow');	
								}							  
							});
						}
											
					} else if ((_phase == 4) && (_length == 2)) {
						
						if (_hidden) {
							$('.phase[data-phase="'+_phase+'"] .group .game').each(function(index) {
								var _team_a =  $(this).find('.score .team-a .goal').data('goal');
								var _team_b =  $(this).find('.score .team-b .goal').data('goal');
								if (_team_a == _team_b) {
									$(this).addClass('shadow');	
								}							  
							});
						}
					} else if (_phase == 6) {
						
						
						$('.phase[data-phase="'+_phase+'"] .group .game').each(function(index) {
							var _team_a =  $(this).find('.score .team-a .goal').data('goal');
							var _team_b =  $(this).find('.score .team-b .goal').data('goal');
							if (_team_a == _team_b) {
								$(this).addClass('shadow');	
							}							  
						});

					}


					
				});				



			$(document).on('click','.menu[data-phase]', function() {

				var _this = $(this);
				var _phase = $(this).data('phase');
				var _position =$(this).data('position');
				var _return = false;
				var _currenPhase = $('.row.phase:visible').data('phase');
				 

				$('.menu.group[data-group]').removeClass('on');		
				$('.menu.phase').removeClass('on');				
				$('.menu.phase[data-phase="'+_phase+'"]').addClass('on');
				$('.row.phase').addClass('hidden');
				$('.row.phase[data-phase="'+_phase+'"]').removeClass('hidden');
				$('.row.phase[data-phase="'+_phase+'"] .group').addClass('hidden');
				
				if (_phase == 1) {						
					$('.menu.group').removeClass('hidden');
					$('.row.phase[data-phase="'+_phase+'"] .group[data-group="1"]').removeClass('hidden');
					$('.menu.group[data-group="1"]').addClass('on');						
				} else {
					$('.row.phase[data-phase="'+_phase+'"] .group').removeClass('hidden');
				}
				
				$.each(arrPhase, function(index,phase) {
					phase.active = false;
					if (phase.id == _phase) {
						
						phase.active = true;
						
						if (_phase == 1) {
							$.each(phase.group, function(index,group) {
								group.active = false;
								if (group.id == 1) {
									group.active = true;	
								}
							});	
						}	
						
						
					}
				});
				
				//$.fgetPhaseMenuSmall();
				
			});
			
		$(document).on('click','.menu[data-group]', function() {
			
			var _this = $(this); 
			var _group = $(this).data('group');
			var _return = false;
			var _groupReturn = 0;

			var _set = 0;


			$('.menu.group').removeClass('on');
			$('.menu.group[data-group="'+_group+'"]').addClass('on');
			$('.row.group').addClass('hidden');
			$('.row.group[data-group="'+_group+'"]').removeClass('hidden');
			
			$.each(arrPhase, function(index,phase) {
				if (phase.active) {
					$.each(phase.group, function(index,group) {
						group.active = false;
						if (group.id == _group) {
							group.active = true;	
						}
					});
				}
			});

		});



		$.fgetUpdate = function() {

			$.each(arrPhase, function(index,phase) {
		
					
					
					$.each(phase.group, function(index, group) {

						group.active = true;
						$.each(group.game, function( index, game ) {
													
							$.each(game.team, function( index, team ) {							
								team.goals.f = $('.phase[data-phase="'+phase.id+'"] .group[data-group="'+group.id+'"] .game[data-game="'+game.id+'"] .score .team[data-team="'+team.id+'"] .goal').data('goal');
							});
							
							if (game.team[0].goals.f > game.team[1].goals.f) {
								game.team[0].points = 3;
								game.team[1].points = 0;
							} else if (game.team[1].goals.f > game.team[0].goals.f) {
								game.team[0].points = 0;
								game.team[1].points = 3;
							} else {
								game.team[0].points = 1;
								game.team[1].points = 1;
							};
							
							game.team[0].goals.a = game.team[1].goals.f;
							game.team[1].goals.a = game.team[0].goals.f;
							
							
							
						});	
						
						$.each(group.team, function( index, team ) {

							team.goals.f = 0;
							team.goals.a = 0;
							team.points = 0;
							
							$.each(group.game, function( index, game ) {
								$.each(game.team, function( index, value ) {
									if (team.id == value.id) {
										team.goals.f += value.goals.f;
										team.goals.a += value.goals.a;
										team.goals.d = 	(team.goals.f - team.goals.a);
										team.points += value.points;
									};
								});
							});

						});
						
						$.fUpdateStandingGroup2();
						
					});
					
					
				
			});

				
			
			
		};
						
		

		$( document ).ready(function() {

				$.fgetUpdate();					
				$.fUpdateStandingPhase22();
			
				/*$.each(arrPhase, function( index,phase) {
	
					$.each(phase.group, function( index,group) {
						
						if (phase.id == 1) {							
							group.active = false;
							if (group.id == 1) {
								group.active = true;	
							}						
						}

						_total += group.classified.length;
					});								
					
					
					if ((phase.id == 1) && (_total == 16)) {
						$('.menu[data-phase="'+arrPhase[phase.id].id+'"]').removeClass('hidden');																		
					} else if ((phase.id == 2) && (_total == 8)) {						
						$('.menu[data-phase="'+arrPhase[phase.id].id+'"]').removeClass('hidden');							
					} else if ((phase.id == 3) && (_total == 4)) {
						$('.menu[data-phase="'+arrPhase[phase.id].id+'"]').removeClass('hidden');							
					} else if ((phase.id == 4) && (_total == 2)) {
						$('.menu[data-phase="'+arrPhase[phase.id].id+'"]').removeClass('hidden');	
						
					}
					
				});*/
						
										
						
				
				
			});

  		});
  		
  		var fReplace = function() {
  			window.location.replace("/exit");
  		};
	  		
