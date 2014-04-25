/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var hoverTimeout = null;
var myScrollDelivery, myScrollMenu, myScrollMaps;
var map; 
var myLatlng; 


var jsonPais = [];
var jsonSucursal = [];

function initialize() {


	var pais = jQuery('#maps-country option:selected').val();
	var sucursal = jQuery('#maps-sucursal option:selected').val();
	var latitud = jQuery('#maps-sucursal option:selected').data('latitud');
	var longitud = jQuery('#maps-sucursal option:selected').data('longitud');
	
    myLatlng = new google.maps.LatLng(latitud, longitud); 
    var mapOptions = { 
        zoom: 15, 
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }; 
    
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    
    
    var marker = new google.maps.Marker({ 
    	position: myLatlng, 
    	title: 'Casa de las baterias ' + sucursal
	});
	
    marker.setMap(map);
    $(function() {
    
    
	    jsonPais.forEach(function(country) {    			
			if (country.nombre == pais) {
			

			
				country.sucursal.forEach(function(sucursales) {			
					if (sucursales.nombre == sucursal) {
					
		
						var foto = '<div style="width:100%; height:250px; margin: 5px auto; background-image: url(img/sucursales/'+sucursales.foto+'); bakcground-size:cover; " ></div>';
						var horario = foto + '<h1 class="title">Horario</h1> <p class="data">'+sucursales.horario+'</p>';
						var direccion = horario +'<h1 class="title">Direccion</h1> <p class="data">'+sucursales.direccion+'</p>';										
						var contacto = direccion +'<h1 class="title">Contacto</h1> <p class="data">'+sucursales.telefono+'</p>';
						contacto += '<p class="data">'+sucursales.email+ '</p>';
						
						var arrtelefono = sucursales.telefono.split('Fax');
						var call = '<p><a href="tel:++'+arrtelefono[0]+'" ><button type="button" class="btn-call">llamar</button></a></p>';							
						contacto = contacto + call;					
						$('#maps-data').html(contacto);
					
					}
			 						
				});    					
			}
		
		});
    
    });
	
    
    
    
    
    
    
    
    
    
    
    
    
    
    
} 





