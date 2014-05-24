	//CALENDARIO JS
	$(document).on('click','.calendar', function(e) {						
		preventBadClick(e);
		eval($(this).data('function'));		
		$('.calendar').removeClass('active');	
		$(this).addClass('active');
		$('#wrapper2').attr('class','page transition right');
		myScroll.scrollTo(0,0,0);
		myScroll2.scrollTo(0,0,0);		
	});
	$(document).on('click','.match', function(e) {	
		preventBadClick(e);
		if ($(this).data('phase')) {
			_fRenderDataContent('_item.fase.search("' + $(this).data('phase') + '") >= 0');		
		} else if ($(this).data('country')){
			_fRenderDataContent('(_item.equipo_local.search("' + $(this).data('country') + '") >= 0  ) || ( _item.equipo_visitante.search("' + $(this).data('country') + '") >= 0)');	
		} else {			
			_fRenderDataContent('_iDate == "' + $(this).data('date') + '"');
		}
		
		myScroll.scrollTo(0,0,0);
		myScroll2.scrollTo(0,0,0);

	});
	
	//HISTORY JS
	$(document).on('click','.history', function(e) {					
		preventBadClick(e);
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});
	
	//INDEX JS
	$(document).on('click','.menu', function(e) {
		preventBadClick(e);

		if ($('header .container .row .menu span').hasClass('icon-back')) {
			_fSetBack();			
		} else if ($('#wrapperM').hasClass('right')) {
			$('#wrapperM').attr('class','page transition left');	
		} else {
			$('#wrapperM').attr('class','page transition right');
		}
	});
	$(document).on('click','.load', function(e) {
		preventBadClick(e);
	/*	$(document).unbind('click');
  		$(document).bind('click'); 
		$(document).off('click');
		$(document).on('click');*/

		clearTimeout(_mTimeout);			
		
		if(_oAjax && _oAjax.readystate != 4) {
			_oAjax.abort();
    	}

		_fSetBack();
		var _this = $(this);
		
		$('body').removeClass();
		$('body').addClass(_jMenu[_this.data('index')].class);
		$('main').empty();
		$('main').data('index',_this.data('index'));	
		$('.title').html('<span>' + _jMenu[_this.data('index')].title + '</span>');						
		$('main').load(_jMenu[_this.data('index')].load);
	
		$('#wrapperM').attr('class','page transition left');
	
	});
	$(document).on('click','.video', function(e) {
		preventBadClick(e);
		window.videoPlayer.play($(this).data('src'));
	});
	$(document).on('click','.livetv', function(e) {
		preventBadClick(e);
		window.videoPlayer.play("http://urtmpkal-f.akamaihd.net/i/0s75qzjf5_1@132850/master.m3u8");
	});
	
	//NOTICIAS JS
	$(document).on('click','.news', function(e) {	
		preventBadClick(e);
		_fRenderDataContent($(this).data('item'));		
	});
	
	//PLAYERS JS
	$(document).on('click','.player', function(e) {	
		preventBadClick(e);
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});
	
	//POLLA JS
	$(document).on('touchend','.add', function(e) {
		preventBadClick(e);	
		var _tGoal = $(this).parent().data('goal');
		_tGoal = parseInt(_tGoal + 1);
		$(this).parent().data('goal',_tGoal);
		$(this).parent().find('.score').html(_tGoal);
	});
	
	$(document).on('touchend','.sub', function(e) {
		preventBadClick(e);	
		var _tGoal = $(this).parent().data('goal');
		_tGoal = parseInt(_tGoal - 1);					
		if (_tGoal <= 0)  _tGoal = 0;					
		$(this).parent().data('goal',_tGoal);
		$(this).parent().find('.score').html(_tGoal);
	});	
	

	$(document).on('touchend','.back', function(e) {	
		preventBadClick(e);									
		var _group = $('.group:visible').data('group');
																	
		if (_group >= 2) {
			$('.group').addClass('hidden');
			$('.group[data-group="'+_group+'"]').prev().removeClass('hidden');	
		}
		
		_group = $('.group:visible').data('group');						
		//if (_group == 1) $('.back').addClass('hidden');																
		myScroll.scrollTo(0,0,0);
						
	});
	
	$(document).on('touchend','.next', function(e) {
		preventBadClick(e);									
		var _group = $('.group:visible').data('group');
		if (_group <= 7) {
			$('.group').addClass('hidden');
			$('.group[data-group="'+_group+'"]').next().removeClass('hidden');
			myScroll.scrollTo(0,0,0);	
		}
	});
	
	
	$(document).on('tap','.flag', function(e) {
		preventBadClick(e);				
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
		preventBadClick(e);				
		$('.goal').removeClass('gol');
		$('.add, .sub').addClass('hidden');
		
		var _team = $(this).parents('.team').data('team');
		var _game = $(this).parents('.row.game').data('game');
		var _goal = $('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').data('goal');
		
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .add').removeClass('hidden');
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal .sub').removeClass('hidden');
		$('.game[data-game="'+_game+'"] .score .team[data-team="'+_team+'"] .goal').addClass('gol');


	});
	
	//POLLA JS
	
	
	
	
	
	
	
	
	
	
	
	
	
	//STADIUMS JS
	$(document).on('click','.stadium', function(e) {
		_fRenderDataContent(decodeURI($(this).data('url')));	
	});
	
	//TEAMS JS
	$(document).on('click','.teams', function(e) {	
		_fRenderDataContent(decodeURI($(this).data('gene')));	
	});
	
	//GENERAL
	function preventBadClick(e){
		try{e.preventDefault();}catch(ex){}
		try{e.stopPropagation();}catch(ex){}
		try{e.stopImmediatePropagation();}catch(ex){}
	}