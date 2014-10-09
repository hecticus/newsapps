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
var _jSchedule = false;
//Push things
var pushInterval;
var newsPushInterval;
var newsReadyForPush = false;
var _jActive = false;

//var _urlHecticus = 'http://10.0.1.125:9002/';
var _urlHecticus = 'http://polla.tvmax-9.com/';
var _urlCloud = 'http://1053e587fa1a3ea08428-6ed752b9d8baed6ded0f61e0102250e4.r36.cf1.rackcdn.com';
var _date = new Date();
var _day = _date.getDate();
var _month = (_date.getMonth()+1);
var _year = _date.getFullYear();
var _copyright= 'Copyright &copy; Televisora Nacional S.A. ' + _year;

var _jGet = false;	
var _oAjax;

var _tap = false;
var _jMenu=[];

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
        //set timeout para init data
    		window.setTimeout(initAllAppData(),100);
    		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};

app.initialize();


function initAllAppData() {
	console.log("initAllAppData");
	
	_jMenu.push({index:0,class:'content-home',title:'Test',load:'test.html',glyphicon:'icon-home_menu'});
	
	//_fRequestCategories();
	//_jMenu.push({index:_jMenu.length,class:'content-signin',title:'Ingresar',load:'SignIn.html', glyphicon:'glyphicon glyphicon-cloud-download'});
	//_jMenu.push({index:_jMenu.length,class:'content-signup',title:'Registro',load:'SignUp.html', glyphicon:'glyphicon glyphicon-cloud-upload'});


//	document.addEventListener('backbutton', function(e) {
				
//		if ($('#wrapper2').hasClass('left')) {	
//			_fSetBack();												
//		} else {
//			
//			if ($('#wrapperM').hasClass('right')) {
//		 		_fSetBack();
//			} else if ($('body').hasClass('content-home')) {							
//				exitApp();				
//			} else if ($('body').hasClass('content-default')) {							
//				exitApp();				
//			} else if ($('body').hasClass('content-signin')) {	
//				backFromRegister();		
//			} else if ($('body').hasClass('content-signup')) {							
//				backFromRegister();				
//			} else {						
//				_fSetLoadInit();
//			}
//								
//		}
//							
//	}, false);
	
	app.receivedEvent('deviceready');    	
//	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false); 
	
	console.log("init data");
	
}


function basicSettings(){
	$.ajax({
      url : "http://revan:9000/garotas/settings",
      type: 'GET',
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      timeout : 60000,
      async: false,
      success : function(data, status) {
          var response = data.response;
          console.log(response.app_version);
          var arrImg = response.img;
					var images = '';
					for(var i = 0; i < arrImg.length; i++){
						images+='<li><div style="width: 100%; heigth: 50%; display: inline-block; position: relative; overflow: hidden;"><img src="'+arrImg[i]+'" width="100%" height="auto" style="vertical-align: middle"/></div></li>';
						//images+='<li><div style="background-image: url(\"'+arrImg[i]+'\"); width: 100%; display: inline-block; position: relative;">&nbsp</div></li>';
					}
					console.log(images);
					$("#slider").append(images);
      },
      error : function(xhr, ajaxOptions, thrownError) {
          var arrImg = ['http://30c96e5d3d6352665630-e992ea5784c8ea654dc41c522b685459.r45.cf1.rackcdn.com/1/1e6c69a0-313a-4ad7-a5d7-b69ae07116961.jpg','http://dabef43ba137c0922ae6-78791d9251c278a0783b6cc2598ecd64.r88.cf1.rackcdn.com/15/4929b5ff-8a07-44e3-a83e-5c88373fbf7ds.jpg','http://dabef43ba137c0922ae6-78791d9251c278a0783b6cc2598ecd64.r88.cf1.rackcdn.com/2/3a8c463c-d834-4327-9d50-fdf14e5b7678a.jpg','http://dabef43ba137c0922ae6-78791d9251c278a0783b6cc2598ecd64.r88.cf1.rackcdn.com/4/4692c05b-d28d-4e94-b8fa-6067480c6dd4l.jpg'];
					var images = '';
					for(var i = 0; i < arrImg.length; i++){
						images+='<li><img src="'+arrImg[i]+'" width="100%" height="auto" style="vertical-align: middle"/></li>';
					}
					$("#slider").append(images);
      }
  });
}
basicSettings();


$(document).ready(function(){
  $('.bxslider').bxSlider({auto: true, controls : false, pager : false});
});