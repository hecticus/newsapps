

	var _fRenderDataContent = function(_url) {
	  
		var _html = '<div class="row" >';

		$.each(_jAfpTeamsIds.teams, function(_index,_team) {
				
			var _opacity = 'opacity';		
			$.each(_jAlert.teams, function(_index,_id) {
				if (_id == _team.ext_id) _opacity = '';
			});
			
			_html += '<div class="col-md-12 teams-alerts ' + _opacity + '" data-id="' + _team.ext_id + '" >';	
				_html += '<img  onerror="this.style.display=\'none\'" src="img/flags/' + _team.flag + '" alt="' +_team.name + '" style="width:20%;  height:auto; max-width:67px; max-height:45px; vertical-align:middle;"  />';		
				_html += '<span>' + _team.name + '</span>';							    	
		 	_html += '</div>';
		 	
		});

	
		_html += '</div>';
		
		
		$('#wrapper2 .scroller .container').empty();
		$('#wrapper2 .scroller .container').append(_html);
		$('#wrapper2').attr('class','page transition left');
		$('header .container .row .menu span').addClass('icon-back');
		myScroll2.scrollTo(0,0,0);
		
	};

















//_fRenderGetInitTime('icon-alertas');

var newClientCountriesAlerts;
//var newClientCategoriesAlerts;
var newClientActionsAlerts;

var cantCategories = 0;

function removeCountryAlert(countryID){
	var index = newClientCountriesAlerts.indexOf(countryID);
	if (index > -1) {
		newClientCountriesAlerts.splice(index, 1);
	}
}
/*function removeCategoryAlert(countryID){
	var index = newClientCategoriesAlerts.indexOf(countryID);
	if (index > -1) {
		newClientCategoriesAlerts.splice(index, 1);
	}
}*/
function removeActionsAlert(actionID){
	var index = newClientActionsAlerts.indexOf(actionID);
	if (index > -1) {
		newClientActionsAlerts.splice(index, 1);
	}
}

function initAlerts(){
$('.list-group.checked-list-box .list-group-item').each(function (index) {
        
        // Settings
        var $widget = $(this),
            $checkbox = $('<input type="checkbox" class="hidden" />'),
            color = ($widget.data('color') ? $widget.data('color') : "primary"),
            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };
            
        $widget.css('cursor', 'pointer');
        $widget.append($checkbox);

        // Event Handlers
        $widget.on('click', function (e) {
        	if(preventBadClick(e)){return false;}	
    		if(e.type == "touchstart" || e.type == "touchend") {return false;}
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });
        $checkbox.on('change', function () {
            updateDisplay();
        });
          

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $widget.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $widget.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$widget.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + ' active');
            } else {
                $widget.removeClass(style + color + ' active');
            }
        }

        // Initialization
        function init() {
        	//console.log("VA A ACTIVO "+index);
        	/*if(index<cantCategories){
        		for(var i=0;i<newClientCategoriesAlerts.length;i++){
        			//console.log("TEST "+JSON.stringify(pushCategoryIndexes[index]));
                	if(newClientCategoriesAlerts[i]==pushCategoryIndexes[index].id_category){
                		//console.log("ACTIVO "+index);
                		$checkbox.prop('checked', !$checkbox.is(':checked'));
                        $checkbox.triggerHandler('change');
                		break;
                	}
                }
        	}else{*/
        		var realIndex = index-cantCategories;
        		//console.log("ACTIONS "+realIndex);
        		for(var i=0;i<newClientActionsAlerts.length;i++){
                	if(newClientActionsAlerts[i]==pushActionsIndex[realIndex].id_action){
                		//console.log("ACTIVO "+realIndex);
                		$checkbox.prop('checked', !$checkbox.is(':checked'));
                        $checkbox.triggerHandler('change');
                		break;
                	}
                }
        	//}
        	
            
            if ($widget.data('checked') == true) {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
            }
            
            updateDisplay();

            // Inject the icon if applicable
            if ($widget.find('.state-icon').length == 0) {
                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }
        init();
    });
    
    
	//TOUCH ALERTAS
	$('#get-checked-data').on('click', function(e) {
		if(preventBadClick(e)){return false;}	
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
	    var checkedItems = {}, counter = 0;
	    //console.log("Paso por boton de save");
	    newClientActionsAlerts = [];
	    //Obtenemos las acciones
	    $("#check-list-box li.active").each(function(idx, li) {
	        checkedItems[counter] = $(li).text();
	        //console.log("ID FROM: "+checkedItems[counter]+" ID:"+$(li).data("value"));
	        newClientActionsAlerts.push($(li).data("value"));
	        counter++;
	    });
	    
	    //obtenemos los paises
	    newClientCountriesAlerts = [];
	
		$.each(_jAlert.teams, function(_index,_id) {
			//console.log("COUNTRY: "+_id+" ID: "+JSON.stringify(getCategoryIDByCountryCode(_id)));
			var obj = getCategoryIDByCountryCode(_id);
			//console.log("COUNTRY SAVE: "+obj.id_category);
			newClientCountriesAlerts.push(obj.id_category);
		});

	    
	    //mandamos a salvar la data
	    /*if(checkIfPushConfigsChanged(newClientCountriesAlerts, newClientActionsAlerts)){
	    	//save data to server
	    }*/
	    navigator.notification.activityStart("Guardando alertas", "Guardando...");
	    setNewPushOptionsToServer(newClientCountriesAlerts, newClientActionsAlerts, alertSaveComplete, alertSaveFail);
	});
	
	/*$('.countryButton').on('click', function(e) {
		if(preventBadClick(e)){return false;}	
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		var sendButton = $(e.target);
		var country = getCountryByCategoryID(newClientCountries[$(sendButton).data("value")]);
		if(country != null){
			console.log("Cambiar country: "+country.name);
		}else{
			console.log("Agregar country");
		}
	    
	});*/
	//END TOUCH
}


