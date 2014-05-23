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

var _aTime = [0,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11];
var _jImageFeatured = false;

				 
var _urlCloud = 'http://1053e587fa1a3ea08428-6ed752b9d8baed6ded0f61e0102250e4.r36.cf1.rackcdn.com';
var _date = new Date();
var _day = _date.getDate();
var _month = (_date.getMonth()+1);
var _year = _date.getFullYear();
var _copyright= 'Copyright &copy; Televisora Nacional S.A. ' + _year;

var _jGet = false;	
var _oAjax;

var _tap = false;

var _jMenu=[
	{index:0,class:'content-home',title:'Home',load:'home.html', glyphicon:'icon-home_menu', json:false},
  	{index:1,class:'content-polla',title:'Polla',load:'polla.html', glyphicon:'icon-polla_menu', json:false},
  	{index:2,class:'content-noticias',title:'Noticias',load:'noticias.html', glyphicon:'icon-noticias_menu', json:false},  	
  	{index:3,class:'content-goles',title:'Goles',load:'goles.html', glyphicon:'icon-goles_menu', json:false},  	
  	{index:4,class:'content-pronosticos',title:'Pron&oacute;sticos',load:'pronosticos.html', glyphicon:'icon-pronosticos_menu', json:false},  	
  	{index:5,class:'content-polemicas',title:'P&oacute;lemicas',load:'polemicas.html', glyphicon:'icon-polemicas_menu', json:false},  	
  	{index:6,class:'content-calendario',title:'Calendario',load:'calendario.html', glyphicon:'icon-fechas', json:false},  	
  	{index:7,class:'content-stadiums',title:'Estadios',load:'stadiums.html', glyphicon:'icon-estadios_menu', json:false},  	
  	{index:8,class:'content-history',title:'Historia',load:'history.html', glyphicon:'icon-historia_menu', json:false},
  	{index:9,class:'content-players',title:'Biograf&iacute;as',load:'players.html', glyphicon:'icon-biografia_menu', json:false},
  	{index:10,class:'content-teams',title:'Equipos',load:'teams.html', glyphicon:'icon-equipo', json:false},
  	{index:11,class:'content-resultados',title:'Resultados',load:'resultados.html', glyphicon:'icon-resultados', json:false},
  	{index:12,class:'content-mam',title:'MaM',load:'mam.html', glyphicon:'icon-minutoaminuto', json:false} 	   
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
    	
    	
    	/*_oAjax = $.fGetAjaXJSON('http://mundial.tvmax-9.com/_modulos/json/noticias_mundial.php',false,false,false);	
		if (_oAjax) {
			_oAjax.done(function(_json) {					
				_jMenu[0].json = _json.noticias_mundial;						
				$.each(_json.noticias_mundial.item, function(_index,_item) {
					if (_index == 0) _jImageFeatured = {src:_item.imagen,caption:_item.titulo};
					return false;
				});				
			});
		}*/
    	    	
    	$.each(_jPlayers, function(_index,_player) {
			_oAjax = $.fGetAjaXJSON(_player.url, 'xml', 'text/xml charset=utf-8', false);
			if (_oAjax) {
				_oAjax.done(function(_xml) {
														
					var _title = $(_xml).find('NewsItem > NewsComponent > NewsLines > HeadLine').text();
					
					var _id = $(_xml).find('NewsItem > Identification > NameLabel').text();
						_id = _id.split('-');
						_id = _id[1];
						
					var _data = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent').clone();
	    				_data = $('<div>').append(_data).remove().html();

	    			_player.title = _title;
	    			//_player.xml = _xml;
	    			_player.image = _urlCloud + '/legends/' + _id +'.jpg';	    								
					_player.datacontent =  _data;
					
				});
			}
		});	



		$.each(_jStadiums, function(_index,_stadium) {
			_oAjax = $.fGetAjaXJSON(_stadium.url, 'xml', 'text/xml charset=utf-8', false);
			if (_oAjax) {
				_oAjax.done(function(_xml) {
					
					var _title = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent > hl2').text();
					
					var _data = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent > dl').clone();
			    		_data = $('<div>').append(_data).remove().html();
			    		
			    		
					var _id = $(_xml).find('NewsItem > Identification > NameLabel').text();
						_id = _id.split('-');
						_id = _id[2];
						
					_stadium.title = _title;
	    			//_stadium.xml = _xml;
	    			_stadium.image = _urlCloud + '/stdmain/' + _id +'-in.jpg';	    								
					_stadium.datacontent =  _data;						
						
				});
			}		
		});


		$.each(_jTeams, function(_index,_team) {
			
			_oAjax = $.fGetAjaXJSON(_team.fiche, 'xml', 'text/xml charset=utf-8', false);
			if (_oAjax) {
				_oAjax.done(function(_xml) {
					
					var _title = $(_xml).find('NewsItem > NewsComponent > NewsLines > ul').text();
						_title = _title.split('-');
						_title =  _title[1];		
									
		    		var _data = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent').clone();
						_data = $('<div>').append(_data).remove().html();
												
					_team.title = _title;
	    			//_team.xml.fiche = _xml;
					_team.datacontent.fiche = _data;							

	
				});
			}

		});



		$.each(_jHistory, function(_index,_history) {	
			_oAjax = $.fGetAjaXJSON(_history.url, 'xml', 'text/xml charset=utf-8', false);
			if (_oAjax) {
				_oAjax.done(function(_xml) {
					
					var _title = $(_xml).find('NewsItem > NewsComponent > NewsLines > HeadLine').text();
			    	var _data = $(_xml).find('NewsItem > NewsComponent > NewsComponent:first > ContentItem > DataContent').clone();
			    		_data = $('<div>').append(_data).remove().html();
			    		
					var _id = $(_xml).find('NewsItem > Identification > NameLabel').text();
						_id = _id.split('-');
						_id = _id[1];
						
					_history.title = _title;
	    			//_history.xml = _xml;
	    			_history.image = _urlCloud + '/histmain/' + _id +'-1.jpg';	    								
					_history.datacontent =  _data;							
		
				});
			}		
		});


		document.addEventListener('backbutton', function(e) {
			
			if ($('#wrapper2').hasClass('left')) {			
				_fSetBack();							
			} else {
				
				if ($('#wrapperM').hasClass('right')) {
			 		_fSetBack();
				} else if ($('body').hasClass('content-home')) {							
					exitApp();				
				} else {
					$('body').removeClass();
					$('body').addClass(_jMenu[0].class);
					$('main').data('index',0);		
					$('main').load(_jMenu[0].load);
					$('.title').html('<span>' + _jMenu[0].title + '</span>'); 
				}
				
			}
										
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
		_html += '<div class="col-md-12 content-menu load" data-index="' +  _menu.index + '" >';
		_html += '<span class="' + _menu.glyphicon + '"></span>';
		_html += '<span>' + _menu.title + '</span>';
		_html += '</div>';
	});         	
	_html += '</div>';

	$('#wrapperM .scroller .container').html(_html);
	
	
	$('body').removeClass();
	$('body').addClass(_jMenu[0].class);
	$('main').data('index',0);		
	$('main').load(_jMenu[0].load);
	$('.title').html('<span>' + _jMenu[0].title + '</span>'); 

	//touchFunctions();
	//initFacebookManager();



	$(document).on('click','.menu', function(e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();

		if ($('header .container .row .menu span').hasClass('icon-back')) {
			_fSetBack();			
		} else if ($('#wrapperM').hasClass('right')) {
			$('#wrapperM').attr('class','page transition left');	
		} else {
			$('#wrapperM').attr('class','page transition right');
		}
	});

	$(document).on('click','.load', function(e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	/*	$(document).unbind('click');
  		$(document).bind('click'); 
		$(document).off('click');
		$(document).on('click');*/

		
		
		clearTimeout(_mTimeout);			
		
		if(_oAjax && _oAjax.readystate != 4) {
			_oAjax.abort();
    	}

		_fSetBack();
		var _this = $(this);
		
		$('body').removeClass();
		$('body').addClass(_jMenu[_this.data('index')].class);
		$('main').empty();
		$('main').data('index',_this.data('index'));	
		$('.title').html('<span>' + _jMenu[_this.data('index')].title + '</span>');						
		$('main').load(_jMenu[_this.data('index')].load);
	
		$('#wrapperM').attr('class','page transition left');
	
	});
	
	$(document).on('click','.video', function(e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		window.videoPlayer.play($(this).data('src'));
	});
	
	$(document).on('click','.livetv', function(e) {
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		window.videoPlayer.play("http://urtmpkal-f.akamaihd.net/i/0s75qzjf5_1@132850/master.m3u8");
	});

}
function _fRenderLoad(){
	
	
};


function touchFunctions(){
	//facebook login
	$('#facebookLoginButton').click(function(){
        //alert("JQuery Running!");
		login();
	});
}






