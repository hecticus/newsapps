
	//loading...
	
	var _oAjax = _fGetAjaxJson(_url + '/v1/clients/favorites/' + _parameters.client);	
	if (_oAjax) {		
		_oAjax.done(function(_json) {

			var _html = '';				
			$.each(_json.response, function(_index,_item) {
				
				_html += '<div class="row" data-touch="load" data-target="2" data-woman="' + _item.woman.id_woman + '" >';

					_html += '<div class="col-md-12">';
						_html += '<img onerror="this.style.display=\'none\'" src="' + _item.woman.default_photo + '" alt="' +_item.woman.name + '" style="width:100%; height:auto;" />';
						_html += '<h3>' + _item.woman.name + ' <span class="badge">' + _item.woman.posts + '</span></h3>';							
						_html += '<h5 style="text-transform: capitalize;">' + _fGetMoment(_item.date).format('MMMM, DD YYYY / hh:mm a') + '</h5>';							
					_html += '</div>';		
			
					_html += '<div class="col-md-12">';
						$.each(_item.woman.categories, function(_index,_item) {
							_html += '<span class="label label-default" data-touch="load" data-category="' + _item.category.id_category + '" style="margin-right:2px;">' + _item.category.name + '</span>';
						});
					_html += '</div>';
					
					_html += '<br />';
					
				_html += '</div>';	

								
			});		

						
			$('#wrapper .scroller .container-fluid').empty();
			$('#wrapper .scroller .container-fluid').append(_html);
																
		});
	}
