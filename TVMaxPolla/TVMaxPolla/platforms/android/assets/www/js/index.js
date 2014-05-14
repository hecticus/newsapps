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
 
function exitApp(){
	if (navigator.app) {						
        navigator.app.exitApp();				            
    } else if (navigator.device) {			        	
        navigator.device.exitApp();				            				          
    }
}

var app = {
    initialize: function() {this.bindEvents();},
    bindEvents: function() {document.addEventListener('deviceready', this.onDeviceReady, false);},
    onDeviceReady: function() {
    	

		document.addEventListener('backbutton', function() {
			//exitApp();
			
			$('#wrapper2 .scroller .container').empty();			
			$('#wrapper2').attr('class','page transition right');
			
		}, false);
		
		app.receivedEvent('deviceready');
    	
    	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
 
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	//init things
    	initPage();
    }
};

function initPage(){

	$('body').addClass('polla');
	$('main').load('polla.html');
	//$('main').load('noticias.html');


	//touchFunctions();
	//initFacebookManager();
}

function touchFunctions(){
	//facebook login
	$('#facebookLoginButton').click(function(){
        //alert("JQuery Running!");
		login();
	});
	
	//video stream button
	$(document).on('touchend','.tv:not(.share)', function(e) {
		e.preventDefault();
		e.stopPropagation();
		console.log("PASO");
		window.videoPlayer.play('rtsp://streaming.tmira.com:1935/tvn/tvn.stream');
	});
}
