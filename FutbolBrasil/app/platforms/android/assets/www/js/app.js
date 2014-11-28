
	//angular.module('FutbolBrasil', ['ngRoute','ngTouch','ngStorage','ngAnimate'])
	angular.module('FutbolBrasil', ['ngRoute','ngTouch','ngStorage'])
 	
 		.run(function($rootScope,$localStorage) {
			$rootScope.contentClass = 'content-init';
			$rootScope.$storage = $localStorage.$default({
				news: false,
				leaderboard:false,
				scorers:false,
				match:false,
			});
		})		
		
		
		.directive('wrapper', function() {
    		var directive = {};
    		directive.restrict = 'E'; /* restrict this directive to elements */
    		
			var _html = '<div id="wrapper" >'; 
					_html += '<div class="scroller">'; 
						_html += '<div class="container">';
						
						
						 
						_html += '</div>';
					_html += '</div>';
				_html += '</div>';
				
    		directive.template = _html;
    		return directive;
    		
		})
		
		
		.factory('domain', function () {
        	return {
        		 
				url: 'http://footballmanager.hecticus.com/',

            	news: function (_page) {
            		return this.url + 'newsapi/v1/news/search/1/' + _page + '/10';					
            	},
            	
            	standings: function () {
            		return this.url + 'api/v1/rankings/get/1';
            	},
            	
            	scorers: function () {
            		return this.url + 'footballapi/v1/players/competitions/scorers/1';
            	},
            	
            	match: function () {
            		return {
            			
            			today: this.url + 'footballapi/v1/matches/date/get/1/today',
            			
            			date: function (_date) {
            				return this.url + 'http://footballmanager.hecticus.com/footballapi/v1/matches/date/get/1/' + _date;	
            			}

            		};            		
            	}
            	
            	
            	
        	};
    	})
    	
	
		.factory('utilities', function () {
        	return {
        		
        		moment:function (_date) {
		 			var _oMoment = moment();	
					if (_date) _oMoment = moment(_date,'YYYYMMDD hh:mm');			
					_oMoment.locale('es');
					return _oMoment;
	 			},
	 			
	 			backbuttom: function () {
	 				            		
                	var _this =  angular.element('#wrapper2');  		 		           		
            		if (_this.hasClass('left')) {
            			_this.attr('class','page transition right');				
            		}	else {
            			
						if (navigator.app) {					
					        navigator.app.exitApp();				            
					    } else if (navigator.device) {			        	
					        navigator.device.exitApp();				            				          
					   }
					   
            		}
            	},
            	
        	};
    	})
				
		.config(function($routeProvider) {
	  		$routeProvider	    	
	    	.when('/match', {
	      		controller:'matchCtrl',
	      		templateUrl:'match.html',
	      		prev: '/livescore',
	      		next: '/standings'
	    	})	
	    	.when('/standings', {
	      		controller:'standingsCtrl',
	      		templateUrl:'standings.html',
	      		prev: '/match',
	      		next: '/news'
	    	})	 
	    	.when('/news', {
	      		controller:'newsCtrl',
	      		templateUrl:'news.html',
	      		prev: '/standings',
	      		next: '/scorers'
	    	})	    
	    	.when('/scorers', {
	      		controller:'scorersCtrl',
	      		templateUrl:'scorers.html',
	      		prev: '/news',
	      		next: '/livescore'
	    	})
	    	.when('/livescore', {
	      		controller:'livescoreCtrl',
	      		templateUrl:'livescore.html',
	      		prev: '/scorers',
	      		next: '/match'
	    	})	 	    		
	    	
	    	.when('/prediction', {
	      		controller:'predictionCtrl',
	      		templateUrl:'prediction.html',
	      		prev: '/points',
	      		next: '/leaderboard'
	    	})	
	    	    
			.when('/leaderboard', {
	      		controller:'leaderboardCtrl',
	      		templateUrl:'leaderboard.html',
	      		prev: '/prediction',
	      		next: '/friends'
	    	})		    	    

			.when('/friends', {
	      		controller:'friendsCtrl',
	      		templateUrl:'friends.html',
	      		prev: '/leaderboard',
	      		next: '/points'
	    	})

			.when('/points', {
	      		controller:'pointsCtrl',
	      		templateUrl:'points.html',
	      		prev: '/friends',
	      		next: '/prediction'
	    	})		    	    
	    	    		 	    	    	
	    	.otherwise({	    		
	    		redirectTo:'/news'									      		
	    	});
		})

 		.controller('mainCtrl', function($rootScope, $scope, $location, $route, $localStorage,$http) {

			$rootScope.$on('$routeChangeStart', 
                 function (event, current, previous, rejection) {
                 //
  			});
  			      
  			$rootScope.$on('$routeChangeSuccess', 
                 function (event, current, previous, rejection) {      	
                 //
  			});


  			$rootScope.menuClass = function(_page) {
    			var _current = $location.path().substring(1);
    			return _page === _current ? "active" : "";
  			};

			$rootScope.showSecction = function(_section) {
				angular.element('.section').removeClass('active');
				angular.element('[data-secction="' + _section + '"]').addClass('active');
				$location.path('/' + _section);				
			};		

			$rootScope.nextPage = function() {  		
				var _this =  angular.element('#wrapper2');
               if (!_this.hasClass('left')) {
                	$location.path($route.current.next);
               } 			    			 
			};

			$rootScope.prevPage = function() {
				
				var _this =  angular.element('#wrapper2');					
				if (_this.hasClass('left')) {
            		_this.attr('class','page transition right');						
				} else {
					$location.path($route.current.prev);
				}			
			};


			$rootScope.showErrorNews = function(_item) {				
				var _return = true;							
				if (_item.length > 0) _return = false;			
				return _return;									
			};


			$rootScope.showError = function(_item, _param) {
				
				var _return = true;
							
				angular.forEach(_item, function(_item) {
					if (eval('_item.' + _param)) {
						if (eval('_item.' + _param + '.length > 0')) {
  							_return = false;
  						}
					}  					  					
				});
				

				return _return;
									
			};


			$rootScope.removeHeader = function(_item, _param) {
				
				var _return = false;
											
				angular.forEach(_item, function(_item) {
					if (eval('_item.' + _param)) {
						if (eval('_item.' + _param + '.length > 0')) {
  							_return  = true;
  						}
					}  					  					
				});
				
				return _return;
									
			};


			$rootScope.removeArrow = function(_item, _param) {
				
				var _count = -1;
							
				angular.forEach(_item, function(_item) {
					if (eval('_item.' + _param)) {
						if (eval('_item.' + _param + '.length > 0')) {
  							_count ++;
  						}
					}  					  					
				});
				
				return _count;
									
			};



			$rootScope.removeElement = function(_item) {				
				if (_item) {				
					if (_item.length > 0) {
						return true;	
					} else {
						return false;	
					}
				} else {
					return false;
				}						
			};

			$rootScope.showCompetition = function(_option) {
				
				var _this = angular.element('.competition.active');
				var _first = 0;				
				var _last = (angular.element('span.competition').length - 1);
				var _current = angular.element('span.competition.active').data('index');
				_scroll.scrollTo(0,0,0);

				if (_option == 'next') {										
					if (_current == _last) {
						_this.removeClass('active');
						_this.prevAll().addClass('active flipInX').last();
					} else {
						_this.removeClass('active');
						_this.next().addClass('active flipInX');						
					}						
				} else {
					if (_current == _first) {
						_this.removeClass('active');							
						_this.nextAll().addClass('active flipInX').last();						
					} else {
						_this.removeClass('active');		
						_this.prev().addClass('active flipInX');
					}				
				}
				
				
			};
			

		})
 
 
 
 		.controller('predictionCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-prediction';
		}])
 
 
 		.controller('leaderboardCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-leaderboard';
		}])
  
 		.controller('friendsCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-friends';			
		}])
		
		.controller('pointsCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-points';			
		}])
 
 		.controller('livescoreCtrl', ['$http','$rootScope', function($http, $rootScope) {			
			$rootScope.contentClass = 'content-livescore';
		}])
 
 
 
 		.controller('scorersCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) {
 				
 			var _this = this;
			$rootScope.contentClass = 'content-scorers';
			
			if (!$rootScope.$storage.scorers) {
				$http.get(domain.scorers()).success(function(_json) {
					_this.item = _json.response;
					$rootScope.$storage.scorers = JSON.stringify(_this.item);
        		});	
			} else {
				_this.item = JSON.parse($rootScope.$storage.scorers);
			}
			
								
		}])
 
 
 		.controller('standingsCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) { 				
 			
 			var _this = this;
			$rootScope.contentClass = 'content-standings';

			
			if (!$rootScope.$storage.standings) {
				$http.get(domain.standings()).success(function(_json) {
					_this.item = _json.response;
					$rootScope.$storage.standings = JSON.stringify(_this.item);
        		});	
			} else {
				_this.item = JSON.parse($rootScope.$storage.standings);
			}
			
			
		}])
  
 		.controller('matchCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) {
 				
			var _this = this;		
			$rootScope.contentClass = 'content-match';						

			if (!$rootScope.$storage.match) {
				$http.get(domain.match().today).success(function(_json) {
					_this.item = _json.response;
					$rootScope.$storage.match = JSON.stringify(_this.item);
        		});	
			} else {
				_this.item = JSON.parse($rootScope.$storage.match);
			}

		}])
	
	


 		.controller('newsCtrl', ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) {

	 		var _this = this;



			_this.backPage = function() {
				utilities.backbuttom();
			};
				
			_this.share = function(_news) {
				window.plugins.socialsharing.share(_news.title,'Brazil Football',null,_news.summary);	
			};

			_this.fromNow = function(_date) {
				return utilities.moment(_date).fromNow();
			};

			_this.showContentNews = function(_news) {
				$rootScope.contentNews = _news;				
				angular.element('#wrapper2').attr('class','page transition left');
				_scroll2.scrollTo(0,0,0);
  			};
  			
			$rootScope.contentClass = 'content-news';
		
			if (!$rootScope.$storage.news) {
				$http.get(domain.news(1)).success(function(_json) {
					_this.item = _json.response;
					$rootScope.$storage.news = JSON.stringify(_this.item);
        		});	
			} else {
				_this.item = JSON.parse($rootScope.$storage.news);
			}





		}]);
 
 	var _app = angular.injector(['FutbolBrasil']);
 
