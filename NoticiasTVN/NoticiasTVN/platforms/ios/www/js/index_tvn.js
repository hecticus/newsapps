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
var animated = false; 
var newsDatacontent;

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
			$.li+='<li><h2 class="back"><img  src="img/bullet/back.png"/><span style="vertical-align:middle; margin-left:5px;" >'+arrCategory[i].title+'</span></h2></li>';
			$.li+='<li><div class="share hidden" ><img src="img/bullet/share.png" /><div></li>';			
			$.li+='</ul>';
			$.li+='</div>';
			
			  
   
			$.li+='<div id="'+arrCategory[i].id+'" class="page" style="position:absolute; z-index:1; top:40px; bottom:0; left:0; width:100%; overflow:auto;">';
				
				$.li+='<div id="'+arrCategory[i].id+'-featured" class="featured"  style="position:absolute;  z-index: 0; background-color:#000000;"></div>';											
				$.li+='<div class="scroller">';
					$.li+='<ul>';
						$.li+='<li>';
							$.li+='<ul id="'+arrCategory[i].id+'-news-featured" class="featured">';	
								$.li+='<li id="'+arrCategory[i].id+'-news-featured-title" class="featured" ></li>';
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
 	{i:0,status:false,id:'latestnews',title:'Home',bgcolor:'#0404B4',featured:{highdef:'',headline:''},xml:'',video:false},
 	{i:1,status:false,id:'latestnews_nacionales',title:'Nacionales',bgcolor:'#FF4000',featured:{highdef:'',headline:''},video:false},
 	{i:2,status:false,id:'latestnews_internacionales',title:'Internacionales',bgcolor:'#A4A4A4',featured:{highdef:'',headline:''},video:false},
 	{i:3,status:false,id:'latestnews_tecnologia',title:'Tecnología',bgcolor:'#AEB404',featured:{highdef:'',headline:''},video:false},
 	{i:4,status:false,id:'latestnews_salud',title:'Salud',bgcolor:'#FE2E64',featured:{highdef:'',headline:''},video:false},
 	{i:5,status:false,id:'latestnews_entretenimiento',title:'Entretenimiento',bgcolor:'#0B610B',featured:{highdef:'',headline:''},video:false},
 	{i:6,status:false,id:'latestnews_deportes',title:'Deportes',bgcolor:'#0000EE',featured:{highdef:'',headline:''},video:false},
 	{i:7,status:false,id:'latestvideos',title:'Videos',bgcolor:'#AAAAAA',featured:{highdef:'',headline:''},video:true},
 	{i:8,status:false,id:'latestnews_decision2014',title:'Noticias Decision 2014',bgcolor:'#BABCEE',featured:{highdef:'',headline:''},video:false},
 	{i:9,status:false,id:'latestvideos_decision2014',title:'Videos Decision 2014',bgcolor:'#CCCCCC',featured:{highdef:'',headline:''},video:true}
 	];



