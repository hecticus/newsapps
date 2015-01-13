'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MainCtrl
 * @description MainCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('MainCtrl', ['$rootScope', '$scope', '$location', '$state', '$localStorage', '$http'
      , function($rootScope, $scope, $location, $state, $localStorage, $http) {

      //TODO mover a application
			$rootScope.$on('$stateChangeStart',  function (event, toState, toParams, fromState, fromParams) {
        $rootScope.loading = false;
        $rootScope.error = false;

        loadClientMSISDN();
        if(!clientMSISDN){
          console.log('User not Authenticated');
          if(toState.name !== 'login'){
            $state.go('login');
          }
        }
			});

      //TODO mover a application
      $rootScope.$on('$stateChangeSuccess',  function (event, toState, toParams, fromState, fromParams) {
        $rootScope.loading = true;
        if (toState.data.contentClass){
          $rootScope.contentClass = toState.data.contentClass;
        }
      });


      $rootScope.menuClass = function(_page) {
        var _current = $location.path().substring(1);
        return _page === _current ? "active" : "";
      };

			$rootScope.showSection = function(_section) {
				angular.element('.section').removeClass('active');
				angular.element('[data-section="' + _section + '"]').addClass('active');
				$location.path('/' + _section);
			};

			$rootScope.nextPage = function() {
        /*if (!angular.element('#wrapper2').hasClass('left')) {
            $location.path($state.current.next);
         } */
			};

			$rootScope.prevPage = function() {

				if (angular.element('#wrapper3').hasClass('left')) {
            		angular.element('#wrapper3').attr('class','page transition right');
            	} else if (angular.element('#wrapper2').hasClass('left')) {
            		angular.element('#wrapper2').attr('class','page transition right');
				} else {
					//$location.path($state.current.prev);
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
		}
]);
