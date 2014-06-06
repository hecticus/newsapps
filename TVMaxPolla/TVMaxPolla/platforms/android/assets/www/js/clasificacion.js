



	var _fRenderInit = function() {
	
		var _html = '<div class="row" >';

		$.each(_jGet.response, function(_index,_item) {

			if (_item.ranking.length >= 1) {
				
				_html += '<div class="col-md-12">';	
				_html += '<div class="table-responsive">';
				_html += '<table class="table">';					
				_html += '<thead>';
				_html += '<tr>';	         				
				
				if (_item.id_phases == 13) {
					_item.name = '3er. Lugar';
				} 
				
				_html += '<th style="width:85%;">' + _item.name + '</th>';
				_html += '<th style="width:2%;">J</th>';
				_html += '<th style="width:2%;">G</th>';
				_html += '<th style="width:2%;">E</th>';
				_html += '<th style="width:2%;">P</th>';
				_html += '<th style="width:5%;">PTS</th>';
				_html += '</tr>';
				_html += '</thead>';			
				_html += '<tbody>';
							
				$.each(_item.ranking, function(_index,_ranking) {
					
					
					_team = _fgetTeamData(_ranking.team.ext_id);
					
					_html += '<tr>'; 
					_html += '<td style="width:85%; text-align:left; font-size:1em;">';
					_html += '<img src="img/flags/' + _team.flag + '" alt="' + _ranking.team.country.name + '" style="width:20%; height:auto; max-width:67px; max-height:45px; margin-left:5px; margin-right:10px;"  />';					
					_html += '<span>' +  _ranking.team.country.name	 + '</span>'; 	
					_html += '</td>';
					
	
					_html += '<td style="width:2%;">' +  _ranking.matches + '</td>';
					_html += '<td style="width:2%;">' +  _ranking.matches_won + '</td>';
					_html += '<td style="width:2%;">' +  _ranking.matches_drawn + '</td>';
					_html += '<td style="width:2%;">' +  _ranking.matches_lost + '</td>';
					_html += '<td style="width:5%;">' +  _ranking.points + '</td>';
					
					_html += '</tr>';		
				});
				
				_html += '</tbody>';											
				_html += '</table>';
				_html += '</div>';
				_html += '</div>';
				
			}
			
		});
		 
		_html += '</div>';
		
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);

	};




	_oAjax = $.fGetAjaXJSON('http://api.hecticus.com/KrakenAfp/v1/ranking/get/global/1',false,false,true);	
	if (_oAjax) {
		_oAjax.done(function(_json) {
			_jGet = _json;		
			_fRenderInit();
		});
	}