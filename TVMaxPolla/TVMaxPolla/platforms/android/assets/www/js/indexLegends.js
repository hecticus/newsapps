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
    	//initPage();
    }
};



function goBack(){
	$('#scroller').addClass('hidden'); 
	$('#returnButton').addClass('hidden');
	$('#players').removeClass('hidden');
	$("#players").scrollTop(0);
}

function initPage(id){
	$("#scroller").scrollTop(0);
	$('#players').addClass('hidden'); 
	$('#returnButton').removeClass('hidden');
	$('#scroller').removeClass('hidden');
	document.getElementById("playerPic").src='img/players/bio/'+id+'.jpg';
  $.ajax({
  	url: 'img/players/xml/wc2014-bio-'+id+'-es.xml',
    type: 'GET',               
    dataType: 'xml',                      
    }).done(function(xml) {
		$(xml).find('NewsItem > NewsComponent > NewsComponent:first').each(function(){
      		var player = $(this).find('ContentItem > DataContent').clone();
		
		$("#playerInfo").html(player);
		
		});
    });
}

function goBackStadiums(){
	$('#scroller').addClass('hidden'); 
	$('#returnButton').addClass('hidden');
	$('#stadiums').removeClass('hidden');
	$("#stadiums").scrollTop(0);
}

function initStadium(id){
	$("#scroller").scrollTop(0);
	$('#stadiums').addClass('hidden'); 
	$('#returnButton').removeClass('hidden');
	$('#scroller').removeClass('hidden');
	document.getElementById("stadiumPic").src='img/stadiums/main/'+id+'-in.jpg';
  $.ajax({
  	url: 'img/stadiums/xml/wc2014-direct-sites-'+id+'-es.xml',
    type: 'GET',               
    dataType: 'xml',                      
    }).done(function(xml) {
		$(xml).find('NewsItem > NewsComponent > NewsComponent:first').each(function(){
      		var player = $(this).find('ContentItem > DataContent').clone();
		
		$("#stadiumInfo").html(player);
		
		});
    });
}

function goBackHist(){
	$('#scroller').addClass('hidden'); 
	$('#returnButton').addClass('hidden');
	$('#hists').removeClass('hidden');
	$("#hists").scrollTop(0);
}

function initHist(id){
	$("#scroller").scrollTop(0);
	$('#hists').addClass('hidden'); 
	$('#returnButton').removeClass('hidden');
	$('#scroller').removeClass('hidden');
	document.getElementById("histPic1").src='img/history/main/'+id+'-1.jpg';
	document.getElementById("histPic2").src='img/history/main/'+id+'-2.jpg';
  $.ajax({
  	url: 'img/history/xml/wc2014-histo-'+id+'-resume-es.xml',
    type: 'GET',               
    dataType: 'xml',                      
    }).done(function(xml) {
		$(xml).find('NewsItem > NewsComponent > NewsComponent:first').each(function(){
      		var player = $(this).find('ContentItem > DataContent').clone();
		
		$("#histInfo").html(player);
		
		});
    });
}

function goBackTeam(){
	$('#scroller').addClass('hidden'); 
	$('#returnButton').addClass('hidden');
	$('#teams').removeClass('hidden');
	$("#teams").scrollTop(0);
}

function initTeam(id){
	$("#scroller").scrollTop(0);
	$('#teams').addClass('hidden'); 
	$('#returnButton').removeClass('hidden');
	$('#scroller').removeClass('hidden');
	//document.getElementById("histPic1").src='img/history/main/1958-1.jpg';
//	$("#teamName").html('<ul><li>'+id+'</li></ul>');
  $.ajax({
  	url: 'img/teams/xml/wc2014-team-'+id+'-fiche-es.xml',
    type: 'GET',               
    dataType: 'xml',                      
    }).done(function(xml) {
		$(xml).find('NewsItem > NewsComponent > NewsLines:first').each(function(){
      		var countryName = $(this).find('ul').clone();
			$("#teamName").html(countryName);
		});
		
		$(xml).find('NewsItem > NewsComponent > NewsComponent:first').each(function(){
      		var player = $(this).find('ContentItem > DataContent').clone();
			$("#teamInfo").html(player);
		});
    });
	
	$.ajax({
  	url: 'img/teams/xml/wc2014-team-'+id+'-gene-es.xml',
    type: 'GET',               
    dataType: 'xml',                      
    }).done(function(xml) {
		$(xml).find('NewsItem > NewsComponent > NewsComponent:first').each(function(){
      		var player = $(this).find('ContentItem > DataContent').clone();
		
			$("#teamText").html(player);
		
		});
    });
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}