//RENDER
function renderInitAlerts() {
	//console.log("Paso por el RENDER ALERTS");
	//var _html = '<div class="row" >';
	//console.log("ARRAY: "+JSON.stringify(pushActionsIndex));
	
	var _html = '<div class="row">';
	_html += '<div class="col-xs-12">';
	_html += '<h3 class="text-center">Paises favoritos</h3>';
	
	/*for(var i=0;i<4;i++){
		if(currentClientCountries.lenght>0 && currentClientCountries<i){
			var country = getCountryByCategoryID(currentClientCountries[i]);
			_html += '<button data-value="'+country.id_category+'" class="btn btn-primary col-xs-12 countryButton" id="country_button_"'+i+' style="margin-top:5%; width:80%;left:10%;">'+country.name+'</button>';
		}else{
			_html += '<button data-value="-1" class="btn btn-primary col-xs-12 countryButton" id="country_button_"'+i+' style="margin-top:5%; width:80%;left:10%;">Agregar</button>';
		}
	}*/
	
	

	_html += '<div id="equipos"  class="row">';	
	_html += '</div>';			
	
	
	_html += '<button data-value="-1" class="btn btn-primary col-xs-12 countryButton"  style="margin-top:5%; width:80%;left:10%;">Agregar</button>';
	
	_html += '<br />';
	
	_html += '<h3 class="text-center">Alertas</h3>';
	//_html += '<div class="well" style="max-height: 300px;overflow: auto;">';
		_html += '<ul id="check-list-box" class="list-group checked-list-box">';
		cantCategories = 0;
		/*for(var i=0;i<pushCategoryIndexes.length;i++){
			if(pushCategoryIndexes[i].id_team == null || pushCategoryIndexes[i].id_team == ""){
				_html += '<li data-value="'+pushCategoryIndexes[i].id_category+'" class="list-group-item" data-style="button">'+pushCategoryIndexes[i].name+'</li>';
				cantCategories++;
			}
		}*/
		for(var i=0;i<pushActionsIndex.length;i++){		
			_html += '<li data-value="'+pushActionsIndex[i].id_action+'" class="list-group-item" data-style="button">'+pushActionsIndex[i].name+'</li>';
			/*_html += '<div class="col-md-12 news" data-item="'+pushActionsIndex[i].id_action+'"  >';
			_html += '</div>';*/		
		}
		 
		//_html += '</div>';
		_html += '</ul>';
		_html += '<br />';
		_html += '</div>';
	
	_html += '<button class="btn btn-primary col-xs-12" id="get-checked-data" style="margin-top:5%; width:80%;left:10%;">Guardar alertas</button>';
	
	_html += '</div>';
	_html += '<br />';
	
	$('#wrapper .scroller .container').empty();
	$('#wrapper .scroller .container').append(_html);
	
	initAlerts();
	_fsetTeamsAlerts();	
}

//SAVING FUNCTIONS alertSaveComplete, alertSaveFail
function alertSaveFail(){
	//window.plugins.spinnerDialog.hide();
	navigator.notification.activityStop();
	navigator.notification.alert("No se guardaron las alertas, error", doNothing, "Alerta", "OK");
}
function alertSaveComplete(){
	//window.plugins.spinnerDialog.hide();
	navigator.notification.activityStop();
	navigator.notification.alert("Se guardaron las alertas exitosamente", doNothing, "Exito", "OK");
}

//INIT FUNCTIONS
function errorRenderAlerts(){
	//window.plugins.spinnerDialog.hide();
	navigator.notification.activityStop();
	//console.log("Paso por el error de RENDER ALERTS");
	navigator.notification.alert("Error cargando las alertas", doNothing, "Alerta", "OK");
}

function initAlertPage(){
	//window.plugins.spinnerDialog.hide();
	navigator.notification.activityStop();
	//inicializamos los valores
	newClientCountriesAlerts = currentClientCountries.slice(0);
	//newClientCategoriesAlerts = currentClientCategories.slice(0);
	newClientActionsAlerts = currentClientActions.slice(0);
	
	//set Country data from WS
	_jAlert.teams = [];
	for(var i=0;i<newClientCountriesAlerts.length;i++){
		var obj = getCountryByCategoryID(newClientCountriesAlerts[i]);
		_jAlert.teams.push(obj.id_team);
	}
	//console.log("ALERTAS!!! "+JSON.stringify(_jAlert)+" LOADED: "+JSON.stringify(newClientCountriesAlerts));
	renderInitAlerts();	

}
//window.plugins.spinnerDialog.show();
navigator.notification.activityStart("Cargando alertas", "Cargando...");
//Obtenemos la informacion del cliente y las opciones que podemos activar/desactivar
getClientPushOptions(initAlertPage, errorRenderAlerts, false);