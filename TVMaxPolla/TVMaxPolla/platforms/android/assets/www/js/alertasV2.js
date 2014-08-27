var cantCategories = 0;

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
        	if(pushList[index].isSuscribed == true){
        		$checkbox.prop('checked', !$checkbox.is(':checked'));
                $checkbox.triggerHandler('change');
        	}
        	
            
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
	    //console.log("Paso por boton de save");
	    //limpiamos los valores
	    for(var j=0;j<pushList.length; j++){
	    	pushList[j].isSuscribed = false;
	    }
	    //Obtenemos las acciones
	    $("#check-list-box li.active").each(function(idx, li) {
	        //console.log("ID FROM: "+checkedItems[counter]+" ID:"+$(li).data("value"));
	        var idAction = $(li).data("value");
	        for(var j=0;j<pushList.length; j++){
	        	if(pushList[j].id_action == idAction){
	        		pushList[j].isSuscribed = true;
	        	}
	        }
	    });
	    
	    //mandamos a salvar la data
	    navigator.notification.activityStart("Guardando alertas", "Guardando...");
	    //TODO: HACER NUEVO SAVE FUNC
	    updatePushOptionsToServer(alertSaveComplete, alertSaveFail);
	});
	//END TOUCH
}


//RENDER
function renderInitAlerts() {
	//console.log("Paso por el RENDER ALERTS");
	//var _html = '<div class="row" >';
	//console.log("ARRAY: "+JSON.stringify(pushActionsIndex));
	
	var _html = '<div class="row">';
	
	_html += '<h3 class="text-center col-xs-12">Alertas</h3>';
	//_html += '<div class="well" style="max-height: 300px;overflow: auto;">';
		_html += '<ul id="check-list-box" class="list-group checked-list-box">';
		cantCategories = 0;
		/*for(var i=0;i<pushCategoryIndexes.length;i++){
			if(pushCategoryIndexes[i].id_team == null || pushCategoryIndexes[i].id_team == ""){
				_html += '<li data-value="'+pushCategoryIndexes[i].id_category+'" class="list-group-item" data-style="button">'+pushCategoryIndexes[i].name+'</li>';
				cantCategories++;
			}
		}*/
		for(var i=0;i<pushList.length;i++){	
			//if(pushActionsIndex[i].id_action!=0){
			_html += '<li data-value="'+pushList[i].id_action+'" class="list-group-item" data-style="button">'+pushList[i].display_name+'</li>';
			/*_html += '<div class="col-md-12 news" data-item="'+pushActionsIndex[i].id_action+'"  >';
			_html += '</div>';*/		
			//}
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
	
	_fSetLoadInit();
}

function initAlertPage(){
	//window.plugins.spinnerDialog.hide();
	navigator.notification.activityStop();
	//inicializamos los valores
	//newClientActionsAlerts = currentClientActions.slice(0);
	
	renderInitAlerts();	

}
//window.plugins.spinnerDialog.show();
navigator.notification.activityStart("Cargando alertas", "Cargando...");
//Obtenemos la informacion del cliente y las opciones que podemos activar/desactivar
getClientPushOptions(initAlertPage, errorRenderAlerts,true);