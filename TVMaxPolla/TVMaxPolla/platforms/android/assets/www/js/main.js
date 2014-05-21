

var _fGetFormatDate = function(_date) {
	
	_date = _date.toString().split(' ');
	var _year = _date[0].toString();
	var _time = '00:00:00';
	
	if (_date[1]) {
		_time = _date[1].toString();	
	}
	
	_time = _time.toString().trim();			
	_time = _time.toString().split(':');
	_time[0] = _aTime[_time[0] * 1];
	
	
	
	return _year + ' ' + _time[0] + ':' + _time[1] + ((_time[0] > 12) ? ' pm' : ' am');
};


var _fSetBack = function() {	

	$('.share').addClass('hidden');
	$('.share').removeAttr('onclick');
				
	$('#wrapperM').attr('class','page transition left');	
	$('#wrapper2 .scroller .container').empty();			
	$('#wrapper2').attr('class','page transition right');
		

};


var _fGetLoading = function() {
	
	var _html = '<div class="row" >';
		_html += '<div class="col-md-12" style="font-size:1.2em; font-weight:bold; text-align:center; ">';
		_html += '<span>Loading...</span>';
		_html += '</div>';
		_html += '</div>';
		
	$('#wrapper .scroller .container').empty();
	$('#wrapper .scroller .container').append(_html);
	
};


var _fGetLoadingError = function() {
	
	var _html = '<div class="row" >';
		_html += '<div class="col-md-12" style="font-size:1.2em; font-weight:bold; text-align:center; ">';
		_html += '<span>Error...</span>';
		_html += '</div>';
		_html += '</div>';
		
	$('#wrapper .scroller .container').empty();
	$('#wrapper .scroller .container').append(_html);
	
};

$.fGetAjaXJSON = function(_url, _dataType, _contentType, _async) {

	try {	
		
			
	  	return $.ajax({
			url: _url,			
			type: 'GET',	
			async: (_async) ? _async : false,            		
			dataType: (_dataType) ? _dataType : 'json',
			contentType: (_contentType) ? _contentType : 'application/json; charset=utf-8',
			beforeSend : function () {				
				_fGetLoading();					
		}}).always(function () {
			//always		
		}).fail(function(jqXHR, textStatus, errorThrown) {		
			//alert('jqXHR -> ' + jqXHR + ' textStatus -> ' + textStatus + ' errorThrown -> ' + errorThrown);
			_fGetLoadingError();
			return false;
		});
		   
	} catch (e) {
		// statements to handle any exceptions
		// pass exception object to error handler
		// alert(e);
		_fGetLoadingError();
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
			_fGetLoadingError();
			return false;
		});
		   
	} catch (e) {
		// statements to handle any exceptions
		// pass exception object to error handler
		// alert(e);
		_fGetLoadingError();
		return false;
	}
	
};
