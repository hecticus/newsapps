
	var _called = false;
	var _scroll = false;
	
	//angular.module('FutbolBrasil', ['ngRoute','ngTouch','ngStorage','ngAnimate'])
	var _app = angular.module('FutbolBrasil', ['ngRoute','ngTouch','ngStorage'])
 	
 		.run(function($rootScope,$localStorage) {
			$rootScope.contentClass = 'content-init';
			$rootScope.$storage = $localStorage.$default({
				news: false,
				leaderboard:false,
				scorers:false,
				match:false,
			});
		})		
		
		
		
		.directive('myScroll', function() {
			return function(scope, element, attrs) {
			    
		    if (scope.$last){
		    		    	
		      	_scroll = new IScroll('#wrapper',{click:true, preventDefault:true});
				_scroll.on('beforeScrollStart', function () {
					this.refresh();		
				});
						      
		    }
		    
		  };
		})
		

		.directive('loading', function () {
			
			var directive = {};
    		directive.restrict = 'E'; /* restrict this directive to elements */
			directive.replace = true;
			
			var _html = '<div class="loading" >'; 
					_html += '<span class="label label-default">loading...</span>';
				_html += '</div>';

			directive.template = _html;
			directive.link = function (scope, element, attr) {
	              scope.$watch('loading', function (val) {
	                  if (val)
	                      $(element).show();
	                  else
	                      $(element).hide();
	              });
		      };
			
		    return directive;
		})
		
		
		
		.directive('error', function() {

			var directive = {};
			directive.restrict = 'E'; /* restrict this directive to elements */
			directive.replace = true;
			
			var _html = '<div class="error" >'; 			
				_html += '<span class="icon-material-error" style="font-size: 10em; text-shadow: -1px 1px 1px rgba(0,0,0,0.5);"></span>';
				_html += '<h1 style="text-shadow: -1px 1px 1px rgba(0,0,0,0.5);">Conte&uacute;do n&atilde; dispon&iacute;vel</h1>';
			_html += '</div>';
						
			directive.template = _html;
			directive.link = function (scope, element, attr) {
	              scope.$watch('error', function (val) {
	                  if (val)
	                      $(element).show();
	                  else
	                      $(element).hide();
	              });
		      };
			
		    return directive;

		})
			

		
		.factory('domain', function () {
        	return {
        		 
				url: 'http://footballmanager.hecticus.com/',

				competitions: function () {
            		return this.url + 'footballapi/v1/competitions/list/ids/1';					
            	},

            	news: function () {
            		return {   
            			         		
            			index:  this.url + 'newsapi/v1/news/scroll/1',
            			
            			up: function (_news) { 

            				return 'http://footballmanager.hecticus.com/newsapi/v1/news/scroll/up/rest/1/' + _news;
            			},
            			
            			down: function (_news) {
            				return  'http://footballmanager.hecticus.com/newsapi/v1/news/scroll/down/rest/1/' + _news;
            			}
            			
            		};
			
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
            				return 'http://footballmanager.hecticus.com/footballapi/v1/matches/date/get/1/' + _date;	
            			}

            		};            		
            	}
            	
            	
            	
        	};
    	})
    	
	
		.factory('utilities', function () {
        	return {
        		        		
        		error:function (_item, _param) {
        			
        			var _return = true;
					
					if (_param) {
						angular.forEach(_item, function(_item) {
							if (eval('_item.' + _param)) {
								if (eval('_item.' + _param + '.length > 0')) {
	  								_return = false;
	  							}
							}  					  					
						});							
					} else {
						if (_item.length > 0) {
							_return = false;	
						}						
					}

					return _return;
        			
        		},
        		
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
	      		prev: '/livescore/',
	      		next: '/standings/',
	      		_class: 'content-match'
	    	})
	    	
	    	.when('/standings', {
	      		controller:'standingsCtrl',
	      		templateUrl:'standings.html',
	      		prev: '/match',
	      		next: '/news',
	      		contentClass: 'content-standings'
	    	})
	    	    
	    	.when('/scorers', {
	      		controller:'scorersCtrl',
	      		templateUrl:'scorers.html',
	      		prev: '/news',
	      		next: '/livescore',
	      		contentClass: 'content-scorers'
	    	})
	    	
	    	.when('/livescore', {
	      		controller:'livescoreCtrl',
	      		templateUrl:'livescore.html',
	      		prev: '/scorers',
	      		next: '/match',
	      		contentClass: 'content-livescore'
	    	})	 	    		
	    	
	    	.when('/prediction', {
	      		controller:'predictionCtrl',
	      		templateUrl:'prediction.html',
	      		prev: '/points',
	      		next: '/leaderboard',
	      		contentClass: 'content-prediction'
	    	})	
	    	    
			.when('/leaderboard', {
	      		controller:'leaderboardCtrl',
	      		templateUrl:'leaderboard.html',
	      		prev: '/prediction',
	      		next: '/friends',
	      		contentClass: 'content-leaderboard'
	    	})		    	    

			.when('/friends', {
	      		controller:'friendsCtrl',
	      		templateUrl:'friends.html',
	      		prev: '/leaderboard',
	      		next: '/points',
	      		contentClass: 'content-friends'
	    	})

			.when('/points', {
	      		controller:'pointsCtrl',
	      		templateUrl:'points.html',
	      		prev: '/friends',
	      		next: '/prediction',
	      		contentClass: 'content-points'
	    	})		    	    
	    	 
	    	.when('/news', {
	    		controller:'newsCtrl',
	      		templateUrl:'news.html',
	      		prev: '/standings',
	      		next: '/scorers',
	      		contentClass: 'content-news'
	    	})	
	    	    		 	    	    	
	    	.otherwise({	    		
	    		redirectTo:'/news'								      		
	    	});

	    	
		})

 		.controller('mainCtrl', function($rootScope, $scope, $location, $route, $localStorage, $http) {

			$rootScope.$on('$routeChangeStart', 
                 function (event, current, previous, rejection) {
                $rootScope.loading = false;                                
				$rootScope.error = false;
				_called = false;					
  			});
  			      
  			$rootScope.$on('$routeChangeSuccess', 
                 function (event, current, previous, rejection) {
                $rootScope.loading = true;
             	if ($route.current.contentClass)
             		$rootScope.contentClass = $route.current.contentClass;
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
						//_this.removeClass('active');
						//_this.siblings('div:first, span:first').addClass('active flipInX');						
					} else {
						_this.removeClass('active');
						_this.next().addClass('active flipInX');						
					}						
				} else {
					if (_current == _first) {
						//_this.removeClass('active');							
						//_this.siblings('div:last, span:last').addClass('active flipInX');						
					} else {
						_this.removeClass('active');		
						_this.prev().addClass('active flipInX');
					}				
				}
				
				
			};
			

		})
 
 
 
 		.controller('predictionCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.error = true;	        	
			$rootScope.loading = false; 
		}])
 
 
 		.controller('leaderboardCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.error = true;	        	
			$rootScope.loading = false;  
		}])
  
 		.controller('friendsCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.error = true;	        	
			$rootScope.loading = false;  			
		}])
		
		.controller('pointsCtrl', ['$http','$rootScope', function($http, $rootScope) {
			$rootScope.error = true;	        	
			$rootScope.loading = false;  			
		}])
 
 		.controller('livescoreCtrl', ['$http','$rootScope', function($http, $rootScope) {			
			$rootScope.error = true;	        	
			$rootScope.loading = false;
		}])
 
 
 
 		.controller('scorersCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) {
 			
 			
 			if (_called) {
 				var _this = this;

				if (!$rootScope.$storage.scorers) {
					$http.get(domain.scorers())
					
					.success(function(_json) {
						
						try {
			 				_this.item = _json.response;
							$rootScope.$storage.scorers = JSON.stringify(_this.item);
							$rootScope.loading = false;
							$rootScope.error = utilities.error(_this.item.leagues,'scorers');	
						} catch(err) {
			 				$rootScope.error = true;	        	
				        	$rootScope.loading = false;				
						}
			
	        		})
	        		        		
	        		.error(function() {
	        			$rootScope.error = true;	        	
						$rootScope.loading = false;
	        		});
	        			
				} else {
					_this.item = JSON.parse($rootScope.$storage.scorers);
					$rootScope.loading = false;
					$rootScope.error = utilities.error(_this.item.leagues,'scorers');
				}

 			}
 				
 			_called = true;
			
								
		}])
 
 
 		.controller('standingsCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) {
 				 				
 			if (_called) {
 				
 				var _this = this;

			
				if (!$rootScope.$storage.standings) {
					$http.get(domain.standings())
					
					.success(function(_json) {
						
						try {
			 				_this.item = _json.response;
							$rootScope.$storage.standings = JSON.stringify(_this.item);
							$rootScope.loading = false;
							$rootScope.error = utilities.error(_this.item.rankings,'ranks');	
						} catch(err) {
			 				$rootScope.error = true;	        	
				        	$rootScope.loading = false;				
						}
					
	        		})
	        		
	        		.error(function() {
	        			$rootScope.error = true;	        	
						$rootScope.loading = false;
	        		});
	        		
				} else {
					_this.item = JSON.parse($rootScope.$storage.standings);
					$rootScope.loading = false;
					$rootScope.error = utilities.error(_this.item.rankings,'ranks');
				}
 				
 				_scroll = new IScroll('#wrapper',{click:true, preventDefault:true});
				_scroll.on('beforeScrollStart', function () {
					this.refresh();			
				});
 			}
 			
			_called = true;
			
		}])
  
 		.controller('matchCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) {

			if (_called) {
				
				var _this = this;		
				

				if (!$rootScope.$storage.match) {
					$http.get(domain.match().today)
					
					.success(function(_json) {		
						
						try {
			 				_this.item = _json.response;
							$rootScope.$storage.match = JSON.stringify(_this.item);
							$rootScope.loading = false;					
							$rootScope.error = utilities.error(_this.item.leagues, 'fixtures');
						} catch(err) {
			 				$rootScope.error = true;	        	
				        	$rootScope.loading = false;				
						}
	
	        		})
	        		
	        		.error(function() {
	        			$rootScope.error = true;	        	
						$rootScope.loading = false;	
	        		});
	
				} else {				
					_this.item = JSON.parse($rootScope.$storage.match);
					$rootScope.loading = false;
					$rootScope.error = utilities.error(_this.item.leagues, 'fixtures');				
				}
							
				
			}

			_called = true;
			
			

		}])

		.directive('onLastRepeat', function() {
        	return function(scope, element, attrs) {
            	if (scope.$last) setTimeout(function(){
                	scope.$emit('onRepeatLast', element, attrs);
            	}, 1);
        	};
    	})
    	
 		.controller('newsCtrl', ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) {

				

				if (_called) {
					
			
					var _this = this;
					var _news = 0;
					
					$scope.$on('onRepeatLast', function(scope, element, attrs){
						_news = element.last().data('news');
				    });
	

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
		  			
		  		 	
	 
		 			if (!$rootScope.$storage.news) {
						$http.get(domain.news().index())
						
						.success(function(_json) {
							
							try {
				 				_this.item = _json.response;
								$rootScope.$storage.news = JSON.stringify(_this.item);
								$rootScope.loading = false;	
								$rootScope.error = utilities.error(_this.item.news);	
							} catch(err) {
				 				$rootScope.error = true;	        	
					        	$rootScope.loading = false;				
							}
							
		        		})	
		        		
		        		.error(function() {	
		        			$rootScope.error = true;
		        			$rootScope.loading = false;
		        		});
		        		
					} else {
						_this.item = JSON.parse($rootScope.$storage.news);
						$rootScope.loading = false;
						$rootScope.error = utilities.error(_this.item.news);	
					}
					
				 
				 	var _scroll = new IScroll('#wrapper',{click:true,preventDefault:true, bounce: true,  probeType: 2});
				 						
					_scroll.on('beforeScrollStart', function () {
						this.refresh();						
					});
				 
				 	_scroll.on('scroll', function () {


				 		/*if (this.y >= 5 && !$rootScope.loading) {
				 			
				 			alert($http.pendingRequests.length);
				 			
				 			
				 			if ($http.pendingRequests.length == 0) {
									
								$rootScope.loading = true;		
								
								$http.get(domain.news(5,2))
								.success(function(_json) {									
									try {		
										
										angular.forEach(_json.response.news, function(_item) {			
											_this.item.news.unshift(_item);
										});
										
										$rootScope.loading = false;
										
									} catch(err) {
																 								
									}
									
				        		})	
				        		
				        		.error(function() {	
				        			
				        		});
								
								
							}
				 			
				 			
				 		}*/
				 		
				 					 	
					if (this.y >= this.maxScrollY) {
				
							if ($http.pendingRequests.length == 0) {
								
	
								//$rootScope.loading = true;		
								$http.get(domain.news().down(_news))
								.success(function(_json) {
									
									try {	
										
										angular.forEach(_json.response.news, function(_item) {			
											_this.item.news.push(_item);
										});
										
									//	$rootScope.loading = false;
 
									} catch(err) {
																 								
									}
									
				        		})	
				        		
				        		.error(function() {	
				        			
				        		});
								
								
							}
				
							

						}
					});
		 		
					var _scroll2 = new IScroll('#wrapper2',{click:true, preventDefault:true});					
					_scroll2.on('beforeScrollStart', function () {
						this.refresh();
					});
				} 				


					
				 
					



				_called = true;
				
	 			

		}]);

