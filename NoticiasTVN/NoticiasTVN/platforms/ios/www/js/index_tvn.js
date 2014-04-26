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



var arrTrendingTopics;
var arrTrendingNews;

var bannerImages = new Array();
var bannerLink = "";


var trendingview = false;

var currentTime = new Date();
var day = currentTime.getDate();
var month = (currentTime.getMonth()+1);
var year = currentTime.getFullYear();
//var formatdate= ((day<10)? '0'+day:day) +'/'+ ((month<10)? '0'+month:month)  +'/'+year;
var formatdate= ((month<10)? '0'+month:month) +'/'+ ((day<10)? '0'+day:day) +'/'+year;

var arrTime=[0,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11];
var arrTimeM=['am','am','am','am','am','am','am','am','am','am','am','am','pm','pm','pm','pm','pm','pm','pm','pm','pm','pm','pm','pm'];
var arrMonth=['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
var arrDay=['Dom', 'Lun', 'Mar','Mie', 'Jue', 'Vie', 'Sab'];

var arrMenuColor=['#ffffff', '#ebebeb', '#d4d4d4','#c0c0c0', '#a8a8a8', '#8f8f8f','#a8a8a8','#c0c0c0','#d4d4d4','#ebebeb'];



var Copyright= 'Copyright © Televisora Nacional S.A. ' + year;
$('#splash-footer').html('Copyright &copy; Televisora Nacional S.A.' + year);

var viewport={width:$(window).width(),height:$(window).height(),pHeight:(($(window).height()*40)/100), pWidth:(($(window).width()*25)/100),ar:($(window).width()/$(window).height())};
var arrPage=[];
var scrollPageDisable = false;
 
var newsDatacontent;

//INIT FUNCTIONS
//Funcion que permite rellenar el menu por codigo
function setMenuCategories(){

	$.li='';
	for(var i=0; i<arrCategory.length; i++){
		$.li+='<li data-category="'+arrCategory[i].classId+'" class="menu" data-position="'+arrCategory[i].i+'" style="padding-left: 1em; background-color:'+arrMenuColor[(i%10)]+';">';			
		$.li+=arrCategory[i].title;			
		$.li+='</li>';
	}
		
	$('#mainMenuList').empty();
	$('#mainMenuList').append($.li);
		
}



$('#menu').css('top',parseInt(((viewport.height*7)/100)+5) + 'px');
$('#datacontent, #datatrending').css('top',parseInt((viewport.height*7)/100) + 'px');
$('header ul li div').css('height', parseInt((viewport.height*7)/100) + 'px');



//function to set the correct pages with the correct IDs and colors
function setScrollPages() {
	$('#scrollerpage').empty();
	for(var i=0; i<(arrCategory.length); i++) {
		
		$.li='<div class="pages"  style="position:relative; float:left; display:block; background-color:#000000;">';

			$.li+='<div id="'+arrCategory[i].classId+'" class="page" style="position:absolute; z-index:1; top:'+((viewport.height*7)/100)+'px; bottom:0; left:0; width:100%; overflow:auto;">';
				
				$.li+='<div id="'+arrCategory[i].classId+'-featured" class="featured"  style="position:absolute;  z-index: 0; background-color:#000000;"></div>';											
				$.li+='<div class="scroller">';
					$.li+='<ul>';
						$.li+='<li>';
							$.li+='<ul id="'+arrCategory[i].classId+'-news-featured" class="featured">';	
								$.li+='<li id="'+arrCategory[i].classId+'-news-featured-title" class="featured" ></li>';
							$.li+='</ul>';
							$.li+='<ul id="'+arrCategory[i].classId+'-news1" class="news1" style="background-color:#ffffff;">';										
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
/*var arrCategory=[
  	{i:0,status:false,classId:'latestnews',id:'latestnews',title:'Home',bgcolor:'#0404B4',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestnews-utf8.asp'},
  	{i:1,status:false,classId:'latestnews_nacionales',id:'latestnews_nacionales',title:'Nacionales',bgcolor:'#FF4000',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestnews_nacionales-utf8.asp'},
  	{i:2,status:false,classId:'latestnews_internacionales',id:'latestnews_internacionales',title:'Internacionales',bgcolor:'#A4A4A4',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestnews_internacionales-utf8.asp'},
  	{i:3,status:false,classId:'latestnews_tecnologia',id:'latestnews_tecnologia',title:'Tecnología',bgcolor:'#AEB404',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestnews_tecnologia-utf8.asp'},
  	{i:4,status:false,classId:'latestnews_salud',id:'latestnews_salud',title:'Salud',bgcolor:'#FE2E64',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestnews_salud-utf8.asp'},
  	{i:5,status:false,classId:'latestnews_entretenimiento',id:'latestnews_entretenimiento',title:'Entretenimiento',bgcolor:'#0B610B',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestnews_entretenimiento-utf8.asp'},
  	{i:6,status:false,classId:'latestnews_deportes',id:'latestnews_deportes',title:'Deportes',bgcolor:'#0000EE',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestnews_deportes-utf8.asp'},
  	{i:7,status:false,classId:'latestvideos',id:'latestvideos',title:'Videos',bgcolor:'#AAAAAA',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestvideos-utf8.asp'},
  	{i:8,status:false,classId:'latestnews_decision2014',id:'latestnews_decision2014',title:'Noticias Decisión 2014',bgcolor:'#BABCEE',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestnews_decision2014-utf8.asp'},
  	{i:9,status:false,classId:'latestvideos_decision2014',id:'latestvideos_decision2014',title:'Videos Decisión 2014',bgcolor:'#CCCCCC',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestvideos_decision2014-utf8.asp'}
];*/

/*var arrCategory=[{i:0,status:false,classId:'latestnews',id:'latestnews',title:'Home',bgcolor:'#0404B4',internalUrl:'http://www.tvn-2.com/noticias/_modulos/json/latestnews-utf8.asp'}];*/
//var arrCategory;
var trendingTopicsCat;

function fRemoveClassIcon() {
		
	$(".icon").removeClass('back');
	$(".icon").removeClass('share');
	$(".icon").removeAttr('onclick');
}

function fBack() {
	
	$('#menu').attr('class','page transition left');	
	//if (!trendingview) $("#header-title").html(fTextoCortado(arrCategory[0].title));
	//if (!trendingview) $("#header-title").html(arrCategory[0].title);
	if (!trendingview && myScrollPage.currPageX == 0) $("#header-title").html(arrCategory[0].title);
	$("#header-title").removeClass('back');
	fRemoveClassIcon();
	$('#datacontent').attr('class','page transition right');
	$('#datacontents').empty();
	$('#datats').empty();		
	$('#screen-block').addClass('hidden');			
}
	
var upcoming=0;
var press=0;
var myScrollMenu, myScrollDatacontent, myScrollDatacontentHorizontal, myScrollPage, myScrollTrending;
var myXml=false;


var hoverClassRegEx = new RegExp('(^|\\s)iScrollHover(\\s|$)');

var vScroll=false;
var vHscroll=false;

//TODO: Move this vars to config file
var textShadowLight = "0px 1px 5px #555;";
var textShadowBlack = "0px 1px 5px #000;";

var hScrollMove = false;




function initBasicApp(){
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

    	
		myScrollTrending = new iScroll('datatrending',1,{snap:false,hScroll: false, vScroll: true, hScrollbar: false,vScrollbar: false,bounce:true,lockDirection: true,
				onBeforeScrollStart: function(e){				
					this.refresh();
					var target = e.target;
					clearTimeout(this.hoverTimeout);					
					this.hoverTimeout = setTimeout(function () {press=true;}, 2);
					this.hoverTarget = target;
					e.preventDefault();		
				},onScrollMove: function(e){			
					
					$('#trending-featured').height((this.y>=0) ? viewport.pHeight+this.y : viewport.pHeight);
					$('#trending-featured').width((this.y>=0) ? viewport.width+(this.y*2) : viewport.width);
					$('#trending-featured').css('left',(this.y<=0) ? 0 : -this.y);			
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
					$('#trending-featured').height((this.y>=0) ? viewport.pHeight+this.y : viewport.pHeight);
					$('#trending-featured').width((this.y>=0) ? viewport.width+(this.y*2) : viewport.width);
					$('#trending-featured').css('left',(this.y<=0) ? 0 : -this.y);
				}
				
			});	


			/*$.getJSON('http://tvn-2.com/noticias/_modulos/json/trendingtopics-utf8.asp', function( data ) { 				
				arrTrendingTopics = data.noticiastrendingtopics.item;			
			});
			
			$.getJSON('http://tvn-2.com/noticias/_modulos/json/trendingnews-utf8.asp', function( data ) {
				arrTrendingNews = data.noticiastrendingnews.item;
			});*/



			$('body').width(viewport.width);
			$('body').height(viewport.height);
					


			
		 	$('#scrollerpage').width(viewport.width*(arrCategory.length));
			$('#scrollerpage').height(viewport.height);					
			
		 	$('.pages').width(viewport.width);
			$('.pages').height(viewport.height);

			$('.featured').width('100%');
			$('.featured').height(viewport.pHeight);
	 		 
		 
			$('#gamesWrapper').width(viewport.width);
			$('#gamesScroller').width(viewport.width);
			
			$('#header-title').width(viewport.width/2);
			
			
		 
			myScrollPage = new iScroll('spage',0,{snap:true,momentum: false,hScroll: true, vScroll: false,hScrollbar: false, lockDirection: true, bounce:true,
				
				onScrollMove: function(e){		
					if(parseInt(this.currPageX + this.dirX)>=0){
						$('#header-title').html(arrCategory[parseInt(this.currPageX + this.dirX)].title);	
					}
				}, onScrollEnd:function () {
										
					if (this.currPageX!=this.lastPageX) {
						
						
						
						if (typeof window[arrPage[this.lastPageX]] != 'undefined') {
   							window[arrPage[this.lastPageX]].scrollTo(0,0,0);
						}
	
						$('#'+arrCategory[this.currPageX].classId).removeClass('hidden');			
						var upcomingback, upcomingnext;
						
						upcomingback = parseInt(this.currPageX-2);									
						upcomingnext = parseInt(this.currPageX+2);
																
						if ((upcomingback)>0) $('#'+arrCategory[upcomingback].classId).addClass('hidden');																		
						if ((upcomingnext)<(arrCategory.length)) $('#'+arrCategory[upcomingnext].classId).addClass('hidden');
						
						upcomingback = parseInt(this.currPageX-1);									
						upcomingnext = parseInt(this.currPageX+1);
												
						if ((upcomingback)>0) $('#'+arrCategory[upcomingback].classId).removeClass('hidden');													
						if ((upcomingnext)<(arrCategory.length)) $('#'+arrCategory[upcomingnext].classId).removeClass('hidden');		
																															
						if (!arrCategory[this.currPageX].status) $.fgetNews();
												
						gaPlugin.setVariable(successGAHandler, errorGAHandler, 1, arrCategory[this.currPageX].classId);
    					gaPlugin.trackEvent(successGAHandler, errorGAHandler, "scroll", "swype", "section", 1);
    					gaPlugin.trackPage(successGAHandler, errorGAHandler, arrCategory[this.currPageX].classId);
    					
					}
					
					this.lastPageX=this.currPageX;
					

				}
			});



			var touchingBack = false;
			$(document).on('touchstart','.back', function() {
				touchingBack = true;
				//fBack();
			});
			$(document).on('touchend','.back', function() {
				fBack();
				touchingBack = false;
			});

			
			$(document).on('touchend','.logo:not(.back)', function() {								
				myScrollMenu.scrollTo(0,0,0);
				
				if ($('#menu').hasClass('right')) {
					$('#menu').attr('class','page transition left');
					$('#screen-block').addClass('hidden');					
				} else {
					$('#menu').attr('class','page transition right');
					$('#screen-block').removeClass('hidden');
				}
					
				
			});
			
			
			
			$(document).on('touchend','.tv:not(.share)', function() {				
				//window.videoPlayer.play('rtsp://streaming.tmira.com:1935/tvn/tvn.stream');
				window.videoPlayer.play('http://urtmpkal-f.akamaihd.net/i/19wqj1kgf_1@136614/master.m3u8');
				//window.videoPlayer.play('http://streaming.tmira.com:1935/tvn/mp4:tvn.stream/playlist.m3u');

			});
			$(document).on('touchend','#screen-block', function() {			
				fBack();				
			});		

			$(document).on('touchstart','.menu', function() {
				press=false;
			}).on('touchend','.menu', function() {
    			if (press) {
    				
    				trendingview=false;
    				$('#screen-block').addClass('hidden');		
    				$('#header-title').html(arrCategory[$(this).data('position')].title);
    				
    				gaPlugin.setVariable(successGAHandler, errorGAHandler, 1, arrCategory[$(this).data('position')].id);
    				gaPlugin.trackEvent(successGAHandler, errorGAHandler, "menu", "touch", "section", 1);
					gaPlugin.trackPage(successGAHandler, errorGAHandler, arrCategory[$(this).data('position')].id);
    				
	    			myScrollPage.scrollToPage($(this).data('position'), 0, 0);
	    			
	    			$('#menu').attr('class','page transition left');	    				    			 	
					$('#datacontent').attr('class','page right');
					$('#datatrending').attr('class','page right');
					

					if (typeof myScrollDatacontentHorizontal != 'undefined') {
						myScrollDatacontentHorizontal = null;
					}	
				

    			}   								
    		});

     			
			$(document).on('touchstart','li[data-content="headline"]', function(e) {				
				press=false;	
    		}).on('touchend','li[data-content="headline"]', function() {				
    			if (press) {
    				
		
					$("#header-title").addClass('back');
					$(".icon.logo").addClass('back');	
    				$(".icon.tv").addClass('share');
    				
    				
    				newsDatacontent = $(this).data('id');
    				goToNewsPage();

				}   
    		});
			
			
			
			$(document).on('touchstart','#mas', function(e) {				
				press=false;	
    		}).on('touchend','#mas', function() {
    			
				if ($('tr[class^=secondtd]').hasClass('hiddentd')) {
					$('tr[class^=second]').removeClass('hiddentd');										    		  
				} else {				    				    
					$('tr[class^=secondtd]').addClass('hiddentd');	
				}
								
    			
    		});
			
			
			
			$(document).on('touchstart','.trending[data-content="trending"]', function(e) {				
				press=false;
				$(this).css('color','#034985');	
    		}).on('touchend','.trending[data-content="trending"]', function() {
    			$(this).css('color','#999999');				
    			if (press) {    				
    				trendingview=true;
    				//$("#header-title").html(fTextoCortado($(this).html()));
    				$("#header-title").html($(this).html());
    				myScrollTrending.scrollTo(0,0,0);	    				
    				//$.fsetTrendings($(this).data('id'));
    				$.fgetTrendings($(this).data('id'));
    				$('#datatrending').attr('class','page transition left');
				}
				   
    		});
    		
			
				
				
			$(document).on('touchstart','li[data-content="trending"]', function(e) {				
				press=false;				
    		}).on('touchend','li[data-content="trending"]', function() {				
    			if (press) {
					
					$("#header-title").addClass('back');
					$(".icon.logo").addClass('back');	
    				$(".icon.tv").addClass('share');
    				
    				var manager = new TrendingManager();
    				manager.loadTrendingByIDFromBD($(this).data('id'),successGetTrendingDataContentFromBD,noConnectionForTrendingNews);
    				//$.fsetTrendingNewsDatacontents($(this).data('id'));
    				$('.news-datacontent').hide();	
					myScrollDatacontent.scrollTo(0,0,0);							
					$($(this).data('news')).show();								
					$('.position').html('1');
					$('#datacontent').attr('class','page transition left');

    				
				}   
    		});				
				
}								
			
			function goToNewsPage(){

				var manager = new NewsManager();
				manager.loadNewsByIDFromBD(newsDatacontent,successGetNewsDataContentFromBD,noConnectionForNews);
				
				$('.news-datacontent').hide();	
				$('.back img').addClass('content');
				$('.back img, .share').removeClass('hidden'); 				  			
				myScrollDatacontent.scrollTo(0,0,0);							
				$($(this).data('news')).show();								
				$('.position').html('1');
				$('#datacontent').attr('class','page transition left');
					
									
			}
    		
    		
    		
			$(document).on('touchstart','div[data-type="video"], li[data-type="video"]', function(e) {
				press=false;		
    		}).on('touchend','div[data-type="video"], li[data-type="video"]', function() {
    			if (press) {
	    			window.videoPlayer.play($(this).data('src'));
				}   
    		});
			
			//Banner touch link
			$(document).on('touchstart','#bannerSpecial', function(e) {				
				press=false;	
    		}).on('touchend','#bannerSpecial', function() {
    			if(bannerLink != null && bannerLink != ""){
    				//window.open(bannerLink, '_system');
    				window.open(bannerLink, '_system', 'closebuttoncaption=regresar');
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
					timeout:120000,
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
						$('.status').append('<li>No hay conexiÃ³n</li>');
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
					timeout:120000,
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
						$('.status').append('<li>No hay conexiÃ³n</li>');
						console.log("fGetAjaX ERROR: "+xhr.responseText+" / "+error+" / "+status);*/
						//revisamos si hay algo en la BD
						var manager = new NewsManager();
						manager.loadNewsCategoryFromBD(arrCategory[myScrollPage.currPageX].id,successGetNewsFromBD,noConnectionForNews);
					});
			};


    		//WITH JSON INSTEAD OF NEWSML
			$.fgetNews = function() {
				//myJson=$.fGetAjaXJSON('http://www.tvn-2.com/noticias/_modulos/json/'+arrCategory[myScrollPage.currPageX].id+'-utf8.asp');
				myJson=$.fGetAjaXJSON(arrCategory[myScrollPage.currPageX].internalUrl);
				myJson.done(function(json) {
					var itemArray = null;
					if(json["noticias"] != null){
						itemArray = json["noticias"];
						//console.log("itemArray "+itemArray.length);
					}
					if(itemArray != null && itemArray.length > 0){
						var manager = new NewsManager();
						json["category"] = arrCategory[myScrollPage.currPageX].id;
						manager.saveNewsFromWS(json,successSaveNews,errorNewsSave);
						$.fsetNews(itemArray);
					}

				});
    		};
		  
		  	function successSaveNews(){
		  		//console.log("SAVE COMPLETE");
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
			
			//get news from bd
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
			//get trending news from bd
			function successGetTrendingDataContentFromBD(results){
					
				if(results != null){	
					var len = results.rows.length;				
					if(len > 0){
						var trendingNewsArray = new Array();
						for(var i=0;i<len;i++){
							var trendingNewsItem = results.rows.item(i);
							trendingNewsItem = decodeTrending(trendingNewsItem);
							trendingNewsArray.push(trendingNewsItem);
						}						
						$.fsetTrendingNewsDatacontents(trendingNewsArray);
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
			
			function noConnectionForNewsInit(err){
				//aqui se tiene que pintar la pantalla de error que ocurre cuando no hay conexion ni hay nada en la BD para desplegar

				$('body').addClass('no-connection');																				
				$('#splash').addClass('hidden');				
				$('#splash-no-connection').removeClass('hidden');

				
			};
		  
			$(document).on('touchend','.no-connection', function(e) {				
				press=false;
				exitApp();
    		});

		  
			$.fsetNews = function(itemArray) {
						isLoaded = true;
						$.category = '#'+arrCategory[myScrollPage.currPageX].classId;
						
						$($.category +'-news1').empty();	
						$($.category+'-news-featured-title').empty();
												
						window['myScroll'+arrCategory[myScrollPage.currPageX].classId]=newScroll(arrCategory[myScrollPage.currPageX].classId);
						arrPage.push('myScroll'+arrCategory[myScrollPage.currPageX].classId);

																		
						for(var i=0;i<itemArray.length; i++){

							$.news={id:itemArray[i]["ID"],headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
							$.news.headline=itemArray[i]["Title"];

							$.news.date=$.formatDateString(itemArray[i]["Date"]);
							
							var dataContent;
							dataContent = '<media media-type="image" style="leftSide"><media-reference mime-type=""/></media>';
							dataContent+=itemArray[i]["Body"];
							$.news.datacontent=$('<div>').append(dataContent).remove().html();
							
							if(itemArray[i]["PortalImageDescription"] != null){
								$.news.caption.push(itemArray[i]["PortalImageDescription"]);
							}
							
							var imageFile = "";
							if(itemArray[i]["PortalImage"] != null){
								imageFile = "http://tvn-cloud-farm-lb.cloudapp.net/"+itemArray[i]["PortalImage"];
							}else{
								imageFile = "http://tvn-cloud-farm-lb.cloudapp.net/"+itemArray[i]["Image"];
							}
							imageFile = cleanExternalURL(imageFile);
																						
							$.news.thumbnail.push({src:imageFile,width:864,height:486});
							$.news.highdef.push({src:imageFile,width:864,height:486});																						
							$.news.quicklook.push({src:imageFile,width:864,height:486});
							
							//check if there is a video
							var isVideo = false;
							if(itemArray[i]["FirstVideo"] != null && itemArray[i]["FirstVideo"] != ""){
								isVideo = true;
								var videoURLIni = "http://www.kaltura.com/p/1199011/sp/0/playManifest/entryId/";
								var videoURLEnd = "/format/url/flavorParamId/0/video.mp4";
								var videoURL = videoURLIni+""+itemArray[i]["FirstVideo"]+""+videoURLEnd;
								$.news.video.push({src:videoURL,poster:itemArray[i]["image"]});
								if(itemArray[i]["SecondVideo"] != null && itemArray[i]["SecondVideo"] != ""){
									videoURL = videoURLIni+""+itemArray[i]["SecondVideo"]+""+videoURLEnd;
									$.news.video.push({src:videoURL,poster:itemArray[i]["image"]});
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
								
								//if (arrCategory[myScrollPage.currPageX].video) {
								if (isVideo) {
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
								
							} else if ((i==1) && (arrCategory[myScrollPage.currPageX].i==0)) {

								$.li='<li data-view="trending" >';
								
									$.li+='<div style="position:relative; display:inline-block; width:'+(((viewport.width*30)/100))+'px; height:auto; min-height:70px; max-height:70px; float:left; background-color: #034985; color:#ffffff; font-style:italic; vertical-align:bottom; box-sizing:border-box;">';
									
									//$.li+='<div style="position: absolute; top: 50%; left: 50%; height: 30%; width:100%; margin: -20% 0 0 -30%;">';
									$.li+='<div align="center" style="position: absolute; height: 100%; width:100%;text-align: center; top:1.6em;">';
										/*$.li+='<span style="font-size:1.0em;">Tendencias</span> <br />';
										$.li+='<span style="font-size:1.4em; font-weight:bold;">DE HOY</span>';*/
										$.li+='<span style="font-size:1.6em;">Tendencias</span> <br />';
										$.li+='<span style="font-size:1.9em; font-weight:bold;">DE HOY</span>';
									$.li+='</div>';
									

									
									$.li+='</div>';
									
									$.li+='<div style="width:'+((viewport.width*70)/100)+'px; height:auto; float:left;">';

									arrTrendingTopics.forEach(function(trending,i) {
										//$.li+='<div style="width:'+(((viewport.width*35)/100))+'px; height:auto; min-height:35px; max-height:35px; float:left; background-color:#f9f9f9;  border-left:1px  solid #ffffff;  border-bottom:1px  solid #ffffff; vertical-align:top; padding:2px; box-sizing:border-box;">';
										//$.li+='<p style="width:100%; height:100%; color:#ffffff; text-align: left; font-size:1.2em; font-weight:bold; color:#999999; display:inline; ">#'+trending.titulo+'</p>';
										$.li+='<div class="trending" data-content="trending" data-id="'+trending.ID+'" style="width:'+(((viewport.width*35)/100)-5)+'px; height:auto; min-height:35px; max-height:35px; float:left; background-color:#f9f9f9;  border-left:1px  solid #ffffff;  border-bottom:1px  solid #ffffff; vertical-align:top; padding:2px; box-sizing:border-box; text-align: left; font-size:1.2em; font-weight:bold; color:#999999; display:inline;">';
										$.li+='#'+trending.Title;										
										$.li+='</div>';
									});

									$.li+='</div>';
									
								$.li+='</li>';
								
								//bannerImages.push("https://www.google.com/images/srpr/logo11w.png");
								if(bannerImages != null && bannerImages.length > 0){
									$.li+='<li id="bannerSpecial" data-view="banner" >';
										$.li+='<img src='+bannerImages[0]+' style="width:100%; height:auto; " />';						
									$.li+='</li>';
								}
											
																								
								$($.category +'-news1').append($.li);
								
							} else if (i>0) {
								
								
								//if (arrCategory[myScrollPage.currPageX].video) {
								if (isVideo) {
									$.li='<li data-view="thumbnail" data-type="video"  data-src="'+$.news.video[0].src+'"  >';
								} else {
									$.li='<li data-view="thumbnail" data-content="headline" data-category="'+arrCategory[myScrollPage.currPageX].classId+'" data-id="'+$.news.id+'" data-news="#news-'+$.news.id+'" data-headline="'+$.news.headline+'" >';									
								}

								if ($.news.quicklook.length >= 1) {
									$.li+='<div data-src="'+$.news.quicklook[0].src+'" class="thumbnail" style="background-image:url('+$.news.quicklook[0].src+'); background-size:cover; height:'+((viewport.height*15)/100)+'px;" >&nbsp;</div>';
								}
								
								$.li+='<div style="background-color:#535252; color:#535252; width:5px; height:'+((viewport.height*15)/100)+'px; float:left;" >';								
								//$.li+='<img src="img/icon/flecha.png" style="width:10px; height:auto; margin-top:5px; margin-left:5px;" />';
								$.li+='</div>';
																								
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
				
				$.category = '#'+arrCategory[myScrollPage.currPageX].classId;
					
				
				for(var i=0;i<itemArray.length; i++){
						if(itemArray[i]["ID"] == newsDatacontent){
						
						$('#datacontents').empty();
							
						$.news={id:itemArray[i]["ID"],headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
						$.news.headline=itemArray[i]["Title"];
						
						var shareURL = "http://tvn-cloud-farm-lb.cloudapp.net"+itemArray[i]["URL"];
						//Share button onclick
						$('.share').attr('onclick','window.plugins.socialsharing.share(\''+$.news.headline.replace(/["']/g, "")+'\',\'NoticiasTVN\',null,\'http://tvn-cloud-farm-lb.cloudapp.net'+itemArray[i]["URL"]+'\');');

						$.news.date=$.formatDateString(itemArray[i]["Date"],true);
														
						var dataContent;
						dataContent = '<media media-type="image" style="leftSide"><media-reference mime-type=""/></media>';
						dataContent+=itemArray[i]["Body"];
						$.news.datacontent=$('<div>').append(dataContent).remove().html();
						
						if(itemArray[i]["PortalImageDescription"] != null){
							$.news.caption.push(itemArray[i]["PortalImageDescription"]);
						}
						
						var imageFile = "";
						if(itemArray[i]["PortalImage"] != null){
							imageFile = "http://tvn-cloud-farm-lb.cloudapp.net/"+itemArray[i]["PortalImage"];
						}else{
							imageFile = "http://tvn-cloud-farm-lb.cloudapp.net/"+itemArray[i]["Image"];
						}
						imageFile = cleanExternalURL(imageFile);
																					
						$.news.thumbnail.push({src:imageFile,width:864,height:486});
						$.news.highdef.push({src:imageFile,width:864,height:486});																						
						$.news.quicklook.push({src:imageFile,width:864,height:486});
						
						//check if there is a video
						if(itemArray[i]["FirstVideo"] != null && itemArray[i]["FirstVideo"] != ""){
							var videoURLIni = "http://www.kaltura.com/p/1199011/sp/0/playManifest/entryId/";
							var videoURLEnd = "/format/url/flavorParamId/0/video.mp4";
							var videoURL = videoURLIni+""+itemArray[i]["FirstVideo"]+""+videoURLEnd;
							$.news.video.push({src:videoURL,poster:itemArray[i]["image"]});
							if(itemArray[i]["SecondVideo"] != null && itemArray[i]["SecondVideo"] != ""){
								videoURL = videoURLIni+""+itemArray[i]["SecondVideo"]+""+videoURLEnd;
								$.news.video.push({src:videoURL,poster:itemArray[i]["image"]});
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
													
									$.lii+='<div data-type="image" style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#FFFFFF; ">';						    										    			
					    			$.lii+='<figure>';						    													
									//$.lii+='<img alt="highdef" src="'+src.src+'" onerror="this.style.display=\'none\'" class="center" style="width:auto; height:'+viewport.pHeight+'px; max-width:'+src.width+'px; max-height:'+src.height+'px; " />';
					    			$.lii+='<img alt="highdef" src="'+src.src+'" onerror="this.style.display=\'none\'" class="center" style="width:auto; height:auto; max-width:100%; max-height:100%; " />';
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
						

						$.li+='<div	class="datacontent">';
						$.li+='<p style="text-align:left;">'+$.news.date+'</p>';
						$.li+='<h2>'+$.news.headline+'</h2>';	
						$.li+='<p>'+$.news.datacontent+'</p>';	
						$.li+='</div>';	
						
						$.li+='<div style="margin:0 10px 0 10px;"><h5>'+Copyright+'</h5></div>';       		
						        		
						        																						
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
    		


    		//TRENDING MANAGE
    		$.fgetTrendings = function(category) {
    			$('#trending-featured').empty();
    			$('#trending-news-featured-title').empty();
    			$('#trending-news1').empty();
    			
    			var urlComplete = "http://tvn-cloud-farm-lb.cloudapp.net/_vti_bin/NewsService.svc/GetNewsByTrendingTopic?trendingTopicId="+category+"&siteUrl=Noticias&rowLimit=10";
				myJson=$.fGetAjaXJSON(urlComplete);
				myJson.done(function(json) {
					var itemArray = null;
					if(json["noticias"] != null){
						itemArray = json["noticias"];
						//console.log("itemArray "+itemArray.length);
					}
					if(itemArray != null && itemArray.length > 0){
						var manager = new TrendingManager();
						json["category"] = category;
						manager.saveTrendingFromWS(json,successSaveTrendingNews,errorTrendingNewsSave);
						$.fsetTrendings(itemArray);
					}
					
					
				});
    		};
		  
		  	function successSaveTrendingNews(){
		  		//console.log("SAVE COMPLETE");
		 	}
		 	function errorTrendingNewsSave(err){
				console.log("TRENDS SAVE FAILS");
			}
			function successGetTrendingNewsFromBD(results){
				printToLog("successGetNewsFromBD");
				if(results != null){
					var len = results.rows.length;
					printToLog("RESULT len: "+len);
					if(len > 0){
						var trendingNewsArray = new Array();
						for(var i=0;i<len;i++){
							var trendingNewsItem = results.rows.item(i);
							trendingNewsItem = decodeTrendingNews(trendingNewsItem);
							trendingNewsArray.push(trendingNewsItem);
						}
						$.fsetTrendings(trendingNewsArray);
						
					}else{
						noConnectionForTrendingNews();
					}
				}else{
					noConnectionForTrendingNews();
				}
			}
			
			function noConnectionForTrendingNews(err){
				//realmente no hay conexion y no hay nada guardado
				arrCategory[myScrollPage.currPageX].status=false;	
				$('.status').append('<li>No hay conexion</li>');
			}
			
			function noConnectionForTrendingNewsInit(err){
				//aqui se tiene que pintar la pantalla de error que ocurre cuando no hay conexion ni hay nada en la BD para desplegar

				$('body').addClass('no-connection');																				
				$('#splash').addClass('hidden');				
				$('#splash-no-connection').removeClass('hidden');

				
			};
    		
    		
    		//SET TRENDING LIST PAGE
			$.fsetTrendings = function(itemArray) {
    			$('#trending-featured').empty();
    			$('#trending-news-featured-title').empty();
    			$('#trending-news1').empty();
    			

				for(var i=0; i<itemArray.length; i++){
					trending = itemArray[i];
					$.news={id:trending.ID,headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
							
							
					$.news.headline=trending.Title;			
					$.news.date=$.formatDateString(formatdate);	
					
					var imageFile = "";
					if(trending["PortalImage"] != null){
						imageFile = "http://tvn-cloud-farm-lb.cloudapp.net/"+trending["PortalImage"];
					}else{
						imageFile = "http://tvn-cloud-farm-lb.cloudapp.net/"+trending["Image"];
					}
					imageFile = cleanExternalURL(imageFile);
																		
					$.news.thumbnail.push({src:imageFile,width:864,height:486});
					$.news.highdef.push({src:imageFile,width:864,height:486});																						
					$.news.quicklook.push({src:imageFile,width:864,height:486});
				
					if (i==0) {
						
						$('#trending-news-featured-title').data('id',$.news.id);
						$('#trending-news-featured-title').data('news','#news-'+$.news.id);																		
						$('#trending-news-featured-title').attr('data-content','trending');
																
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
							$('#trending-featured').append('<img data-src="'+$.news.highdef[0].src+'" onerror="this.style.display=\'none\'" src="'+$.news.highdef[0].src+'" class="center" style="width:auto; height:100%;"  />');
						}else{
							$('#trending-featured').append('<img data-src="'+$.news.highdef[0].src+'" onerror="this.style.display=\'none\'" src="'+$.news.highdef[0].src+'" class="center" style="width:100%; height:auto;"  />');
						}
		
						$('#trending-news-featured-title').data('id',$.news.id);
						$('#trending-news-featured-title').data('news','#news-'+$.news.id);
						$('#trending-news-featured-title').data('headline',$.news.headline);																			
						$('#trending-news-featured-title').attr('data-content','trending');
						$('#trending-news-featured-title').attr('data-id',$.news.id);
						$('#trending-news-featured-title').attr('data-news','#news-'+$.news.id);
						
						//$.li='<li data-view="thumbnail" data-content="trending" data-id="'+$.news.id+'" data-news="#news-'+$.news.id+'" >';
						
						$.li='<div style="position: relative; width:'+viewport.width+'px; height:'+(viewport.pHeight + 20)+'px;  ">';								
						$.li+='<h3 style="position: absolute; bottom: 0; left: 0; width:'+(viewport.width-10)+'px; height:auto; padding:5px; min-height:35px; background-color: rgba(0,0,0,0.5);  color: #ffffff; text-shadow: 0px 1px 5px #000; " >'+$.news.headline+'</h3>';								
						$.li+='</div>';

						$('#trending-news-featured-title').append($.li);

					} else if (i>0) {						
						$.li='<li data-view="thumbnail" data-content="trending" data-id="'+$.news.id+'" data-news="#news-'+$.news.id+'" >';
						
						if ($.news.quicklook.length >= 1) {
							$.li+='<div data-src="'+$.news.quicklook[0].src+'" class="thumbnail" style="background-image:url('+$.news.quicklook[0].src+'); background-size:cover; height:'+((viewport.height*15)/100)+'px;" >&nbsp;</div>';
						}
								
						$.li+='<div style="background-color:#535252; color:#535252; width:5px; height:'+((viewport.height*15)/100)+'px; float:left;" >';								
						//$.li+='<img src="img/icon/flecha.png" style="width:10px; height:auto; margin-top:5px; margin-left:5px;" />';
						$.li+='</div>';
								
																									
						$.li+='<div class="headline"><span class="title">'+$.news.headline+'</span><br /><span class="date">'+$.news.date+'</span></div>';							
						$.li+='</li>';
						$('#trending-news1').append($.li);
					}
												
				};
									

    		};


    		//SET TRENDING TOPIC NEWS COMPLETE
			$.fsetTrendingNewsDatacontents = function(itemArray) {
				//for(var i=0;i<itemArray.length; i++){
				if(itemArray.length > 0){
					trending = itemArray[0];

					$.news={id:trending.ID,headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''};								    	
					$.news.headline=trending.Title;
					$.news.date=$.formatDateString(trending.Date,true);
					
					var imageFile = "";
					if(trending["PortalImage"] != null){
						imageFile = "http://tvn-cloud-farm-lb.cloudapp.net/"+trending["PortalImage"];
					}else{
						imageFile = "http://tvn-cloud-farm-lb.cloudapp.net/"+trending["Image"];
					}
					imageFile = cleanExternalURL(imageFile);
					
					$.news.thumbnail.push({src:imageFile,width:864,height:486});
					$.news.highdef.push({src:imageFile,width:864,height:486});																						
					$.news.quicklook.push({src:imageFile,width:864,height:486});
					if(trending.PortalImageDescription != null){
						$.news.caption.push(trending.PortalImageDescription);
					}
					
					var dataContent = '<media media-type="image" style="leftSide"><media-reference mime-type=""/></media>';
					dataContent+=trending.Body;
					$.news.datacontent=$('<div>').append(dataContent).remove().html();

					var shareURL = "http://tvn-cloud-farm-lb.cloudapp.net"+itemArray[i]["URL"];
					//Share button onclick
					$('.share').attr('onclick','window.plugins.socialsharing.share(\''+$.news.headline.replace(/["']/g, "")+'\',\'NoticiasTVN\',null,\'http://tvn-cloud-farm-lb.cloudapp.net'+itemArray[i]["URL"]+'\');');
				
					$.li='<li id="news-'+$.news.id+'" video="news-'+$.news.id+'-video" class="news-datacontent none" >';
					
					
					
					$.total = $.news.highdef.length;				        					
					if ($.total==0) $.total=1;
						
					$.li+='<div id="hWrapper" video="news-'+$.news.id+'-video" style="position:relative; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; text-align:left;">';
					
					$.li+='<div video="news-'+$.news.id+'-video" style="float:left; width:'+(viewport.width*$.total)+'px; height:'+viewport.pHeight+'px; ">';
					$.lii='';

						c=0;
						$.news.highdef.forEach(function(src){											
							$.lii+='<div data-type="image" style="position:relative; float:left; width:'+viewport.width+'px; height:'+viewport.pHeight+'px; background-color:#FFFFFF; ">';						    										    			
			    			$.lii+='<figure>';						    													
							//$.lii+='<img alt="highdef" src="'+src.src+'" onerror="this.style.display=\'none\'" class="center" style="width:auto; height:'+viewport.pHeight+'px; max-width:'+src.width+'px; max-height:'+src.height+'px; " />';
			    			$.lii+='<img alt="highdef" src="'+src.src+'" onerror="this.style.display=\'none\'" class="center" style="width:auto; height:auto; max-width:100%; max-height:100%; " />';
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
					
					
					$.li+='<div	class="datacontent">';					
					$.li+='<p style="text-align:left;">'+$.news.date+'</p>';
					$.li+='<h2>'+$.news.headline+'</h2>';	
					$.li+='<p>'+$.news.datacontent+'</p>';	
					$.li+='</div>';	
					$.li+='<div style="margin:0 10px 0 10px;"><h5>'+Copyright+'</h5></div>';      
					$.li+='</li>';
															
					$('#datacontents').append($.li);

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
			
			//dd/MM/yyyy hh:mm t.t. or d/M/yyyy h:m t.t. or just the month/day/year
			$.formatDateString = function(ds,full) {

											
				var dateString = ""+ds;
				var parts = dateString.split(" ");
				var months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
				var DMY = parts[0].split("/");
				var monthIndex = parseInt(DMY[1]);
				if(parts.length > 1){
					
					var HMS = parts[1].split(":");
					var meridian = parts[2];
					var dateStringFinal = ""+HMS[0]+':'+HMS[1]+' '+meridian;

					if (full) {						
						dateStringFinal = ""+months[monthIndex-1]+' '+DMY[0]+', '+DMY[2]+' '+HMS[0]+':'+HMS[1]+' '+meridian;									
					} else {						
						if ((parseInt(DMY[2])<parseInt(year)) || (parseInt(DMY[1])<parseInt(month)) || (parseInt(DMY[0])<parseInt(day))) {
							dateStringFinal = ""+months[monthIndex-1]+' '+DMY[0]+', '+DMY[2]+' '+HMS[0]+':'+HMS[1]+' '+meridian;
						}	
					}
					

					

					return dateStringFinal;
				}else{
					var dateStringFinal = months[monthIndex-1]+', '+DMY[0]+", "+DMY[2];

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

		//refresh data
		setInterval(function(){
			clearPageStatus();
			refreshTrendingIndexesForApp();
			getBannerSpecial();
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
function getCategoriesForApp(){
	var manager = new CategoryManager();
	manager.getCategories(successGetCategories,errorGetCategories);
}

function successGetCategories(results){
	//console.log("successGetCategories");
	if(results != null){
		var len = results.length;
		//console.log("RESULT len: "+len);
		if(len > 0){
			//agregamos la señal en vivo
			
			//results.push({i:len,status:false,classId:'live_tv',id:'live_tv',title:'Señal en vivo',bgcolor:'#0404B4'});
			arrCategory = results.slice(0);
			//console.log("ARRAY ORIGINAL: "+JSON.stringify(arrCategory));
			removeInvalidCategories();
			//console.log("ARRAY CHANGED: "+JSON.stringify(arrCategory));
			//endOfAppInitialization();
			getTrendingIndexesForApp();
		}else{
			console.log("Error CATEGORIES");
			noConnectionForNewsInit();
		}
	}else{
		console.log("Error CATEGORIES 2");
		noConnectionForNewsInit();
	}
	//endOfAppInitialization();
}

function errorGetCategories(){
	console.log("Error CATEGORIES real");
	noConnectionForNewsInit();
	//endOfAppInitialization();
}
function removeInvalidCategories(){
	var indexToDelete = -1;
	//buscamos la categoria de trendings
	for(var i=0;i<arrCategory.length;i++){
		if(arrCategory[i].trending == 1){
			//console.log("Trending: "+arrCategory[i].internalUrl+" index:"+i);
			trendingTopicsCat = arrCategory[i].internalUrl;
			indexToDelete = i;
		}
	}
	
	if(indexToDelete >= 0){
		arrCategory.splice(indexToDelete,1);
	}
	
	//eliminamos todas las categorias ocultas
	var noMore = false;
	while(!noMore){
		indexToDelete = -1;
		for(var i=0;i<arrCategory.length;i++){
			if(arrCategory[i].hidden == 1){
				indexToDelete = i;
			}
		}
		if(indexToDelete >= 0){
			arrCategory.splice(indexToDelete,1);
		}else{
			noMore = true;
		}
	}
}

//trending indexes
function getTrendingIndexesForApp(){
	var manager = new TrendingIndexManager();
	manager.getTrendingIndexes(successGetTrendingIndexes,errorGetTrendingIndexes);
}

function successGetTrendingIndexes(results){
	//console.log("successGetTrendingIndexes");
	if(results != null){
		var len = results.length;
		//console.log("RESULT len: "+len);
		if(len > 0){
			//console.log("TRENDINGTOPICS: "+JSON.stringify(results));
			arrTrendingTopics = results.slice(0);
			//getTrendingNewsForApp();
			endOfAppInitialization();
		}else{
			console.log("Error TrendingIndexes");
			noConnectionForNewsInit();
		}
	}else{
		console.log("Error TrendingIndexes 2");
		noConnectionForNewsInit();
	}
}

function errorGetTrendingIndexes(){
	console.log("Error TrendingIndexes real");
	noConnectionForNewsInit();
}

//banner
function getBannerSpecial(){
	var urlBanner = 'http://tvn.news.hecticus.com:9001/newsapi/v1/banners/get';
	//var urlBanner = 'http://10.0.3.142:9007/newsapi/v1/banners/get';
	//console.log("VA AL Banners");
	$.ajax({
		url : urlBanner,
		timeout : 120000,
		success : function(data, status) {
			if(typeof data == "string"){
				data = JSON.parse(data);
			}
			//console.log("Banners DATA: "+JSON.stringify(data));
			var error = data["error"];
			if(error == 0){
				var results = data["response"]["banners"];
				//console.log("Banners results: "+JSON.stringify(results));
				if(results != null){
					if(results.length>0){
						var banner = results[0];
						//Guardamos las imagenes del banner y el link
						bannerImages = new Array();
						var imagesArray = banner["fileList"];
						var indexToUse = 0;
						var minSize = 70000;
						for(var i=0;i<imagesArray.length;i++){
							var diff = window.innerWidth - imagesArray[i]["width"];
							if(diff < 0){
								diff = diff*(-1);
							}
							if(diff < minSize){
								minSize = diff;
								indexToUse = i;
							}
						}
						bannerImages.push(imagesArray[indexToUse]["location"]);
						bannerLink = banner["link"];
					}
				}
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			console.log("ERROR Banners DATA: "+thrownError);
		}
	});
}

//REFRESH ARRAYS
function refreshTrendingIndexesForApp(){
	var managerIndex = new TrendingIndexManager();
	managerIndex.getTrendingIndexes(successRefreshTrendingIndexes,errorRefresh);
}
function successRefreshTrendingIndexes(results){
	//console.log("successRefreshTrendingIndexes");
	if(results != null){
		var len = results.length;
		if(len > 0){
			arrTrendingTopics = results.slice(0);
		}
	}
}
function errorRefresh(){
	console.log("errorRefresh");
}
//END REFRESH ARRAYS

//end de funciones de inicializacion de categorias y trendings

function endOfAppInitialization(){
	//console.log("endOfAppInitialization");
	initBasicApp();
	
	clearPageStatus();
	
	getBannerSpecial();
	
	$.fgetNews();
	
	//snap de las paginas con un threshold del 15% de la pantalla
	myScrollPage.options.snapThreshold = window.innerWidth*0.15;
	
	$('#splash').addClass('hidden');
	
	getCurrentGeoPosition();
	
	
}

function exitApp(){
	if (navigator.app) {
		gaPlugin.exit(successGAHandler, successGAHandler);						
        navigator.app.exitApp();				            
    } else if (navigator.device) {
    	gaPlugin.exit(successGAHandler, successGAHandler);				        	
        navigator.device.exitApp();				            				          
    }
}


function fTextoCortado(texto){
	
	var longitud=20; 
	if(texto.length > longitud){ 
		
		
    	texto=texto.substring(0,longitud);
    	
    	indiceUltimoEspacio= texto.lastIndexOf(' ');
    	texto=texto.substring(0,indiceUltimoEspacio) +' ...';
	};
	
	return texto;  
};

//GEOLOCATION
function getCurrentGeoPosition(){
	//console.log("getCurrentGeoPosition");
	navigator.geolocation.getCurrentPosition(successGeolocationHandler, errorGeolocationHandler);
	//console.log("end getCurrentGeoPosition");
}

function successGeolocationHandler (position) {
	//console.log("Lat: "+position.coords.latitude+" Long: "+position.coords.longitude);
    //position.coords.latitude;
    //position.coords.longitude;
}

function errorGeolocationHandler (error) {
    //console.log('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
    //initGeolocation();
}
//END GEOLOCATION


var app = {
    initialize: function() {this.bindEvents();},
    bindEvents: function() {document.addEventListener('deviceready', this.onDeviceReady, false);},
    onDeviceReady: function() {
  
    	
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
 			  
    			if($('#menu').hasClass('right')){
					$('#menu').attr('class','page transition left');	    				    				
				}else if ($('#datacontent').hasClass('left')){
					fRemoveClassIcon();
					$('#datacontent').attr('class','page transition right');
				}else if ($('#datatrending').hasClass('left')){
					trendingview = false;
					$('#datatrending').attr('class','page transition right');
					fRemoveClassIcon();																			
				}else {
					if(myScrollPage.currPageX == 0){
						
						exitApp();

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
 
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	initialSetup();
    	isCommingFromPush = false;
    	isLoaded = false;
		//init push data
		initPush();		
		//Manejador de BD
		storageManager = new StorageManager();		
		//window.plugins.smsPlugin.sendSMS("Prueba sms",successSaveNews, errorNewsSave);
		
		/*initBasicApp();
		
		clearPageStatus();*/
		
		
		//init page
		getCategoriesForApp();
		//endOfAppInitialization();
		//$.fgetNews();
		
    }
};
