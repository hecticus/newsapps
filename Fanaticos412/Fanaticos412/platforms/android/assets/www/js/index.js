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
/*
function supports_video() {
  return !!document.createElement('video').canPlayType;
}

function supports_h264_baseline_video() {
  if (!supports_video()) { return false; }
  var v = document.createElement("video");
  return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
}*/




var currentTime = new Date();
var day = currentTime.getDate();
var month = (currentTime.getMonth()+1);
var year = currentTime.getFullYear();
var formatdate= ((day<10)? '0'+day:day) +'/'+ ((month<10)? '0'+month:month)  +'/'+year;

var arrTime=[0,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11];
var arrTimeM=['am','am','am','am','am','am','am','am','am','am','am','am','pm','pm','pm','pm','pm','pm','pm','pm','pm','pm','pm','pm'];
var arrMonth=['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
var arrDay=['Dom', 'Lun', 'Mar','Mie', 'Jue', 'Vie', 'Sab'];





var viewport={width:$(window).width(),height:$(window).height(),pHeight:(($(window).height()*40)/100), pWidth:(($(window).width()*25)/100)};
var arrPage=[];

function newScroll(scroll) {
	return new iScroll(scroll,1,{snap:false,hScroll: false, vScroll: true, hScrollbar: false,vScrollbar: false,bounce:true,lockDirection: true,
		onBeforeScrollStart: function(e){				
			this.refresh();
			var target = e.target;
			clearTimeout(this.hoverTimeout);					
			this.hoverTimeout = setTimeout(function () {press=true;}, 80);
			this.hoverTarget = target;
			e.preventDefault();		
		},onScrollMove: function(e){	
			$('#'+scroll+'-featured').height((this.y>=0) ? viewport.pHeight+this.y : viewport.pHeight);
			$('#'+scroll+'-featured').width((this.y>=0) ? viewport.width+(this.y*2) : viewport.width);
			$('#'+scroll+'-featured').css('left',(this.y<=0) ? 0 : -this.y);			
			if (this.hoverTarget) {
				clearTimeout(this.hoverTimeout);	
				this.hoverTarget.className = this.hoverTarget.className.replace(hoverClassRegEx, '');	
				this.target = null;
				press = false;
			}  
			e.preventDefault();					
		},onBeforeScrollEnd: function(e){
			if (this.hoverTarget) {
				clearTimeout(this.hoverTimeout);	
				this.hoverTarget.className = this.hoverTarget.className.replace(hoverClassRegEx, '');	
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
	{i:0,status:false,id:'All',title:'Home',bgcolor:'#0404B4',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:1,status:false,id:'football',title:'Futbol',bgcolor:'#FF4000',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:2,status:false,id:'baseball_nacional',title:'Beisbol Nacional',bgcolor:'#A4A4A4',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:0,status:false,id:'baseball',title:'Beisbol Internacional',bgcolor:'#AEB404',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:1,status:false,id:'basket',title:'Baloncesto',bgcolor:'#FE2E64',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:2,status:false,id:'tennis',title:'Tenis',bgcolor:'#0B610B',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:0,status:false,id:'f1',title:'F1',bgcolor:'#0000EE',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:1,status:false,id:'cycling',title:'Ciclismo',bgcolor:'#AAAAAA',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:2,status:false,id:'athletics',title:'Atletismo',bgcolor:'#BABCEE',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:0,status:false,id:'golf',title:'Golf',bgcolor:'#CCCCCC',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:1,status:false,id:'olympics',title:'Olimpiadas',bgcolor:'#EEEEEE',featured:{highdef:'',headline:''},xml:'',news:''},
	{i:2,status:false,id:'Other',title:'Más Deportes',bgcolor:'#0B3B2E',featured:{highdef:'',headline:''},xml:'',news:''}];


var upcoming=0;
var press=0;
var myScrollMenu, myScrollDatacontent, myScrollDatacontentHorizontal, myScrollPage;
var myXml=false;


var hoverClassRegEx = new RegExp('(^|\\s)iScrollHover(\\s|$)');


var vScroll=false;
var vHscroll=false;

var arrLVBP=[{id:'calendar',data:false},{id:'standings',data:false}];


var app = {
    initialize: function() {this.bindEvents();},
    bindEvents: function() {document.addEventListener('deviceready', this.onDeviceReady, false);},
    onDeviceReady: function() {    	    	    	   
    	document.addEventListener('backbutton', function checkConnection() {
    		$(function() {    			  
    			if(!$('#top').hasClass('closed')){
    				$('#top').addClass('closed');
				}else if ($('#video').hasClass('center')) {										
					$('#video').attr('class','page transition left');	
					$('video').hide();
				}else if ($('#datacontent').hasClass('left')){
					$('#datacontent').attr('class','page transition right');						
				}else if ($('#score').hasClass('right')){
					$('#score').attr('class','page transition left');
				}else {
					if(myScrollPage.currPageX == 0){
						navigator.app.exitApp();					
					}else{
						if(myScrollPage.enabled){
							//TODO: revisar si se puede hacer la animacion inversa del scroll por touch
							myScrollPage.scrollToPage(myScrollPage.currPageX-1, 0, 0);
							$('#top').addClass('closed');
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
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {


    	myScrollMenu = new iScroll('menu',0,{hScrollbar: false,vScrollbar: false, hScroll: false, vScroll: true,
    		onBeforeScrollStart: function(e){
    			this.refresh();    			
				var target = e.target;
				clearTimeout(this.hoverTimeout);				
				while (target.nodeType != 1) target = target.parentNode;
				this.hoverTimeout = setTimeout(function () {
					if (!hoverClassRegEx.test(target.className)) target.className = target.className ? target.className + ' iScrollHover' : 'iScrollHover';					
					press=true;						
				}, 80);				
				this.hoverTarget = target;
				e.preventDefault(); 					
    		},onScrollMove: function(){
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
		myScrollScore=newScroll('score');


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
					
		 	$('#score').width(viewport.width);
			$('#score').height(viewport.height);
			
		 	$('#spage').width(viewport.width);
			$('#spage').height(viewport.height);		 
		 	$('#scrollerpage').width(viewport.width*arrCategory.length);
			$('#scrollerpage').height(viewport.height);					
			$('.section').width(viewport.width);
			
		 	$('.pages').width(viewport.width);
			$('.pages').height(viewport.height);
			$('#video').width(viewport.width);
			$('#video').height(viewport.height);

			$('.featured').width(viewport.width);
			$('.featured').height(viewport.pHeight);
			
			
			$('.news-featured').width('100%');
			$('.news-featured').height(viewport.pHeight);		
			
			$('.news-featured-title').width('100%');
			$('.news-featured-title').height(viewport.pHeight);					
			
				
			$('#top').height(viewport.height-100);
			$('#top').width(viewport.width);		 		 
		 		 
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


			
			$(document).on('touchstart','.pullMenu', function() {
					myScrollMenu.scrollTo(0,0,0);
					if ($('div').hasClass('closed')) $('#top').removeClass('closed');
					else  $('#top').addClass('closed');															
			});
			

			$(document).on('touchstart','.menu', function() {
				press=false;
			}).on('touchend','.menu', function() {
    			if (press) {
	    			if ($(this).data('position') >= 12) {
	    				myScrollScore.scrollTo(0,0,0);
	    				$('#top').addClass('closed');    				
	    				$('#score').attr('class','page transition right');
	    				$.fgetScores($(this).data('position'),$(this).data('title'));
	    			} else {
	    			 	myScrollPage.scrollToPage($(this).data('position'), 0, 0);
	    			 	$('#score').attr('class','page left');
						$('#datacontent').attr('class','page right');
						$('#top').addClass('closed');
						if (typeof myScrollDatacontentHorizontal != 'undefined') {
							myScrollDatacontentHorizontal = null;
						}
    				}
    			}   								
    		});

     			
			$(document).on('touchstart','.highdef, .quicklook, .thumbnail, .headline, .caption', function(e) {
				
				if ($(this).attr('wrapper')) {
					myScrollDatacontentHorizontal = new iScroll($(this).attr('wrapper'),0,{snap: true,momentum: false,hScrollbar: false, 
			    		onBeforeScrollStart: function(e){
							this.refresh();    			
							var target = e.target;
							clearTimeout(this.hoverTimeout);
							this.hoverTimeout = setTimeout(function () {
								press=true;						
							}, 80);				
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
						}});  	
				}
				
				press=false;
		
    		}).on('touchend','.highdef, .quicklook, .thumbnail, .headline, .caption', function() {
    			if (press) {
	    			myScrollDatacontent.scrollTo(0,0,0);
					$('.news-datacontent').hide();									 					
					$($(this).attr('content')+'-video').show();
					$($(this).attr('content')).show();					
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


			$.fn.exists = function() {
    			return this.length>0;
			};

			$.fgetUrlNews = function(u) {
				u = u.split('/');
				u = 'http://0c05ec810be157e5ab10-7e0250ad12242003d6f6a9d85a0d9417.r19.cf1.rackcdn.com/'+u[1]+'/'+u[2];
				return u;
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
					}).fail(function() {
						arrCategory[myScrollPage.currPageX] .status=false;	
						$('.status').append('<li>No hay conexión</li>');				    
					});
			};


			$.fgetAllNews = function() {
				
				arrCategory.forEach(function(category){
					myAjax= $.ajax({
						url: 'http://02.kraken.hecticus.com/storefront/render/news.php?category='+category.id,
						type: 'get',
						dataType: 'xml',
						cache: false,
						async:false,
						timeout:60000,
						beforeSend : function (){
							//status loading...								
						}}).always(function() {
							//update status true 				
							category.status=true;
						}).fail(function() {
							//update status false
							category.status=false;
							//status fail...											   
						});
					
					myAjax.done(function(xml) {
					
						category.xml=xml;

						$(xml).find('newsML>category').each(function(i){
							$.news={id:'',headline:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};	
							$(this).find('news').each(function(i){
								
								$.news.id=$(this).attr('duid');					    	
								$.news.headline=$(this).find('headline').text();
								$.news.datacontent=$('<div>').append($(this).find('datacontent').clone()).remove().html();
								
								$(this).find('images[duid]').each(function(i) {							
									$.news.caption.push($(this).find('caption').text());
									$.news.thumbnail.push($.fgetUrlNews($(this).find('image[type="Thumbnail"]').text()));
								
									
									$.news.highdef.push($.fgetUrlNews($(this).find('image[type="HighDef"]').text()));
									$.news.quicklook.push($.fgetUrlNews($(this).find('image[type="Quicklook"]').text()));									
								});
								
								$(this).find('datacontent>p>a[class="videoSet"]').each(function(i){													
									$.news.video.push({src:$.fgetUrlNews($(this).find('a[title="Mpeg4-640x360"]').attr('href')),poster:$.fgetUrlNews($(this).find('a[title="jpeg"]').attr('href'))});			    				
								});
								
								if (category.id=='baseball_nacional'){								
									$.news.highdef.push('img/lvbp.jpg');
									$.news.quicklook.push('img/lvbp.jpg');
								}

								if ((i>0) && (category.id!='baseball_nacional')) {
									
									$.li='<li style="width:100%; height:auto; background-color:#ffffff;">';
									
									$.li+='<div style="margin:5px; float: inherit; ">';
		
									$.li+='<div  content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="thumbnail" style="float: inherit; z-index: 0;">';
									$.li+='<div style="position:relative; width:100%; height:auto;">';																	
									$.li+='<img src="'+$.news.thumbnail[i]+'" alt="thumbnail" onerror="this.style.display=\'none\'" style="float: inherit;"  />';
									$.li+='</div>';					        			
									$.li+='</div>';								
						        		
									$.li+='<div content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="headline" style="display: inline; font-size: medium; font-style:oblique; font-weight: bold; ">';							        				
									$.li+= $.news.headline;
									$.li+='</div>';	
									$.li+='</div>';				        			
									$.li+='<div style="clear: both; width:100%; height:5px;"></div>';				        			
									
									$.li+='</li>';
	
									category.news+=$.li;	
								} else if (category.id=='baseball_nacional') {
						    		$.li='<li style="width:100%; height:auto; background-color:#ffffff;">';
									$.li+='<div content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="headline" style="display: inline; font-size: medium; font-style:oblique; font-weight: bold;">';							        				
									$.li+= $.news.headline;
									$.li+='</div>';	
									$.li+='<div style="clear: both; width:100%; height:10px;"></div>';
									$.li+='</li>';								
									category.news+=$.li;
						    	}								
								
								
								
								
								
							}); //news
							
							if (i==0) {
								category.featured.highdef=$.news.highdef[0];
								
								$.li='<div style="position:relative; width:100%; height: '+viewport.pHeight+'px;">';
								$.li+='<div style="position:absolute; position: absolute; bottom: 0; left: 0; color:#ffffff;">';
								$.li+='<h2 style="color: #ffffff; text-shadow: 0px 2px 3px #555;">'+$.news.headline+'</h2>';
								$.li+='</div>';
								$.li+='</div>';
								
								category.featured.headline=$.li;
																	
							} 
							
							
							
						}); //newsML>category
					}); //root
					
				});
			};


			$.fgetScores = function(position,section) {
				
			
				$('#score-featured').empty();
				$('#score-featured').append('<img  src="img/lvbp.jpg" onerror="this.style.display=\'none\'" style="width:100%; height:100%;"  />');
				
				$.li='<div style="position:relative; width:100%; height: '+viewport.pHeight+'px;">';
				$.li+='<div style="position:absolute; position: absolute; bottom: 0; left: 0; color:#ffffff;">';
				$.li+='<h2 style="color: #ffffff; text-shadow: 0px 2px 3px #555;">LVBP 2013-2014</h2>';
				$.li+='</div>';
				$.li+='</div>';

				$('#score-news-featured-title').empty();
				$('#score-news-featured-title').append($.li);
				
				$('#gamesScroller').empty();
				$('#standings').empty();
				
				$('#score-section').empty();				
				$('#score-section').append('&nbsp;&nbsp;'+section);

				if (position==13) {
			
					
					myJson=$.fGetAjaX('http://67ba19379ed4c6a20edb-6401e2f1ab65a42d785a1afb10dac52b.r15.cf1.rackcdn.com/standings.json','json');				
					myJson.done(function(json) {
		
																			
						$.div = '<table style="width:100%; height:auto; background-color: #ffffff;">';					
						
						$.div += '<tr>';
	    				$.div += '<th style="width:50%; height:auto; text-align:left"></th>';
	    				$.div += '<th style="width:10%; height:auto; text-align:center;">J</th>';
	    				$.div += '<th style="width:10%; height:auto; text-align:center;">G</th>';
	    				$.div += '<th style="width:10%; height:auto; text-align:center;">P</th>';
	    				$.div += '<th style="width:10%; height:auto; text-align:center;">AVG</th>';
	    				$.div += '<th style="width:10%; height:auto; text-align:center;">DIF</th>';
	  					$.div += '</tr>';
	
	  					
						$.each(json.data.rows, function(index, element) {
							$.div += '<tr>';
							
							
							
							$.div += '<td style="text-align:left;">';
							$.div += '<img alt="'+element.nombre_equipo.toLowerCase()+'" src="img/lvbp/team/'+element.nombre_equipo.toLowerCase()+'.jpg"  onerror="this.style.display=\'none\'" style="width:25%; height:auto; vertical-align:middle; margin-right:5px;"  />';											
							$.div += '<span style="text-transform:capitalize;">'+element.nombre_equipo.toLowerCase()+'</span>';
							$.div += '</td>';
	
							
							$.div += '<td style="text-align:center;">';
							$.div += element.ju;
							$.div += '</td>';
							
							
							$.div += '<td style="text-align:center;">';
							$.div += element.gan;
							$.div += '</td>';
							
							$.div += '<td style="text-align:center;">';
							$.div += element.per;
							$.div += '</td>';
							
							$.div += '<td style="text-align:center;">';
							$.div += element.ave;
							$.div += '</td>';
							
							$.div += '<td style="text-align:center;">';
							$.div += element.vent;
							$.div += '</td>';
							
							$.div += '</tr>';	
							
				        });
				        
				        
				        $.div += '</table>';
				       
				        $('#standings').append($.div);
	
					});
				
				}
					
				
				
				if (position==12) {
					
						
					
					
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
							
							
							
							
								
								
							
							
						
						
							/*if (formatdate==element.fecha_juego) {
							
								$.div = '<table style="width:100%; height:auto; background-color: #ffffff; ">';											
								
								$.div += '<tr>';
			    				$.div += '<th style="width:40%; height:auto; text-align:left"></th>';
			    				$.div += '<th style="width:5%; height:auto; text-align:center;">C</th>';
			    				$.div += '<th style="width:5%; height:auto; text-align:center;">H</th>';
			    				$.div += '<th style="width:5%; height:auto; text-align:center;">E</th>';
			    				$.div += '<th style="width:45%; height:auto; text-align:center;"></th>';
			  					$.div += '</tr>';
	
								$.div += '<tr>';
								
								$.div += '<td style="width:40%; height:auto; text-align:left"></td>';
								$.div += '<td style="width:5%; height:auto; text-align:center;">C</td>';
								$.div += '<td style="width:5%; height:auto; text-align:center;">H</td>';
								$.div += '<td style="width:5%; height:auto; text-align:center;">E</td>';
								
								$.div += '<td rowspan="4" style="width:45%; height:auto;  text-align:center; vertical-align:middle;">';
						
								
								if (element.estatus==null) {							
									$.div += '<p style="color:#999999;">Hora de Inicio</p>';
									$.div += '<p><b>'+element.hora_ini+'</b></p>';
								} else {
									$.div += '<p style="color:#999999; text-transform:capitalize;">'+element.inning_periodo.toLowerCase()+' '+element.inning+'</p>';
									$.div += '<p><b style="color:#999999; text-transform:capitalize;">'+element.estatus.toLowerCase()+'</b></p>';
								}
						
								
								$.primera = ((element.primera==null)? '0' : element.primera);
								$.segunda = ((element.segunda==null)? '0' : element.segunda);
								$.tercera = ((element.tercera==null)? '0' : element.tercera);
								$.base = $.primera+$.segunda+$.tercera;
								
								
								$.div += '<img style="width:40%; height:auto; vertical-align:middle;" src="img/lvbp/base/'+ $.base  +'.jpg">';
								$.div += '<img style="width:30%; height:auto; vertical-align:middle;" src="img/lvbp/out/' + ((element.out==null) ? 0 : element.out) + '.jpg">'
								
								$.div += '</td>';
								
								$.div += '</tr>';
								
								
								
								$.div += '<tr>';
		
								$.div += '<td style="text-align:left;">';
								$.div += '<img alt="'+element.nombre_v.toLowerCase()+'" src="img/lvbp/team/'+element.nombre_v.toLowerCase()+'.jpg"  onerror="this.style.display=\'none\'" style="width:30%; height:auto; vertical-align:middle; margin-right:5px;"  />';											
								$.div += '<span style="text-transform:capitalize;"><b>'+element.nombre_v.toLowerCase()+'</b></span>';
	
								$.div += '</td>';
		
								
								$.div += '<td style="text-align:center;">';
								$.div += ((element.c_v==null)? '0':element.c_v) ;
								$.div += '</td>';
								
								
								$.div += '<td style="text-align:center;">';
								$.div += ((element.h_v==null)? '0':element.h_v); 
								$.div += '</td>';
								
								$.div += '<td style="text-align:center;">';
								$.div += ((element.e_v==null)? '0':element.e_v);
								$.div += '</td>';
								
								
								
								$.div += '</tr>';	
	
								$.div += '<tr>';
									
								$.div += '<td style="text-align:left;">';
								$.div += '<img alt="'+element.nombre_h.toLowerCase()+'" src="img/lvbp/team/'+element.nombre_h.toLowerCase()+'.jpg"  onerror="this.style.display=\'none\'" style="width:30%; height:auto; vertical-align:middle; margin-right:5px;"  />';											
								$.div += '<span style="text-transform:capitalize;"><b>'+element.nombre_h.toLowerCase()+'</b></span>';
								$.div += '</td>';
		
								
								$.div += '<td style="text-align:center;">';
								$.div += ((element.c_h==null)? '0':element.c_h); 
								$.div += '</td>';
															
								$.div += '<td style="text-align:center;">';
								$.div += ((element.h_h==null)? '0':element.h_h);
								$.div += '</td>';
								
								$.div += '<td style="text-align:center;">';
								$.div += ((element.e_h==null)? '0':element.e_h);
								$.div += '</td>';
								
								$.div += '</tr>';	
								$.div += '</table>';
					       
					        	$('#games').append($.div);
				        	
				        	}*/
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
									$.div += '<p style="color:#999999;">Hora de Inicio</p>';
									$.div += '<p><b>'+element.hora_ini+'</b></p>';
								} else {
									$.div += '<p style="color:#999999; text-transform:capitalize;">'+element.inning_periodo.toLowerCase()+' '+element.inning+'</p>';
									$.div += '<p><b style="color:#999999; text-transform:capitalize;">'+element.estatus.toLowerCase()+'</b></p>';
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
				     					     		
				     		$('#gamesScroller').append('<div id="game-'+i+'" style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#ffffff; '+$.visibility+' ">'+$.div+'</div>');
				        	g--;
				        	
				        }
				        
				        
				        myScrollGamesWrapper.refresh();
				       	myScrollGamesWrapper.scrollToPage(page, 0, 0);
	     
	
					});
				
				}
				
				
				
				
				
				
				
				
				
				
			};

			//WITH PHP INSTEAD OF NEWSML
			$.fgetNews = function(c,section,color) {
				myXml=$.fGetAjaX('http://02.kraken.hecticus.com/storefront/render/news.php?category='+arrCategory[myScrollPage.currPageX].id,'xml'); 
				myXml.done(function(xml) {
					$(xml).find('newsML>category').each(function(i){
						
						$.category = '#'+$(this).attr('name');
						window['myScroll'+$(this).attr('name')]=newScroll($(this).attr('name'));
						arrPage.push('myScroll'+$(this).attr('name'));

						$($.category+'-news1').empty();
						$($.category+'-news1').append('<li><div class="section" style="background-color:'+arrCategory[myScrollPage.currPageX] .bgcolor+'; width:'+viewport.width+'px; height:auto;">&nbsp;&nbsp;'+arrCategory[myScrollPage.currPageX] .title+'</div></li>');

																		
						$(this).find('news').each(function(i){
											
							
							$.news={id:$(this).attr('duid'),headline:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
							$.news.headline=$(this).find('headline').text();
							$.news.datacontent=$('<div>').append($(this).find('datacontent').clone()).remove().html();
							
							$(this).find('images[duid]').each(function(i) {							
								$.news.caption.push($(this).find('caption').text());
								$.news.thumbnail.push($.fgetUrlNews($(this).find('image[type="Thumbnail"]').text()));
								$.news.highdef.push($.fgetUrlNews($(this).find('image[type="HighDef"]').text()));	
								$.news.quicklook.push($.fgetUrlNews($(this).find('image[type="Quicklook"]').text()));									
							});
							
							$(this).find('datacontent>p>a[class="videoSet"]').each(function(i){													
								$.news.video.push({src:$.fgetUrlNews($(this).find('a[title="Mpeg4-640x360"]').attr('href')),poster:$.fgetUrlNews($(this).find('a[title="jpeg"]').attr('href'))});			    				
							});
									
									
							if ($.category=='#baseball_nacional'){								
								$.news.highdef.push('img/lvbp.jpg');
								$.news.quicklook.push('img/lvbp.jpg');
							}
										
							if (i==0) {
								
								$($.category+'-featured').empty;								
								$($.category+'-featured').append('<img id="featured-image"  src="'+$.news.highdef[0]+'"  onerror="this.style.display=\'none\'" style="width:100%; height:100%;"  />');
																
								$($.category+'-news-featured-title').attr('content','#news-'+$.news.id);
								$($.category+'-news-featured-title').attr('wrapper','news-'+$.news.id+'-wrapper');
								$($.category+'-news-featured-title').attr('class','headline');
	
								$.li='<div style="position:relative; width:100%; height: '+viewport.pHeight+'px;">';
									$.li+='<div style="position:absolute; position: absolute; bottom: 0; left: 0; color:#ffffff;">';
										$.li+='<h2 style="color: #ffffff; text-shadow: 0px 2px 3px #555;">'+$.news.headline+'</h2>';
									$.li+='</div>';
								$.li+='</div>';

								$($.category+'-news-featured-title').empty();
								$($.category+'-news-featured-title').append($.li);
								
							} else if ((i>0) && ($.category!='#baseball_nacional')) {
							
																		
								$.li='<li style="width:100%; height:auto; background-color:#ffffff;">';
								$.li+='<div style="margin:5px; float: inherit; ">';
					
								if ($.news.video.length==0) _watermark='transp-block-camare';
								else _watermark='transp-block-video';
									
	
								$.li+='<div  content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="thumbnail" style="float: inherit; z-index: 0;">';
								$.li+='<div class="'+_watermark+'" style="position:relative; width:100%; height:auto;">';
															
								$.li+='<img src="'+$.news.thumbnail[0]+'" alt="thumbnail" onerror="this.style.display=\'none\'" class="transparent" style="float: inherit; "  />';												
								$.li+='</div>';					        			
								$.li+='</div>';								
					
					        		
								$.li+='<div content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="headline" style="display: inline; font-size: medium; font-style:oblique; font-weight: bold; ">';							        				
								$.li+= $.news.headline;
								$.li+='</div>';	
								$.li+='</div>';				        			
								$.li+='<div style="clear: both; width:100%; height:5px;"></div>';				        			
								
								$.li+='</li>';
								
								$($.category +'-news1').append($.li);
								
					    	} else if ($.category=='#baseball_nacional') {
					    		$.li='<li style="width:100%; height:auto; background-color:#ffffff;">';
								$.li+='<div content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="headline" style="display: inline; font-size: medium; font-style:oblique; font-weight: bold;">';							        				
								$.li+= $.news.headline;
								$.li+='</div>';	
								$.li+='<div style="clear: both; width:100%; height:10px;"></div>';
								$.li+='</li>';								
								$($.category +'-news1').append($.li);
					    	}

					    	$.li='<li id="news-'+$.news.id+'" video="news-'+$.news.id+'-video" class="news-datacontent" style="width:100%; height:auto; text-align:center; margin: 0 auto; display:none; background-color:#ffffff;">';				        			
							$.li+='<div video="news-'+$.news.id+'-video" style="margin:0 auto;">';			        			
							$.total = $.news.highdef.length+$.news.video.length;				        					
	
								
								$.li+='<div id="news-'+$.news.id+'-wrapper" video="news-'+$.news.id+'-video" style="position:relative; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; text-align:left;">';
								$.li+='<div video="news-'+$.news.id+'-video" style="display:block; float:left;  width:'+(viewport.width*$.total)+'px; height:'+viewport.pHeight+'px; ">';
								$.lii='';
								
									c=0;
									$.news.video.forEach(function(video){
			
										$.lii+='<div data-src="'+video.src+'" data-type="video" style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#000000; ">';										
					    				$.lii+='<img alt="highdef" src="'+video.poster+'" onerror="this.style.display=\'none\'" style="width:'+viewport.width+'px; height:'+viewport.pHeight+'px;  " />';												
					    				$.lii+='<a href="'+video.src+'"><img alt="highdef" src="img/playvideo.png" style="position:absolute; width:32px; height:32px; top:45%; left:45%;" /></a>';
					    				$.lii+='<div style="position:absolute; bottom:0; left:0;">';					        				
					    				$.lii+='<h2 style="color: #ffffff; text-shadow: 0px 2px 3px #555; font-size: small;">'+$.news.caption[c++]+'</h2>';					    				
					    				$.lii+='</div>';
					    				$.lii+='</div>';
					    				
									});
									
									c=0;
									$.news.highdef.forEach(function(src){
										
					    				$.lii+='<div style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#000000; ">';
					    				$.lii+='<img alt="highdef" src="'+src+'" onerror="this.style.display=\'none\'" style="width:'+viewport.width+'px; height:'+viewport.pHeight+'px;  " />';
					    				$.lii+='<div style="position:absolute; bottom:0; left:0;">';					        				
					    				$.lii+='<h2 style="color: #ffffff; text-shadow: 0px 2px 3px #555; font-size: small;">'+$.news.caption[c++]+'</h2>';					    				
					    				$.lii+='</div>';
					    				$.lii+='</div>';
									});
									
								$.li+=$.lii;			
								$.li+='</div>';
								$.li+='</div>';
								
							        	
							if ($.total>1){
		    					$.li+='<h3 style="color: #ffffff; text-shadow: 0px 2px 3px #555; text-align:center">&#8249;&nbsp;&nbsp;&nbsp; <span class="position">1</span> de '+$.total+'&nbsp;&nbsp;&nbsp;&#8250;</h3>';	
		    				}							        	
	
							$.li+='<div	style="position:relative; width:100%; height:auto; ">';
							$.li+='<div><button onclick="window.plugins.socialsharing.share(\''+$.news.headline.replace(/["']/g, "")+'\',null,null,\'http://superkraken.net/fanaticos412/?test&idt=99&idn='+$.news.id+'&cn='+arrCategory[myScrollPage.currPageX].id+'\')">Share</button></div>';				
							$.li+='<div style="width:98%; color:#000; font-size: normal; text-align:justify; margin-left:1%;">';
							$.li+=$.news.datacontent;
							$.li+='</div>';	
							$.li+='</div>';	
							
							$.li+='</div>';				        																						
							$.li+='</li>';
														
							$('#datacontents').append($.li);
						});
						
						
					});
					
				});

    		};//*/
			
    		//WITH NEWSML
			/*$.fgetNews = function(c,section,color) {
				var start = new Date().getTime();
				console.log("Parametros: "+c+", "+section+", "+color);
				var u = 'http://0c05ec810be157e5ab10-7e0250ad12242003d6f6a9d85a0d9417.r19.cf1.rackcdn.com/All/index.xml';
				if (c) {
					$('#featured').empty();
					$('#news-featured-title').empty();					
					$('#news1').empty();
					$('#datacontents').empty();
					u='http://0c05ec810be157e5ab10-7e0250ad12242003d6f6a9d85a0d9417.r19.cf1.rackcdn.com/'+c+'/index.xml';
				}

				if (!section) {
					section='Home';
				};
				
				if (!color) {
					color='#0040FF';
				};



				$('#news1').append('<li><div id="section" style="background-color:'+color+'; width:'+viewport.width+'px; height:auto;">&nbsp;&nbsp;'+section+'</div><div style="clear: both; width:100%; height:5px;"></div></li>');
				
				console.log("Paso0");
				$.fGetAjaX(u).done(function(xml) {
					var end = new Date().getTime();
					var time = end - start;
					console.log("Paso1 "+time);
					$(xml).find('NewsItem>NewsComponent>NewsComponent>NewsItemRef').each(function(i){

						$.fGetAjaX($.fgetUrlNews($(this).attr("NewsItem"))).done(function(xml) {
							$.news={id:i,headline:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
							$.news.headline=$(xml).find('NewsItem>NewsComponent>NewsLines>HeadLine').text();
							$.news.datacontent=$('<div>').append($(xml).find('NewsItem>NewsComponent>NewsComponent>ContentItem>DataContent').clone()).remove().html();
					    	console.log("Headline "+$.news.headline);					    	
							$(xml).find('NewsItem>NewsComponent>NewsComponent[Duid]>NewsComponent').each(function(i) {
							
								
								if ($(this).find('Role').attr('FormalName') == 'Thumbnail') {										
									//$.news.thumbnail.push($.fgetUrlNews($(this).find('ContentItem').attr('Href')));
								}
								
								if ($(this).find('Role').attr('FormalName') == 'Caption') {
									$.news.caption.push($(this).find('ContentItem>DataContent').text());
								}
																			
								if ($(this).find('Role').attr('FormalName') == 'HighDef'){
									//$.news.highdef.push($.fgetUrlNews($(this).find('ContentItem').attr('Href')));	
								}
								
								if ($(this).find('Role').attr('FormalName') == 'Quicklook'){
									//$.news.quicklook.push($.fgetUrlNews($(this).find('ContentItem').attr('Href')));	
								}
								
							});
							
							$(xml).find('NewsItem>NewsComponent>NewsComponent>ContentItem>DataContent>p>a[class="videoSet"]').each(function(i){									
								//$.news.video.push({src:$.fgetUrlNews($(this).find('a[title="Mpeg4-640x360"]').attr('href')),poster:$.fgetUrlNews($(this).find('a[title="jpeg"]').attr('href'))});			    				
							});
									
									
							if ($.category=='#baseball_nacional'){								
								$.news.highdef.push('img/lvbp.jpg');
								$.news.quicklook.push('img/lvbp.jpg');
							}
										
							if ($.news.id==0) {
								
								$($.category+'-featured').empty;								
								$($.category+'-featured').append('<img id="featured-image"  src="'+$.news.highdef[0]+'"  onerror="this.style.display=\'none\'" style="width:100%; height:100%;"  />');
																
								$($.category+'-news-featured-title').attr('content','#news-'+$.news.id);
								$($.category+'-news-featured-title').attr('wrapper','news-'+$.news.id+'-wrapper');
								$($.category+'-news-featured-title').attr('class','headline');
	
								$.li='<div style="position:relative; width:100%; height: '+viewport.pHeight+'px;">';
									$.li+='<div style="position:absolute; position: absolute; bottom: 0; left: 0; color:#ffffff;">';
										$.li+='<h2 style="color: #ffffff; text-shadow: 0px 2px 3px #555;">'+$.news.headline+'</h2>';
									$.li+='</div>';
								$.li+='</div>';

								$($.category+'-news-featured-title').empty();
								$($.category+'-news-featured-title').append($.li);
								
							} else if ((i>0) && ($.category!='#baseball_nacional')) {
							
																		
								$.li='<li style="width:100%; height:auto; background-color:#ffffff;">';
								$.li+='<div style="margin:5px; float: inherit; ">';
					
								if ($.news.video.length==0) _watermark='transp-block-camare';
								else _watermark='transp-block-video';
									

								$.li+='<div  content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="thumbnail" style="float: inherit; z-index: 0;">';
								$.li+='<div class="'+_watermark+'" style="position:relative; width:100%; height:auto;">';
															
								$.li+='<img src="'+$.news.thumbnail[0]+'" alt="thumbnail" onerror="this.style.display=\'none\'" class="transparent" style="float: inherit; "  />';												
								$.li+='</div>';					        			
								$.li+='</div>';								
					
					        		
								$.li+='<div content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="headline" style="display: inline; font-size: mediun; font-style:oblique; font-weight: bold; ">';							        				
								$.li+= $.news.headline;
								$.li+='</div>';	
								$.li+='</div>';				        			
								$.li+='<div style="clear: both; width:100%; height:5px;"></div>';				        			
								
								$.li+='</li>';
								
								$($.category +'-news1').append($.li);
								
					    	} else if ($.category=='#baseball_nacional') {
					    		$.li='<li style="width:100%; height:auto; background-color:#ffffff;">';
								$.li+='<div content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="headline" style="display: inline; font-size: mediun; font-style:oblique; font-weight: bold;">';							        				
								$.li+= $.news.headline;
								$.li+='</div>';	
								$.li+='<div style="clear: both; width:100%; height:10px;"></div>';
								$.li+='</li>';
								$('#news1').append($.li);
					    	}
					
					    	$.li='<li id="news-'+$.news.id+'" video="news-'+$.news.id+'-video" class="news-datacontent" style="width:100%; height:auto; text-align:center; margin: 0 auto; display:none; background-color:#ffffff;">';				        			
							$.li+='<div video="news-'+$.news.id+'-video" style="margin:0 auto;">';			        			
							$.total = $.news.highdef.length+$.news.video.length;				        					

								
								$.li+='<div id="news-'+$.news.id+'-wrapper" video="news-'+$.news.id+'-video" style="position:relative; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; text-align:left;">';
								$.li+='<div video="news-'+$.news.id+'-video" style="display:block; float:left;  width:'+(viewport.width*$.total)+'px; height:'+viewport.pHeight+'px; ">';
								$.lii='';

									$.news.video.forEach(function(video){
										$.lii+='<div video="news-'+$.news.id+'-video" style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#000000; ">';																        									        			
					    				$.lii+='<video id="news-'+$.news.id+'-video" video="news-'+$.news.id+'-video" poster="'+video.poster+'" style="width:'+viewport.width+'px; height:'+viewport.pHeight+'px; ">';
										  $.lii+='<source src="'+video.src+'" type="video/mp4">';											  
										  $.lii+='Your browser does not support the video tag.';
										$.lii+='</video>';
										$.lii+='<img video="news-'+$.news.id+'-video" alt="highdef" src="img/playvideo.png" style="position:absolute; width:32px; height:32px; top:45%; left:45%;" />';
					    				$.lii+='<div video="news-'+$.news.id+'-video" style="position:absolute; bottom:0; left:0;">';					        				
					    				$.lii+='<h2 video="news-'+$.news.id+'-video" style="color: #ffffff; text-shadow: 0px 2px 3px #555; font-size: small;">'+$.news.headline+'</h2>';		        									    							        									        									        									        									        
					    				$.lii+='</div>';					        				
					    				$.lii+='</div>';
									});
										
									$.news.highdef.forEach(function(src){
										
					    				$.lii+='<div style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#000000; ">';
					    				$.lii+='<img alt="highdef" src="'+src+'" onerror="this.style.display=\'none\'" style="width:'+viewport.width+'px; height:'+viewport.pHeight+'px;  " />';
					    				$.lii+='<div style="position:absolute; bottom:0; left:0;">';					        				
					    				$.lii+='<h2 style="color: #ffffff; text-shadow: 0px 2px 3px #555; font-size: small;">'+$.news.headline+'</h2>';					    				
					    				$.lii+='</div>';
					    				$.lii+='</div>';
									});
									
								$.li+=$.lii;			
								$.li+='</div>';
								$.li+='</div>';
								
							        	
							if ($.total>1){
		    					$.li+='<h3 style="color: #ffffff; text-shadow: 0px 2px 3px #555; text-align:center">&#8249;&nbsp;&nbsp;&nbsp; <span class="position">1</span> de '+$.total+'&nbsp;&nbsp;&nbsp;&#8250;</h3>';	
		    				}							        	

							$.li+='<div	style="position:relative; width:100%; height:auto; ">';
							$.li+='<div><button onclick="window.plugins.socialsharing.share(\''+$.news.headline.replace(/["']/g, "")+'\',null,null,\'http://superkraken.net/fanaticos412/?test&idt=99&idn='+$.news.id+'&cn='+arrCategory[myScrollPage.currPageX].id+'\')">Share</button></div>';				
							$.li+='<div style="width:100%; color:#000; font-size: normal; text-align:justify; ">';
							$.li+=$.news.datacontent;
							$.li+='</div>';	
							$.li+='</div>';	
							
							$.li+='</div>';				        																						
							$.li+='</li>';
							$('#datacontents').append($.li);
							
							var end = new Date().getTime();
							var time = end - start;
							console.log("TOTAL "+time);
			
						});

					});

				});
				
				
    		};//*/

			
			$.fgetNews();
			$.fgetScores(12);
			$.fgetScores(13);
			


		});
		      

    }
};
