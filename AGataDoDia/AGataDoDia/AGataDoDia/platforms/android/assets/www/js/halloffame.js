
	var _index = $('main').data('index');
	var _json = _jMenu[_index].data; 
		
	var _fRenderHtml =  function(_json, _push) {
		_html = '';		
		$.each(_json.response, function(_index,_item) {
			
			_html += '<div class="row" data-touch="load" data-target="4" data-param="woman" data-value="' + _item.id_woman + '">';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" >';
					_html += '<h3>' + _item.name + '</h3>';												
				_html += '</div>';		
			_html += '</div>';
			
			_html += '<div class="row"  >';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
					$.each(_item.categories, function(_index,_item) {
						_html += '<span class="label label-default" data-touch="load" data-target="3" data-param="category" data-value="' + _item.category.id_category + '" style="margin-left:2px; margin-right:2px;">' + _item.category.name + '</span>';
					});
				_html += '</div>';	
			_html += '</div>';	
				
			_html += '<hr />';
						
		});	
	
	
		if (_json.response.length == 0) {
			_html = '<div class="row" >';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center;" >';
					_html += '<h5>El resultado de la b&uacute;squeda no gener&oacute; ning&uacute;n resultado</h5>';
				_html += '</div>';
			_html += '</div>';
		}
	
		$('#wrapper .scroller .container').append(_html);	
	
	};
	
	_fRenderHtml(_json);
