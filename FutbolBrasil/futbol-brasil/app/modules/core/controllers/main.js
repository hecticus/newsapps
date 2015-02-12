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
        , '$timeout', '$window', 'Domain', 'ClientManager','CordovaApp'
        , function($rootScope, $scope, $location, $state, $localStorage, $http, $timeout, $window, Domain
            , ClientManager, CordovaApp) {

            $rootScope.$storage = $localStorage;
            $scope.strings = {
                MENU_NOTISTATS : 'NotiStats',
                MENU_BETS : 'Palpites',
                MENU_SETTINGS : 'Definições'
            };

            $scope.$on('load', function(){
                $scope.loading = true;
                $scope.error = false;
            });

            $scope.$on('unload', function(){$scope.loading = false;});
            $scope.$on('error', function(){
                $scope.error = true;
                $scope.loading = false;
                }
            );

            $scope.isActive = function(className){
                return $state.current.name === className;
            };

            $scope.getDrawerIcon = function(){
                var classStr = 'icon ';
                if(angular.element('.page.back.left:last').hasClass('left')){
                    classStr += 'mdi-navigation-arrow-back ';
                } else {
                    classStr += 'mdi-navigation-menu';
                }
                return classStr;
            };

            $rootScope.showMenu = function() {
                if ($('#wrapperM').hasClass('left')) {
                    console.log('showMenu. invisible. showing');
                    $window.addEventListener('touchmove', function(){
                        $scope.hideMenu();
                        $window.removeEventListener('touchmove');
                    });
                    $rootScope.transitionPage('#wrapperM', 'right');
                } /*else {
                    console.log('showMenu. visible. hiding');
                    $scope.hideMenu();
                }*/
            };

            $rootScope.hideMenu = function() {
                if ($('#wrapperM').hasClass('right')) {
                    console.log('hideMenu. visible. hiding');
                    $rootScope.transitionPage('#wrapperM', 'left');
                }
            };

            $rootScope.runBackButton = function() {
                console.log('runBackButton.');
                if (angular.element('.page.back.left:last').hasClass('left')) {
                    $rootScope.transitionPage('.page.back.left:last', 'right')
                } else if ($('#wrapperM').hasClass('right')) {
                   $scope.hideMenu();
                } else if ($('#wrapperM').hasClass('left')){
                    $scope.showMenu();
                }
                //TODO reemplazar por escucha de botón back
//                } else if (_exit && confirm('Para sair da aplicação')) {
//                    CordovaApp.exitApp();
//                }
            };

            $rootScope.showSection = function(_section) {
                $timeout(function() {
                    angular.element('.section').removeClass('active');
                    angular.element('[data-section="' + _section + '"]').addClass('active');
                    $scope.hideMenu();
                    $state.go(_section);
                },300);
            };

            $rootScope.transitionPage = function(_wrapper, _direction, _class) {
                if (!_class) _class = '';
                angular.element(_wrapper).attr('class', _class + ' page transition ' + _direction);
            };

            $rootScope.transitionPageBack = function(_wrapper, _direction) {
                $rootScope.transitionPage(_wrapper, _direction, 'back')
            };

            $rootScope.nextPage = function() {
                $scope.hideMenu();
            };

            $rootScope.prevPage = function() {
                $scope.hideMenu();
            };

            $scope.getCompetitions = function(){
                return $http({method: 'GET', url:Domain.competitions()}).success(function(obj){
                    //TODO Usado en StandingsCtrl
                    $rootScope.$storage.competitions = JSON.stringify(obj.response);
                });
            };

            $scope.init = function(){
                CordovaApp.setBackButtonCallback(function(){
                    if(angular.element('.page.back.left:last').hasClass('left')){
                        $scope.runBackButton();
                    } else {
                        var EXIT_APP_TITLE = 'Sair do Aplicativo';
                        var EXIT_APP_MSG = 'Tem certeza de que deseja sair do aplicativo?';
                        var ok = 'Ok';
                        var cancel = 'Cancelar';
                        if (!!navigator.notification) {
                            navigator.notification.confirm(EXIT_APP_MSG, CordovaApp.exitApp(), EXIT_APP_TITLE, [ok, cancel]);
                        } else if (confirm(EXIT_APP_MSG)) {
                            CordovaApp.exitApp();
                        }
                    }
                });
                $scope.getCompetitions();
                ClientManager.getClientStatus(
                    function(isActive, status){
                        console.log('getClientStatus. callback. isActive: ' + isActive + ' status: ' + status);
                    },
                    function(){
                        console.log('getClientStatus. callback. error');
                    }
                );
            }();
        }
    ]);
