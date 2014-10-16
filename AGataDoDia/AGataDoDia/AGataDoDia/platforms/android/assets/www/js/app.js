var _url = 'http://10.0.1.125:9100/garotas';

var _jMenu = [];
	_jMenu.push({
		index:_jMenu.length, 
		class:'content-home', 
		title:'Home', 
		load:'home.html', 
		glyphicon:'icon-home', 
		json:false, 
		session:false
	});

var _jApp = {
	
	loading: function(_index) {

	},
	
	load: function(_index) {
		
		try {
			
			$('body').removeClass();
			$('body').addClass('');
			$('main').empty();
			$('main').data('home',_index);		
			$('main').load(_jMenu[_index].load);

		} catch(err) {    	
  			this.error();
		}
		 		       			
  	},
  	
  	offLine: function() {
  		
  	},
  	
  	error: function() {
  		
  	}
  	    
};