var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	
		document.addEventListener('backbutton', function checkConnection() {
			
    		$(function() { 			  
 			  	$('#delivery,#maps').attr('class','page transition right');
       			$('form').trigger("reset");
       			/*myScrollMenu.scrollTo(0,0,0);
       			myScrollDelivery.scrollTo(0,0,0);
       			myScrollMaps.scrollTo(0,0,0);*/		
			});
			
    	}, false);
    	

    	google.maps.event.addDomListener(document.getElementById('maps-sucursal'), 'change', initialize); 
    	document.addEventListener('touchmove', function (e) {e.preventDefault();}, false);    	
    	document.body.addEventListener('touchmove', function(event) {event.preventDefault();}, false);    	 
        app.receivedEvent('deviceready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	
    	

       	myScrollDelivery = new IScroll('#delivery'); 
       	myScrollDelivery.on('beforeScrollStart', function () { this.refresh(); });

		myScrollMaps = new IScroll('#maps'); 
     	myScrollMaps.on('beforeScrollStart', function () { this.refresh(); });
     
     
       	
       	myScrollMenu = new IScroll('#index',{tap:true});
       	
		myScrollMenu.on('scrollStart', function () {
			this.refresh();
			clearTimeout(hoverTimeout);
			$('.option').removeClass('hover');
		});


		myScrollMenu.on('scrollCancel', function () {
			clearTimeout(hoverTimeout);	
			$('.option').removeClass('hover');
		});

	
		$(function() {
      		
      
      		$('body').width($(window).width());
			$('body').height($(window).height());
			
			$('.pages').width($(window).width());
			$('.pages').height($(window).height());		
      		
	       		
       		$('input, textarea','select').on('focus', function (e) {
			    $('header, footer, .page').css('position', 'absolute');
			}).on('blur', function (e) {
			    $('header, footer, .page').css('position', 'fixed');
			
			});
			
			
			$.ajax({
			  	url: 'xml/Sucursales_DATOS.xml',
			  	type: 'GET',			  
			  	dataType: 'xml',
			  	async:false, 
				success:function(xml){	
					var nombre = '';
					var index = -1;			
					$(xml).find('Workbook > Worksheet > Table > Row').each(function(i){
						var cell = $(this);
						if (nombre != cell.find('Cell > Data').eq(0).text()) {			
							nombre = cell.find('Cell > Data').eq(0).text();
							if (nombre != '') {
								jsonPais.push({nombre : cell.find('Cell > Data').eq(0).text(), sucursal: []});
								index = index + 1;
							}							
						}
						
						if (nombre == cell.find('Cell > Data').eq(0).text()) {
							if (nombre != '') {
								jsonPais[index].sucursal.push({
								
								nombre:cell.find('Cell > Data').eq(1).text(),
								latitud:cell.find('Cell > Data').eq(6).text(),
								longitud:cell.find('Cell > Data').eq(7).text(),
								foto: cell.find('Cell > Data').eq(8).text(),
								horario: cell.find('Cell > Data').eq(2).text(),
								direccion: cell.find('Cell > Data').eq(3).text(),
								telefono: cell.find('Cell > Data').eq(4).text(),
								email: cell.find('Cell > Data').eq(5).text()
								});
								
							}

						}	
						
			     	});		
				
				}			  	
			});
			
			
			
			
	       	jsonPais.forEach(function(pais) {	       	
			    $('#maps-country').append('<option value="'+pais.nombre+'">&nbsp;'+pais.nombre+'</option>');
				$('#delivery-country').append('<option value="'+pais.nombre+'">&nbsp;'+pais.nombre+'</option>');	
			});
	       	
	       	
	       	$('#delivery-country').on('change', function (e){
	       		
	       		var optionSelected = $("option:selected", this);
    			var valueSelected = this.value;
	       		$('#delivery-sucursal').empty();
	       		
	       		
	       		$('#delivery-sucursal').append('<option value="">&nbsp;Sucursal *</option>');	
    			jsonPais.forEach(function(pais) {    			
    				if (pais.nombre == valueSelected) {
    					pais.sucursal.forEach(function(sucursal) {
    						$('#delivery-sucursal').append('<option value="'+sucursal.nombre+'">&nbsp;'+sucursal.nombre+'</option>');    						
    					});    					
    				}
    			
    			});

			});

	       	
	       	$('#maps-country').on('change', function (e){
	       		
	       		var optionSelected = $("option:selected", this);
    			var valueSelected = this.value;
	       		$('#maps-sucursal').empty();
	       		$('#map-canvas').empty();
    			$('#maps-data').empty();
    			
    			$('#maps-sucursal').append('<option value="">&nbsp;Sucursal *</option>');	
    			jsonPais.forEach(function(pais) {    			
    				if (pais.nombre == valueSelected) {
    					pais.sucursal.forEach(function(sucursal) {
    						$('#maps-sucursal').append('<option data-latitud="'+sucursal.latitud+'" data-longitud="'+sucursal.longitud+'" value="'+sucursal.nombre+'">&nbsp;'+sucursal.nombre+'</option>');
    					});    					
    				}
    			
    			});
    			
			});
	       	
			


			$(document).on('touchend','.btn-send', function() {
			
				var _return = true;
			
				$('form').find(':input:not([type="button"])').each(function() {        			        			
        			if ($(this).val().length == 0) {
        				alert (this.name + ' es un campo obligatorio');
        				$(this).focus();
        				myScrollDelivery.scrollTo(0,0,0);
        				_return = false;
        				return false;
        			}        			
        		});

				if (_return) {
					
					
					var body = "<fieldset>";
					body += "<legend>Datos personales:</legend>";
					body += "Nombre: " + $('#name').val();
					body += "<br />Email: " + $('#email').val();
					body += "<br />Telefono: " + $('#phone').val();
					body += "</fieldset>";
	        		
	        		
	        		body += "<fieldset>";
					body += "<legend>Datos del Vehiculo:</legend>";
					body += "Marca: " + $('#brand-car').val();
					body += "<br />Modelo: " + $('#model-car').val();
					body += "<br />Año de antiguedad: " + $('#year-car').val();
					body += "<br />Combustible: " + $('#combustible').val();
					body += "<br />Tiempo de vida de la bateria: " + $('#time-living').val();				
					body += "</fieldset>";
	        		
	        		body += "<fieldset>";
					body += "<legend>Datos del Servicio:</legend>";
					body += "Tipo de Servicio: " + $('#type-service').val();				
					body += "<br />Metodo de pago: " + $('#payment-method').val();
					body += "<br />Combustible: " + $('#combustible').val();
					body += "<br />Pais: " + $('#delivery-country').val();
					body += "<br />Sucursal: " + $('#delivery-sucursal').val();
					body += "</fieldset>";
	
	        		window.plugin.email.open({
					    to:      ['alidaniel.buenano@hecticus.com'],
					    cc:      ['alidaniel.buenano@hecticus.com'],
					    subject: 'Casa de las baterias - Delivery',
					    body:    body,				    
	    				isHtml:  true
					});
					
					
				}

        		
				
				
			
			}); 
	
       		$(document).on('touchend','header', function() {      			
       			$('#delivery,#maps').attr('class','page transition right');
       			$('form').trigger("reset");
       			myScrollMenu.scrollTo(0,0,0);
       			myScrollDelivery.scrollTo(0,0,0);
       			myScrollMaps.scrollTo(0,0,0);			
			});
			
			
			$(document).on('tap','.option', function() {
				var option = $(this).data('option');				
				$(option).attr('class','page transition left');				
			});

	       	$(document).on('touchstart','.option', function() {
				var _this = this;
	       		clearTimeout(hoverTimeout);
				hoverTimeout = setTimeout(function () {
					$(_this).addClass('hover');													
				}, 10);
			});
	       		

	       		
		});
       
    }
};
