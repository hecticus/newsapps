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
        , '$timeout', '$window', '$translate', 'Domain', 'Client', 'ClientManager','CordovaApp'
        , function($rootScope, $scope, $location, $state, $localStorage, $http, $timeout, $window, $translate,
                   Domain, Client, ClientManager, CordovaApp) {

            $rootScope.$storage = $localStorage;

            $scope.toggles = {
                favorites: true
            };

            $scope.strings = {};

            $scope.isFavoritesFilterActive = function(){
                return $scope.toggles.favorites;
            };

            $rootScope.hasFavorites = false;

            $scope.$on('load', function(){
                $scope.loading = true;
                $scope.error = false;
            });

            $scope.$on('unload', function(){
                    $timeout(function(){
                        $scope.loading = false;
                    }, 200);
                }
            );
            $scope.$on('error', function(){
                $scope.error = true;
                $scope.loading = false;
                }
            );

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
                    $window.addEventListener('touchmove', function(){
                        $scope.hideMenu();
                        $window.removeEventListener('touchmove');
                    });
                    $rootScope.transitionPage('#wrapperM', 'right');
                }
            };

            $rootScope.hideMenu = function() {
                if ($('#wrapperM').hasClass('right')) {
//                    console.log('hideMenu. visible. hiding');
                    $rootScope.transitionPage('#wrapperM', 'left');
                }
            };

            $rootScope.runBackButton = function() {
//                console.log('runBackButton.');
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

            $scope.getFavoritesClass = function(){
                if($scope.toggles.favorites){
                    return 'mdi-action-favorite';
                } else {
                    return 'mdi-action-favorite-outline';
                }
            };

            $scope.toggleFavorites = function(){
                $scope.toggles.favorites =! $scope.toggles.favorites;
                Client.enableFavoritesFilter($scope.toggles.favorites);
                $state.reload();
            };

            $rootScope.showSection = function(_section) {
                $timeout(function() {
//                    angular.element('.section').removeClass('active');
//                    angular.element('[data-section="' + _section + '"]').addClass('active');
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

            /**
             * Function that gets and updates the app's common usage Strings
             * to minimize the number of requests across  modules and improve
             * performance
             */
            $scope.getTranslations = function(){
                $translate('NOT_AVAILABLE').then(function(translation){
                    $scope.strings.NOT_AVAILABLE = translation;
                });
            };

            $scope.init = function(){
                CordovaApp.setBackButtonCallback($scope.runBackButton);
                $scope.toggles.favorites = Client.isFavoritesFilterActive();
                $scope.$watch('Client.getHasFavorites()', function(){
                    $rootScope.hasFavorites = Client.getHasFavorites();
//                    console.log('Client.getHasFavorites(): ' + $rootScope.hasFavorites);
                });
                $scope.getTranslations();
                $rootScope.$on('$translateChangeSuccess', function () {
                    $scope.getTranslations();
                });
            }();
        }
    ]);
