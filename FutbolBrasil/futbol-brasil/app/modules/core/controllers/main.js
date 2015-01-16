'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MainCtrl
 * @description MainCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('MainCtrl', ['$rootScope', '$scope', '$location', '$state', '$localStorage', '$http', 'Domain'
      , function($rootScope, $scope, $location, $state, $localStorage, $http, Domain) {

        $rootScope.$storage = $localStorage;

        $scope.isActive = function(className){
            return $state.current.name === className;
        },

        $rootScope.showSection = function(_section) {
            $state.go(_section);
        },

        $rootScope.nextPage = function() {
        /*if (!angular.element('#wrapper2').hasClass('left')) {
            $location.path($state.current.next);
         } */
        },

        $rootScope.prevPage = function() {
            //TODO $state.go();
            if (angular.element('#wrapper3').hasClass('left')) {
                angular.element('#wrapper3').attr('class','page transition right');
            } else if (angular.element('#wrapper2').hasClass('left')) {
                angular.element('#wrapper2').attr('class','page transition right');
            }

        },

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

        },

        //TODO not being used
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

        },

        $rootScope.removeElement = function(_item) {
            if (_item) {
                return _item.length > 0;
            } else {
                return false;
            }
        },

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
        },

        $scope.getCompetitions = function(){
            return $http({method: 'GET', url:Domain.competitions()}).success(function(obj){
                //TODO Usado en StandingsCtrl
                $rootScope.$storage.competitions = JSON.stringify(obj.response);
            });
        },

        $scope.init = function(){
            $scope.getCompetitions();
        }();
    }
]);
