'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MainCtrl
 * @description MainCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('MainCtrl', ['$rootScope', '$scope', '$location', '$state', '$localStorage', '$http', '$timeout'
        , 'Domain', 'ClientManager','CordovaApp',
        function($rootScope, $scope, $location, $state, $localStorage, $http, $timeout, Domain, ClientManager, CordovaApp) {

            $rootScope.$storage = $localStorage;
            $scope.strings = {
                MENU_NOTISTATS : 'NotiStats',
                MENU_BETS : 'Palpites',
                MENU_SETTINGS : 'Definições'
//                DEFINI&#199;&#213;ES
            };

            $scope.$on('load', function(){
                $scope.loading = true;
                $scope.error = false;
            });

            $scope.$on('unload', function(){$scope.loading = false;});
            $scope.$on('error', function(){$scope.error = true;});
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

            $rootScope.runBackButton = function() {
                if (angular.element('.page.back.left:last').hasClass('left')) {
                    $rootScope.transitionPage('.page.back.left:last', 'right')
                } else if ($('#wrapperM').hasClass('right')) {
                    $rootScope.transitionPage('#wrapperM', 'left');
                } else {
                    $scope.showMenu();
                }
                //TODO reemplazar por escucha de botón back
//                } else if (_exit && confirm('Para sair da aplicação')) {
//                    CordovaApp.exitApp();
//                }
            };

            $rootScope.showSection = function(_section) {
                $rootScope.runBackButton();
                $timeout(function() {
                    angular.element('.section').removeClass('active');
                    angular.element('[data-section="' + _section + '"]').addClass('active');
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
                $rootScope.runBackButton();
            };

            $rootScope.prevPage = function() {
                $rootScope.runBackButton();
            };

            $scope.getCompetitions = function(){
                return $http({method: 'GET', url:Domain.competitions()}).success(function(obj){
                    //TODO Usado en StandingsCtrl
                    $rootScope.$storage.competitions = JSON.stringify(obj.response);
                });
            };

            $scope.showMenu = function() {
                if ($('#wrapperM').hasClass('right')) {
                    $rootScope.transitionPage('#wrapperM', 'left');
                } else {
                    $rootScope.transitionPage('#wrapperM', 'right');
                }
            };

            $scope.init = function(){
                $scope.getCompetitions();
//            ClientManager.getClientStatus(
//                function(){
//                    console.log();
//                },
//                function(){}
//            );
            }();
        }
    ]);
