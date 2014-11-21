angular.module('FutbolBrasil', ['ngRoute'])
 	
	.config(function($routeProvider) {
	  $routeProvider
	    .when('/', {
	      controller:'newsCtrl',
	      templateUrl:'news.html',
	    })	 
	    .otherwise({
	      redirectTo:'/'
	    });
	})
 
 
 	.controller('newsCtrl', ['$http', function($http) {

 		var news = this;
 		 		
		$('body').removeClass();
		$('body').addClass('content-news');
		
 		news.getMoment = function (_date) {
 			var _oMoment = moment();	
			if (_date) _oMoment = moment(_date,'YYYYMMDD hh:mm');			
			_oMoment.locale('es');
			return _oMoment;
 		};
 		
		$http.get('http://10.0.1.125:9000/newsapi/v1/news/search/1/1/10').success(function(_json) {
			news.item = _json.response.news;
        });
        
	}]);
 
