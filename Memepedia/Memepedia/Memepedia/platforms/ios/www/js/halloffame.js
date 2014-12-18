
	var _index = $('main').data('index');
	var _json = _jMenu[_index].data; 
	
	var _fRenderHtml =  function(_json, _push) {

			var _html = '<div class="list-group" style="margin-top:10px;">';	
				$.each(_json.response, function(_index,_item) {
						
					_html += '<div class="list-group-item" data-touch="load" data-target="4" data-param="theme" data-value="' + _item.id_theme + '">';
				        _html += '<div class="row-picture">';
				            _html += '<img class="circle" src="' + _item.default_photo + '" alt="icon" style="border:0;">';
				        _html += '</div>';
				        _html += '<div class="row-content">';	
				            _html += '<h4 class="list-group-item-heading">' + _item.name + '</h4>';
				            _html += '<p class="list-group-item-text">';
				            	$.each(_item.categories, function(_index,_item) {
									_html += '<span class="label label-default" data-touch="load" data-target="3" data-param="category" data-value="' + _item.category.id_category + '" >' + _item.category.name + '</span>';
								});	
				            _html += '</p>';		            
				        _html += '</div>';
				    _html += '</div>';
				    _html += '<div class="list-group-separator"></div>';
				
					
				});	
				
				
			_html += '</div>';	
			
		return _html;
	
	};
	

	if(_json) {
		$('#wrapper .scroller .container').append(_fRenderHtml(_json));	
	} else {		
		$('#wrapper .scroller .container').append(_fRenderHtmlListPostError());	 
	}
	
	
