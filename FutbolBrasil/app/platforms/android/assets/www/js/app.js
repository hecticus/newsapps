
	var _scroll = false;
	
	//angular.module('FutbolBrasil', ['ngRoute','ngTouch','ngStorage','cordovaHTTP'])
	//El modulo cordovaHTTP est� generando un error cuando se hace el injector
			
	angular.module('FutbolBrasil', ['ngRoute','ngTouch','ngStorage'])
 	
 		.run(function($rootScope,$localStorage,$http, domain) {
 			
			$rootScope.contentClass = 'content-init';
			$rootScope.$storage = $localStorage.$default({
				news: false,
				leaderboard:false,
				scorers:false,
				match:false,
				competitions:false,
			});
			
			
			$http({method: 'GET', url:domain.competitions()}).success(function(obj){
				$rootScope.$storage.competitions = JSON.stringify(obj.response);
		   	});

		})
		
		.config(function($routeProvider) {
			
	  		$routeProvider
	  		
	  		.when('/login', {
	      		controller:'loginCtrl as login',
	      		templateUrl:'login.html',
	      		prev: '/login',
	      		next: '/login',
	      		_class: 'content-login'
	      		
	    	})

	  		.when('/match', {
	      		controller:'matchCtrl as _this',
	      		templateUrl:'match.html',
	      		prev: '/livescore/',
	      		next: '/standings/',
	      		_class: 'content-match'
	      		
	    	})
	    	
	    	.when('/standings', {
	      		controller:'standingsCtrl as _this',
	      		templateUrl:'standings.html',
	      		prev: '/match',
	      		next: '/news',
	      		contentClass: 'content-standings'
	    	})
	    	    
	    	.when('/scorers', {
	      		controller:'scorersCtrl  as _this',
	      		templateUrl:'scorers.html',
	      		prev: '/news',
	      		next: '/livescore',
	      		contentClass: 'content-scorers'
	    	})
	    	
	    	.when('/livescore', {
	      		controller:'livescoreCtrl  as _this',
	      		templateUrl:'livescore.html',
	      		prev: '/scorers',
	      		next: '/match',
	      		contentClass: 'content-livescore'
	    	})	 	    		
	    	
	    	.when('/prediction', {
	      		controller:'predictionCtrl  as _this',
	      		templateUrl:'prediction.html',
	      		prev: '/points',
	      		next: '/leaderboard',
	      		contentClass: 'content-prediction'
	    	})	
	    	    
			.when('/leaderboard', {
	      		controller:'leaderboardCtrl  as _this',
	      		templateUrl:'leaderboard.html',
	      		prev: '/prediction',
	      		next: '/friends',
	      		contentClass: 'content-leaderboard'
	    	})		    	    

			.when('/friends', {
	      		controller:'friendsCtrl  as _this',
	      		templateUrl:'friends.html',
	      		prev: '/leaderboard',
	      		next: '/points',
	      		contentClass: 'content-friends'
	    	})
 
			.when('/points', {
	      		controller:'pointsCtrl  as _this',
	      		templateUrl:'points.html',
	      		prev: '/friends',
	      		next: '/prediction',
	      		contentClass: 'content-points'
	    	})		    	    
	    	 
	    	.when('/news', {
	    		controller:'newsCtrl  as _this',
	      		templateUrl:'news.html',
	      		prev: '/standings',
	      		next: '/scorers',
	      		contentClass: 'content-news'
	    	})	
	    	    		 	    	    	
	    	.otherwise({	    		
	    		redirectTo:'/news'								      		
	    	});
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

		.directive('onLastRepeat', function() {
        	return function(scope, element, attrs) {

            	if (scope.$last) setTimeout(function(){
                	scope.$emit('onRepeatLast', element, attrs);
            	}, 1);
            	
            	if (scope.$first) setTimeout(function(){
                	scope.$emit('onRepeatFirst', element, attrs);
            	}, 1);
            	
        	};
    	})
		
		.factory('domain', function () {
        	return {
        		 
				url: 'http://footballmanager.hecticus.com/',

				competitions: function () {
            		return this.url + 'footballapi/v1/competitions/list/1';					
            	},

            	news: function () {
            		return {   
            			         		
            			index:  this.url + 'newsapi/v1/news/scroll/1',
            			
            			up: function (_news,_limit) { 
            				return 'http://footballmanager.hecticus.com/newsapi/v1/news/scroll/up/rest/1/' 
            				+ _news;
            			},
            			
            			down: function (_news,_limit) {
            				return  'http://footballmanager.hecticus.com/newsapi/v1/news/scroll/down/rest/1/' 
            					+ _news;
            			}
            			
            		};
			
            	},
            	
            	standings: function () {
            		return this.url + 'api/v1/rankings/get/1';
            	},
            	
            	phases: function (_competition) {
            		return this.url + 'footballapi/v1/competitions/phases/1/' + _competition;
            	},
            	
				ranking: function (_competition, _phase) {
            		return this.url + 'footballapi/v1/competitions/ranking/1/' + _competition + '/' + _phase;
            	},
	
            	scorers: function () {
            		return this.url + 'footballapi/v1/players/competitions/scorers/1';
            	},
            	
            	match: function (_date, _limit, _page) {    		
            		return this.url + 'footballapi/v1/matches/date/paged/1/' + _date + '?pageSize=' + _limit + '&page=' + _page;	          		
            	}

        	};
    	})

		.factory('utilities', function () {
        	return {
        		        		
        		error:function (_item, _param) {
        			
        			var _return = true;
        			
					if (_item) {
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
					} else {
						

						_return = false;
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
               		 		           		
            		if (angular.element('#wrapper3').hasClass('left')) {            		                    		
            			angular.element('#wrapper3').attr('class','page transition right');                    			  			
					} else if (angular.element('#wrapper2').hasClass('left')) {
						angular.element('#wrapper2').attr('class','page transition right');						
            		}else {
						if (navigator.app) {					
					        navigator.app.exitApp();				            
					    } else if (navigator.device) {			        	
					        navigator.device.exitApp();				            				          
					   }					   
            		}
            	},
            	
            	newScroll: {
            		vertical: function (_wrapper) {            			
						window[_wrapper] = new IScroll('#' + _wrapper,{click:true, preventDefault:true});		
						window[_wrapper].on('beforeScrollStart', function () {
							this.refresh();		
						});					
            		},
            	},
            	
            	
            	
            	
            	
            	
        	};
    	})

		.controller('loginCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
			
			$scope.msisdn = '';
			$scope.password = '';
			$scope.isPasswordScreenVisible = false;
			
			$scope.sendMsisdn = function(){
				if($scope.msisdn){
					console.log('sendMsisdn. msisdn: ' + $scope.msisdn);
					if(saveClientMSISDN($scope.msisdn)){
	//					createOrUpdateClient($scope.msisdn, null, true
	//							, $scope.showSetPasswordScreen(), $scope.showClientSignUpError());
	//					alert('MSISDN Saved');
						$scope.showPasswordScreen();
					} else {
						console.log('Error saving MSISDN');
						alert('Error saving MSISDN');
					}
				} else {
					alert('Please input your phone number');
				}
			};
			
			$scope.showPasswordScreen = function(){
				$scope.isPasswordScreenVisible = true;
			};
			
			$scope.showClientSignUpError = function(){
				alert('LogIn Error.');
			};
			
			$scope.doMsisdnLogin = function(){
				if($scope.password){
					console.log("doMsidnLogin. Init FB Manager.");
					getFBLoginStatus();
				} else {
					alert('doMsidnLogin. Please input password');
				}
			};
			
			$scope.init = function(){
				$rootScope.error = false;
				$rootScope.loading = false;
				$scope.isPasswordScreenVisible = false;
				console.log('Inside loginCtrl');
			}();
		}])


 		.controller('mainCtrl', ['$rootScope', '$scope', '$location', '$route', '$localStorage', '$http'
             , function($rootScope, $scope, $location, $route, $localStorage, $http) {

			$rootScope.$on('$routeChangeStart',  function (event, current, previous, rejection) {
	                $rootScope.loading = false;                                
					$rootScope.error = false;	
					
					loadClientMSISDN();
					if(!clientMSISDN){
						console.log('User not Authenticated');
						$location.path('/login');
					}
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
							
              /*if (!angular.element('#wrapper2').hasClass('left')) {
                	$location.path($route.current.next);
               } */	
               		    			 
			};

			$rootScope.prevPage = function() {
		
				if (angular.element('#wrapper3').hasClass('left')) {
            		angular.element('#wrapper3').attr('class','page transition right');
            	} else if (angular.element('#wrapper2').hasClass('left')) {
            		angular.element('#wrapper2').attr('class','page transition right');							
				} else {
					//$location.path($route.current.prev);
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
			

		}])
 
 
 
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
 
 
 
 		.controller('livescoreCtrl', ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities) {		
			
			
				var _this = this;		
 				var _angular =  angular.element;
				
				_this.date = utilities.moment().format('dddd Do YYYY');
							
				_this.getTime = function(_date) {
					return utilities.moment(_date).format('H:MM');
				};

				$http({method: 'GET', url: domain.match(utilities.moment().format('YYYYMMDD'),100,0)}).then(function(obj) {
					_this.item =  obj.data.response;
				}).finally(function(data) {
  					$rootScope.loading = false;  					
  					$rootScope.error = utilities.error();
				});

				$scope.$on('onRepeatFirst', function(scope, element, attrs) {		
					//console.log('onRepeatFirst');
 		    	});
 		
 				$scope.$on('onRepeatLast', function(scope, element, attrs) {
 					//console.log('onRepeatLast');								
				});
			
			
			 	var _scroll = new IScroll('#wrapper', {click:true, preventDefault:true, bounce: true,  probeType: 2});
				_scroll.on('beforeScrollStart', function () {
					this.refresh();						
				});
	
		}])
 
 
 
 		.controller('scorersCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities) {
 				
 				var _this = this;
				var _promise = false;
				var _element =  angular.element;

				_this.wrapper = {
					name:'wrapperV', 
					getName : function(_index) {
						return this.name + _index;
					} 
				};

				_this.width = window.innerWidth;
				_this.widthTotal = (window.innerWidth * 11);

				
 				if ($rootScope.$storage.scorers) {
 					_this.item = JSON.parse($rootScope.$storage.scorers);
 					$rootScope.loading = false;
 					$rootScope.error = utilities.error(_this.item.leagues,'scorers');
 				} else {
 					_promise = $http({method: 'GET', url: domain.scorers()});
					_promise.then(function(obj) {
						_this.item =  obj.data.response;
						$rootScope.$storage.scorers = JSON.stringify(obj.data.response);
					}).finally(function(data) {
	  					$rootScope.loading = false;  					
	  					$rootScope.error = utilities.error(_this.item.leagues,'scorers');
					}); 					
 				}
 				
				var _scroll = new IScroll('#wrapperH', { 
					scrollX: true, 
					scrollY: false, 
					mouseWheel: true, 
					momentum: false,
					snap: true,
					snapSpeed: 1000,
					probeType: 3,
					bounce: false,
				});
				
				_scroll.on('beforeScrollStart', function () {
					this.refresh();						
				});	
					
				$scope.$on('onRepeatLast', function(scope, element, attrs) {
					angular.forEach(_this.item.leagues, function(_item, _index) {							
						utilities.newScroll.vertical(_this.wrapper.getName(_index));
					});			
				});	
							
		}])

 		.controller('standingsCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) {

 				var _this = this;
 				var _promise = false; 
 							
 				$rootScope.loading = false;
				$rootScope.error = false;
				
				_this.fromNow = function(_date) {
					return utilities.moment(_date).format('MMMM Do YYYY');
				};
				
				_this.showContentPhases = function(competition) {
					
					$rootScope.loading = true;
					_this.item.ranking = [];
					_this.item.phases = [];
					_this.item.competition = false;
					_promise = $http({method: 'GET', url: domain.phases(competition.id_competitions)});
					_promise.then(function(obj) {
						
						_this.item.phases = obj.data.response.phases;
						_this.item.competition = competition;	
						if (_this.item.phases.length == 1) {
							_this.showContentRanking(_this.item.competition.id_competitions
									, _this.item.phases[0].id_phases);							
						} else {
							angular.element('#wrapper2').attr('class','page transition left');
							_scroll2.scrollTo(0,0,0);
						}

					}).finally(function(data) {
	  					$rootScope.loading = false;
	  					$rootScope.error = false;  						  					
					});		

	  			};
				
				_this.showContentRanking = function(competition,phase) {
					
					$rootScope.loading = true;
					_this.item.phase = false;
					_this.item.ranking = [];
					_promise = $http({method: 'GET', url: domain.ranking(competition,phase)});
					_promise.then(function(obj) {			
										
						_this.item.tree = obj.data.response.tree;
						_this.item.phase = obj.data.response.phase;	
						_this.item.ranking =  obj.data.response.ranking;
						
						angular.element('#wrapper3').attr('class','page transition left');					
						_scroll3.scrollTo(0,0,0);
						
					}).finally(function(data) {
	  					$rootScope.loading = false;
	  					$rootScope.error = false;  						  					
					});	

	  			};
				
				_this.item = JSON.parse($rootScope.$storage.competitions);

				 var _scroll = new IScroll('#wrapper',{click:true,preventDefault:true, bounce: true,  probeType: 2});
				_scroll.on('beforeScrollStart', function () {
					this.refresh();						
				});
				
				var _scroll2 = new IScroll('#wrapper2',{click:true, preventDefault:true});					
				_scroll2.on('beforeScrollStart', function () {
					this.refresh();
				});
				
				var _scroll3 = new IScroll('#wrapper3',{click:true, preventDefault:true});					
				_scroll3.on('beforeScrollStart', function () {
					this.refresh();
				});
				
		}])
  
 		.controller('matchCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) {

 				var _this = this;		
 				var _angular =  angular.element;
				var _limit = 100;
 				var _currentPage = 0;
 				var _start = true;				
				var _index = 0;
				
				_this.wrapper = {
					name:'wrapperV', 
					getName : function(_index) {
						return this.name + _index;
					} 
				};
				
				_this.getTime = function(_date) {
					return utilities.moment(_date).format('H:MM');
				};
				
				
				
				
 				_this.pagesBefore = [];
				_this.pagesAfter = [];
				
				_this.pages = [
					{name: utilities.moment().subtract(2, 'days').format('LL'), date:utilities.moment().subtract(2, 'days').format('YYYYMMDD')},
					{name:'Ontem', date:utilities.moment().subtract(1, 'days').format('YYYYMMDD')},
					{name:'Hoje', date:utilities.moment().format('YYYYMMDD')},
					{name:'Amanha', date:utilities.moment().add(1, 'days').format('YYYYMMDD')},
					{name: utilities.moment().add(2, 'days').format('LL'), date:utilities.moment().add(2, 'days').format('YYYYMMDD')},
 				];
				
				_this.width = window.innerWidth;
				_this.widthTotal = (window.innerWidth * _this.pages.length);
				
				angular.forEach(_this.pages, function(_item, _index) {
					$http({method: 'GET', url: domain.match(_item.date,_limit,0)})
					.then(function(obj) {						
						_this.pages[_index].matches =  obj.data.response;			
					}).finally(function(data) {
	  					$rootScope.loading = false;  					
	  					$rootScope.error = utilities.error();
					});
				});
				

 				var _scroll = new IScroll('#wrapperH', { 
 					scrollX: true, 
					scrollY: false, 
 					mouseWheel: false, 
 					momentum: false,
 					snap: true,
					snapSpeed: 700,
 					probeType: 3,
 					bounce: false
 				});
	
 				_scroll.on('beforeScrollStart', function () {
					this.refresh();						
 					//_unshift= false;			
 				});	
 				
 				_scroll.on('scrollStart', function () {
 					_currentPage = this.currentPage.pageX;
 				});

				_scroll.on('scroll', function () {
 	
 					if (this.currentPage.pageX != _currentPage) {

 						if (this.currentPage.pageX  == (_this.pages.length - 1)) {

							_index = _this.pagesAfter.length + 3;		
							_this.pagesAfter.push(
								{
									name: utilities.moment().add(_index, 'days').format('LL'), 
								 	date: utilities.moment().add(_index, 'days').format('YYYYMMDD')
								}
							);
	
					 		_this.pages.push((_this.pagesAfter[_this.pagesAfter.length - 1]));							 		
							_this.widthTotal = (window.innerWidth * _this.pages.length);								
						
							$rootScope.loading = true;  
							
							_index = _this.pages.length - 1;
							
							$http({method: 'GET', url: domain.match(_this.pages[_index].date,_limit,0)}).then(function(obj) {
								_this.pages[_index].matches =  obj.data.response;										
								utilities.newScroll.vertical(_this.wrapper.getName(_index));
							}).finally(function(data) {
			  					$rootScope.loading = false;  					
			  					$rootScope.error = utilities.error();
							});

 						} 

 						_currentPage = this.currentPage.pageX;
 						
 					}

 				});

				$scope.$on('onRepeatFirst', function(scope, element, attrs) {		
					//console.log('onRepeatFirst');
 		    	});
 		
 				$scope.$on('onRepeatLast', function(scope, element, attrs) {
 					//console.log('onRepeatLast');		
					if (_start) {
																	
 						_scroll.refresh();				
						_scroll.goToPage(2,0);			
						_start = false;	

						angular.forEach(_this.pages, function(_item, _index) {							
							utilities.newScroll.vertical(_this.wrapper.getName(_index));
						});
 			
					};					
				});
				

		}])
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
    	
 		.controller('newsCtrl', ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities) {

			var _this = this;
			var _news = {first:0, last:0};
			var _promise = false;
				
			$scope.$on('onRepeatFirst', function(scope, element, attrs) {		
				_news.first = element.first().data('news');
				$rootScope.loading = false;	
		    });					
					
			$scope.$on('onRepeatLast', function(scope, element, attrs) {
				_news.last = element.last().data('news');
				$rootScope.loading = false;	
		    });


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

 			if ($rootScope.$storage.news) {
 				_this.item = JSON.parse($rootScope.$storage.news);
				$rootScope.loading = false;
				$rootScope.error = utilities.error(_this.item.news);	 				
			} else {
				_promise = $http({method: 'GET', url: domain.news().index});
				_promise.then(function(obj) {
					_this.item =  obj.data.response;
					$rootScope.$storage.news = JSON.stringify(obj.data.response);
				}).finally(function(data) {
  					$rootScope.loading = false;
  					$rootScope.error = utilities.error(_this.item.news);
				}).catch(function() {
					$rootScope.error = true;				
				});			
			}
			
		 
		 	var _scroll = new IScroll('#wrapper',{click:true,preventDefault:true, bounce: true,  probeType: 2});
			_scroll.on('beforeScrollStart', function () {
				this.refresh();						
			});
				 
			_scroll.on('scroll', function () {

				if (this.y >= 50 ) {
					if ($http.pendingRequests.length == 0 && !$rootScope.loading) {							
						$rootScope.loading = true;
						_promise = $http({method: 'GET', url: domain.news().up(_news.first)});
						_promise.then(function(obj) {
							angular.forEach(obj.data.response.news, function(_item) {			
								_this.item.news.unshift(_item);
							});
						}).finally(function(data) {
							$rootScope.loading = false;  									  					
						});								
					}						
            	}

	            if (this.y <= this.maxScrollY) {	            				
	            	if ($http.pendingRequests.length == 0 && !$rootScope.loading) {	            			
            			$rootScope.loading = true;
            			_promise = $http({method: 'GET', url: domain.news().down(_news.last)});
						_promise.then(function(obj) {
							angular.forEach(obj.data.response.news, function(_item) {			
								_this.item.news.push(_item);
							});
						}).finally(function(data) {
							$rootScope.loading = false;  									  					
						});
					}		
				}

			});
		 		
			var _scroll2 = new IScroll('#wrapper2',{click:true, preventDefault:true});					
			_scroll2.on('beforeScrollStart', function () {
				this.refresh();
			});

		}]);

	var _app = angular.injector(['FutbolBrasil']);



	

