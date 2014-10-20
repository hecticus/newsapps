var _url = 'http://10.0.1.125:9100/garotas';
var _parameters = {client:1};
var _jMenu = [];

_jMenu.push({index:_jMenu.length, class:'content-home', title:'Inicio', load:'home.html', glyphicon:'icon-home', json:false, session:false});
_jMenu.push({index:_jMenu.length, class:'content-favorites', title:'Meu favorito', load:'favorites.html', glyphicon:'icon-favorites', json:false, session:false});
_jMenu.push({index:_jMenu.length, class:'content-posts', title:'Posts', load:'posts.html', glyphicon:'icon-posts', json:false, session:false});

var _jApp = {
	
	loading: function(_index) {

	},
	
	load: function(_index) {
		
		try {
			
			$('body').removeClass();
			$('body').addClass('');
			$('main').empty();
			$('main').data('',_index);		
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
