
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
	    	
	    	.when('/mtm', {
	      		controller:'mtmCtrl  as _this',
	      		templateUrl:'mtm.html',
	      		prev: '/scorers',
	      		next: '/match',
	      		contentClass: 'content-mtm'
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
            		
            		var _this = this;
            		
            		return {   
            			         		
            			index:  function (_news,_limit) { 
            				return _this.url + 'newsapi/v1/news/scroll/1';
            			},
            			
            			up: function (_news,_limit) { 
            				return _this.url + 'newsapi/v1/news/scroll/up/rest/1/' + _news;
            			},
            			
            			down: function (_news,_limit) {
            				return   _this.url + 'newsapi/v1/news/scroll/down/rest/1/' + _news;
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
            	},


				mtm: function (_event) {
            		return this.url + 'footballapi/v1/matches/mam/next/1/5/390/' + _event;
            	},
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
            		horizontal: function (_wrapper) {
            			
            			delete window[_wrapper] ;
            			
            			window[_wrapper] = new IScroll('#' + _wrapper, { 
		 					scrollX: true, 
							scrollY: false, 
		 					mouseWheel: false, 
		 					momentum: false,
		 					snap: true,
							snapSpeed: 700,
		 					probeType: 3,
		 					bounce: false
 						});
	
						window[_wrapper].on('beforeScrollStart', function () {
							this.refresh();		
						});	
						
						return window[_wrapper];	

            		}
            		
            		,vertical: function (_wrapper) {  
            			
            			delete window[_wrapper] ;    
            			      			
						window[_wrapper] = new IScroll('#' + _wrapper, {click:true,preventDefault:true, bounce: true,  probeType: 2});		
						window[_wrapper].on('beforeScrollStart', function () {
							this.refresh();		
						});	
						
						return window[_wrapper];	
									
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
             ,function($rootScope, $scope, $location, $route, $localStorage, $http) {

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
 
 

 		.controller('mtmCtrl', ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities','$timeout',
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,$timeout) {		
				
				/* Events */
				/*
					'1', 'Gol de jogada'
					'2', 'Gol de cabe�a'
					'3', 'Gol contra'
					'4', 'Gol de p�nalti'
					'5', 'Gol de falta'
					'6', 'Cart�o amarelo'
					'7', 'Substitui��o'
					'8', 'Gol por tribunal de disciplina'
					'9', 'Cart�o vermelho'
					'10', 'Vermelho, duas amarelas'
				*/
				/* Events */
						
				var _this = this;		
 				var _angular =  angular.element;
				var _scroll = utilities.newScroll.vertical('wrapper');
				var _scroll2 = utilities.newScroll.vertical('wrapper2');				
				var _event = {first:0, last:0};
			
				_this.interval = false;
				
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

				_this.refreshEvents = function() {
					
					
					if ($http.pendingRequests.length == 0 && !$rootScope.loading) {
						
						$rootScope.loading = true; 

						$http({method: 'GET', url: domain.mtm(_event.first)}).then(function(obj) {
							
							if (obj.data.error == 0) {
								
								if (_this.item.mtm.length == 0) {
									_this.item.mtm = obj.data.response;
								} else {									
									angular.forEach(obj.data.response.actions[0].events, function(_event, _eIndex) {										
										_this.item.mtm.actions[0].events.unshift(_event);										
									});								
								}
								
								_event.first =  obj.data.response.actions[0].events[0].id_game_match_events;													
								_this.item.match.home.goals = obj.data.response.home_team_goals;
								_this.item.match.away.goals = obj.data.response.away_team_goals;
								
														
							}
							
						}).finally(function(data) {
		  					$rootScope.loading = false;  					
		  					$rootScope.error = utilities.error();
						});
						
						
						
						
					}
					
					$timeout.cancel(_this.interval);
					_this.interval = $timeout(function () {
			 			_this.refreshEvents();
	  			 	},50000);
					
				};
				
				
				_this.showContentEvents = function(_league, _match) {
					
					_this.item.mtm = [];
					_this.item.league = _league;					
					_this.item.match = {
						home: {name:_match.homeTeam.name, goals:_match.home_team_goals}, 
						away: {name:_match.awayTeam.name, goals:_match.away_team_goals},
						status: _match.status
					};	
										
					angular.element('#wrapper2').attr('class','page transition left');
					_scroll2.scrollTo(0,0,0);
					_this.refreshEvents();	
					 						
	  			};
	  			
	  			 
	  			_this.prevPageMtM = function () {
	  				$rootScope.loading = false;
	  				_event = {first:0, last:0};
	  				$timeout.cancel(_this.interval);
	  				$rootScope.prevPage();
	  			};
	  			
	  
	  			
	  			
	
		}])
 
 
 
 		.controller('scorersCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities) {
 				
 				var _this = this;
 				var _element =  angular.element;
				var _promise = false;
				

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
 				
 				var _scroll = utilities.newScroll.horizontal('wrapperH');
					
				$scope.$on('onRepeatLast', function(scope, element, attrs) {
					angular.forEach(_this.item.leagues, function(_item, _index) {							
						utilities.newScroll.vertical(_this.wrapper.getName(_index));
					});			
				});	
							
		}])

 		.controller('standingsCtrl',  ['$http','$rootScope','$scope','$route','$localStorage','domain','utilities', 
 			function($http, $rootScope, $scope, $route,$localStorage,domain,utilities,data) {

 				var _this = this;
 				var _angular =  angular.element;
 				var _promise = false; 
 				
 				var _scroll = utilities.newScroll.vertical('wrapper');
				var _scroll2 = utilities.newScroll.vertical('wrapper2');
				var _scroll3 = utilities.newScroll.vertical('wrapper3');	
 							
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
				
				var _scroll = utilities.newScroll.horizontal('wrapperH');
	 				
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
 		
 				$scope.$on('onRepeatLast', function(scope, element, attrs) {	
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
			var _angular =  angular.element;
			var _news = {first:0, last:0};
			var _scroll = utilities.newScroll.vertical('wrapper'); 
			var _scroll2 = utilities.newScroll.vertical('wrapper2');
							
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
 				_news.first = _this.item.news[0].idNews;
				_news.last  = _this.item.news[_this.item.news.length-1].idNews;
				$rootScope.loading = false;
				$rootScope.error = utilities.error(_this.item.news);	 				
			} else {
				console.log('index-> ' + domain.news().index());
				$http({method: 'GET', url: domain.news().index()})
				.then(function(obj) {
					_this.item =  obj.data.response;
					_news.first = _this.item.news[0].idNews;
					_news.last  = _this.item.news[_this.item.news.length-1].idNews;
					$rootScope.$storage.news = JSON.stringify(obj.data.response);
				}).finally(function(data) {
  					$rootScope.loading = false;
  					$rootScope.error = utilities.error(_this.item.news);
				}).catch(function() {
					$rootScope.error = true;				
				});			
			}
			
		  
			_scroll.on('scroll', function () {

				if (this.y >= 50 ) {
					if ($http.pendingRequests.length == 0 && !$rootScope.loading) {							
						$rootScope.loading = true;

						$http({method: 'GET', url: domain.news().up(_news.first)})
						.then(function(obj) {
							if (obj.data.response.news.length >= 1) {
								_news.first = obj.data.response.news[0].idNews;
								angular.forEach(obj.data.response.news, function(_item) {			
									_this.item.news.unshift(_item);
								});
							}							
						}).finally(function(data) {
							$rootScope.loading = false;  									  					
						});								
					}						
            	}

	            if (this.y <= this.maxScrollY) {	            				
	            	if ($http.pendingRequests.length == 0 && !$rootScope.loading) {	            			
            			$rootScope.loading = true;
            		
            			$http({method: 'GET', url: domain.news().down(_news.last)})
						.then(function(obj) {
							if (obj.data.response.news.length >= 1) {
								_news.last = obj.data.response.news[obj.data.response.news.length-1].idNews;
								angular.forEach(obj.data.response.news, function(_item) {			
									_this.item.news.push(_item);
								});
							}							
						}).finally(function(data) {
							$rootScope.loading = false;  									  					
						});
					}		
				}
				
				
			});
			
		 	
		 	


		}]);

	var _app = angular.injector(['FutbolBrasil']);



	

