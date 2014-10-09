	var lastClicked = 0;
$(document).on('click','.load', function(e) {
		
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		//clearTimeout(_mTimeout);			
		
		if(_oAjax && _oAjax.readystate != 4) {
			_oAjax.abort();
    	}

		//_fSetBack();
		var _this = $(this);
			
//		if (_this.data('index') == 'fb') {
//			loginByFacebook();
//		} else {
								
//			if(_jMenu[_this.data('index')].class == 'content-polla' 
//				|| _jMenu[_this.data('index')].class == 'content-alertas'
//				|| _jMenu[_this.data('index')].class == 'content-leaderboard'){
//				//revisamos si esta hay client data
//				if(loadClientData() == null){
//					navigator.notification.alert("Para entrar a esta sección debes estar registrado, entra en Menú/Ingresar", doNothing, "Alerta", "OK");
//					return false;
//				}
//			}
			
			
			/*$('body').removeClass();
			$('body').addClass(_jMenu[_this.data('index')].class);
			$('main').empty();
			$('main').data('index',_this.data('index'));	
			$('.title').html('<span>' + _jMenu[_this.data('index')].title + '</span>');						
			$('main').load(_jMenu[_this.data('index')].load);	
			$('#wrapperM').attr('class','page transition left');
			/*if(_this.data('index') == 0){
				try{setTimeout(function() {
					reloadNewsMain();	
				}, 100);}catch(e){}
			}*/

			
//		}
console.log("anrtes");
$('#wrapperM').attr('class','page transition right');
		myScroll2.scrollTo(0,0,0);
console.log("despues");		
		return false;
	
	});
	
	function preventBadClick(e){
		try{e.preventDefault();}catch(ex){}
		try{e.stopPropagation();}catch(ex){}
		try{e.stopImmediatePropagation();}catch(ex){}
		//console.log("getCurrentTimeMillis():"+getCurrentTimeMillis()+" lastClicked:"+lastClicked);
		if(lastClicked != 0 &&  getCurrentTimeMillis()-lastClicked  < 500){
			//lastClicked = getCurrentTimeMillis();
			return true;
		}else{
			lastClicked = getCurrentTimeMillis();
			return false;
		}
	}
	
	$(document).on('click','.menu .logo', function(e) {	
		if(preventBadClick(e)){return false;}
		console.log("click");
		//if(e.type == "touchstart" || e.type == "touchend") {return false;}
		//$('#wrapperM').attr('class','page transition left');
		//myScroll2.scrollTo(0,0,0);
	});
	
	
$(document).on('click','.next', function(e) {
		
		if(preventBadClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		//clearTimeout(_mTimeout);			
		
		if(_oAjax && _oAjax.readystate != 4) {
			_oAjax.abort();
    	}

		//_fSetBack();
		var _this = $(this);

console.log("anrtes");

		myScroll.scrollTo(1,0,0);
console.log("despues");		
		return false;
	
	});