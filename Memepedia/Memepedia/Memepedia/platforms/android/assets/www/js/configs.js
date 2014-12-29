	
	function configClientGenderUpdate(isActive, status){
		//se actualizo bien el cliente
		_fAlert('Cliente atualizado com sucesso');
		
		try{
			loadingButton.button('reset');
		}catch(e){
			console.log("ERROR "+e);
		}
		reloadMainJSON();
		setCheckGender();
	}
	
	function errorUpdatingConfigClientUpdate(err){
		//error
		_fAlert('Erro ao atualizar cliente');
		
		try{
			loadingButton.button('reset');
		}catch(e){
			
		}
		
	}
		
	function setCheckGender() {	
		console.log("LLEGO CLIENT GENDER: "+clientGender);
		$('button i').remove();
		$('button[data-value="' + clientGender + '"]').prepend('<i class="icon-material-check" style="font-size: 0.9em; color:#ffffff; margin-right:2px;"></i>');
	}
	

	setCheckGender();
