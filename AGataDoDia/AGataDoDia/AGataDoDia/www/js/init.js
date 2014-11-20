	
	
	var _oAjax = _fGetAjaxJson(_url + '/garotas/loading/'+$(window).width()+'/'+$(window).height());	
	if (_oAjax) {		
		_oAjax.done(function(_json) {

			if (_json.response.feature_image.link != null) {
				var _img = new Image();
    			_img.src = _json.response.feature_image.link;        		        		         		
		    	_img.onload = function() {
		    		document.body.style.backgroundImage="url('"+_json.response.feature_image.link+"')";
		    		$('.container').removeClass('hidden');		    	
		    	};
			}
			
		    
		    
		});
	}

	function sendInfoSignup(password, putMSISDN){
		console.log("PASO POR EL SIGNUP");
		if(putMSISDN){
			createOrUpdateClient(clientMSISDN, password, true, setPasswordScreen, errorUpdatingClientSignup);
		}else{
			createOrUpdateClient(clientMSISDN, password, false, clientUpdatedSignup, errorUpdatingClientSignup);
		}
	}
	
	function setPasswordScreen(isActive, status){
		$('#msisdnInputGroup').addClass('hidden');
		$('#passwordInputGroup').removeClass('hidden');
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
	function errorUpdatingClientSignup(err){
		//error
		alert("Error al crear cliente "+err);
	}

