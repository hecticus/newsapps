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


var currentTime = new Date();
var day = currentTime.getDate();
var month = (currentTime.getMonth()+1);
var year = currentTime.getFullYear();
var formatdate= ((day<10)? '0'+day:day) +'/'+ ((month<10)? '0'+month:month)  +'/'+year;

var arrTime=[0,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11];
var arrTimeM=['am','am','am','am','am','am','am','am','am','am','am','am','pm','pm','pm','pm','pm','pm','pm','pm','pm','pm','pm','pm'];
var arrMonth=['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
var arrDay=['Dom', 'Lun', 'Mar','Mie', 'Jue', 'Vie', 'Sab'];

var viewport={width:$(window).width(),height:$(window).height(),pHeight:(($(window).height()*40)/100), pWidth:(($(window).width()*25)/100),ar:($(window).width()/$(window).height())};




var arrPage=[];
var arrMode=[{title:'Resultados',page:12},{title:'Noticias',page:0}];

//INIT FUNCTIONS
//Funcion que permite rellenar el menu por codigo
function setMenuCategories(){
	

	var mode=0;	
	 if (($('#modeset').html()=="") || ($('#modeset').html()=="Noticias"))  {
	 	
	 	$('#modeset').html('Resultados');
	 	$('#modetitle').html('Noticias');
	 	$('#modeset').data('mode',0); 	
	 	$('.slider').height('250px');
	 	 if (typeof myScrollPage != 'undefined') {
	 	 	myScrollPage.scrollToPage(0, 0, 0);
	 	 	$('#extra').attr('class','page left');
			$('#datacontent').attr('class','page right');
			$('#top').addClass('closed');
			if (typeof myScrollDatacontentHorizontal != 'undefined') {
				myScrollDatacontentHorizontal = null;
			}	
	 	 } 

	 } else {
	 
	 	$('.slider').height('130px'); 
	 	$('#modeset').html('Noticias');
	 	$('#modetitle').html('Resultados');
	 	$('#modeset').data('mode',1);
	 	mode = 1;
	 	
		myScrollextra.scrollTo(0,0,0);
		$('#datacontent').attr('class','page right');
	    $('#top').addClass('closed');    				
	    $('#extra').attr('class','page transition right');
	   	$.fgetExtras(12,arrCategory[12].title);	
	 	
	 	
	 }
	
	

	$.lil='';
	$('#mainMenuList').empty();
	for(var i=0; i<arrCategory.length; i++){
		if (arrCategory[i].mode == mode){
			$.lil+='<li category="'+arrCategory[i].id+'" title="'+arrCategory[i].title+'" class="menu" data-position="'+arrCategory[i].i+'">'+arrCategory[i].title+'</li>\n';
		}
	}	

	$('#mainMenuList').append($.lil);	
}

//function to set the correct pages with the correct IDs and colors
function setScrollPages() {
	$('#scrollerpage').empty();
	for(var i=0; i<arrCategory.length; i++){
	
		$.li='<div class="pages"  style="position:relative; float:left; display:block; background-color:#000000;">';
			$.li+='<div id="'+arrCategory[i].id+'" class="page" style="position:absolute; z-index:1; top:20px; bottom:0; left:0; width:100%; overflow:auto;">';	
				$.li+='<div id="'+arrCategory[i].id+'-featured" class="featured" style="position:absolute;  z-index: 0; background-color:#000000;"></div>';
				
				
				
				$.li+='<div class="scroller">';
					$.li+='<ul>';
						$.li+='<li>';
							$.li+='<ul id="'+arrCategory[i].id+'-news-featured" class="featured">';	
								$.li+='<li id="'+arrCategory[i].id+'-news-featured-title" class="featured" data-content="headline"></li>';
							$.li+='</ul>';
							$.li+='<ul id="'+arrCategory[i].id+'-news1" class="news1" style="background-color:#ffffff;">';										
							$.li+='</ul>';
							$.li+='<ul class="status" style="background-color:#ffffff; text-align:center;"></ul>';											
						$.li+='</li>';
					$.li+='</ul>';
				$.li+='</div>';
			$.li+='</div>';	
		$.li+='</div>';

		$('#scrollerpage').append($.li);
	}
}

function newScroll(scroll) {
	return new iScroll(scroll,1,{snap:false,hScroll: false, vScroll: true, hScrollbar: false,vScrollbar: false,bounce:true,lockDirection: true,
		onBeforeScrollStart: function(e){				
			this.refresh();
			var target = e.target;
			clearTimeout(this.hoverTimeout);					
			this.hoverTimeout = setTimeout(function () {press=true;}, 2);
			this.hoverTarget = target;
			e.preventDefault();		
		},onScrollMove: function(e){	
			$('#'+scroll+'-featured').height((this.y>=0) ? viewport.pHeight+this.y : viewport.pHeight);
			$('#'+scroll+'-featured').width((this.y>=0) ? viewport.width+(this.y*2) : viewport.width);
			$('#'+scroll+'-featured').css('left',(this.y<=0) ? 0 : -this.y);			
			if (this.hoverTarget) {
				clearTimeout(this.hoverTimeout);
				this.target = null;
				press = false;
			}  
			e.preventDefault();					
		},onBeforeScrollEnd: function(e){
			if (this.hoverTarget) {
				clearTimeout(this.hoverTimeout);			
				this.target = null;
				press = false;
			}
		},onScroll: function(e){
			$('#'+scroll+'-featured').height((this.y>=0) ? viewport.pHeight+this.y : viewport.pHeight);
			$('#'+scroll+'-featured').width((this.y>=0) ? viewport.width+(this.y*2) : viewport.width);
			$('#'+scroll+'-featured').css('left',(this.y<=0) ? 0 : -this.y);
		}
		
	});
}

var slidesPages=['pCenter','pRight','pLeft'];


var arrCategory=[
	{i:0,status:false,id:'All',title:'Home',bgcolor:'#b6110d',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:1,status:false,id:'football',title:'Futbol',bgcolor:'#067816',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:2,status:false,id:'baseball_nacional',title:'Beisbol Nacional',bgcolor:'#0720de',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:3,status:false,id:'baseball',title:'Beisbol Internacional',bgcolor:'#01aab1',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:4,status:false,id:'basket',title:'Baloncesto',bgcolor:'#ff6000',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:5,status:false,id:'tennis',title:'Tenis',bgcolor:'#de7f07',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:6,status:false,id:'f1',title:'F1',bgcolor:'#b52f00',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:7,status:false,id:'cycling',title:'Ciclismo',bgcolor:'#b7c238',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:8,status:false,id:'athletics',title:'Atletismo',bgcolor:'#0a67be',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:9,status:false,id:'golf',title:'Golf',bgcolor:'#ffc936',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:10,status:false,id:'olympics',title:'Olimpiadas',bgcolor:'#5bb618',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:11,status:false,id:'Other',title:'Más Deportes',bgcolor:'#bdfd8e',featured:{highdef:'',headline:''},xml:'',news:'',view:0,extra:0,mode:0},
	{i:12,status:false,id:'extrascores',title:'LVBP Resultados',bgcolor:'#0720de',featured:{highdef:'',headline:''},xml:'',news:'',view:3,extra:1,mode:1},
	{i:13,status:false,id:'extrastandings',title:'LVBP Tabla',bgcolor:'#0720de',featured:{highdef:'',headline:''},xml:'',news:'',view:4,extra:1,mode:1}
];
	
var upcoming=0;
var press=0;
var myScrollMenu, myScrollDatacontent, myScrollDatacontentHorizontal, myScrollPage;
var myXml=false;


var hoverClassRegEx = new RegExp('(^|\\s)iScrollHover(\\s|$)');

var vScroll=false;
var vHscroll=false;

//TODO: Move this vars to config file
var textShadowLight = "0px 1px 5px #555;";
var textShadowBlack = "0px 1px 5px #000;";

var app = {
    initialize: function() {this.bindEvents();},
    bindEvents: function() {document.addEventListener('deviceready', this.onDeviceReady, false);},
    onDeviceReady: function() { 
  	    	    	   
    	document.addEventListener('backbutton', function checkConnection() {
    		$(function() {    			  
    			if(!$('#top').hasClass('closed')){
    				$('#top').addClass('closed');
				}else if ($('#extra').hasClass('right')){					 	
					if ($('#modeset').html()==1) $('#extra').attr('class','page transition left');	
				}else if ($('#datacontent').hasClass('left')){
					$('#datacontent').attr('class','page transition right');														
				}else {
					if(myScrollPage.currPageX == 0){
						navigator.app.exitApp();					
					}else{
						if(myScrollPage.enabled) {
							//TODO: revisar si se puede hacer la animacion inversa del scroll por touch
							//myScrollPage.scrollToPage(myScrollPage.currPageX-1, 0, 0);
							myScrollPage.refresh();
							myScrollPage.scrollToPage(0, 0, 0);
							if (typeof myScrollDatacontentHorizontal != 'undefined') {
								myScrollDatacontentHorizontal = null;
							}
						}						
					}					
				}
			});
    	}, false);
    	
    	document.addEventListener('touchmove', function (e) {e.preventDefault();}, false);    	
    	document.body.addEventListener('touchmove', function(event) {event.preventDefault();}, false);    	 
        app.receivedEvent('deviceready');
        initialSetup();
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	
    	//INIT SPECIAL DATA
		setScrollPages();
		setMenuCategories();

    	myScrollMenu = new iScroll('menu',0,{hScrollbar: false,vScrollbar: false, hScroll: false, vScroll: true,
    		onBeforeScrollStart: function(e){
    			this.refresh(); 
			},onScrollStart: function(e){	
			
				var target = e.target;
				clearTimeout(this.hoverTimeout);				
				while (target.nodeType != 1) target = target.parentNode;
				this.hoverTimeout = setTimeout(function () {
					if (!hoverClassRegEx.test(target.className)) target.className = target.className ? target.className + ' iScrollHover' : 'iScrollHover';					
					press=true;							
				}, 5);				
				this.hoverTarget = target;	
				e.preventDefault();
				  
    		},onScrollMove: function(e){
				if (this.hoverTarget) {		
					clearTimeout(this.hoverTimeout);
					this.hoverTarget.className = this.hoverTarget.className.replace(hoverClassRegEx, '');
					this.target = null;
					press = false;
				}    				
			},onBeforeScrollEnd: function(){
				if (this.hoverTarget) {		
					clearTimeout(this.hoverTimeout);
					this.hoverTarget.className = this.hoverTarget.className.replace(hoverClassRegEx, '');
					this.target = null;
					press = false;
				}    				
			}
		});
    	
    	myScrollDatacontent=new iScroll('datacontent',0,{hScrollbar: false,vScrollbar: false,hScroll: false, vScroll: true, onBeforeScrollStart: function(){this.refresh();}});    	        	    			
		myScrollextra=newScroll('extra');

		myScrollGamesWrapper = new iScroll('gamesWrapper',0,{snap:true,momentum: false,hScroll: true, vScroll: false,hScrollbar: false, lockDirection: true, bounce:true,
			onScrollEnd:function (e) {					
				$('#game-'+(this.currPageX-2)).css('visibility','hidden');
				$('#game-'+(this.currPageX-1)).css('visibility','visible');			
				$('#game-'+this.currPageX).css('visibility','visible');
				$('#game-'+(this.currPageX+1)).css('visibility','visible');
				$('#game-'+(this.currPageX+2)).css('visibility','hidden');
			}
		});


		$(function() {
			
			$('body').width(viewport.width);
			$('body').height(viewport.height);
					
		 	$('#extra').width(viewport.width);
			$('#extra').height(viewport.height);

			
		 	$('#scrollerpage').width(viewport.width*arrCategory.length);
			$('#scrollerpage').height(viewport.height);					
			
		 	$('.pages').width(viewport.width);
			$('.pages').height(viewport.height);

			$('.featured').width('100%');
			$('.featured').height(viewport.pHeight);
	 		 
		 	$('#menus').addClass('animated bounce');

			$('#gamesWrapper').width(viewport.width);
			$('#gamesScroller').width(viewport.width);
		 
			myScrollPage = new iScroll('spage',0,{snap:true,momentum: false,hScroll: true, vScroll: false,hScrollbar: false, lockDirection: true, bounce:true,
				onScrollEnd:function () {										
					if (this.currPageX!=this.lastPageX) {
							
						if (typeof window[arrPage[this.lastPageX]] != 'undefined') {
   							window[arrPage[this.lastPageX]].scrollTo(0,0,0);
						}
						$('#'+arrCategory[this.currPageX].id).removeClass('hidden');			
						var upcomingback, upcomingnext;
						
						upcomingback = parseInt(this.currPageX-2);									
						upcomingnext = parseInt(this.currPageX+2);
																
						if ((upcomingback)>0) $('#'+arrCategory[upcomingback].id).addClass('hidden');																		
						if ((upcomingnext)<arrCategory.length) $('#'+arrCategory[upcomingnext].id).addClass('hidden');
						
						upcomingback = parseInt(this.currPageX-1);									
						upcomingnext = parseInt(this.currPageX+1);
												
						if ((upcomingback)>0) $('#'+arrCategory[upcomingback].id).removeClass('hidden');													
						if ((upcomingnext)<arrCategory.length) $('#'+arrCategory[upcomingnext].id).removeClass('hidden');		
																															
						if (!arrCategory[this.currPageX].status) $.fgetNews();
						

					}
					
					this.lastPageX=this.currPageX;
						
				}
			});


			$(document).on('touchstart','#modeset', function() {
				setMenuCategories();
    		});

			
			$(document).on('touchstart','.pullMenu', function() {
				myScrollMenu.scrollTo(0,0,0);
				if ($('#top').hasClass('closed')) $('#top').removeClass('closed');
				else  $('#top').addClass('closed');															
			});
			

			$(document).on('touchstart','.menu', function() {
				press=false;
			}).on('touchend','.menu', function() {
    			if (press) {
    				if (arrCategory[$(this).data('position')].extra) {
	    				myScrollextra.scrollTo(0,0,0);
	    				$('#top').addClass('closed');    				
	    				$('#extra').attr('class','page transition right');
	    				$.fgetExtras($(this).data('position'),$(this).data('title'));	
	    			} else {
	    			 	myScrollPage.scrollToPage($(this).data('position'), 0, 0);
	    			 	$('#extra').attr('class','page left');
						$('#datacontent').attr('class','page right');
						$('#top').addClass('closed');
						if (typeof myScrollDatacontentHorizontal != 'undefined') {
							myScrollDatacontentHorizontal = null;
						}
    				}
    			}   								
    		});

     			
			$(document).on('touchstart','li[data-content="headline"]', function(e) {
				
				if ($(this).attr('wrapper')) {
					myScrollDatacontentHorizontal = new iScroll($(this).attr('wrapper'),0,{snap: true,momentum: false,hScrollbar: false, 
			    		onBeforeScrollStart: function(e){
							this.refresh();    			
							var target = e.target;
							clearTimeout(this.hoverTimeout);
							this.hoverTimeout = setTimeout(function () {
								press=true;						
							}, 2);				
							this.hoverTarget = target;							
							e.preventDefault(); 				    					    					    					    				
			    		},onScrollMove: function () {			
							if (this.hoverTarget) {		
								clearTimeout(this.hoverTimeout);
								this.target = null;
								press = false;
							}
						},onBeforeScrollEnd: function () {			
							if (this.hoverTarget) {		
								clearTimeout(this.hoverTimeout);
								this.target = null;
								press = false;
							}
						},onScrollEnd:function () {	
							$('.position').html(this.currPageX+1);	
							$('div[data-type="image"]').find('figure figcaption').addClass('hidden');	
						}});  	
				}
				
				press=false;
		
    		}).on('touchend','li[data-content="headline"]', function() {
    			if (press) {
    				$('#top').addClass('closed');  
	    			myScrollDatacontent.scrollTo(0,0,0);
					$('.news-datacontent').hide();									 					
					$($(this).attr('content')+'-video').show();
					$($(this).attr('content')).show();
					$($(this).attr('content')).find('.datebar').css('background-color',arrCategory[myScrollPage.currPageX].bgcolor);					
					$('.position').html('1');
					$('#datacontent').attr('class','page transition left');
				}   
    		});
    		
    		
    		
			$(document).on('touchstart','div[data-type="video"]', function(e) {
				press=false;				
    		}).on('touchend','div[data-type="video"]', function() {
    			if (press) {
	    			window.videoPlayer.play($(this).data('src'));
				}   
    		});

			$(document).on('touchstart','div[data-type="image"]', function(e) {
				press=false;				
    		}).on('touchend','div[data-type="image"]', function() {
    			if (press) {
	    			if ($(this).find('figcaption').hasClass('hidden')) $(this).find('figcaption').removeClass('hidden');
					else  $('div[data-type="image"]').find('figcaption').addClass('hidden');
				}   
    		});



			$.fn.exists = function() {
    			return this.length>0;
			};

			$.fgetUrlNews = function(u) {
				u = u.split('/');				
				var url = 'http://0c05ec810be157e5ab10-7e0250ad12242003d6f6a9d85a0d9417.r19.cf1.rackcdn.com/';
				for(var i=0; i<u.length; i++){
					url+="/"+u[i];
				}
				return url;
			};		
	


			$.fGetAjaX = function(u,d) {			
				return $.ajax({
					url: u,
					type: 'get',
					dataType: d,
					cache: false,
					async:true,
					timeout:60000,
					beforeSend : function (){						
						myScrollPage.disable();
						$('.status').empty(); 
						$('.status').append('<li>cargando...</li>');											
					}}).always(function() {
						$('.status').empty();
						arrCategory[myScrollPage.currPageX] .status=true;
						myScrollPage.enable();				
					}).fail(function(xhr, status, error) {
						arrCategory[myScrollPage.currPageX] .status=false;	
						$('.status').append('<li>No hay conexión</li>');
						console.log("fGetAjaX ERROR: "+xhr.responseText+" / "+error+" / "+status);
					});
			};



			$.fgetExtras = function(position,section) {
			
			
				$('#extra-news-featured-title').empty();			
				$('#extra-featured').empty();
				$('#extra-featured').removeClass('hidden');	
				$('#extra-featured').append('<img  src="img/lvbp.jpg" onerror="this.style.display=\'none\'" style="width:100%; height:100%;"  />');
				$('#gamesScroller').empty();
				$('#standings').empty();				
				$('#extra-section').empty();
								
				
				$.li='<li data-view="title" data-section="'+arrCategory[position].id+'">';
				$.li+='<div>&nbsp;::&nbsp;'+arrCategory[position].title+'</div>';
				$.li+='</li>';					
								
				$('#extra-section').append($.li);

				
				if (arrCategory[position].view == 4) {
			
					
					myJson=$.fGetAjaX('http://67ba19379ed4c6a20edb-6401e2f1ab65a42d785a1afb10dac52b.r15.cf1.rackcdn.com/standings.json','json');				
					myJson.done(function(json) {
		
																			
						$.div = '<table style="width:90%; height:auto; background-color: #ffffff;">';					
						
						$.div += '<tr>';
	    				$.div += '<th style="width:50%; height:auto; text-align:left"></th>';
	    				$.div += '<th style="width:10%; height:auto; text-align:center; font-size:1.4em;">J</th>';
	    				$.div += '<th style="width:10%; height:auto; text-align:center; font-size:1.4em;">G</th>';
	    				$.div += '<th style="width:10%; height:auto; text-align:center; font-size:1.4em;">P</th>';
	    				$.div += '<th style="width:10%; height:auto; text-align:center; font-size:1.4em;">AVG</th>';
	    				$.div += '<th style="width:10%; height:auto; text-align:center; font-size:1.4em;">DIF</th>';
	  					$.div += '</tr>';
	
	  					
						$.each(json.data.rows, function(index, element) {
							$.div += '<tr>';
							
							
							
							$.div += '<td style="text-align:left;">';
							$.div += '<img alt="'+element.nombre_equipo.toLowerCase()+'" src="img/lvbp/team/'+element.nombre_equipo.toLowerCase()+'.jpg"  onerror="this.style.display=\'none\'" style="width:30%; height:auto; vertical-align:middle; margin-right:5px;"  />';											
							$.div += '<span style="font-size:1.4em; font-weight:bold; text-transform:capitalize;">'+element.nombre_equipo.toLowerCase()+'</span>';
							$.div += '</td>';
	
							
							$.div += '<td style="text-align:center;">';
							$.div += '<span style="font-size:1.4em; text-transform:capitalize;">'+element.ju+'</span>';
							$.div += '</td>';
							
							
							$.div += '<td style="text-align:center;">';
							$.div += '<span style="font-size:1.4em;  text-transform:capitalize;">'+element.gan+'</span>';
							$.div += '</td>';
							
							$.div += '<td style="text-align:center;">';
							$.div += '<span style="font-size:1.4em;  text-transform:capitalize;">'+element.per+'</span>';
							$.div += '</td>';
							
							$.div += '<td style="text-align:center;">';
							$.div += '<span style="font-size:1.4em;  text-transform:capitalize;">'+element.ave+'</span>';
							$.div += '</td>';
							
							$.div += '<td style="text-align:center;">';
							$.div += '<span style="font-size:1.4em;  text-transform:capitalize;">'+element.vent+'</span>';
							$.div += '</td>';
							
							$.div += '</tr>';	
							
				        });
				        
				        
				        $.div += '</table>';
				       
				        $('#standings').append($.div);
	
					});
				
				}

				//VIEW de juegos de Baseball
				//if (position==12) {
				if (arrCategory[position].view == 3) {
					
					myJson=$.fGetAjaX('http://67ba19379ed4c6a20edb-6401e2f1ab65a42d785a1afb10dac52b.r15.cf1.rackcdn.com/calendar.json','json');									
					myJson.done(function(json) {
	
							
						var arrDateGame=[];	
						var dateGame;
						var totalgame=0;
						
							
						$.each(json.data.rows, function(index, element) {
	
							element.hora_ini = element.hora_ini.split(':');
							element.hora_ini = arrTime[element.hora_ini[0]]+':'+element.hora_ini[1]+' '+arrTimeM[element.hora_ini[0]];	
						
							if (element.fecha_juego != dateGame) {
													
								var fecha_juego = element.fecha_juego.split('/');
								var d = new Date(fecha_juego[2], (fecha_juego[1]-1), fecha_juego[0]); 
								var nd = d.getDay();
								var nm = d.getMonth();
								
								
								arrDateGame.push({id:index,data:[element],day:arrDay[nd],month:arrMonth[nm],dayd:fecha_juego[0],time_begin:element.hora_ini,dategame:element.fecha_juego });
														
								totalgame=totalgame+1;
								dateGame=element.fecha_juego;
								
							} else {
								arrDateGame[totalgame-1].data.push(element);
							}
							
				        });
				        
	
				        g=arrDateGame.length-1;
				        $('#gamesScroller').width(viewport.width*g);			        
				        
				        
				        page=0;
				        pages=0;
				        for(var i=0;i<arrDateGame.length;i++){
				        
				        	$.div='<p style="text-align:center;"><b>'+arrDateGame[g].day +', '+ arrDateGame[g].month + ' ' + arrDateGame[g].dayd + '</b></p>';
				        	arrDateGame[g].data.forEach(function(element){
				        	
				        	
								$.div += '<div style="width:50%; height:auto; float:left;">';
								
								$.div += '<div style="width:100%; height:auto; text-align:center;">';
								
								if (element.estatus==null) {							
									$.div += '<p style="width:100%; height:auto; text-align:center; color:#999999;">Hora de Inicio</p>';
									$.div += '<p style="text-align:center;"><b>'+element.hora_ini+'</b></p>';
								} else {
									$.div += '<p style="width:100%; height:auto; text-align:center; color:#999999; text-transform:capitalize;" >'+element.inning_periodo.toLowerCase()+' '+element.inning+'</p>';
									$.div += '<p style="text-align:center;"><b style="color:#999999; text-transform:capitalize;">'+element.estatus.toLowerCase()+'</b></p>';
								}
								
								$.div += '</div>';
															
								$.div += '<div style="width:100%; height:auto;">';
								
								$.div += '<div style="width:50%; height:auto; float:left;">';
								
								$.div += '<div style="width:100%; height:auto;">';
			        			$.div += '<img alt="'+element.nombre_v.toLowerCase()+'" src="img/lvbp/team/'+element.nombre_v.toLowerCase()+'.jpg"  onerror="this.style.display=\'none\'" style="width:70%; height:auto; vertical-align:middle; margin-right:5px;"  />';											
								$.div += '<span style="text-transform:capitalize;"><b>'+((element.c_v==null)? '0':element.c_v)+'</b></span>';
								$.div += '</div>';
								
								$.div += '<div style="width:100%; height:auto;">';
			        			$.div += '<img alt="'+element.nombre_h.toLowerCase()+'" src="img/lvbp/team/'+element.nombre_h.toLowerCase()+'.jpg"  onerror="this.style.display=\'none\'" style="width:70%; height:auto; vertical-align:middle; margin-right:5px;"  />';											
								$.div += '<span style="text-transform:capitalize;"><b>'+((element.c_h==null)? '0':element.c_h)+'</b></span>';							
								$.div += '</div>';
								
								$.div += '</div>';
								
								
								$.div += '<div style="width:50%; height:auto; float:left;">';
								
								$.primera = ((element.primera==null || element.primera=="")? '0' : '1');
								$.segunda = ((element.segunda==null || element.segunda=="")? '0' : '2');
								$.tercera = ((element.tercera==null || element.tercera=="")? '0' : '3');
								$.base = $.primera+$.segunda+$.tercera;
								
								$.div += '<img style="width:70%; height:auto; vertical-align:middle;" src="img/lvbp/out/' + ((element.out==null) ? 0 : element.out) + '.jpg">';
								$.div += '<img style="width:70%; height:auto; vertical-align:middle;" src="img/lvbp/base/'+ $.base  +'.jpg">';
	
								$.div += '</div>';
								
								
								$.div += '</div>';
			        			$.div += '</div>';						    				
							});
				        				        	
				        	$.visibility= 'visibility:hidden';
				        	if (formatdate==arrDateGame[g].dategame) {			        	
								page=i;
								$.visibility = 'visibility:visible';
					     	}
				     					     		
				        	$('#gamesScroller').append('<div id="game-'+i+'" style="position:relative; float:left; width:'+viewport.width+'px; height:'+(viewport.pHeight+(viewport.pHeight/2))+'px; background-color:#ffffff; '+$.visibility+' ">'+$.div+'</div>');
				        	g--;
				        	
				        }
				        
				        
				        myScrollGamesWrapper.refresh();
				       	myScrollGamesWrapper.scrollToPage(page, 0, 0);
	     
	
					});
				
				}

			};

			//WITH PHP INSTEAD OF NEWSML
			$.fgetNews = function(c,section,color) {
				var d=0;
				$.lil='';
				myXml=$.fGetAjaX('http://02.kraken.hecticus.com/storefront/render/news.php?category='+arrCategory[myScrollPage.currPageX].id,'xml');
	
				myXml.done(function(xml) {
					$(xml).find('newsML>category').each(function(i){
						
						$.category = '#'+$(this).attr('name');
						window['myScroll'+$(this).attr('name')]=newScroll($(this).attr('name'));
						arrPage.push('myScroll'+$(this).attr('name'));

						

																		
						$(this).find('news').each(function(i){
											
							
							$.news={id:$(this).attr('duid'),headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
							$.news.headline=$(this).find('headline').text();

							var myDate = $(this).find('DateAndTime').text();
							var arrayDate = $.parseDate(myDate);
							$.news.date=new Date(arrayDate[0],arrayDate[1],arrayDate[2],arrayDate[3],arrayDate[4],arrayDate[5],0);
							$.news.datacontent=$('<div>').append($(this).find('datacontent').clone()).remove().html();
							
							$(this).find('images[duid]').each(function(i) {
								$.news.caption.push($(this).find('caption').text());																								
								$.news.thumbnail.push({src:$.fgetUrlNews($(this).find('image[type="Thumbnail"]').text()),width:$(this).find('image[type="Thumbnail"]').attr('width'),height:$(this).find('image[type="Thumbnail"]').attr('height')});
								$.news.highdef.push({src:$.fgetUrlNews($(this).find('image[type="HighDef"]').text()),width:$(this).find('image[type="HighDef"]').attr('width'),height:$(this).find('image[type="HighDef"]').attr('height')});																						
								$.news.quicklook.push({src:$.fgetUrlNews($(this).find('image[type="Quicklook"]').text()),width:$(this).find('image[type="Quicklook"]').attr('width'),height:$(this).find('image[type="Quicklook"]').attr('height')});								
								
							});
							
							$(this).find('datacontent>p>a[class="videoSet"]').each(function(i){							
								$.news.video.push({src:$.fgetUrlNews($(this).find('a[title="Mpeg4-640x360"]').attr('href')),poster:$.fgetUrlNews($(this).find('a[title="jpeg"]').attr('href'))});			    				
							});
									
									
							if ($.category=='#baseball_nacional') {
								$.news.thumbnail.push({src:'img/lvbp/thumbnail.jpg'});
								$.news.quicklook.push({src:'img/lvbp/thumbnail.jpg'});							
								$.news.highdef.push({src:'img/lvbp.jpg'});
							}

										
							if (i==0) {
								
	
								$($.category+'-featured').append('<img src="'+$.news.highdef[0].src+'" onerror="this.style.display=\'none\'" class="center" style="width:100%; height:100%; max-width:'+$.news.highdef[0].width+'px; max-height:'+$.news.highdef[0].height+'px; "  />');																	
								$($.category+'-news-featured-title').attr('content','#news-'+$.news.id);
								$($.category+'-news-featured-title').attr('wrapper','news-'+$.news.id+'-wrapper');

		
		
								$.li='<div style="position: relative; width:'+viewport.width+'px; height:'+(viewport.pHeight + 20)+'px;  ">';
								$.li+='<h3 style="position: absolute; bottom: 0; left: 0; width:100%; height:auto; padding:5px; min-height:35px; background-color: rgba(0,0,0,0.5);  color: #ffffff; text-shadow: 0px 1px 5px #000; " >'+$.news.headline+'</h3>';								
								$.li+='</div>';
	
								$($.category+'-news-featured-title').empty();
								$($.category+'-news-featured-title').append($.li);
								

								$.li='<li data-view="title" data-section="'+arrCategory[myScrollPage.currPageX].id+'">';
								$.li+='<div>&nbsp;::&nbsp;'+arrCategory[myScrollPage.currPageX].title+'</div>';
								$.li+='</li>';								
								$($.category +'-news1').append($.li);
								
								
							} else if (i>0) {
							
								$.li='<li data-view="thumbnail" data-content="headline"  content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" >';
								if (($.news.quicklook[0].width/$.news.quicklook[0].height) >= viewport.ar)
									$.li+='<img src="'+$.news.quicklook[0].src+'" alt="thumbnail" onerror="this.style.display=\'none\'" style="width:40%; height:'+((viewport.height*20)/100)+'px; " />';
								else
									$.li+='<img src="'+$.news.quicklook[0].src+'" alt="thumbnail" onerror="this.style.display=\'none\'" style="width:'+((viewport.width*40)/100)+'px; height:20%; " />';								
								$.li+='<div><span  class="title">'+$.news.headline+'</span><br /><span class="date">'+$.formatDate($.news.date)+'</span></div>';																	
								$($.category +'-news1').append($.li);
																
					    	} 
					    	
					    	if ($("#news-"+$.news.id).length == 0) {
					    	
  								$.li='<li id="news-'+$.news.id+'" video="news-'+$.news.id+'-video" class="news-datacontent" style="width:100%; height:auto; text-align:center; margin: 0 auto; display:none; background-color:#ffffff;">';				        			
									        			
								$.total = $.news.highdef.length+$.news.video.length;				        					
								if ($.total==0) $.total=1;
									
									$.li+='<div id="news-'+$.news.id+'-wrapper" video="news-'+$.news.id+'-video" style="position:relative; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; text-align:left;">';
									
									$.li+='<div video="news-'+$.news.id+'-video" style="float:left; width:'+(viewport.width*$.total)+'px; height:'+viewport.pHeight+'px; ">';
									$.lii='';
									
										c=0;
										$.news.video.forEach(function(video){
											$.lii+='<div data-src="'+video.src+'" data-type="video" style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#000000; ">';						    				
							    			$.lii+='<img alt="highdef" src="'+video.poster+'" onerror="this.style.display=\'none\'" class="center" style="width:auto; height:'+viewport.pHeight+'px; " />';					    					
							    			$.lii+='<a href="'+video.src+'"><img alt="highdef" src="img/playvideo.png" style="position:absolute; width:32px; height:32px; top:45%; left:45%;" /></a>';
							    			$.lii+='</div>';
										});
										
										c=0;
										$.news.highdef.forEach(function(src){				
											$.lii+='<div data-type="image" style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#000000; ">';						    										    			
							    			$.lii+='<figure>';						    													
											$.lii+='<img alt="highdef" src="'+src.src+'" onerror="this.style.display=\'none\'" class="center" style="width:auto; height:'+viewport.pHeight+'px; max-width:'+src.width+'px; max-height:'+src.height+'px; " />';
											$.lii+='<figcaption class="hidden" style="position: absolute; bottom: 0; left: 0; background-color: rgba(0,0,0,0.7); width:'+viewport.width+'px; min-height:35px;  color: #ffffff; text-shadow: '+textShadowLight+' font-size: 1em;" >'+$.news.headline+'</figcaption>';										
											$.lii+='</figure>';						    					    											    			
							    			$.lii+='</div>';
										});
										
									$.li+=$.lii;
												
									$.li+='</div>';
	
									$.li+='</div>';
									$.li+='<div style="position: relative; bottom: 0px; left: 0; color: #ffffff; text-shadow: '+textShadowLight+' background-color:#FF0000; width:100%; height:20px; text-align:center; opacity:.75; font-size:1.2em; font-weight:bold; ">&#8249;&nbsp;&nbsp;&nbsp; <span class="position">1</span> de '+$.total+'&nbsp;&nbsp;&nbsp;&#8250;</div>';
									
						        
									$.li+='<div class="datebar" style="position: relative; width:100%; height:auto; min-height: 20px; background-color:'+arrCategory[myScrollPage.currPageX].bgcolor+'; color:#fff;  ">';
									$.li+='<div style="text-align:right; padding: 5px;">'+$.formatDate($.news.date)+'</div>';
									$.li+='</div>';
																	
	
		
								$.li+='<div	style="position:relative; width:100%; height:auto; ">';
								$.li+='<div><a onclick="window.plugins.socialsharing.share(\''+$.news.headline.replace(/["']/g, "")+'\',null,null,\'http://superkraken.net/fanaticos412/?test&idt=99&idn='+$.news.id+'&cn='+arrCategory[myScrollPage.currPageX].id+'\')"><b>Share</b></a></div>';
	
								$.li+='<h2 style="text-align:left;">'+$.news.headline+'</h2>';
	
								$.li+='<div style="width:98%; margin-left:1%; color:#000; font-size: normal; text-align:justify; ">';
								$.li+=$.news.datacontent;
								$.li+='</div>';
									
								$.li+='</div>';	
								        																						
								$.li+='</li>';
															
								$('#datacontents').append($.li);
												
							} 
					    	

					    	

						});
						
						
					});									
					
				});

    		};
    		
	
			$.fgetNews();
			
			
			$.parseDate = function(stringDate) {
				var stringValue = ""+stringDate;
				var array = new Array();
				array.push(stringValue.substring(0,4));
				array.push(stringValue.substring(4,6));
				array.push(stringValue.substring(6,8));
				array.push(stringValue.substring(9,11));
				array.push(stringValue.substring(11,13));
				array.push(stringValue.substring(13,15));
				//stringValue = ""+stringValue.substring(0,4)+" "+stringValue.substring(4,6)+" "+stringValue.substring(6,8)+
				//" "+stringValue.substring(9,11)+":"+stringValue.substring(11,13)+":"+stringValue.substring(13,15);
																														  
				return array;
			};
			
			$.formatDate = function(d) {
				var dd = d.getDate();
				if ( dd < 10 ) dd = '0' + dd;
				//var MM = d.getMonth()+1;
				//if ( MM < 10 ) mm = '0' + mm
				var MM = d.getMonth();
				
				var hh = d.getHours();
				var meridian = "a.m.";
				if ( hh > 12 ){
					hh = hh-12;
					meridian = "p.m."
				}
				
				var mm = d.getMinutes();
				if ( mm < 10 ) mm = '0' + mm;
				
				var months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];				
				return hh+':'+mm+' '+meridian+', '+months[MM]+', '+dd;
			};
			
			//MM/dd/yyyy hh:mm:ss t.t. or M/d/yyyy h:m:s t.t. or just the month/day/year
			$.formatDateString = function(ds) {
				var dateString = ""+ds;
				var parts = dateString.split(" ");
				var months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
				var MDY = parts[0].split("/");
				var monthIndex = parseInt(MDY[0]);
				if(parts.length > 1){					
					var HMS = parts[1].split(":");
					var meridian = parts[2];
					var dateStringFinal = ""+HMS[0]+':'+HMS[1]+' '+meridian+', '+months[monthIndex-1]+', '+MDY[1];
					return dateStringFinal;
				}else{
					var dateStringFinal = months[monthIndex-1]+', '+MDY[1]+", "+MDY[2];
					return dateStringFinal;
				}				
			};


		});
    }
};
