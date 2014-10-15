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
	$('#header').removeClass('hidden');
	$('main').empty();
	if(_this.data('index')==0){
		$('#wrapperL').attr('class','page transition right');
	} else {
//	$('body').removeClass();
//	$('body').addClass(_jMenu[_this.data('index')].class);
//	$('main').data('index',_this.data('index'));	
//	$('.title').html('<span>' + _jMenu[_this.data('index')].title + '</span>');						
		$('#wrapperM').attr('class','page transition right');
	}
	//myScroll2.scrollTo(0,0,0);
	return false;

});


	
$(document).on('click','.create', function(e) {

	if(preventBadClick(e)){return false;}
	if(e.type == "touchstart" || e.type == "touchend") {return false;}
	//clearTimeout(_mTimeout);			
	
	if(_oAjax && _oAjax.readystate != 4) {
		_oAjax.abort();
	}
	
	//_fSetBack();
	var _this = $(this);
	var dataIndex = _this.data('index');
	var doCall = true;
	var idClient = loadClientID();
	var pimpUrl = "";
	var callMethod = "";
	var params = "";
	var pimpSuccess = false;
	if(idClient == null){
		pimpUrl = "http://10.0.3.128:9000/garotas/v1/clients/create";
		callMethod = 'POST';
		var login = $("#login").val();
		var pwd = $("#pwd").val();
		if(login != "" && pwd != ""){
			console.log("log in");
			params = '{"country": 1, "login":"'+login+'","password": "'+pwd+'","devices": [{"device_id": 1,"registration_id": "'+regID+'"}]}';	
		} else if(dataIndex == 1){
			console.log("temporal");
			params = '{"country": 1,"devices": [{"device_id": 1,"registration_id": "'+regID+'"}]}';	
			dataIndex = 0;
		} else {
			console.log("fail");
			doCall = false;
		}
	} else {
		console.log("get");
		pimpUrl = "http://10.0.3.128:9000/garotas/v1/clients/get/"+idClient;
		callMethod = 'GET';
		if(dataIndex == 1){
			dataIndex = 0;
		}
	}
	
	if(doCall){
		$.ajax({
			url : pimpUrl,
			type: callMethod,
			contentType: "application/json; charset=utf-8",
			data: params,
			dataType: 'json',
			timeout : 60000,
			async: false,
			success : function(data, status) {
				var response = data.response;
				saveClientID(""+response.id_client);
				pimpSuccess = true;
			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log("BOOM");
			}
		});
	} else {
		console.log("missing data");
		//display error
	}
	if(pimpSuccess){
		console.log("move on " + dataIndex);
		$('body').removeClass();
		$('body').addClass(_jMenu[dataIndex].class);
		$('main').empty();
		$('main').data('index',dataIndex);	
		$('main').load(_jMenu[dataIndex].load);
		$('.title').html('<span>' + _jMenu[dataIndex].title + '</span>');						
		$('#header').removeClass('hidden');
		$('#wrapperL').attr('class','page transition left');
		//myScroll2.scrollTo(0,0,0);
	}
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