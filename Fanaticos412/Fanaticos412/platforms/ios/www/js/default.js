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
var scrollPageDisable = false;

//INIT FUNCTIONS
//Funcion que permite rellenar el menu por codigo
function setMenuCategories(){

	$.li='';
	for(var i=0; i<arrCategory.length; i++){
			$.li+='<li data-category="'+arrCategory[i].id+'" class="menu" data-position="'+arrCategory[i].i+'" style="padding-left: 1em; background-color:#ffffff;">';			
			$.li+=arrCategory[i].title;			
			$.li+='</li>';
	}
		
	$('#mainMenuList').empty();
	$('#mainMenuList').append($.li);
		
}

//function to set the correct pages with the correct IDs and colors
function setScrollPages() {
	$('#scrollerpage').empty();
	for(var i=0; i<arrCategory.length; i++){
		
		$.li='<div class="pages"  style="position:relative; float:left; display:block; background-color:#000000;">';

			$.li+='<div data-category="'+arrCategory[i].id+'" style="position: absolute; top:0; left:0 color:#ffffff; width:100%; height:40px;">';
			
			$.li+='<ul id="header">';
			$.li+='<li><h1 class="back"><img  src="img/bullet/back.png"/><span style="vertical-align:middle; margin-left:10px;" >'+arrCategory[i].title+'</span></h1></li>';
			$.li+='<li><div class="share hidden" ><img src="img/bullet/share.png" /><div></li>';			
			$.li+='</ul>';
			$.li+='</div>';
			
			  
   
			$.li+='<div id="'+arrCategory[i].id+'" class="page" style="position:absolute; z-index:1; top:40px; bottom:0; left:0; width:100%; overflow:auto;">';
				
				$.li+='<div id="'+arrCategory[i].id+'-featured" class="featured"  style="position:absolute;  z-index: 0; background-color:#000000;"></div>';											
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
			if (this.y >= 10) {
				myScrollPage.disable();
				scrollPageDisable = true;	
			}	
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
		},onScrollEnd : function(e){
			
			if (scrollPageDisable) {
				myScrollPage.scrollToPage(myScrollPage.currPageX, 0, 0);
				scrollPageDisable = false;
			}
			
 			myScrollPage.enable();
 			
 			 			
		},onScroll: function(e){
			$('#'+scroll+'-featured').height((this.y>=0) ? viewport.pHeight+this.y : viewport.pHeight);
			$('#'+scroll+'-featured').width((this.y>=0) ? viewport.width+(this.y*2) : viewport.width);
			$('#'+scroll+'-featured').css('left',(this.y<=0) ? 0 : -this.y);
		}
		
	});
}

var slidesPages=['pCenter','pRight','pLeft'];


var arrCategory=[
	{i:0,status:false,id:'All',title:'Home',bgcolor:'#b6110d',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:1,status:false,id:'football',title:'Futbol',bgcolor:'#067816',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:2,status:false,id:'baseball_nacional',title:'LVBP',bgcolor:'#0720de',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:3,status:false,id:'baseball',title:'Beisbol Int.',bgcolor:'#01aab1',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:4,status:false,id:'basket',title:'Baloncesto',bgcolor:'#ff6000',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:5,status:false,id:'tennis',title:'Tenis',bgcolor:'#de7f07',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:6,status:false,id:'f1',title:'F1',bgcolor:'#b52f00',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:7,status:false,id:'cycling',title:'Ciclismo',bgcolor:'#b7c238',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:8,status:false,id:'athletics',title:'Atletismo',bgcolor:'#0a67be',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:9,status:false,id:'golf',title:'Golf',bgcolor:'#ffc936',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:10,status:false,id:'olympics',title:'Olimpiadas',bgcolor:'#5bb618',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0},
	{i:11,status:false,id:'Other',title:'Más Deportes',bgcolor:'#bdfd8e',featured:{highdef:'',headline:''},xml:'',news:'',view:0,mode:0}
];


