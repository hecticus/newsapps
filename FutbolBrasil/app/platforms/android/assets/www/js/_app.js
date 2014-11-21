	
	
	
	var _oAjax = false; 
	
	var _jApp = {
		
		pages: {
					
			find: function (_index, _data) {
				
				var _return = false;
				
				$.each(_jApp.pages.pages, function(__index,_item) {
					
 					if (_index.toLowerCase() == _item.index.toLowerCase()) {
 						_jApp.pages.page = _item;
 						if (_data) _jApp.pages.page.data = _data; 						
 						_return = true; 						
 					}					 
 					
 					if (_return) return _return;
 								
 				});
 				
 				return _return; 				
 				
			},
		
			pages: [
			
				{	
					index:'news', 
					class:'content-news',  
					title:'News', 
					load:'news.html', 
					data:false  
				}
			
			],
			
			
			page: false
			
	
		},
		
		domain: {
			url: 'http://10.0.1.125:9000/newsapi/v1/',
			news: function(_page) {
				return _jApp.domain.url +'news/search/1/' + _page + '/10';
			}
		},	
		
		start: function() {

			_oAjax = _fGetAjaxJson(_jApp.domain.news(1));
			if (_oAjax) {
				_oAjax.done(function(_json) {
					_jApp.pages.find('news',_json);
				});
			}
								
			_jApp.load('news');

		},
		
		loading: function() {
			
		},
		
		load: function(_index) {
			
			try {
				
				_jApp.pages.find(_index);		
				$('body').removeClass();
				$('body').addClass(_jApp.pages.page.class);
				$('main').empty();
				$('main').data('page',_jApp.pages.page.index);		
				$('main').load(_jApp.pages.page.load).fadeIn(1000);
	
			} catch(err) {    	
	  			_jApp.error();
			}
			 		       			
	  	},
	  	
	  	offLine: function() {
	  		
	  	},
	  	
	  	error: function() {
	  		
	  	},
	  	
	  	back: function() {
	  		
			if ($('#wrapper2').hasClass('left')) {						
				$('#wrapper2').attr('class','page transition right');									
			}
			
	  	}
	  		  		   
	};



	