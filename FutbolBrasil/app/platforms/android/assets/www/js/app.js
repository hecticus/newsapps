	
	var _oAjax = false; 
	
	var _jPages = [];
		_jPages.push({
			index:'news',
			class:'content-news', 
			title:'News', 		
			load:'news.html', 
			glyphicon:'icon-news', 
			data:false, 
			session:false
		});


	var _jApp = {
		
		domain: {
			url: 'http://10.0.1.125:9000/newsapi/v1/',
			news: function(_page) {
				return _jApp.domain.url +'news/search/1/' + _page + '/10';
			}
		},	
		
		loading: function(_index) {
			
		},
		
		load: function(_index) {
			
			try {
						
				var _jPage = _fFindPage(_index);
				if (_jPage) {
					$('body').removeClass();
					$('body').addClass(_jPage.class);
					$('main').empty();
					$('main').data('page',_jPage.index);		
					$('main').load(_jPage.load);	
				} else {
					this.error();
				}
			
	
			} catch(err) {    	
	  			this.error();
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



	function _fFindPage(_index) {
		
		var _return = false;
		
	 	$.each(_jPages, function(__index,_item) {
	 		if (_index.toLowerCase() == _item.index.toLowerCase()) _return = _item;					 			
	 		if (_return) return _return;
	 	});
	 		 	
	 	return _return;
	 		 	
	};
	

