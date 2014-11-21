	var _domain = {
			url: 'http://10.0.1.125:9000/newsapi/v1/',
			news: function(_page) {
				return _domain.url +'news/search/1/' + _page + '/10';
			}
	};

	var _app = angular.module('FutbolBrasil', ['ngRoute'])
 	
 		.run(function($rootScope) {
			$rootScope.contentClass = 'content-init';
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
 
 		.controller('scorersCtrl', ['$http', function($http) {

		}])
 
 		.controller('livescoreCtrl', ['$http', function($http) {

		}])
 
 		.controller('leaderboardCtrl', ['$http', function($http) {

		}])
  
 		.controller('matchCtrl', ['$http', function($http) {

		}])

 		.controller('newsCtrl', ['$http','$rootScope', function($http,$rootScope) {
 			
			$rootScope.contentClass = 'content-news';

	 		var news = this;

	 		news.getMoment = function (_date) {
	 			var _oMoment = moment();	
				if (_date) _oMoment = moment(_date,'YYYYMMDD hh:mm');			
				_oMoment.locale('es');
				return _oMoment;
	 		};
 		
			$http.get(_domain.news(1)).success(function(_json) {
				news.item = _json.response.news;
	        });
        
		}]);
 
