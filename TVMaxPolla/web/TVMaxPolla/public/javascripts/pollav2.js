
	$(function() {

		$(document).on('click','.up, .down', function() {
					
			var _this = $(this);
			var _phase = _this.parents('.phase').data('phase');
			var _game = _this.parents('.game');

			_game.attr('data-set','true');
			_game = _game.data('game');

			var _team =  _this.parents('.team').data('team');
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

		});				

		$(document).on('click','.menu[data-group]', function() {

			var _this = $(this); 
			var _group = $(this).data('group');
			
			$('.menu.group').removeClass('on');
			$('.menu.group[data-group="'+_group+'"]').addClass('on');
			$('.row.group').addClass('hidden');
			$('.row.group[data-group="'+_group+'"]').removeClass('hidden');

		});

	});
	  		
	var fReplace = function() {
		window.location.replace("/exit");
	};
