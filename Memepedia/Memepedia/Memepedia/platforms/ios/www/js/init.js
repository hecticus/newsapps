

	var _json = _jMenu[5].data;
	if (_json) {
		if (_json.response.feature_image.link != null) {
			var _img = new Image();
			_img.src = _json.response.feature_image.link;        		        		         		
	    	_img.onload = function() {
	    		document.body.style.backgroundImage="url('"+_json.response.feature_image.link+"')";
	    		document.body.style.backgroundSize="cover";
	    		document.body.style.backgroundRepeat="no-repeat";
	    		$('.container').removeClass('hidden');
	    	};		    	
		};	
	}	
	 

	function sendInfoSignup(password, putMSISDN){		
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
		//EXITO ahora ir a pagina principal, ya no, ahora hay que escojer el gender tambien
		//markClientAsOK();
		if(isActive || status == 2){
			$('#passwordInputGroup').addClass('hidden');
			$('#gender').removeClass('hidden');			
		}else{			
			_fAlert('Expirado Cliente');			
		}
	}
	
	function errorUpdatingClientSignup(err){
		//error
		_fAlert('Falha ao criar o cliente');
		try{
			loadingButton.button('reset');
		}catch(e){
			
		}
		
	}
	
	function clientGenderUpdate(isActive, status){
		//EXITO ahora ir a pagina principal
		markClientAsOK();
		if(isActive || status > 0){
			startApp(isActive, status);
		}else{
			_fAlert('Error Cliente');			
		}
	}

