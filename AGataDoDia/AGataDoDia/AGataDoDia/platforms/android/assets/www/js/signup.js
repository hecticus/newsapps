	
	
	/*var _oAjax = _fGetAjaxJson(_url + '/garotas/loading');	
	if (_oAjax) {		
		_oAjax.done(function(_json) {

			var _html = '';
			var _html2 = '';
			var _width = $(window).width();
			var _item = _json.response.posts[0];
			_width = parseInt($(window).width() * _item.files.length);
			
			_html += '<div class="row" style="overflow:hidden; height:' + parseInt(($(window).height()) /2) + 'px;">';
				$.each(_item.files, function(_index,_file) {			
					_html += '<figure style="width:' + $(window).width() + 'px; height:auto; float:left; " >';								
						_html += '<img onerror="this.style.display=\'none\'" src="' + _file + '" alt="' +_item.woman.name + '" class="img-rounded" />';	
					_html += '</figure>';
				});	
			_html += '</div>';	
								

								
			$('#wrapper1').css('height',  parseInt(($(window).height()) /2)  + 'px');
			$('#wrapper1').css('width', $(window).width() + 'px');
			$('#wrapper1 .scroller').css('width',  _width + 'px');
			$('#wrapper1 .scroller .container').append(_html);
			
		});
	}*/
	
	function sendInfoSignup(password){
		console.log("PASO POR EL SIGNUP");
		var subscribe = true;
		if(password != null && password != ""){
			subscribe = false;
		}
		createOrUpdateClient(clientMSISDN, password, subscribe, clientUpdatedSignup, errorUpdatingClientSignup);
	}
	
	function clientUpdatedSignup(isActive, status){
		//EXITO ahora ir a pagina principal
		if(isActive || status == 2){
			startApp(isActive, status);
		}else{
			//error con el cliente, esta vencida su suscripcion
			alert("Cliente vencido");
		}
	}
	function errorUpdatingClientSignup(){
		//error
		alert("Error al crear cliente");
	}

