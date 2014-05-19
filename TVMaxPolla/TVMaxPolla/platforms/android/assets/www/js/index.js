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

var _urlCloud = 'http://1053e587fa1a3ea08428-6ed752b9d8baed6ded0f61e0102250e4.r36.cf1.rackcdn.com';
var _date = new Date();
var _day = _date.getDate();
var _month = (_date.getMonth()+1);
var _year = _date.getFullYear();
var _copyright= 'Copyright &copy; Televisora Nacional S.A. ' + _year;

var _jGet = false;	
var _oAjax;
var _jMenuColor=['#ffffff', '#ebebeb', '#d4d4d4','#c0c0c0', '#a8a8a8', '#8f8f8f','#a8a8a8','#c0c0c0','#d4d4d4','#ebebeb'];
var _tap = false;


var _jMenu=[
	{index:0,class:'content-home',title:'Home',load:'home.html', glyphicon:'glyphicon glyphicon-home', json:false},
  	{index:1,class:'content-polla',title:'Polla',load:'polla.html', glyphicon:'glyphicon glyphicon-tower', json:false},
  	{index:2,class:'content-noticias',title:'Noticias',load:'noticias.html', glyphicon:'glyphicon glyphicon-star', json:false},
  	{index:3,class:'content-goles',title:'Goles',load:'goles.html', glyphicon:'glyphicon glyphicon-facetime-video', json:false},
  	{index:4,class:'content-pronosticos',title:'Pronosticos',load:'pronosticos.html', glyphicon:'glyphicon glyphicon-heart', json:false},
  	{index:5,class:'content-polemicas',title:'Polemicas',load:'polemicas.html', glyphicon:'glyphicon glyphicon-bookmark', json:false},
  	{index:6,class:'content-calendario',title:'Calendario',load:'calendario.html', glyphicon:'glyphicon glyphicon-calendar', json:false},
  	{index:7,class:'content-stadiums',title:'Estadios',load:'stadiums.html', glyphicon:'glyphicon glyphicon-inbox', json:false},
  	{index:8,class:'content-history',title:'Historia',load:'history.html', glyphicon:'glyphicon glyphicon-plane', json:false},
  	{index:9,class:'content-players',title:'Biografias',load:'players.html', glyphicon:'glyphicon glyphicon-user', json:false},
  	{index:10,class:'content-teams',title:'Equipos',load:'teams.html', glyphicon:'glyphicon glyphicon-flag', json:false}
  	    	
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
			_fSetBack();						
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
	
	$('#wrapperM').height($(window).height());
	$('#wrapperM .scroller').height($(window).height());
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
		_tap = false;
		myScrollM.scrollTo(0,0,0);
		$('#wrapperM').attr('class','page transition right');		
	});

	$(document).on('tap','.load', function(e) {
	
		if(_oAjax && _oAjax.readystate != 4) {
            _oAjax.abort();
        }

	
		_fSetBack();
		var _this = $(this);
		
		$('body').removeClass();
		$('body').addClass(_this.data('class'));
		$('main').empty();
		$('main').data('index',_this.data('index'));	
		$('.title').html('<span>' + _jMenu[_this.data('index')].title + '</span>');						
		$('main').load(_this.data('load'));
	
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






