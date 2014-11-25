var a = false;


	angular.module('FutbolBrasil', ['ngRoute','ngTouch'])
 	
 		.run(function($rootScope) {
			$rootScope.contentClass = 'content-init';
		})		
		
		
		.factory('domain', function () {
        	return {
        		url: 'http://footballmanager.hecticus.com/newsapi/v1/',
            	news: function (_page) {
            		return this.url + 'news/search/1/' + _page + '/10';					
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

 		.controller('mainCtrl', function($rootScope, $location, $route) {
			
			 	
			$rootScope.$on('$routeChangeStart', 
                 function (event, current, previous, rejection) {
    			console.log('$routeChangeStart');
  			});
  			      
  			$rootScope.$on('$routeChangeSuccess', 
                 function (event, current, previous, rejection) {      
    			console.log('$routeChangeSuccess');
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
               if (_this.hasClass('left')) {
                	_this.attr('class','page transition right');
               } else{
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

		})
 
 		.controller('scorersCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-scorers';
		}])
 
 
 		.controller('standingsCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-standings';
		}])
  
 		.controller('matchCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-match';			
		}])
		
		.controller('livescoreCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-livescore';			
		}])
		
 		.controller('newsCtrl', ['$http','$rootScope','$route','domain','utilities', function($http, $rootScope, $route, domain, utilities,data) {
 			

 			
			$rootScope.contentClass = 'content-news';

	 		var news = this;

			news.backPage = function() {
				utilities.backbuttom();
			};
				
			news.share = function(_news) {
				window.plugins.socialsharing.share(_news.title,'Brazil Football',null,_news.summary);	
			};

			news.fromNow = function(_date) {
				return utilities.moment(_date).fromNow();
			};

			news.showContentNews = function(_news) {
				$rootScope.contentNews = _news;				
				angular.element('#wrapper2').attr('class','page transition left');
				_scroll2.scrollTo(0,0,0);	   							
  			};

			if (!a) {
				$http.get(domain.news(1)).success(function(_json) {
					news.item = _json.response.news;
					a = _json.response.news;								 
        		});	
			} else {
				news.item = a;
			}
			
 			 
 	  		
 	  
		}]);
 
 	var _app = angular.injector(['FutbolBrasil']);
 
