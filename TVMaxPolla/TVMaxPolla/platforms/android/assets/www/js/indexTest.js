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
			exitApp();
		}, false);
		
		app.receivedEvent('deviceready');
    	
    	
 
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	//init things
    	initPage();
    }
};

/*function initPage(id){
	$(document).ready(function(){
	  $("#dvContent").append("<ul></ul>");
	  $.ajax({
		type: "GET",
		url: "img/players/xml/wc2014-bio-"+id+"-es.xml",
		dataType: "xml",
		success: function(xml){
		$(xml).find('NewsItem > NewsComponent > NewsComponent:first').each(function(){
			var sTitle = $(this).find('ContentItem > DataContent').text();
			$("#playerInfo").append(sTitle);
		});
		
	  },
	  error: function() {
		alert("An error occurred while processing XML file.");
	  }
	  });
	});

	
	
	
	//$("#playerInfo").append(bioTest);
	
	
	
	/*$('#facebookLoginButton').click(function(){
        //alert("JQuery Running!");
		login();
	});
	
	initFacebookManager();*
}*/


function initPage(id){
  $.ajax({
  	url: 'img/players/xml/wc2014-bio-'+id+'-es.xml',
    type: 'GET',               
    dataType: 'xml',                      
    }).done(function(xml) {
		$(xml).find('NewsItem > NewsComponent > NewsComponent:first').each(function(){
      		var player = $(this).find('ContentItem > DataContent').clone();//.replaceAll("<block>", "<div>");
		//	player = player.replaceAll("</block>", "</div>");
		//	$('#playerInfo').append(player).html();
		//alert(player.text());
		
		$("#playerInfo").html(player);
		
		console.log(document.getElementById('#playerInfo').innerHTML());
	 	});
    });
	
	
	
}


