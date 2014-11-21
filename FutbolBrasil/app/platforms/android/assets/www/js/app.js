
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
        		
            	backButtom: function () {            		
                	if ($('#wrapper2').hasClass('left')) {						
						$('#wrapper2').attr('class','page transition right');									
					}					
            	}
        	};
    	})
		
		
		.config(function($routeProvider) {
	  		$routeProvider
	    	.when('/news', {
	      		controller:'newsCtrl',
	      		templateUrl:'news.html',
	    	})	    	
	    	.when('/match', {
	      		controller:'matchCtrl',
	      		templateUrl:'match.html',
	    	})	
	    	.when('/leaderboard', {
	      		controller:'leaderboardCtrl',
	      		templateUrl:'leaderboard.html',
	    	})	 
	    	.when('/scorers', {
	      		controller:'scorersCtrl',
	      		templateUrl:'scorers.html',
	    	})	    		    		 	    
	    	.when('/livescore', {
	      		controller:'livescoreCtrl',
	      		templateUrl:'livescore.html',
	    	})	 
	    	.otherwise({	    		
	    		redirectTo:'/news'									      		
	    	});
		})
 
 		.controller('mainCtrl', function($scope, $location) {
  			
  			$scope.menuClass = function(page) {
    			var current = $location.path().substring(1);
    			return page === current ? "active" : "";
  			};

		})
 
 		.controller('scorersCtrl', ['$http','$rootScope', function($http, $rootScope) {
				$rootScope.contentClass = 'content-scorers';
		}])
 
 		.controller('livescoreCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-livescore';
		}])
 
 		.controller('leaderboardCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-leaderboard';
		}])
  
 		.controller('matchCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.contentClass = 'content-match';
		}])
		
 		.controller('newsCtrl', ['$http','$rootScope','domain','utilities', function($http, $rootScope, domain, utilities) {
 			
			$rootScope.contentClass = 'content-news';

	 		var news = this;

			news.fromNow = function(_date) {
				return utilities.moment(_date).fromNow();
			};

			news.showContentNews = function(_news) {
				$rootScope.contentNews = _news;				
				$('#wrapper2').attr('class','page transition left');	   							
  			};

 		
			$http.get(domain.news(1)).success(function(_json) {
				news.item = _json.response.news;
	        });
        
		}]);
 
 	var _app = angular.injector(['FutbolBrasil']);
 
