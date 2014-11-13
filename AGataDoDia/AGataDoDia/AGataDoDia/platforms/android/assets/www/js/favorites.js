
	var _index = $('main').data('index');
	var _json = _jMenu[_index].data; 
	var _html = _jMenu[_index].html;
	
	
	var _fRenderHtml =  function(_json, _push) {
		_html = '';	
		$.each(womenList, function(_index,_item) {
			
			_html += '<div class="row" data-touch="load" data-target="4" data-param="woman" data-value="' + _item.id_woman + '">';			
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="padding:10px !important; ">';
				
					_html += '<h3>' + _item.name + '</h3>';							
					_html += '<p>';					
						$.each(_item.categories, function(_index,_item) {
							_html += '<span class="label label-default" data-touch="load" data-target="3" data-param="category" data-value="' + _item.category.id_category + '" style="font-size:1em; margin-right:2px;">' + _item.category.name + '</span>';
						});					
					_html += '</p>';

				_html += '</div>';
			_html += '</div>';	

			_html += '<hr />';
			
		});	
	
	
		if (womenList.length == 0) {
			_html = '<div class="row" >';
				_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="text-align:center;" >';
					_html += '<h5>El resultado de la b&uacute;squeda no gener&oacute; ning&uacute;n resultado</h5>';
				_html += '</div>';
			_html += '</div>';
		}
	
	
		return _html;
	
	};
		
	if (_json) {		
		//if (!_html) _html = _fRenderHtml(_json);
		_html = _fRenderHtml(_json);
		$('#wrapper .scroller .container').empty();
		$('#wrapper .scroller .container').append(_html);
		_jMenu[_index].html = $('#wrapper .scroller .container').html();			
	}
