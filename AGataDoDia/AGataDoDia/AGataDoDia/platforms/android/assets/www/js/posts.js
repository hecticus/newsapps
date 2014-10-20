
	//loading...
	

	
	var _oAjax = _fGetAjaxJson(_url + '/v1/posts/list/woman/' + _jParameters.woman);	
	if (_oAjax) {		
		_oAjax.done(function(_json) {

				var _html = ''; 	
				$.each(_json.response, function(_index,_item) {
					
					_html += '<div class="row" data-touch="woman" data-post="' + _item.woman.id_woman + '" >';

						_html += '<div class="col-md-12">';
							_html += '<img onerror="this.style.display=\'none\'" src="' + _item.woman.default_photo + '" alt="' +_item.woman.name + '" style="width:100%; height:auto;" />';
							_html += '<h3>' + _item.woman.name + '</h3>';							
							_html += '<h5 style="text-transform: capitalize;">' + _fGetMoment(_item.date).format('MMMM, DD YYYY / hh:mm a') + '</h5>';							
						_html += '</div>';		
										
					_html += '</div>';	
									
				});		
			
						
			$('#wrapper .scroller .container').empty();
			$('#wrapper .scroller .container').append(_html);
																
		});
	}
