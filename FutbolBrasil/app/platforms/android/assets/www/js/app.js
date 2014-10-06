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
			$('main').data('index',_index);		
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



$(document).on('click','header div[data-touch="menu"]', function(e) {
	
	if(_fPreventDefault(e)){return false;}
	if(e.type == "touchstart" || e.type == "touchend") {return false;}
	
	var _index = $(this).data('index');
	
	$('footer div[data-touch="menu"]').addClass('hidden');
	$('footer div.' + _index).removeClass('hidden');
		
});

