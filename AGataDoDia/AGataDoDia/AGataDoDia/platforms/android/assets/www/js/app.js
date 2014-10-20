	
	var _url = 'http://10.0.1.125:9100/garotas';
	var _jParameters = {client:1};
	var _jMenu = [];
	
	_jMenu.push({index:_jMenu.length, class:'content-home', title:'Inicio', load:'home.html', glyphicon:'icon-home', json:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-favorites', title:'Meu favorito', load:'favorites.html', glyphicon:'icon-favorites', json:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-posts', title:'Posts', load:'posts.html', glyphicon:'icon-posts', json:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-categories', title:'Categories', load:'categories.html', glyphicon:'icon-category', json:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-hall-of-fame', title:'Salao da Fama', load:'hall-of-fame.html', glyphicon:'icon-hall-of-fame', json:false, session:false});
	
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


	$(document).on('click','[data-touch="category"]', function(e) {
		
		if(_fPreventDefault(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		
		var _category = $(this).data('category');			

		if (_category) {
			_jParameters.category = _category;	
		} else {
			_jParameters.category  = false;	
		}
		
		_jApp.load(3);
		
	});



	$(document).on('click','[data-touch="load"]', function(e) {
		
		if(_fPreventDefault(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		var _load = $(this).data('target');
		var _woman = $(this).data('woman');
			
		if (_woman) {
			_jParameters.woman.id = _woman;	
		} else {
			_jParameters.woman  = false;	
		}
		
		_jApp.load(_load);	
		
	});

	$(document).on('click','[data-touch="post"]', function(e) {
		if(_fPreventDefault(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		var _post = $(this).data('post');		
	});


	$(document).on('click','[data-touch="favorite"]', function(e) {
				
		if(_fPreventDefault(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		
		var _woman = $(this).data('woman');
		var _data = {'add_woman': [],'remove_woman': []};
		
		if($(this).hasClass('on')) {
			$('[data-touch="favorite"][data-woman="' + _woman + '"]').removeClass('on');
			_data.remove_woman.push(_woman);		
		} else {
			$('[data-touch="favorite"][data-woman="' + _woman + '"]').addClass('on');
			_data.add_woman.push(_woman);		
		}

		_fPostAjaxJson(_url + '/v1/clients/update/' + _jParameters.client,_data) ;
		
	});
	



