var _fGetLoading = function() {
	
	var _html = '<div class="row" >';
		_html += '<div class="col-md-12" style="font-size:1.2em; font-weight:bold; text-align:center; ">';
		_html += '<span>Loading...</span>';
		_html += '</div>';
		_html += '</div>';
		
	$('#wrapper .scroller .container').empty();
	$('#wrapper .scroller .container').append(_html);
	
};

$.fGetAjaXJSON = function(_url) {
	
	try {				
	  	return $.ajax({
			url: _url,			
			type: 'GET',	            		
			dataType: 'json',
			beforeSend : function () {				
				_fGetLoading();					
		}}).always(function () {
			//always		
		}).fail(function(jqXHR, textStatus, errorThrown) {		
			//alert('jqXHR -> ' + jqXHR + ' textStatus -> ' + textStatus + ' errorThrown -> ' + errorThrown);
			return false;
		});
		   
	} catch (e) {
		// statements to handle any exceptions
		// pass exception object to error handler
		// alert(e);
		return false;
	}
	
};


$.fPostAjaXJSON = function(_url, _data) {
	
	try {				
	  	return $.ajax({
			url: _url,		
			data: _data,	
			type: 'POST',	            		
			dataType: 'json',
			beforeSend : function () {
				_fGetLoading();
		}}).always(function () {
			//always		
		}).fail(function(jqXHR, textStatus, errorThrown) {		
			//alert('jqXHR -> ' + jqXHR + ' textStatus -> ' + textStatus + ' errorThrown -> ' + errorThrown);
			return false;
		});
		   
	} catch (e) {
		// statements to handle any exceptions
		// pass exception object to error handler
		// alert(e);
		return false;
	}
	
};
