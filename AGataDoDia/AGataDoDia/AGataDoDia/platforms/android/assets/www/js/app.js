	
	var _url = 'http://gatadodia.hecticus.com/garotas';
	var _jParameters = {client:1};
	var _jMenu = [];

	_jMenu.push({index:_jMenu.length, class:'content-home', title:'Inicio', load:'home.html', glyphicon:'icon-home', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-favorites', title:'Meu favorito', load:'favorites.html', glyphicon:'icon-favorites', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-posts', title:'Posts', load:'posts.html', glyphicon:'icon-posts', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-categories', title:'Categories', load:'categories.html', glyphicon:'icon-category', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-hall-of-fame', title:'Salao da Fama', load:'hall-of-fame.html', glyphicon:'icon-hall-of-fame', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-signin', title:'', load:'signin.html', glyphicon:'icon-signin', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-signup', title:'', load:'signup.html', glyphicon:'icon-signup', data:false, session:false});
	_jMenu.push({index:_jMenu.length, class:'content-terms', title:'', load:'terms.html', glyphicon:'icon-terms', data:false, session:false});
	
	var _jApp = {
		
		loading: function(_index) {
			var _html =  "<div class='container' style='text-align:center;'>";
				_html += '<div class="row" style="margin-top:100px !important;" >';
					_html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="height:' + ($(window).height() - 55) + 'px;" >';
						_html += '<h1 style="margin: 0 auto;">Loading...</h1>';		
					_html += '</div>';
				_html += '</div>';
			_html += '</div>';
			$('main').empty();
			$('main').append(_html);
	
		},
		
		load: function(_index) {
			
			
			try {
		
				$('body').removeClass();
				$('body').addClass(_jMenu[_index].class);
				$('main').empty();
				$('main').data('',_index);
				this.loading();		
				$('main').load(_jMenu[_index].load);
	
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
			
			this.load(0);
	  	},
	  	
	  	black: function(_url) {
	  		//var ref = window.open(_url, '_blank', 'location=yes');
         	/*ref.addEventListener('loadstart', function() { alert('start: ' + event.url); });
         	ref.addEventListener('loadstop', function() { alert('stop: ' + event.url); });
         	ref.addEventListener('exit', function() { alert(event.type); });*/	
	  	}

	  	    
	};


	$(document).on('click','[data-touch="category"]', function(e) {
		
	
		
		if(_fPreventDefaultClick(e)){return false;}
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
	
		if(_fPreventDefaultClick(e)){return false;}
		if(e.type == "touchstart" || e.type == "touchend") {return false;}
		var _load = $(this).data('target');
		var _woman = $(this).data('woman');
		var _post = $(this).data('post');
			
		if (_woman) {
			_jParameters.woman = _woman;	
		} else {
			_jParameters.woman  = false;	
		}
		
		if (_post) {
			_jParameters.post = _post;	
		} else {
			_jParameters.post  = false;	
		}
		
		_jApp.load(_load);
		
	});

	
	$(document).on('click','[data-touch="favorite"]', function(e) {
				
		if(_fPreventDefaultClick(e)){return false;}
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
	



