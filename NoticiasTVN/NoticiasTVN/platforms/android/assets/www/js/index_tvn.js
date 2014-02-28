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
	for(var i=0; i<(arrCategory.length-1); i++){
		
		$.li='<div class="pages"  style="position:relative; float:left; display:block; background-color:#000000;">';

			$.li+='<div data-category="'+arrCategory[i].id+'" style="position: absolute; top:0; left:0 color:#ffffff; width:100%; height:40px;">';
			
			$.li+='<ul id="header">';
			$.li+='<li><h3 class="back"><img  src="img/bullet/back.png"/><span style="vertical-align:middle; margin-left:5px;" >'+arrCategory[i].title+'</span></h3></li>';
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
 	{i:9,status:false,id:'latestvideos_decision2014',title:'Videos Decision 2014',bgcolor:'#CCCCCC',featured:{highdef:'',headline:''},video:true},
 	{i:10,status:false,id:'live_tv',title:'Se&ntilde;al en vivo',bgcolor:'#0404B4',featured:{highdef:'',headline:''},video:true}
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
					


			
		 	$('#scrollerpage').width(viewport.width*(arrCategory.length-1));
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
						if ((upcomingnext)<(arrCategory.length-1)) $('#'+arrCategory[upcomingnext].id).addClass('hidden');
						
						upcomingback = parseInt(this.currPageX-1);									
						upcomingnext = parseInt(this.currPageX+1);
												
						if ((upcomingback)>0) $('#'+arrCategory[upcomingback].id).removeClass('hidden');													
						if ((upcomingnext)<(arrCategory.length-1)) $('#'+arrCategory[upcomingnext].id).removeClass('hidden');		
																															
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
    				
    				if (arrCategory[$(this).data('position')].id == 'live_tv') {    					    					
    					window.videoPlayer.play('rtsp://streaming.tmira.com:1935/tvn/tvn.stream');
    				} else {
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
						arrCategory[myScrollPage.currPageX].status=true;
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
						//noConnectionForNews();
						fBack();
					}
				}else{
					//noConnectionForNews();
					fBack();
				}
			}
			
			function noConnectionForNews(err){
				//realmente no hay conexion y no hay nada guardado
				arrCategory[myScrollPage.currPageX].status=false;	
				$('.status').append('<li>No hay conexion</li>');
			}
		  
		  
			$.fsetNews = function(itemArray) {
						isLoaded = true;
				
						$.category = '#'+arrCategory[myScrollPage.currPageX].id;
						
						$($.category +'-news1').empty();	
						$($.category+'-news-featured-title').empty();
						
						
												
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

								
								$($.category+'-news-featured-title').append($.li);

								if ((ImgCache.ready) && ($.news.highdef.length >= 1)) {								
									$('img[src="'+$.news.highdef[0].src+'"]').each(function() {                                	
	                                	var target = $(this);
										ImgCache.isCached(target.attr('src'), function(path, success){
											if(success){
												if(isOffline()){
													ImgCache.useCachedFile(target);
												}
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
												if(isOffline()){
													ImgCache.useCachedBackground(target);
												}
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
		    	pushInterval = window.setInterval(function(){
					if(isLoaded){
						newsDatacontent = extra_params;
						goToNewsPage();
						isCommingFromPush = true;
						stopPushInterval();
					}
					
				},500);
			};
			
			function stopPushInterval(){
				clearInterval(pushInterval);
			}
			var isCommingFromPush;
			var isLoaded;
			var pushInterval;



	   setTimeout(function () {
			press=true;						
		}, 2);	

		setInterval(function(){			
			clearPageStatus();			 		
		}, 300000);


function clearPageStatus(){
	$.each(arrCategory, function(key,value) {
		arrCategory[key].status = false;	  
	});
}

function reloadApp(){
	clearPageStatus();
	$.fgetNews();
}

//funciones que traen las categorias y los trending topics
function getCategoriesFromWS(){
	
}

function loadCategoriesFromBD(){
	var manager = new CategoryManager();
	json["category"] = arrCategory[myScrollPage.currPageX].id;
	manager.saveNewsFromWS(json,successSaveNews,errorNewsSave);
}

//Obtiene todas las noticias trending de la categoria actual
function getTrendingNewsByCategory(category){
	var result = [];
	for(var i=0;i<arrTrendingTopics.length;i++){
		if(arrTrendingTopics[i].categoria == category){
			result.push(arrTrendingTopics[i]);
		}
	}
	return result;
}

//end de funciones de inicializacion de categorias y trendings

//Vars de trending

var arrTrendingTopics=[
              	{
				categoria: "17",
				titulo: "Crisis en Venezuela",
				imagen: "http://imagenes.tvn-2.com/noticias_img/131650.jpg"
				},
				{
				categoria: "35",
				titulo: "Renuncia Marta de Martinelli ",
				imagen: "http://imagenes.tvn-2.com/noticias_img/132249.jpg"
				},
				{
				categoria: "33",
				titulo: "TE cuestionado",
				imagen: "http://imagenes.tvn-2.com/noticias_img/132173.jpg"
				},
				{
				categoria: "34",
				titulo: "TVN/Dichter&Neira",
				imagen: "http://imagenes.tvn-2.com/noticias_img/132248.jpg"
				}
];

var arrTrendingNews=[
{
	id: "305",
	categoria: "33",
	idnews: "132318",
	titulo: "Tribunal Electoral rechaza dudas de Martinelli",
	descripcion: "El Tribunal Electoral aclaró, mediante un comunicado, que ni Cenaturi ni ninguna empresa nacional o extranjera ni intermediario alguno se involucra en la transmisión de los resultados de cada mesa de ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132318.jpg"
	},
	{
	id: "303",
	categoria: "35",
	idnews: "132282",
	titulo: "Linares de Martinelli pide al TE ser imparcial",
	descripcion: "La candidata a vicepresidenta por el oficialista Cambio Democrático y esposa del presidente Ricardo Martinelli, Marta Linares de Martinelli, afirmó hoy en Noticias AM que ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132282.jpg"
	},
	{
	id: "304",
	categoria: "35",
	idnews: "132276",
	titulo: "Martinelli critica indirectamente a candidatos Solís y Varela",
	descripcion: "El presidente Ricardo Martinelli afirmó que su esposa, Marta Linares de Martinelli, candidata a la Vicepresidencia de la República por Cambio Democrático, se separó del Despacho de la Primera Dama, pe",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132276.jpg"
	},
	{
	id: "306",
	categoria: "31",
	idnews: "132269",
	titulo: " Chapo Guzmán intenta bloquear posible extradición a EEUU",
	descripcion: "El narco mexicano Joaquín ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132269.jpg"
	},
	{
	id: "299",
	categoria: "34",
	idnews: "132252",
	titulo: "Fábrega lidera encuesta por Alcaldía de Panamá",
	descripcion: "La encuesta semanal de TVN y Dichter & Neira registró un cambio en las preferencias de los electores para ser el próximo alcalde de la ciudad de Panamá, aunque igualmente persiste una diferencia mínim",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132252.jpg"
	},
	{
	id: "300",
	categoria: "34",
	idnews: "132251",
	titulo: "Designación de la primera dama no benefició a CD",
	descripcion: "Luego de publicados los resultados de la encuesta Dichter & Neira, el analista político Ebrahim Asvat, afirmó que la decisión de nombrar a la primera dama Marta de Martinelli como candidata a la vice",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132251.jpg"
	},
	{
	id: "302",
	categoria: "35",
	idnews: "132251",
	titulo: "Designación de la primera dama no benefició a CD",
	descripcion: "Luego de publicados los resultados de la encuesta Dichter & Neira, el analista político Ebrahim Asvat, afirmó que la decisión de nombrar a la primera dama Marta de Martinelli como candidata a la vice",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132251.jpg"
	},
	{
	id: "301",
	categoria: "35",
	idnews: "132249",
	titulo: "Primera Dama se separa del despacho para hacer campaña",
	descripcion: "La primera dama de la República, Marta Linares de Martinelli, anunció que se separará del despacho que dirige a fin de participar de lleno en la campaña política, como compañera de fórmula del candida",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132249.jpg"
	},
	{
	id: "297",
	categoria: "34",
	idnews: "132248",
	titulo: "Arias baja tres puntos, se recorta la diferencia con Navarro",
	descripcion: "El candidato por el Partido Revolucionario Democrático, Juan Carlos Navarro, recortó 3 puntos en la carrera presidencial de Panamá, según refleja los datos de la encuesta TVN y Dichter & Neira, public",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132248.jpg"
	},
	{
	id: "298",
	categoria: "26",
	idnews: "132248",
	titulo: "Arias baja tres puntos, se recorta la diferencia con Navarro",
	descripcion: "El candidato por el Partido Revolucionario Democrático, Juan Carlos Navarro, recortó 3 puntos en la carrera presidencial de Panamá, según refleja los datos de la encuesta TVN y Dichter & Neira, public",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132248.jpg"
	},
	{
	id: "296",
	categoria: "33",
	idnews: "132247",
	titulo: "Desmeritan denuncia contra magistrados ante Pacto Ético",
	descripcion: "Una denuncia interpuesta ante los promotores del Pacto Ético Electoral, la Comisión de Justicia y Paz, contra el magistrado presidente del Tribunal Electoral (TE), Erasmo Pinilla, y el también magistr",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132247.jpg"
	},
	{
	id: "307",
	categoria: "31",
	idnews: "132211",
	titulo: "Escuchas y colaboradores llevaron hacia ",
	descripcion: "Mientras las fuerzas militares mexicanas se abrían paso por el principal escondite de Joaquín ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132211.jpg"
	},
	{
	id: "293",
	categoria: "33",
	idnews: "132175",
	titulo: "Ana Gómez ratificó confianza en el Tribunal Electoral",
	descripcion: "La exprocuradora de la Nación, Ana Matilde Gómez, ratificó hoy su “confianza plena” con el Tribunal Electoral de Panamá, luego del polémico comunicado emitido por el Secretario de Comunicación de Camb",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132175.jpg"
	},
	{
	id: "294",
	categoria: "33",
	idnews: "132173",
	titulo: "Martinelli pone en duda contrato de informática en el TE",
	descripcion: "El presidente Ricardo Martinelli evitó comentar el comunicado emitido ayer por el vocero de comunicación del oficialista partido Cambio Democrático, Luis Eduardo Camacho, quien expresó sus dudas sobre",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132173.jpg"
	},
	{
	id: "295",
	categoria: "33",
	idnews: "132139",
	titulo: "Camacho pone en duda imparcialidad del TE ",
	descripcion: "El secretario de comunicación del oficialista partido Cambio Democrático, Luis Eduardo Camacho, instó este domingo a los miembros del partido a cuidar el voto en las elecciones de mayo próximo, al in",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132139.jpg"
	},
	{
	id: "269",
	categoria: "31",
	idnews: "132098",
	titulo: "Legislador de EEUU pide extradición de ",
	descripcion: "Un líder clave de la Cámara de Representantes estadounidense exhortó el domingo a las autoridades mexicanas a extraditar a Estados Unidos a Joaquín ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132098.jpg"
	},
	{
	id: "271",
	categoria: "32",
	idnews: "132094",
	titulo: "Tymoshenko dice que no quiere ser primera ministra de Ucrania",
	descripcion: "La líder de la oposición en Ucrania, Yulia Tymoshenko, liberada el sábado tras la huída de su eterno rival, el presidente Viktor Yanukovich, dijo el domingo que no quería ser considerada para el puest",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132094.jpg"
	},
	{
	id: "272",
	categoria: "32",
	idnews: "132092",
	titulo: "EEUU: Ejército ruso en Ucrania sería un error ",
	descripcion: "La asesora de Seguridad Nacional del presidente Barack Obama opinó el domingo que sería un ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132092.jpg"
	},
	{
	id: "273",
	categoria: "32",
	idnews: "132090",
	titulo: "Canciller panameño espera que Ucrania defina su futuro en paz",
	descripcion: "El canciller panameño, Francisco Álvarez de Soto expresó este domingo en su cuenta de Twitter que ante los acontecimientos que reportan los medios sobre Ucrania, “esperamos que ese país defina su fut",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132090.jpg"
	},
	{
	id: "274",
	categoria: "32",
	idnews: "132089",
	titulo: "Los nuevos gobernantes de Ucrania desmantelan poder de Yanukovich",
	descripcion: "Los nuevos gobernantes de Ucrania, apenas 24 horas después de derrocar al presidente Viktor Yanukovich, comenzaron a desmantelar con rapidez su estructura de poder, designando a un líder provisional y",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132089.jpg"
	},
	{
	id: "275",
	categoria: "32",
	idnews: "132087",
	titulo: "Crisis en Ucrania por falla democrática: Gorbachev ",
	descripcion: "La actual crisis política en Ucrania se debió al fracaso del gobierno para actuar democráticamente, afirmó el ex gobernante soviético Mijaíl Gorbachev.El premio Nobel de la Paz aseveró lo anterior",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132087.jpg"
	},
	{
	id: "270",
	categoria: "31",
	idnews: "132029",
	titulo: "El Chapo, enemigo número uno de Chicago",
	descripcion: "La Comisión del Crimen de Chicago nombró Joaquín ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132029.jpg"
	},
	{
	id: "308",
	categoria: "31",
	idnews: "132017",
	titulo: "",
	descripcion: "Joaquín ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132017.jpg"
	},
	{
	id: "309",
	categoria: "31",
	idnews: "132015",
	titulo: "Funcionario EEUU: El ",
	descripcion: "El capo del Cártel de Sinaloa del narcotráfico mexicano Joaquín ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132015.jpg"
	},
	{
	id: "276",
	categoria: "32",
	idnews: "132013",
	titulo: "El régimen de Ucrania cede ante la oposición",
	descripcion: "El parlamento ucraniano aprobó el “acuerdo para resolver la crisis política”, un documento forjado en arduas conversaciones entre el presidente Víctor Yanukóvich y los líderes de la oposición parlamen",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132013.jpg"
	},
	{
	id: "277",
	categoria: "32",
	idnews: "132010",
	titulo: "Ucraniana dio positivo en dopaje en esquí de fondo",
	descripcion: "SOCHI, Rusia (AP) -- La esquiadora de fondo ucraniana Marina Lisogor dio positivo en un control antidopaje, el tercer caso que se detecta en los Juegos de Sochi.El Comité Olímpico de Ucrania infor",
	imagen: "http://imagenes.tvn-2.com/noticias_img/132010.jpg"
	},
	{
	id: "266",
	categoria: "30",
	idnews: "131930",
	titulo: "Tránsito establecerá 60 puntos de control para inicio de clases",
	descripcion: "La Autoridad de Tránsito y Transporte Terrestre en conjunto con la Policía Nacional coordina un operativo para el próximo lunes 24 de febrero, cuando se espera un mayor movimiento vehicular con motivo",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131930.jpg"
	},
	{
	id: "263",
	categoria: "5",
	idnews: "131918",
	titulo: "Pérdidas por atrasos serían de $280 millones: Quijano",
	descripcion: "El administrador de la Autoridad del Canal de Panamá, Jorge Quijano, manifestó este viernes ante el Consejo de la Concertación Nacional que las pérdidas por los retrasos en la ampliación de la vía int",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131918.jpg"
	},
	{
	id: "264",
	categoria: "5",
	idnews: "131915",
	titulo: "García: Gobierno español dio garantías para continuar ampliación",
	descripcion: "Olmedo García, del Instituto del Canal de Panamá de la Universidad de Panamá, consideró hoy en Noticias AM que se ha hecho un paso significativo con el acuerdo parcial alcanzado por la Autoridad del",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131915.jpg"
	},
	{
	id: "278",
	categoria: "32",
	idnews: "131910",
	titulo: "Presidente de Ucrania anuncia elecciones anticipadas ",
	descripcion: "Los líderes de la oposición de Ucrania firmaron el viernes un acuerdo con el presidente y mediadores europeos para que se realicen elecciones anticipadas y de forme un nuevo gobierno con la esperanza ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131910.jpg"
	},
	{
	id: "244",
	categoria: "30",
	idnews: "131900",
	titulo: "Docentes del Louis Martinz decidirán acciones con padres",
	descripcion: "Los educadores del Instituto Profesional y Técnico Louis Martinz, en Samaria, corregimiento Belisario Porras, del distrito de San Miguelito, recibirán el lunes a los estudiantes pero se reunirán con l",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131900.jpg"
	},
	{
	id: "245",
	categoria: "30",
	idnews: "131898",
	titulo: "UMALI exige al Meduca respetar mesa del diálogo",
	descripcion: "Humberto Montero, dirigente de la Unidad Magisterial Libre, solicitó hoy al Ministerio de Educación, respetar la mesa del diálogo, donde esperan que el Meduca presente formalmente su propuesta de aum",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131898.jpg"
	},
	{
	id: "243",
	categoria: "28",
	idnews: "131881",
	titulo: "No hay racionamiento, pero embalses van rumbo al mínimo",
	descripcion: "Pese a que los embalses están peligrosamente cerca de sus niveles mínimos, no han sido anunciadas medidas de racionamiento, como aquellas que se dieron durante la crisis energética del año 2013.Se",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131881.jpg"
	},
	{
	id: "265",
	categoria: "5",
	idnews: "131876",
	titulo: "Quijano: Trabajos de ampliación se reanudaron",
	descripcion: "A eso de las 4 de la tarde de hoy se reanudaron los trabajos de ampliación del Canal de Panamá tanto en la vertiente Pacífico, como la del Atlántico, así lo informó esta tarde el administrador de la A",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131876.jpg"
	},
	{
	id: "242",
	categoria: "5",
	idnews: "131832",
	titulo: "Nulo inicio de trabajos de ampliación",
	descripcion: "Los trabajos de ampliación del Canal, al menos en el área de Cocolí, no iniciaron como se pensó.Los trabajadores comenzaron a llegar desde temprano, pero eran devueltos en los mismos buses de Grup",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131832.jpg"
	},
	{
	id: "279",
	categoria: "32",
	idnews: "131828",
	titulo: "Ucrania: Mueren 70 por nuevos enfrentamientos ",
	descripcion: "Por lo menos 70 personas murieron el jueves en la convulsionada capital de Ucrania cuando los manifestantes de oposición avanzaron sobre la policía arrojando bombas incendiarias y francotiradores del ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131828.jpg"
	},
	{
	id: "239",
	categoria: "17",
	idnews: "131816",
	titulo: "Martinelli pide llamar a Embajador de Panamá en Venezuela",
	descripcion: "El presidente Ricardo Martinelli avisó en su cuenta de Twitter que ha instruido al canciller Francisco Álvarez De Soto llamar al embajador de Panamá en Venezuela, Pedro Pereira, a consultas.El go",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131816.jpg"
	},
	{
	id: "240",
	categoria: "17",
	idnews: "131813",
	titulo: "Venezuela llama a consultas a su embajadora en Panamá",
	descripcion: "La Cancillería de Venezuela informó que la embajadora venezolana en Panamá, Elena Salcedo, será llamada a consultas por declaraciones del Ministerio de Relaciones Exteriores de Panamá sobre la situaci",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131813.jpg"
	},
	{
	id: "241",
	categoria: "17",
	idnews: "131809",
	titulo: "Venezolanos realizan vigilia en David, Chiriquí",
	descripcion: "Un grupo de ciudadanos venezolanos realizó esta mañana una vigilia y luego caminó por los alrededores del parque Cervantes de David, provincia de Chiriquí, en protesta por la represión de las manifes",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131809.jpg"
	},
	{
	id: "235",
	categoria: "29",
	idnews: "131798",
	titulo: "Facebook comprará el servicio de WhatsApp por 19 mil millones",
	descripcion: "Facebook Inc comprará a la firma de mensajería de móviles WhatsApp por 19 mil millones de dólares en efectivo y acciones en un acuerdo histórico que acerca a la mayor red social del mundo al corazón d",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131798.jpg"
	},
	{
	id: "236",
	categoria: "5",
	idnews: "131795",
	titulo: "Trabajadores de GUPC regresan a su área de trabajo",
	descripcion: "Los trabajadores del Grupo Unidos por el Canal regresaron con optimismo hoy a las áreas de trabajo, tras quince días de paralización de labores por decisión del consorcio.Los obreros consideraron ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131795.jpg"
	},
	{
	id: "280",
	categoria: "32",
	idnews: "131791",
	titulo: "Esquiadora ucraniana se retira de Sochi",
	descripcion: "SOCHI, Rusia (AP) -- Una esquiadora ucraniana decidió marcharse de los Juegos de Sochi en respuesta a la violencia en su país.El Comité Olímpico Internacional confirmó el jueves que el retiro de B",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131791.jpg"
	},
	{
	id: "246",
	categoria: "30",
	idnews: "131789",
	titulo: "Docentes del Instituto América dispuestos a colaborar: Cambra",
	descripcion: "Los docentes José Cambra y María Mojica, expresaron hoy, en Noticias AM, la disposición a colaborar con buena voluntad para resolver la situación imperante en el Instituto América, ante el atraso en l",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131789.jpg"
	},
	{
	id: "238",
	categoria: "17",
	idnews: "131788",
	titulo: "Controversia Rubén Blades y Nicolás Maduro generan revuelo",
	descripcion: "En tanto, las opiniones del cantautor panameño Rubén Blades sobre la situación en Venezuela y las reacciones airadas del presidente venezolano, Nicolás Maduro, generan revuelo en las redes sociales.",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131788.jpg"
	},
	{
	id: "237",
	categoria: "17",
	idnews: "131787",
	titulo: "Las protestas contra Maduro siguen cobrando vidas en Venezuela",
	descripcion: "Los muertos por la ola de protestas que sacude a Venezuela suman seis, mientras el dividido país seguía envuelto en disturbios y un dirigente opositor detenido instó a seguir luchando para lograr la ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131787.jpg"
	},
	{
	id: "234",
	categoria: "5",
	idnews: "131786",
	titulo: "Diarios españoles destacan reanudación de trabajos en el Canal",
	descripcion: "Los diarios españoles, El País, El Mundo y ABC resaltaron en sus últimas ediciones y en internet, el acuerdo parcial alcanzado por la Autoridad del Canal de Panamá y el consorcio Grupo Unidos por el C",
	imagen: "http://imagenes.tvn-2.com/noticias_img/no_img.jpg"
	},
	{
	id: "232",
	categoria: "17",
	idnews: "131785",
	titulo: "Tribunal ratifica detención de Leopoldo López en Venezuela",
	descripcion: "Un tribunal de control de Venezuela ratificó el jueves la detención del opositor Leopoldo López, cuya audiencia se realizó en una cárcel militar donde fue recluido desde el martes por su presunta resp",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131785.jpg"
	},
	{
	id: "281",
	categoria: "32",
	idnews: "131781",
	titulo: "Ucrania: 22 muertos por nuevos enfrentamientos ",
	descripcion: "Duros enfrentamientos entre manifestantes y policías antidisturbios se registraron quebraron la breve tregua en esta capital el jueves, lo que causó la muerte de al menos 22 personas.Se informó qu",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131781.jpg"
	},
	{
	id: "233",
	categoria: "17",
	idnews: "131778",
	titulo: "Nicolás Maduro responde a señalamientos de Rubén Blades",
	descripcion: "La noche de hoy, miércoles 19 de febrero, el presidente venezolano Nicolás Maduro le respondió a algunos de los artistas que habían increpado a su gobierno sobre los hechos de violencia. El Mandat",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131778.jpg"
	},
	{
	id: "231",
	categoria: "5",
	idnews: "131773",
	titulo: "ACP deberá tomar decisión definitiva hoy",
	descripcion: "La Autoridad del Canal de Panamá (ACP) deberá dar hoy una respuesta definitiva al conflicto con Grupo Unidos por el Canal (GUPC), que mantiene luego de la paralización de la obra.Directivos de la ",
	imagen: "http://imagenes.tvn-2.com/noticias_img/131773.jpg"
	}

       ];

//end vars de trneding

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
		ImgCache.options.cacheClearSize = 5;
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
    	
    	document.addEventListener('touchmove', function (e) {e.preventDefault();}, false);    	
    	document.body.addEventListener('touchmove', function(event) {event.preventDefault();}, false);    	 
        app.receivedEvent('deviceready');
        initialSetup();
 
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	isCommingFromPush = false;
    	isLoaded = false;
		//init push data
		initPush();		
		//Manejador de BD
		storageManager = new StorageManager();		
		//window.plugins.smsPlugin.sendSMS("Prueba sms",successSaveNews, errorNewsSave);
		
		clearPageStatus();
		
		//init page
		$.fgetNews();
		
		//snap de las paginas con un threshold del 15% de la pantalla
		myScrollPage.options.snapThreshold = window.innerWidth*0.15;
    }
};
