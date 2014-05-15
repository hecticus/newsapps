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

var _date = new Date();
var _day = _date.getDate();
var _month = (_date.getMonth()+1);
var _year = _date.getFullYear();
var _copyright= 'Copyright &copy; Televisora Nacional S.A. ' + _year;

var _jGet = false;	
var _oAjax;
var _jMenuColor=['#ffffff', '#ebebeb', '#d4d4d4','#c0c0c0', '#a8a8a8', '#8f8f8f','#a8a8a8','#c0c0c0','#d4d4d4','#ebebeb'];

var _jMenu=[
	{index:0,class:'noticias',title:'Home',bgcolor:'#0404B4',load:'noticias.html', glyphicon:'glyphicon glyphicon-home', json:false},
  	{index:1,class:'polla',title:'Polla',bgcolor:'#0404B4',load:'polla.html', glyphicon:'glyphicon glyphicon-tower', json:false},
  	{index:2,class:'noticias',title:'Noticias',bgcolor:'#FF4000',load:'noticias.html', glyphicon:'glyphicon glyphicon-star', json:false},
  	{index:3,class:'goles',title:'Goles',bgcolor:'#A4A4A4',load:'goles.html', glyphicon:'glyphicon glyphicon-facetime-video', json:false},
  	{index:4,class:'pronosticos',title:'Pronosticos',bgcolor:'#AEB404',load:'pronosticos.html', glyphicon:'glyphicon glyphicon-heart', json:false},
  	{index:5,class:'polemicas',title:'Polemicas',bgcolor:'#FE2E64',load:'polemicas.html', glyphicon:'glyphicon glyphicon-bookmark', json:false}  	
];


 
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
						
			$('.share').addClass('hidden');
			$('.share').removeAttr('onclick');
			
			$('#wrapperM').attr('class','page transition left');	
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

	

	var _html = '<div class="row">';	
	$(_jMenu).each(function(_index,_menu) {
		_html += '<div class="col-md-12 load" data-index="' +  _menu.index + '" data-class="' + _menu.class + '" data-load="' +  _menu.load + '" style="background:'+ _jMenuColor[(_index%10)] + '; line-height:40px; " >';
		_html += '<span class="' + _menu.glyphicon + '"></span>';
		_html += '<span style="margin-left:5px; font-size:1.4em; font-weight:bold;" >' + _menu.title + '</span>';
		_html += '</div>';
	});         	
	_html += '</div>';
	
	$('#wrapperM .scroller .container').height($(window).height());
	$('#wrapperM .scroller .container').append(_html);
	
	
	

	
	$('body').removeClass();
	$('body').addClass(_jMenu[0].class);
	$('main').data('index',0);		
	$('main').load(_jMenu[0].load);
	$('.title').html('<span>' + _jMenu[0].title + '</span>'); 

	//touchFunctions();
	//initFacebookManager();

	$(document).on('touchend','.menu', function(e) {
		$('#wrapperM').attr('class','page transition right');
	});

	$(document).on('tap','.load', function(e) {
		
		var _this = $(this);
		
		$('body').removeClass();
		$('body').addClass(_this.data('class'));
		$('main').data('index',_this.data('index'));		
					
		$('main').load(_this.data('load'), function(){
        	$('.title').html('<span>' + _jMenu[_this.data('index')].title + '</span>');        	
        });

		$('#wrapperM').attr('class','page transition left');
		
	});
		
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