function fBack() {
	
	$('#datacontent').attr('class','page transition right');		
	$('.back img').removeClass('content');	
	
	//if (animated) {
		$('.back').removeClass('animated');
		$('.back').removeClass('fadeInLeft');
	//}					
	
	$('.share').addClass('hidden');						
	$('#flag').removeClass('hidden');
	$('#datacontents').empty();			
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
    					gaPlugin.trackEvent(successGAHandler, errorGAHandler, "scroll", "swype", "section", 1);
    					gaPlugin.trackPage(successGAHandler, errorGAHandler, arrCategory[this.currPageX].id);
    					
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
					gaPlugin.trackPage(successGAHandler, errorGAHandler, arrCategory[$(this).data('position')].id);

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
    		}).on('touchend','li[data-content="headline"]', function() {				
    			if (press) {
    				
    				newsDatacontent = $(this).data('id');
    				goToNewsPage();

				}   
    		});
			
			function goToNewsPage(){
				var manager = new NewsManager();
				manager.loadNewsByIDFromBD(newsDatacontent,successGetNewsDataContentFromBD,noConnectionForNews);
				
				$('.news-datacontent').hide();	
				$('.back img').addClass('content');
				$('.back img, .share').removeClass('hidden');
				//if (animated) $('.back').addClass('animated fadeInLeft');    				
				$('.back').addClass('animated fadeInLeft');     				
				myScrollDatacontent.scrollTo(0,0,0);
							
				$($(this).data('news')).show();
									
				$('.position').html('1');
				$('#datacontent').attr('class','page transition left');
				$('#flag').addClass('hidden');
				$('.share').removeClass('hidden');  					
									
			}
    		
    		
    		
			$(document).on('touchstart','div[data-type="video"], li[data-type="video"]', function(e) {
				press=false;		
    		}).on('touchend','div[data-type="video"], li[data-type="video"]', function() {
    			if (press) {
	    			window.videoPlayer.play($(this).data('src'));
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
						/*console.log("Fails!!!");
						arrCategory[myScrollPage.currPageX] .status=false;	
						$('.status').append('<li>No hay conexión</li>');
						console.log("fGetAjaX ERROR: "+xhr.responseText+" / "+error+" / "+status);*/
						//revisamos si hay algo en la BD
						var manager = new NewsManager();
						manager.loadNewsCategoryFromBD(arrCategory[myScrollPage.currPageX].id,successGetNewsFromBD,noConnectionForNews);
					});
			};


    		//WITH JSON INSTEAD OF NEWSML
			$.fgetNews = function(c,section,color) {

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
						var manager = new NewsManager();
						json["category"] = arrCategory[myScrollPage.currPageX].id;
						manager.saveNewsFromWS(json,successSaveNews,errorNewsSave);
						$.fsetNews(itemArray, c,section,color);
					}
					
					
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
						var newsArray = new Array();
						for(var i=0;i<len;i++){
							var newsItem = results.rows.item(i);
							newsItem = decodeNews(newsItem);
							newsArray.push(newsItem);
						}
						$.fsetNews(newsArray);
						
					}else{
						noConnectionForNews();
					}
				}else{
					noConnectionForNews();
				}
			}
			
			function successGetNewsDataContentFromBD(results){
					
				if(results != null){	
					var len = results.rows.length;				
					if(len > 0){
						var newsArray = new Array();
						for(var i=0;i<len;i++){
							var newsItem = results.rows.item(i);
							newsItem = decodeNews(newsItem);
							newsArray.push(newsItem);
						}						
						$.fsetNewsDatacontents(newsArray);
					}else{
						noConnectionForNews();
					}
				}else{
					noConnectionForNews();
				}
			}
			
			function noConnectionForNews(err){
				//realmente no hay conexion y no hay nada guardado
				arrCategory[myScrollPage.currPageX].status=false;	
				$('.status').append('<li>No hay conexion</li>');
			}
		  
		  
			$.fsetNews = function(itemArray) {
				
						$.category = '#'+arrCategory[myScrollPage.currPageX].id;
														
						window['myScroll'+arrCategory[myScrollPage.currPageX].id]=newScroll(arrCategory[myScrollPage.currPageX].id);
						arrPage.push('myScroll'+arrCategory[myScrollPage.currPageX].id);

						
						
																		
						for(var i=0;i<itemArray.length; i++){
											
							
							$.news={id:itemArray[i]["id"],headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
							$.news.headline=itemArray[i]["title"];

							$.news.date=$.formatDateString(itemArray[i]["pubdate"]);
							
							var dataContent;
							dataContent = '<media media-type="image" style="leftSide"><media-reference mime-type=""/></media>';
							dataContent+=itemArray[i]["description"];
							$.news.datacontent=$('<div>').append(dataContent).remove().html();
							
							if(itemArray[i]["imagecaption"] != null){
								$.news.caption.push(itemArray[i]["imagecaption"]);
							}
																						
							$.news.thumbnail.push({src:itemArray[i]["image"],width:864,height:486});
							$.news.highdef.push({src:itemArray[i]["image"],width:864,height:486});																						
							$.news.quicklook.push({src:itemArray[i]["image"],width:864,height:486});
							
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
									$($.category+'-featured').append('<img data-src="'+$.news.highdef[0].src+'" onerror="this.style.display=\'none\'" src="'+$.news.highdef[0].src+'" class="center" style="width:auto; height:100%;"  />');
								}else{
									$($.category+'-featured').append('<img data-src="'+$.news.highdef[0].src+'" onerror="this.style.display=\'none\'" src="'+$.news.highdef[0].src+'" class="center" style="width:100%; height:auto;"  />');
								}
																
								$($.category+'-news-featured-title').data('id',$.news.id);
								$($.category+'-news-featured-title').data('news','#news-'+$.news.id);
								$($.category+'-news-featured-title').data('headline',$.news.headline);																			
								$($.category+'-news-featured-title').attr('data-content','headline');
								
								if (arrCategory[myScrollPage.currPageX].video) {
									$($.category+'-news-featured-title').attr('data-content','');
									$($.category+'-news-featured-title').attr('data-type','video');
									$($.category+'-news-featured-title').attr('data-src',$.news.video[0].src);		
								}
								
		
		
								$.li='<div style="position: relative; width:'+viewport.width+'px; height:'+(viewport.pHeight + 20)+'px;  ">';								
								$.li+='<h3 style="position: absolute; bottom: 0; left: 0; width:'+(viewport.width-10)+'px; height:auto; padding:5px; min-height:35px; background-color: rgba(0,0,0,0.5);  color: #ffffff; text-shadow: 0px 1px 5px #000; " >'+$.news.headline+'</h3>';								
								$.li+='</div>';

								$($.category+'-news-featured-title').empty();
								$($.category+'-news-featured-title').append($.li);

								if ((ImgCache.ready) && ($.news.highdef.length >= 1)) {								
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
								};

							} else if (i>0) {
							
								
								if (arrCategory[myScrollPage.currPageX].video) {	
									$.li='<li data-view="thumbnail" data-type="video"  data-src="'+$.news.video[0].src+'"  >';
								} else {
									$.li='<li data-view="thumbnail" data-content="headline" data-category="'+arrCategory[myScrollPage.currPageX].id+'" data-id="'+$.news.id+'" data-news="#news-'+$.news.id+'" data-headline="'+$.news.headline+'" >';									
								}

								if ($.news.quicklook.length >= 1) {
									$.li+='<div data-src="'+$.news.quicklook[0].src+'" class="thumbnail" style="background-image:url('+$.news.quicklook[0].src+'); background-size:cover; height:'+((viewport.height*15)/100)+'px;" >&nbsp;</div>';
								}
																
								$.li+='<div class="headline"><span class="title">'+$.news.headline+'</span><br /><span class="date">'+$.news.date+'</span></div>';
								
								$.li+='</li>';
																								
								$($.category +'-news1').append($.li);
								

								
								
								if ((ImgCache.ready) && ($.news.quicklook.length >= 1)) {									
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
								};														

					    	}; 

						};
														

    		};
    		
    		
    		
    		
			$.fsetNewsDatacontents = function(itemArray) {
				
				$.category = '#'+arrCategory[myScrollPage.currPageX].id;
					
				
				for(var i=0;i<itemArray.length; i++){
						if(itemArray[i]["id"] == newsDatacontent){

						$.news={id:itemArray[i]["id"],headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
						$.news.headline=itemArray[i]["title"];
						
						//Share button onclick
						console.log("HEADLINE "+$.news.headline);
						$('.share').attr('onclick','window.plugins.socialsharing.share(\''+$.news.headline.replace(/["']/g, "")+'\',null,null,\'http://www.tvn-2.com/noticias/noticias_detalle.asp?id='+$.news.id+'\');');

						$.news.date=$.formatDateString(itemArray[i]["pubdate"]);
														
						var dataContent;
						dataContent = '<media media-type="image" style="leftSide"><media-reference mime-type=""/></media>';
						dataContent+=itemArray[i]["description"];
						$.news.datacontent=$('<div>').append(dataContent).remove().html();
						
						if(itemArray[i]["imagecaption"] != null){
							$.news.caption.push(itemArray[i]["imagecaption"]);
						}
																					
						$.news.thumbnail.push({src:itemArray[i]["image"],width:864,height:486});
						$.news.highdef.push({src:itemArray[i]["image"],width:864,height:486});																						
						$.news.quicklook.push({src:itemArray[i]["image"],width:864,height:486});
						
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


						$.li='<li id="news-'+$.news.id+'" video="news-'+$.news.id+'-video" class="news-datacontent none" >';				        			
						

						$.total = $.news.highdef.length+$.news.video.length;				        					
						if ($.total==0) $.total=1;
							
							$.li+='<div id="hWrapper" video="news-'+$.news.id+'-video" style="position:relative; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; text-align:left;">';
							
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
									
									if ($.news.caption[c] == 'undefined') $.news.caption[c] = "";
													
									$.lii+='<div data-type="image" style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#000000; ">';						    										    			
					    			$.lii+='<figure>';						    													
									$.lii+='<img alt="highdef" src="'+src.src+'" onerror="this.style.display=\'none\'" class="center" style="width:auto; height:'+viewport.pHeight+'px; max-width:'+src.width+'px; max-height:'+src.height+'px; " />';
									$.lii+='<figcaption class="hidden" style="position: absolute; bottom: 0; left: 0; background-color: rgba(0,0,0,0.7); width:'+viewport.width+'px; min-height:35px;  color: #ffffff; text-shadow: '+textShadowLight+' font-size: 1em;" >'+$.news.caption[c]+'</figcaption>';										
									$.lii+='</figure>';						    					    											    			
					    			$.lii+='</div>';
					    			c=c+1;
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
						$.li+='<p style="text-align:right;">'+$.news.date+'</p>';
						$.li+='<h2>'+$.news.headline+'</h2>';	
						$.li+='<p>'+$.news.datacontent+'</p>';	
						$.li+='</div>';	
						        																						
						$.li+='</li>';
						
																
						$('#datacontents').append($.li);
						

						myScrollDatacontentHorizontal = new iScroll('hWrapper',0,{snap: true,momentum: false,hScrollbar: false,bounce: false,  
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
							}
						});
						
						
						}

				};									

    		};    	
    		

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


			//PUSH FUNCTIONS
		    executePushInit = function(extra_params){
				window.setTimeout(function(){
					newsDatacontent = extra_params;
					goToNewsPage();
				},200);
			}











var app = {
    initialize: function() {this.bindEvents();},
    bindEvents: function() {document.addEventListener('deviceready', this.onDeviceReady, false);},
    onDeviceReady: function() {
    	
    	if (device.version > 4.1) animated = true;
    	
   		//Google Analytics
		initGA();
		
		//Image Cache
    	ImgCache.options.debug = true;
    	ImgCache.options.localCacheFolder = 'NoticiasTVN';
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
		//window.plugins.smsPlugin.sendSMS("Prueba sms",successSaveNews, errorNewsSave);
		
		//init page
		$.fgetNews();
		
		//snap de las paginas con un threshold del 15% de la pantalla
		myScrollPage.options.snapThreshold = window.innerWidth*0.15;
    }
};
