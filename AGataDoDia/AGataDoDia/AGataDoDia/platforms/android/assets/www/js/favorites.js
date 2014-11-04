
	
	_oAjax = _fGetAjaxJson(_url + '/garotas/v1/clients/favorites/' + _jParameters.client);
	if (_oAjax) {		
		_oAjax.done(function(_json) {

			var _html = '';				
			_jMenu[$('main').data('index')].data = _json;
			
			$.each(_json.response, function(_index,_item) {

					_html += '<div class="row" data-touch="load" data-target="4" data-param="woman" data-value="' + _item.woman.id_woman + '">';
						_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" >';
							_html += '<h3>' + _item.woman.name + '</h3>';							
							_html += '<h5 style="text-transform: capitalize;">' + _fGetMoment(_item.date).format('MMMM, DD YYYY / hh:mm a') + '</h5>';							
						_html += '</div>';		
					_html += '</div>';
					
					_html += '<div class="row"  >';
						_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
							$.each(_item.woman.categories, function(_index,_item) {
								_html += '<span class="label label-default" data-touch="load" data-target="3" data-param="category" data-value="' + _item.category.id_category + '" style="margin-left:2px; margin-right:2px;">' + _item.category.name + '</span>';
							});
						_html += '</div>';	
					_html += '</div>';	
					
					//_html += '<hr style="border-bottom: solid 1pt #FF0000;">';		
					_html += '<hr />';
							
							
								
			});		
			
						
			$('#wrapper .scroller .container').empty();
			$('#wrapper .scroller .container').append(_html);
																
		});
	}
