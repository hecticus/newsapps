	
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

