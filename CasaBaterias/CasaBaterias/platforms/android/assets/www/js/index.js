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


var map; 
var myLatlng; 
function initialize() {

	var latitud = jQuery('#maps-sucursal option:selected').data('latitud');
	var longitud = jQuery('#maps-sucursal option:selected').data('longitud');
	
    myLatlng = new google.maps.LatLng(latitud, longitud); 
    var mapOptions = { 
        zoom: 16, 
        center: myLatlng 
    }; 
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
} 
var marker = new google.maps.Marker({ 
    position: myLatlng, 
    map: map, 
    title: 'Mi punto en el mapa' 
});


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
 			  	$('#content').attr('class','page transition right');
 			  	myScrollMenu.scrollTo(0,0,0);
			});
			
    	}, false);
    	
    	
    	google.maps.event.addDomListener(document.getElementById('maps-sucursal'), 'change', initialize); 
    	document.addEventListener('touchmove', function (e) {e.preventDefault();}, false);    	
    	document.body.addEventListener('touchmove', function(event) {event.preventDefault();}, false);    	 
        app.receivedEvent('deviceready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	
    	
    	
    	
    	
    	
    	var _hoverTimeout = null;
       	
       	var myScrollDelivery, myScrollMenu, myScrollMaps;
       	
       	myScrollDelivery = new IScroll('#delivery'); 
       	
       	      
		myScrollMaps = new IScroll('#maps'); 
     
     
     
       	
       	myScrollMenu = new IScroll('#index',{tap:true});

		myScrollMenu.on('scrollStart', function () {
			clearTimeout(_hoverTimeout);
			$('.option').removeClass('hover');
		});


		myScrollMenu.on('scrollCancel', function () {
			clearTimeout(_hoverTimeout);	
			$('.option').removeClass('hover');
		});

	
		$(function() {
	       		
	       		
	       		
       		$('input, textarea','select').on('focus', function (e) {
			    $('header, footer').css('position', 'absolute');
			}).on('blur', function (e) {
			    $('header, footer').css('position', 'fixed');
			
			});
	       		
	       	$.getJSON('json/maps.json', function(maps){
    			$.each(maps.pais, function(i,pais){    			
    				$('#maps-country').append('<option value="'+pais.nombre+'">&nbsp;'+pais.nombre+'</option>');
    			});    			
    		});
	       	
	       	$('#maps-country').on('change', function (e){
	       		
	       		var optionSelected = $("option:selected", this);
    			var valueSelected = this.value;
	       		$('#maps-sucursal').empty();
	       		$('#map-canvas').empty();
	       		
	       		
			  	$.getJSON('json/maps.json', function(maps){
	    			$.each(maps.pais, function(i,pais){	    				
	    				if (valueSelected == pais.nombre) {
	    					$('#maps-sucursal').append('<option value="">&nbsp;Seleccione</option>');
	    					$.each(pais.sucursal, function(i,sucursal){
	    						$('#maps-sucursal').append('<option data-latitud="'+sucursal.latitud+'" data-longitud="'+sucursal.longitud+'"  value="'+sucursal.nombre+'">&nbsp;'+sucursal.nombre+'</option>');
	    					});
	    				}
	    			});    			
    			});
    			
			});
	       	

			$(document).on('touchend','.btn-send', function() {				
				$("form").find(':input:not([type="button"])').each(function() {
        			
        		});
			}); 
	
       		$(document).on('touchend','header', function() {      			
       			$('#delivery,#maps').attr('class','page transition right');
       			myScrollMenu.scrollTo(0,0,0);		
			});
			
			
			$(document).on('tap','.option', function() {
				var option = $(this).data('option');				
				$(option).attr('class','page transition left');
			});

	       	$(document).on('touchstart','.option', function() {
				var _this = this;
	       		clearTimeout(_hoverTimeout);
				_hoverTimeout = setTimeout(function () {
					$(_this).addClass('hover');													
				}, 10);
			});
	       		

	       		
		});
       
    }
};
