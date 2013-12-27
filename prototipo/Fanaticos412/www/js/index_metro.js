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

//INIT FUNCTIONS
//Funcion que permite rellenar el menu por codigo
function setMenuCategories(){
	$.lil='';
	
	for(var i=0; i<arrCategory.length; i++){
		$.lil+='<li category="'+arrCategory[i].id+'" title="'+arrCategory[i].title+'" class="menu" bgcolor="'+arrCategory[i].bgcolor+'" data-position="'+arrCategory[i].i+'">'+arrCategory[i].title+'</li>\n';
	}
	for(var i=0; i<otherCategoriesArray.length; i++){
		$.lil+='<li category="'+otherCategoriesArray[i].id+'" data-title="'+otherCategoriesArray[i].title+'" class="menu" bgcolor="'+otherCategoriesArray[i].bgcolor+'" data-position="'+otherCategoriesArray[i].i+'">'+otherCategoriesArray[i].title+'</li>\n';
	}
	
	
	$('#mainMenuList').append($.lil);
}

//function to set the correct pages with the correct IDs and colors
function setScrollPages() {
	$('#scrollerpage').empty();
	for(var i=0; i<arrCategory.length; i++){
		//insertar cada pagina con sus datos correctos
		$.li='<div class="pages"  style="position:relative; float:left; display:block;background-color:'+arrCategory[i].bgcolor+';">';
			$.li+='<div id="'+arrCategory[i].id+'" class="page" style="position:absolute; z-index:1; top:0px; bottom:0; left:0; width:100%; overflow:auto;">';	
				$.li+='<div id="'+arrCategory[i].id+'-featured" class="featured" style="position:absolute;  z-index: 0; background-color: '+arrCategory[i].bgcolor+';"></div>';
				$.li+='<div class="scroller">';
					$.li+='<ul>';
						$.li+='<li>';
							$.li+='<ul id="'+arrCategory[i].id+'-news-featured" class="news-featured">';	
								$.li+='<li id="'+arrCategory[i].id+'-news-featured-title" class="news-featured-title"></li>';
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
			this.hoverTimeout = setTimeout(function () {
				$('#metro-img-'+$(target).data('img')).addClass('metroHover');
				press=true;
			}, 2);
			this.hoverTarget = target;
			e.preventDefault();		
		},onScrollMove: function(e){	
			$('#'+scroll+'-featured').height((this.y>=0) ? viewport.pHeight+this.y : viewport.pHeight);
			$('#'+scroll+'-featured').width((this.y>=0) ? viewport.width+(this.y*2) : viewport.width);
			$('#'+scroll+'-featured').css('left',(this.y<=0) ? 0 : -this.y);			
			if (this.hoverTarget) {
				clearTimeout(this.hoverTimeout);
				$('#metro-img-'+$(this.hoverTarget).data('img')).removeClass('metroHover');	
				//this.hoverTarget.className = this.hoverTarget.className.replace(hoverClassRegEx, '');	
				this.target = null;
				press = false;
			}  
			e.preventDefault();					
		},onBeforeScrollEnd: function(e){
			if (this.hoverTarget) {
				clearTimeout(this.hoverTimeout);
				$('#metro-img-'+$(this.hoverTarget).data('img')).removeClass('metroHover');	
				//this.hoverTarget.className = this.hoverTarget.className.replace(hoverClassRegEx, '');	
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
	{i:0,status:false,id:'All',title:'Home',bgcolor:'#0404B4',featured:{highdef:'',headline:''},xml:'',news:'',view:1},
	{i:1,status:false,id:'football',title:'Futbol',bgcolor:'#FF4000',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
	{i:2,status:false,id:'baseball_nacional',title:'Beisbol Nacional',bgcolor:'#A4A4A4',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
	{i:3,status:false,id:'baseball',title:'Beisbol Internacional',bgcolor:'#AEB404',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
	{i:4,status:false,id:'basket',title:'Baloncesto',bgcolor:'#FE2E64',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
	{i:5,status:false,id:'tennis',title:'Tenis',bgcolor:'#0B610B',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
	{i:6,status:false,id:'f1',title:'F1',bgcolor:'#0000EE',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
	{i:7,status:false,id:'cycling',title:'Ciclismo',bgcolor:'#AAAAAA',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
	{i:8,status:false,id:'athletics',title:'Atletismo',bgcolor:'#BABCEE',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
	{i:9,status:false,id:'golf',title:'Golf',bgcolor:'#CCCCCC',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
	{i:10,status:false,id:'olympics',title:'Olimpiadas',bgcolor:'#EEEEEE',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
	{i:11,status:false,id:'Other',title:'Más Deportes',bgcolor:'#0B3B2E',featured:{highdef:'',headline:''},xml:'',news:'',view:0}
	];
var otherCategoriesArray=[{i:12,status:false,id:'extra',title:'LVBP Resultados',bgcolor:'#000000',featured:{highdef:'',headline:''},xml:'',news:'',view:3},
             	{i:13,status:false,id:'extra',title:'LVBP Tabla',bgcolor:'#000000',featured:{highdef:'',headline:''},xml:'',news:'',view:4}
                 ];
//*/
/*var arrCategory=[
 	{i:0,status:false,id:'latestnews',title:'Home',bgcolor:'#0404B4',featured:{highdef:'',headline:''},xml:'',news:'',view:1},
 	{i:1,status:false,id:'latestnews_nacionales',title:'Nacionales',bgcolor:'#FF4000',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
 	{i:2,status:false,id:'latestnews_internacionales',title:'Internacionales',bgcolor:'#A4A4A4',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
 	{i:3,status:false,id:'latestnews_tecnologia',title:'Tecnología',bgcolor:'#AEB404',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
 	{i:4,status:false,id:'latestnews_salud',title:'Salud',bgcolor:'#FE2E64',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
 	{i:5,status:false,id:'latestnews_entretenimiento',title:'Entretenimiento',bgcolor:'#0B610B',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
 	{i:6,status:false,id:'latestnews_deportes',title:'Deportes',bgcolor:'#0000EE',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
 	{i:7,status:false,id:'latestvideos',title:'Videos',bgcolor:'#AAAAAA',featured:{highdef:'',headline:''},xml:'',news:'',view:2},
 	{i:8,status:false,id:'latestnews_decision2014',title:'Noticias Decision 2014',bgcolor:'#BABCEE',featured:{highdef:'',headline:''},xml:'',news:'',view:0},
 	{i:9,status:false,id:'latestvideos_decision2014',title:'Videos Decision 2014',bgcolor:'#CCCCCC',featured:{highdef:'',headline:''},xml:'',news:'',view:2}
 	];
var otherCategoriesArray=[
                           ];
//*/
var upcoming=0;
var press=0;
var myScrollMenu, myScrollDatacontent, myScrollDatacontentHorizontal, myScrollPage;
var myXml=false;


var hoverClassRegEx = new RegExp('(^|\\s)iScrollHover(\\s|$)');

var hoverClassRegExAlpha = new RegExp('(^|\\s)metroHover(\\s|$)');

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
				}else if ($('#video').hasClass('center')) {										
					$('#video').attr('class','page transition left');	
					$('video').hide();
				}else if ($('#datacontent').hasClass('left')){
					$('#datacontent').attr('class','page transition right');						
				}else if ($('#extra').hasClass('right')){
					$('#extra').attr('class','page transition left');
				}else if ($('#metro').hasClass('right')){
					$('#metro').attr('class','page transition left');					
				}else {
					if(myScrollPage.currPageX == 0){
						navigator.app.exitApp();					
					}else{
						if(myScrollPage.enabled){
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
				var target = e.target;
				clearTimeout(this.hoverTimeout);				
				while (target.nodeType != 1) target = target.parentNode;
				this.hoverTimeout = setTimeout(function () {
					if (!hoverClassRegEx.test(target.className)) target.className = target.className ? target.className + ' iScrollHover' : 'iScrollHover';					
					press=true;						
				}, 2);				
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
			
			$('#metro').width(viewport.width);
			$('#metro').height(viewport.height);
			
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
	    			//if ($(this).data('position') >= 12) {
    				//Si es otro tipo de pantalla diferente a las categorias la creamos como tal
    				if (otherCategoriesArray.length>0 && $(this).data('position') >= otherCategoriesArray[0].i) {
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

     			
			$(document).on('touchstart','.highdef, .quicklook, .thumbnail, .headline, .caption', function(e) {
				
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


			$(document).on('touchstart','.mymetro', function(e) {
				press=false;						
    		}).on('touchend','.mymetro', function() {
    			if (press) {    				
    				if ($(this).data('type')=='video') {
    					window.videoPlayer.play($(this).data('src'));
    				} else {
    					myScrollDatacontent.scrollTo(0,0,0);
						$('.news-datacontent').hide();
						$($(this).data('content')).show();										
						$('#datacontent').attr('class','page transition left');	
    				}
				} 
    		});

			$.fn.exists = function() {
    			return this.length>0;
			};

			$.fgetUrlNews = function(u) {
				u = u.split('/');
				//u = 'http://0c05ec810be157e5ab10-7e0250ad12242003d6f6a9d85a0d9417.r19.cf1.rackcdn.com/'+u[1]+'/'+u[2];
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
			
			//para noticias TVN es muy importante el dataType y el contentType, sin esto no funcionan
			$.fGetAjaXJSON = function(u) {			
				return $.ajax({
					url: u,
					type: 'get',
					dataType: "json",
					contentType: "application/json; Charset=utf-8",
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


			/*$.fgetAllNews = function() {
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
								$.li+='<h2 style="color: #ffffff; text-shadow:'+textShadowLight+'">'+$.news.headline+'</h2>';
								$.li+='</div>';
								$.li+='</div>';
								
								category.featured.headline=$.li;
																	
							} 
							
							
							
						}); //newsML>category
					}); //root
					
				});
			};*/


			$.fgetExtras = function(position,section) {
				$('#extra-featured').empty();
				$('#extra-featured').removeClass('hidden');	
				$('#extra-featured').append('<img  src="img/lvbp.jpg" onerror="this.style.display=\'none\'" style="width:100%; height:100%;"  />');
				
				$.li='<div style="position:relative; width:100%; height: '+viewport.pHeight+'px;">';
				$.li+='<div style="position:absolute; position: absolute; bottom: 0; left: 0; color:#ffffff;">';
				$.li+='<h2 style="color: #ffffff; text-shadow: '+textShadowLight+'">LVBP 2013-2014</h2>';
				$.li+='</div>';
				$.li+='</div>';

				$('#extra-news-featured-title').empty();
				$('#extra-news-featured-title').append($.li);
				
				$('#gamesScroller').empty();
				$('#standings').empty();
				
				$('#extra-section').empty();				
				$('#extra-section').append('&nbsp;&nbsp;'+section);

				var currentItem;
				for(var i=0;i<otherCategoriesArray.length;i++){
					if(otherCategoriesArray[i].i == position){
						currentItem = otherCategoriesArray[i];
					}
				}
				
				//VIEW de tabla de resultados de Baseball
				//if (position==13) {
				if (currentItem.view == 4) {
			
					
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

				//VIEW de juegos de Baseball
				//if (position==12) {
				if (currentItem.view == 3) {
					
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
				     					     		
				     		//$('#gamesScroller').append('<div id="game-'+i+'" style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#ffffff; '+$.visibility+' ">'+$.div+'</div>');
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

						$($.category+'-news1').empty();
						$($.category+'-news1').append('<li><div class="section" style="background-color:'+arrCategory[myScrollPage.currPageX] .bgcolor+'; width:'+viewport.width+'px; height:auto;">&nbsp;&nbsp;'+arrCategory[myScrollPage.currPageX].title+'</div></li>');

																		
						$(this).find('news').each(function(i){
											
							
							$.news={id:$(this).attr('duid'),headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
							$.news.headline=$(this).find('headline').text();

							var myDate = $(this).find('DateAndTime').text();
							$.news.date=new Date($.parseDate(myDate));
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
										$.li+='<h2 style="color: #ffffff; text-shadow: '+textShadowBlack+'">'+$.news.headline+'</h2>';
									$.li+='</div>';
								$.li+='</div>';

								$($.category+'-news-featured-title').empty();
								$($.category+'-news-featured-title').append($.li);
								
							} else if ((i>0) && ($.category!='#baseball_nacional')) {
								
								if (arrCategory[myScrollPage.currPageX].view==0){
									
									$.li='<li style="width:100%; height:auto; background-color:#ffffff;">';
									$.li+='<div style="margin:5px; float: inherit; ">';
						
									if ($.news.video.length==0) _watermark='transp-block-camare';
									else _watermark='transp-block-video';
										
									//Colocar margin aqui para separar un poco las letras de la imagen
									$.li+='<div  content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="thumbnail" style="width:30%; float: inherit; z-index: 0; background:#FFF;">';
									$.li+='<div class="'+_watermark+'" style="display: inline-block; position:relative; width:100%; height:auto; vertical-align:middle;">';
																		
									//$.li+='<img src="'+$.news.thumbnail[0]+'" alt="thumbnail" onerror="this.style.display=\'none\'" class="transparent" style="float: inherit; width:100%; height:auto; vertical-align:middle;"  />';
									$.li+='<img src="'+$.news.thumbnail[0]+'" alt="thumbnail" onerror="this.src=\'img/noimage.png\'" class="transparent" style="float: inherit; width:100%; height:auto; vertical-align:middle;"  />';
									$.li+='</div>';					        			
									$.li+='</div>';								
						
						        	
									var left = 3;
									if(d%2==0){
										left = 0;
									}
									$.li+='<div content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="headline" style="margin-left:'+left+'%; display: inline-block; font-size: medium; font-style:oblique; font-weight: bold; width:66%; height:100%; background-color:#ffffff;">';							        				
									$.li+= $.news.headline;
									//$.li+= '<p>'+$.news.date+'</p>';
									$.li+= '<br><div style="display: inline; font-size: small; color:#555 ">'+$.formatDate($.news.date)+'</div>';
									$.li+='</div>';	
									$.li+='</div>';				        			
									$.li+='<div style="clear: both; width:100%; height:5px;"></div>';				        			
									
									$.li+='</li>';
									
									$($.category +'-news1').append($.li);	
									
								} else if  (arrCategory[myScrollPage.currPageX].view==1) {
									
									
									if ((d%2)==1) $.lil='<li style="width:100%; height:auto; background-color:#ffffff;">';	
														
									$.lil+='<div class="mymetro" data-content="#news-'+$.news.id+'" style="position:relative; width:'+((viewport.width/2)-4)+'px; height:'+((viewport.height*25)/100)+'px; float:left; border:2px solid #ffffff; ">';									
									$.lil+='<img id="metro-img-'+$.news.id+'"  data-img="'+$.news.id+'" data-content="#news-'+$.news.id+'" class="metro" src="'+$.news.quicklook[0]+'"  onerror="this.style.display=\'none\'" style="width:100%; height:100%;  "  />';								
									$.lil+='<h2 data-img="'+$.news.id+'" data-content="#news-'+$.news.id+'" style="position:absolute; top: 0; left: 0; color: #ffffff; text-shadow: '+textShadowBlack+' font-size:small;">'+$.news.headline+'</h2>';
									$.lil+='</div>';
									
									if (((d%2)==0) || (d==9)) {
										$.lil+='</li>';
										$($.category +'-news1').append($.lil);	
									}	

									
								} else if  (arrCategory[myScrollPage.currPageX].view==2) {
									
									if ($.news.video.length==0) _watermark='transp-block-camare';
									else _watermark='transp-block-video';
									
								
									if ($.news.video.length>=1) {
										
				
										$.li='<li class="mymetro" data-src="'+$.news.video[0].src+'" data-type="video"  style="width:100%; height:auto; background-color:#ffffff;">';
										
										$.li+='<div style="position:relative; width:'+viewport.width+'px; height: '+viewport.pHeight+'px; ">';
										
										$.li+='<div class="'+_watermark+'" style="position:relative; width:100%; height:height:100%;">';										
										$.li+='<img src="'+$.news.highdef[0]+'" class="transparent"  onerror="this.style.display=\'none\'" style="width:100%; height:100%; "  />';
										$.li+='</div>';
										
										$.li+='<div style="position:absolute; position: absolute; bottom: 0; left: 0; color:#ffffff;">';
										$.li+='<h2 style="color: #ffffff; text-shadow: '+textShadowLight+' font-size:medium;">'+$.news.headline+'</h2>';										
										$.li+='</div>';
										$.li+='</div>';
										$.li+='</li>';
										
									} else {
										
										
										
										$.li='<li class="mymetro" data-content="#news-'+$.news.id+'" style="width:100%; height:auto; background-color:#ffffff;">';
										
										$.li+='<div style="position:relative; width:'+viewport.width+'px; height: '+viewport.pHeight+'px; ">';
										
										$.li+='<div class="'+_watermark+'" style="position:relative; width:100%; height:height:100%; ">';										
										$.li+='<img src="'+$.news.highdef[0]+'" class="transparent" onerror="this.style.display=\'none\'" style="width:100%; height:100%; "  />';
										$.li+='</div>';
										
										$.li+='<div style="position:absolute; position: absolute; bottom: 0; left: 0; color:#ffffff;">';
										$.li+='<h2 style="color: #ffffff; text-shadow: '+textShadowLight+' font-size:medium;">'+$.news.headline+'</h2>';										
										$.li+='</div>';
										
										$.li+='</div>';
										$.li+='</li>';	
									}
									
									
									
									$($.category +'-news1').append($.li);	
								}																		
									
															
					
								
					    	} else if ($.category=='#baseball_nacional') {
					    		$.li='<li style="width:100%; height:auto; background-color:#ffffff;">';
								$.li+='<div content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="headline" style="display: inline; font-size: medium; font-style:oblique; font-weight: bold;">';							        				
								$.li+= $.news.headline;
								$.li+='</div>';	
								$.li+='<div style="clear: both; width:100%; height:10px;"></div>';
								$.li+='</li>';								
								$($.category +'-news1').append($.li);
					    	}
					    	
							d++;

							

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
					    				$.lii+='<h2 style="color: #ffffff; text-shadow: '+textShadowLight+' font-size: small;">'+$.news.caption[c++]+'</h2>';					    				
					    				$.lii+='</div>';
					    				$.lii+='</div>';
					    				
									});
									
									c=0;
									$.news.highdef.forEach(function(src){
										
					    				$.lii+='<div style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#000000; ">';
					    				$.lii+='<img alt="highdef" src="'+src+'" onerror="this.style.display=\'none\'" style="width:'+viewport.width+'px; height:'+viewport.pHeight+'px;  " />';
					    				$.lii+='<div style="position:absolute; bottom:0; left:0;">';					        				
					    				$.lii+='<h2 style="color: #ffffff; text-shadow: '+textShadowLight+' font-size: small;">'+$.news.caption[c++]+'</h2>';					    				
					    				$.lii+='</div>';
					    				$.lii+='</div>';
									});
									
								$.li+=$.lii;			
								$.li+='</div>';
								$.li+='</div>';
								
							        	
							if ($.total>1){
		    					$.li+='<h3 style="color: #ffffff; text-shadow: '+textShadowLight+' text-align:center">&#8249;&nbsp;&nbsp;&nbsp; <span class="position">1</span> de '+$.total+'&nbsp;&nbsp;&nbsp;&#8250;</h3>';	
		    				}							        	
	
							$.li+='<div	style="position:relative; width:100%; height:auto; ">';
							$.li+='<div><button onclick="window.plugins.socialsharing.share(\''+$.news.headline.replace(/["']/g, "")+'\',null,null,\'http://superkraken.net/fanaticos412/?test&idt=99&idn='+$.news.id+'&cn='+arrCategory[myScrollPage.currPageX].id+'\')">Share</button></div>';				
							//$.li+='<div style="width:100%; color:#000; font-size: normal; text-align:justify; ">';
							$.li+='<div style="width:98%; margin-left:1%; color:#000; font-size: normal; text-align:justify; ">';
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
    		
    		
    		//WITH JSON INSTEAD OF NEWSML
			/*$.fgetNews = function(c,section,color) {
				var d=0;
				$.lil='';
				myJson=$.fGetAjaXJSON('http://www.tvn-2.com/noticias/_modulos/json/'+arrCategory[myScrollPage.currPageX].id+'-utf8.asp');

				myJson.done(function(json) {
					var itemArray = null;
					if(json["noticias"] != null){
						itemArray = json["noticias"]["item"];
						console.log("itemArray "+itemArray.length);
					}else{
						itemArray = json["videos"]["item"];
						console.log("Videos Size: "+itemArray.length);
					}
					if(itemArray != null && itemArray.length > 0){
						$.category = '#'+arrCategory[myScrollPage.currPageX].id;
						window['myScroll'+arrCategory[myScrollPage.currPageX].id]=newScroll(arrCategory[myScrollPage.currPageX].id);
						arrPage.push('myScroll'+arrCategory[myScrollPage.currPageX].id);
						
						$($.category+'-news1').empty();
						$($.category+'-news1').append('<li><div class="section" style="background-color:'+arrCategory[myScrollPage.currPageX] .bgcolor+'; width:'+viewport.width+'px; height:auto;">&nbsp;&nbsp;'+arrCategory[myScrollPage.currPageX].title+'</div></li>');
						
						for(var i=0;i<itemArray.length; i++){
							$.news={id:itemArray[i]["id"],headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
							$.news.headline=itemArray[i]["title"];

							$.news.date=$.formatDateString(itemArray[i]["pubdate"]);
							var dataContent;
							if(i%2==0){
								dataContent = '<media media-type="image" style="leftSide"><media-reference mime-type=""/></media>';
							}else{
								dataContent = '<media media-type="image" style="rightSide"><media-reference mime-type=""/></media>';
							}
							dataContent+=itemArray[i]["description"];
							$.news.datacontent=$('<div>').append(dataContent).remove().html();
							
							if(itemArray[i]["imagecaption"] != null){
								$.news.caption.push(itemArray[i]["imagecaption"]);
							}
							
							$.news.thumbnail.push(itemArray[i]["image"]);
							$.news.highdef.push(itemArray[i]["image"]);	
							$.news.quicklook.push(itemArray[i]["image"]);
							
							//check if there is a video
							if(itemArray[i]["videourl"] != null){
								if(itemArray[i]["uploadedvideo"] != null){
									if(itemArray[i]["uploadedvideo"] != "0"){
										$.news.video.push({src:itemArray[i]["videourl"],poster:itemArray[i]["image"]});
									}
								}else{
									$.news.video.push({src:itemArray[i]["videourl"],poster:itemArray[i]["image"]});
								}			    				
							}
									
							//TODO: Ali esto es un poco cableado, mejorar	
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
											$.li+='<h2 style="color: #ffffff; text-shadow: '+textShadowBlack+'">'+$.news.headline+'</h2>';
										$.li+='</div>';
									$.li+='</div>';
	
									$($.category+'-news-featured-title').empty();
									$($.category+'-news-featured-title').append($.li);
									
								} else if ((i>0) && ($.category!='#baseball_nacional')) {
									
									if (arrCategory[myScrollPage.currPageX].view==0){
										
										$.li='<li style="width:100%; height:auto; background-color:#ffffff;">';
										$.li+='<div style="margin:5px; float: inherit; ">';
							
										if ($.news.video.length==0) _watermark='transp-block-camare';
										else _watermark='transp-block-video';
											
										//Colocar margin aqui para separar un poco las letras de la imagen
										$.li+='<div  content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="thumbnail" style="width:30%; float: inherit; z-index: 0; background:#FFF;">';
										$.li+='<div class="'+_watermark+'" style="display: inline-block; position:relative; width:100%; height:auto; vertical-align:middle;">';
																			
										//$.li+='<img src="'+$.news.thumbnail[0]+'" alt="thumbnail" onerror="this.style.display=\'none\'" class="transparent" style="float: inherit; width:100%; height:auto; vertical-align:middle;"  />';
										$.li+='<img src="'+$.news.thumbnail[0]+'" alt="thumbnail" onerror="this.src=\'img/noimage.png\'" class="transparent" style="float: inherit; width:100%; height:auto; vertical-align:middle;"  />';
										$.li+='</div>';					        			
										$.li+='</div>';								
							
							        	
										var left = 3;
										if(d%2==0){
											left = 0;
										}
										$.li+='<div content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="headline" style="margin-left:'+left+'%; display: inline-block; font-size: medium; font-style:oblique; font-weight: bold; width:66%; height:100%; background-color:#ffffff;">';							        				
										$.li+= $.news.headline;
										//$.li+= '<p>'+$.news.date+'</p>';
										$.li+= '<br><div style="display: inline; font-size: small; color:#555 ">'+$.news.date+'</div>';
										$.li+='</div>';	
										$.li+='</div>';				        			
										$.li+='<div style="clear: both; width:100%; height:5px;"></div>';				        			
										
										$.li+='</li>';				        			
										
										$.li+='</li>';
										
										$($.category +'-news1').append($.li);	
										
									} else if  (arrCategory[myScrollPage.currPageX].view==1) {
										
										
										if ((d%2)==1) $.lil='<li style="width:100%; height:auto; background-color:#ffffff;">';	
															
										$.lil+='<div class="mymetro" data-content="#news-'+$.news.id+'" style="position:relative; width:'+((viewport.width/2)-4)+'px; height:'+((viewport.height*25)/100)+'px; float:left; border:2px solid #ffffff; ">';									
										$.lil+='<img id="metro-img-'+$.news.id+'"  data-img="'+$.news.id+'" data-content="#news-'+$.news.id+'" class="metro" src="'+$.news.quicklook[0]+'"  onerror="this.style.display=\'none\'" style="width:100%; height:100%;  "  />';								
										$.lil+='<h2 data-img="'+$.news.id+'" data-content="#news-'+$.news.id+'" style="position:absolute; top: 0; left: 0; color: #ffffff; text-shadow: '+textShadowBlack+' font-size:small;">'+$.news.headline+'</h2>';
										$.lil+='</div>';
										
										if (((d%2)==0) || (d==itemArray.length-1)) {
										//if (((d%2)==0)) {
											$.lil+='</li>';
											$($.category +'-news1').append($.lil);	
										}	
	
										
									} else if  (arrCategory[myScrollPage.currPageX].view==2) {
										
										if ($.news.video.length==0) _watermark='transp-block-camare';
										else _watermark='transp-block-video';
										
									
										if ($.news.video.length>=1) {
											
					
											$.li='<li class="mymetro" data-src="'+$.news.video[0].src+'" data-type="video"  style="width:100%; height:auto; background-color:#ffffff;">';
											
											$.li+='<div style="position:relative; width:'+viewport.width+'px; height: '+viewport.pHeight+'px; ">';
											
											$.li+='<div class="'+_watermark+'" style="position:relative; width:100%; height:height:100%;">';										
											$.li+='<img src="'+$.news.highdef[0]+'" class="transparent"  onerror="this.style.display=\'none\'" style="width:100%; height:100%; "  />';
											$.li+='</div>';
											
											$.li+='<div style="position:absolute; position: absolute; bottom: 0; left: 0; color:#ffffff;">';
											$.li+='<h2 style="color: #ffffff; text-shadow: '+textShadowLight+' font-size:medium;">'+$.news.headline+'</h2>';										
											$.li+='</div>';
											$.li+='</div>';
											$.li+='</li>';
											
										} else {
											
											
											
											$.li='<li class="mymetro" data-content="#news-'+$.news.id+'" style="width:100%; height:auto; background-color:#ffffff;">';
											
											$.li+='<div style="position:relative; width:'+viewport.width+'px; height: '+viewport.pHeight+'px; ">';
											
											$.li+='<div class="'+_watermark+'" style="position:relative; width:100%; height:height:100%; ">';										
											$.li+='<img src="'+$.news.highdef[0]+'" class="transparent" onerror="this.style.display=\'none\'" style="width:100%; height:100%; "  />';
											$.li+='</div>';
											
											$.li+='<div style="position:absolute; position: absolute; bottom: 0; left: 0; color:#ffffff;">';
											$.li+='<h2 style="color: #ffffff; text-shadow: '+textShadowLight+' font-size:medium;">'+$.news.headline+'</h2>';										
											$.li+='</div>';
											
											$.li+='</div>';
											$.li+='</li>';	
										}
										
										
										
										$($.category +'-news1').append($.li);	
									}																		
										
																
						
									
						    	} else if ($.category=='#baseball_nacional') {
						    		$.li='<li style="width:100%; height:auto; background-color:#ffffff;">';
									$.li+='<div content="#news-'+$.news.id+'" wrapper="news-'+$.news.id+'-wrapper" class="headline" style="display: inline; font-size: medium; font-style:oblique; font-weight: bold;">';							        				
									$.li+= $.news.headline;
									$.li+='</div>';	
									$.li+='<div style="clear: both; width:100%; height:10px;"></div>';
									$.li+='</li>';								
									$($.category +'-news1').append($.li);
						    	}
						    	
								d++;
	
								
	
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
						    				$.lii+='<h2 style="color: #ffffff; text-shadow: '+textShadowLight+' font-size: small;">'+$.news.caption[c++]+'</h2>';					    				
						    				$.lii+='</div>';
						    				$.lii+='</div>';
						    				
										});
										
										c=0;
										$.news.highdef.forEach(function(src){
											
						    				$.lii+='<div style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#000000; ">';
						    				$.lii+='<img alt="highdef" src="'+src+'" onerror="this.style.display=\'none\'" style="width:'+viewport.width+'px; height:'+viewport.pHeight+'px;  " />';
						    				$.lii+='<div style="position:absolute; bottom:0; left:0;">';					        				
						    				$.lii+='<h2 style="color: #ffffff; text-shadow: '+textShadowLight+' font-size: small;">'+$.news.caption[c++]+'</h2>';					    				
						    				$.lii+='</div>';
						    				$.lii+='</div>';
										});
										
									$.li+=$.lii;			
									$.li+='</div>';
									$.li+='</div>';
									
								        	
								if ($.total>1){
			    					$.li+='<h3 style="color: #ffffff; text-shadow: '+textShadowLight+' text-align:center">&#8249;&nbsp;&nbsp;&nbsp; <span class="position">1</span> de '+$.total+'&nbsp;&nbsp;&nbsp;&#8250;</h3>';	
			    				}							        	
		
								$.li+='<div	style="position:relative; width:100%; height:auto; ">';
								$.li+='<div><button onclick="window.plugins.socialsharing.share(\''+$.news.headline.replace(/["']/g, "")+'\',null,null,\'http://superkraken.net/fanaticos412/?test&idt=99&idn='+$.news.id+'&cn='+arrCategory[myScrollPage.currPageX].id+'\')">Share</button></div>';				
								//$.li+='<div style="width:100%; color:#000; font-size: normal; text-align:justify; ">';
								$.li+='<div style="width:98%; margin-left:1%; color:#000; font-size: normal; text-align:justify; ">';
								$.li+=$.news.datacontent;
								$.li+='</div>';	
								$.li+='</div>';	
								
								$.li+='</div>';				        																						
								$.li+='</li>';
															
								$('#datacontents').append($.li);	

						}
					}
					
					
				});

    		};//*/
    						
			$.fgetNews();
			
			
			$.parseDate = function(stringDate) {
				return ""+stringDate.substring(0,4)+" "+stringDate.substring(4,6)+" "+stringDate.substring(6,8)+
				" "+stringDate.substring(9,11)+":"+stringDate.substring(11,13)+":"+stringDate.substring(13,15);
			}
			
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
			}
			
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
				
			}


		});
    }
};
