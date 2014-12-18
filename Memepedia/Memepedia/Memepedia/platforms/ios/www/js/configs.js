	
	function configClientGenderUpdate(isActive, status){
		//se actualizo bien el cliente
		_fAlert('Cliente atualizado com sucesso');
		
		try{
			loadingButton.button('reset');
		}catch(e){
			console.log("ERROR "+e);
		}
		reloadMainJSON();
	}
	
	function errorUpdatingConfigClientUpdate(err){
		//error
		_fAlert('Erro ao atualizar cliente');
		
		try{
			loadingButton.button('reset');
		}catch(e){
			
		}
		
	}
			    