function fBack() {
	$('#datacontent').attr('class','page transition right');	
	$('.back img').removeClass('content');	
	$('.back').removeClass('fadeInLeft');
	$('.back').removeClass('animated');					
	$('.share').addClass('hidden');						
	$('#flag').removeClass('hidden');			
}
	
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

var hScrollMove = false;


var app = {
    initialize: function() {this.bindEvents();},
    bindEvents: function() {document.addEventListener('deviceready', this.onDeviceReady, false);},
    onDeviceReady: function() {
    	
   		//Google Analytics
		initGA();
		
		//Image Cache
    	ImgCache.options.debug = true;
    	ImgCache.options.localCacheFolder = 'Fanaticos412';
      	ImgCache.options.usePersistentCache = true;       	        	    	
		ImgCache.init();  	    	

    	document.addEventListener('backbutton', function checkConnection() {

    		$(function() {    			  
    			if(!$('#top').hasClass('closed')){
    				$('#top').addClass('closed');
				}else if ($('#datacontent').hasClass('left')){
					$('#datacontent').attr('class','page transition right');														
				}else {
					if(myScrollPage.currPageX == 0){
						
						if (navigator.app) {
							gaPlugin.exit(successGAHandler, successGAHandler);						
				            navigator.app.exitApp();				            
				        } else if (navigator.device) {
				        	gaPlugin.exit(successGAHandler, successGAHandler);				        	
				            navigator.device.exitApp();				            				          
				        }

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
				
				fBack();

			});
    	}, false);
    	
 		document.addEventListener("online", onOnline, false);				
    	document.addEventListener('touchmove', function (e) {e.preventDefault();}, false);    	
    	document.body.addEventListener('touchmove', function(event) {event.preventDefault();}, false);    	 
        app.receivedEvent('deviceready');
        initialSetup();
        
        function onOnline() {ImgCache.clearCache();}
 
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		//init push data
		initPush();
		
		//Manejador de BD
		storageManager = new StorageManager();
		
		
    	
    	//INIT SPECIAL DATA
		setScrollPages();
		setMenuCategories();

    	myScrollMenu = new iScroll('menu',0,{hScrollbar: false,vScrollbar: true, hScroll: false, vScroll: true,
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
		


			$('body').width(viewport.width);
			$('body').height(viewport.height);
					


			
		 	$('#scrollerpage').width(viewport.width*arrCategory.length);
			$('#scrollerpage').height(viewport.height);					
			
		 	$('.pages').width(viewport.width);
			$('.pages').height(viewport.height);

			$('.featured').width('100%');
			$('.featured').height(viewport.pHeight);
	 		 
		 
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
												
						gaPlugin.setVariable(successGAHandler, errorGAHandler, 1, arrCategory[this.currPageX].id);
    					gaPlugin.trackEvent(successGAHandler, errorGAHandler, "Scroll", "swiped", "section", 1);
    				
					}
					
					this.lastPageX=this.currPageX;
								
					
				}
			});



			$(document).on('touchstart','.back', function() { 
				fBack();
			});

			
			$(document).on('touchstart','#flag', function() {
				myScrollMenu.scrollTo(0,0,0);							
				if ($('#top').hasClass('closed')) {
					$('#screen-block').removeClass('hidden');
					$('#top').removeClass('closed');
				} else {
					$('#screen-block').addClass('hidden');					
					$('#top').addClass('closed');
				} 															
			});
			

			$(document).on('touchstart','.menu', function() {
				press=false;
			}).on('touchend','.menu', function() {
    			if (press) {
    				
    				gaPlugin.setVariable(successGAHandler, errorGAHandler, 1, arrCategory[$(this).data('position')].id);
    				gaPlugin.trackEvent(successGAHandler, errorGAHandler, "menu", "touch", "section", 1);

    				$('#screen-block').addClass('hidden');
	    			myScrollPage.scrollToPage($(this).data('position'), 0, 0);	    			 	
					$('#datacontent').attr('class','page right');
					$('#top').addClass('closed');
					if (typeof myScrollDatacontentHorizontal != 'undefined') {
						myScrollDatacontentHorizontal = null;
					}

    			}   								
    		});

     			
			$(document).on('touchstart','li[data-content="headline"]', function(e) {
				
				press=false;
				
				
				if ($(this).attr('wrapper')) {
					myScrollDatacontentHorizontal = new iScroll($(this).attr('wrapper'),0,{snap: true,momentum: false,hScrollbar: false,bounce: false,  
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
    		}).on('touchend','li[data-content="headline"]', function() {
    	
				
    			if (press) {
    				
    				myScrollDatacontent.scrollTo(0,0,0);
    				$('.news-datacontent').hide();	
    				$('.back img').addClass('content');
    				$('.back img, .share').removeClass('hidden');
    				$('.back').addClass('animated fadeInLeft');
				
					$($(this).data('news')).show();
										
					$('.position').html('1');
					$('#datacontent').attr('class','page transition left');
					$('#flag').addClass('hidden');

    				$('.share').removeClass('hidden');  
    				$('.share').attr('onclick','window.plugins.socialsharing.share(\''+$(this).data('headline').replace(/["']/g, "")+'\',null,null,\'http://superkraken.net/fanaticos412/?test&idt=99&idn='+$(this).data('id')+'&cn='+arrCategory[myScrollPage.currPageX].id+'\')');					
							
					
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
				
				return url.replace('//../','/');
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
						/*arrCategory[myScrollPage.currPageX] .status=false;
						$('.status').append('<li>No hay conexión</li>');
						console.log("fGetAjaX ERROR: "+xhr.responseText+" / "+error+" / "+status);*/
						var manager = new NewsManager();
						manager.loadNewsCategoryFromBD(arrCategory[myScrollPage.currPageX].id,successGetNewsFromBD,noConnectionForNews);
					});
			};

			

			//WITH PHP INSTEAD OF NEWSML
			$.fgetNews = function() {
				myXml=$.fGetAjaX('http://02.kraken.hecticus.com/storefront/render/news.php?category='+arrCategory[myScrollPage.currPageX].id,'xml');
		  
				myXml.done(function(xml) {
						var manager = new NewsManager();
						$(xml).find('newsML>category').each(function(i){
							var json = {};
							json["category"] = arrCategory[myScrollPage.currPageX].id;

							json["data"] = $(this);

							manager.saveNewsFromWS(json,successSaveNews,errorNewsSave);
						});
						$.fsetNews(xml);
				});
			};
		  
		  	function successSaveNews(){
		  		console.log("SAVE COMPLETE");
		 	}
		 	function errorNewsSave(err){
				console.log("SAVE FAILS");
			}
			function successGetNewsFromBD(results){
				printToLog("successGetNewsFromBD");
				if(results != null){
					var len = results.rows.length;
					printToLog("RESULT len: "+len);
					if(len > 0){
						//var newsArray = new Array();
						//var xml = $('<newsML><variable name="limit"/><category name="'+arrCategory[myScrollPage.currPageX].id+'"> </category></newsML>');
						var xmlstring = '<newsML><variable name="limit"/><category name="'+arrCategory[myScrollPage.currPageX].id+'">';

						for(var i=0;i<len;i++){
							var newsItem = results.rows.item(i);
							newsItem = decodeNews(newsItem);
							//en vez de agregarlos a un arreglo los agregamos al xml
							xmlstring = xmlstring+""+newsItem;
						}
						var xml = parseXml(''+xmlstring+'</category></newsML>');
						$.fsetNews(xml);
						
					}else{
						noConnectionForNews();
					}
				}else{
					noConnectionForNews();
				}
			}
			function noConnectionForNews(err){
				//realmente no hay conexion y no hay nada guardado
				arrCategory[myScrollPage.currPageX] .status=false;	
				$('.status').append('<li>No hay conexión</li>');
			}
		  
		  
			$.fsetNews = function(xml) {
				var d=0;
				$.lil='';
				
					$(xml).find('newsML>category').each(function(i){
						
						$.category = '#'+$(this).attr('name');
														
						window['myScroll'+$(this).attr('name')]=newScroll($(this).attr('name'));
						arrPage.push('myScroll'+$(this).attr('name'));

						

																		
						$(this).find('news').each(function(i){
											
							
							$.news={id:$(this).attr('duid'),headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
							$.news.headline=$(this).find('headline').text();

							var myDate = $(this).find('DateAndTime').text();
							var arrayDate = $.parseDate(myDate);
							$.news.date=new Date(arrayDate[0],(arrayDate[1]-1),arrayDate[2],arrayDate[3],arrayDate[4],arrayDate[5],0);
							
							
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
								$.news.thumbnail.push({src:''});
								$.news.quicklook.push({src:''});							
								$.news.highdef.push({src:'img/lvbp.jpg'});
							}

										
							if (i==0) {

								//$($.category+'-featured').append('<img data-src="'+$.news.highdef[0].src+'"   src="'+$.news.highdef[0].src+'" class="center" style="width:100%; height:100%; max-width:'+$.news.highdef[0].width+'px; max-height:'+$.news.highdef[0].height+'px; "  />');
								var width = window.innerWidth;
								var height = window.innerHeight;
								var screenwidth = window.innerWidth;
								var screenheight = window.innerHeight;

								var realY = screenheight*0.40;//40% del css ?? este numero hay que revisarlo, funciona ahora
								var realX = screenwidth;
								var screenAspect = realX/realY;
								var imageDiff = (realX/$.news.highdef[0].width);
								var realImageX = $.news.highdef[0].width*imageDiff;
								var realImageY = $.news.highdef[0].height*imageDiff;
								var imageAspect = realImageX/realImageY;
								
								if(realImageY < realY){
									$($.category+'-featured').append('<img data-src="'+$.news.highdef[0].src+'"   src="'+$.news.highdef[0].src+'" class="center" style="width:auto; height:100%;"  />');
								}else{
									$($.category+'-featured').append('<img data-src="'+$.news.highdef[0].src+'"   src="'+$.news.highdef[0].src+'" class="center" style="width:100%; height:auto;"  />');
								}
								
								
								$($.category+'-news-featured-title').data('id',$.news.id);
								$($.category+'-news-featured-title').data('news','#news-'+$.news.id);
								$($.category+'-news-featured-title').data('headline',$.news.headline);																			
								$($.category+'-news-featured-title').data('content','#news-'+$.news.id);
								$($.category+'-news-featured-title').attr('wrapper','news-'+$.news.id+'-wrapper');
								
		
								$.li='<div style="position: relative; width:'+viewport.width+'px; height:'+(viewport.pHeight + 20)+'px;  ">';								
								$.li+='<h3 style="position: absolute; bottom: 0; left: 0; width:'+(viewport.width-10)+'px; height:auto; padding:5px; min-height:35px; background-color: rgba(0,0,0,0.5);  color: #ffffff; text-shadow: 0px 1px 5px #000; " >'+$.news.headline+'</h3>';								
								$.li+='</div>';

								$($.category+'-news-featured-title').empty();
								$($.category+'-news-featured-title').append($.li);

								if (ImgCache.ready) {								
									$('img[src="'+$.news.highdef[0].src+'"]').each(function() {                                	
	                                	var target = $(this);
										ImgCache.isCached(target.attr('src'), function(path, success){
											if(success){											
											    ImgCache.useCachedFile(target);
											} else {
												ImgCache.cacheFile(target.attr('src'), function(){
													ImgCache.useOnlineFile(target);
											    });
											}
										});                                	
	                        		});
								}

							} else if (i>0) {
							
								$.li='<li data-view="thumbnail" data-content="headline" data-category="'+arrCategory[myScrollPage.currPageX].id+'" data-news="#news-'+$.news.id+'" data-headline="'+$.news.headline+'" wrapper="news-'+$.news.id+'-wrapper" >';
								$.li+='<div data-src="'+$.news.quicklook[0].src+'" class="thumbnail" style="background-image:url('+$.news.quicklook[0].src+'); background-size:cover; height:'+((viewport.height*15)/100)+'px;" >&nbsp;</div>';
								$.li+='<div class="headline"><span class="title">'+$.news.headline+'</span><br /><span class="date">'+$.formatDate($.news.date)+'</span></div>';	
								$.li+='</li>';
																								
								$($.category +'-news1').append($.li);

								if (ImgCache.ready) {
									$('div[data-src="'+$.news.quicklook[0].src+'"]').each(function() {                                	
	                                	var target = $(this);
										ImgCache.isCached(target.data('src'), function(path, success){
											if(success){											
											    ImgCache.useCachedBackground(target);
											} else {
												ImgCache.cacheBackground(target, function(){
													ImgCache.useOnlineFile(target);
											    });
											}
										});                                	
	                        		});	
								}
								
								
																
					    	} 
					    	
					    	if ($("#news-"+$.news.id).length == 0) {
					    	
  								$.li='<li id="news-'+$.news.id+'" video="news-'+$.news.id+'-video" class="news-datacontent" style="display:none; background-color:#ffffff;">';				        			
								

								$.total = $.news.highdef.length+$.news.video.length;				        					
								if ($.total==0) $.total=1;
									
									$.li+='<div id="news-'+$.news.id+'-wrapper" video="news-'+$.news.id+'-video" style="position:relative; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; text-align:left;">';
									
									$.li+='<div video="news-'+$.news.id+'-video" style="float:left; width:'+(viewport.width*$.total)+'px; height:'+viewport.pHeight+'px; ">';
									$.lii='';
									

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
											$.lii+='<figcaption class="hidden" style="position: absolute; bottom: 0; left: 0; background-color: rgba(0,0,0,0.7); width:'+viewport.width+'px; min-height:35px;  color: #ffffff; text-shadow: '+textShadowLight+' font-size: 1em;" >'+$.news.caption[c++]+'</figcaption>';										
											$.lii+='</figure>';						    					    											    			
							    			$.lii+='</div>';
										});
										
									$.li+=$.lii;
												
									$.li+='</div>';
	
									$.li+='</div>';
								
									if ($.total>1){
										$.li+='<div style="position: relative; bottom: 0px; left: 0; color: #ffffff; text-shadow: '+textShadowLight+' background-color: rgba(92,90,91,0.4); width:100%; height:auto; padding:10px 0; line-height:100%; text-align:center; font-size:1.2em; font-weight:bold; ">';
										$.li+='&#8249;&nbsp;&nbsp;&nbsp; <span class="position">1</span> de '+$.total+'&nbsp;&nbsp;&nbsp;&#8250;';
										$.li+='</div>';
									}
								


								$.li+='<div	style="margin:0 10px;">';
								$.li+='<p style="text-align:right;">'+$.formatDate($.news.date)+'</p>';
								$.li+='<h2>'+$.news.headline+'</h2>';	
								$.li+='<p>'+$.news.datacontent+'</p>';	
								$.li+='</div>';	
								        																						
								$.li+='</li>';
															
								$('#datacontents').append($.li);
												
							} 
					    	

					    	

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
				return array;
			};
			
			$.formatDate = function(d) {
				var dd = d.getDate();
				if ( dd < 10 ) dd = '0' + dd;

				var MM = d.getMonth();
				
				var hh = d.getHours();
				var meridian = "a.m.";
				
				if ( hh > 12 ){
					hh = hh-12;
					meridian = "p.m.";
				}
				
				var mm = d.getMinutes();
				if ( mm < 10 ) mm = '0' + mm;
				
				var months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];				
				return hh+':'+mm+' '+meridian+', '+months[MM]+', '+dd;
			};
						

    }
};
