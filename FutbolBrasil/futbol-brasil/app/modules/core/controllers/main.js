'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MainCtrl
 * @description MainCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('MainCtrl', ['$rootScope', '$scope', '$state', '$localStorage'
        , '$timeout', '$window', '$translate', 'Client', 'CordovaApp', 'SocialAppsManager'
        , function($rootScope, $scope, $state, $localStorage, $timeout, $window, $translate,
                   Client, CordovaApp, SocialAppsManager) {

            $rootScope.$storage = $localStorage;
            $scope.updateInfo = {};
            $scope.displayInfo = {};

            $scope.toggles = {
                favorites: true
            };

            $scope.strings = {};

            $scope.isGuest = function(){
                return Client.isGuest();
            };

            $rootScope.isFavoritesFilterActive = function(){
                return $scope.toggles.favorites;
            };

            $rootScope.hasFavorites = false;

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

            $scope.isOnUtilitySection = CordovaApp.isOnUtilitySection;

            $scope.getSection = function (){
                return CordovaApp.getCurrentSection();
            };

            $scope.getDrawerIcon = function(){
                var hasPreviousSubsection = angular.element('.page.back.left:last').hasClass('left');
                if(hasPreviousSubsection || CordovaApp.isOnUtilitySection()){
                    return 'icon mdi-navigation-arrow-back ';
                } else {
                    return 'icon mdi-navigation-menu';
                }
            };

            $rootScope.showMenu = function() {
                if (!CordovaApp.isOnUtilitySection() && $('#wrapperM').hasClass('left')) {
                    $window.addEventListener('touchmove', function(){
                        $scope.hideMenu();
                        $window.removeEventListener('touchmove');
                    });
                    $rootScope.transitionPage('#wrapperM', 'right');
                }
            };

            $rootScope.hideMenu = function() {
                if ($('#wrapperM').hasClass('right')) {
                    $rootScope.transitionPage('#wrapperM', 'left');
                }
            };

            $rootScope.onMenuButtonPressed = function(){
                var menuWrapper = $('#wrapperM');
                var hasPreviousSubsection = angular.element('.page.back.left:last').hasClass('left');
                if(hasPreviousSubsection || CordovaApp.isOnUtilitySection()) {
                    CordovaApp.onBackButtonPressed();
                } else if (menuWrapper.hasClass('left')) {
                    $scope.showMenu();
                } else if (menuWrapper.hasClass('right')) {
                    $scope.hideMenu();
                }
            };

            $rootScope.showSection = function(_section) {
//                $timeout(function() {
                if ($('#wrapperM').hasClass('right')) {
                    $scope.hideMenu();
                }
                $state.go(_section);
//                },300);
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

            $scope.goToStore = function(){
                if($window.cordova && $window.cordova.plugins && $window.cordova.plugins.market) {
                    $window.cordova.plugins.market.open($scope.updateInfo.download, {
                        success: function() {
                            console.log("Redirect to App Store Successful");
                        },
                        failure: function() {
                            console.log("Couldn't open App Store to update App");
                        }
                    });
                } else {
                    console.log('$window.cordova.plugins.market Object not available. Are you directly on a browser?');
                }
            };

            $scope.showShareModal = function(message, subject){
                $scope.share = {
                    message: message,
                    subject: subject
                };

                $('#share-modal').modal({
                    backdrop: true,
                    keyboard: false,
                    show: false})
                    .modal('show');
            };

            $scope.fbShare = function(){
                SocialAppsManager.fbShare($scope.share.message, $scope.share.subject);
            };

            $scope.twitterShare = function(){
                SocialAppsManager.twitterShare($scope.share.message, $scope.share.subject);
            };

            /**
             * @ngdoc function
             * @name core.Controllers.MainCtrl#showInfoModal
             * @description Function that displays an information dialog
             * @param {object} displayInfo Information to display. must have keys:
             * @param {string} displayInfo.title The name of the event.
             * @param {string} displayInfo.subtitle The subtitle of the event.
             * @param {string} displayInfo.message The message of the event.
             * @param {string} displayInfo.type The type of information it is ('warning'/'error').
             * @methodOf core.Controllers.MainCtrl
             */
            $scope.showInfoModal = function (displayInfo){
                var icon = '';
                displayInfo.icon = '';
                switch(displayInfo.type){
                    case 'error':
                        icon = 'mdi-alert-error text-danger';
                        displayInfo.html = '<p class="text-danger">' + displayInfo.subtitle + '</p>';
                        break;
                    case 'warning':
                    default:
                        icon = 'mdi-alert-warning text-warning';
                        displayInfo.html = '<p class="text-warning">' + displayInfo.subtitle + '</p>';

                }

                displayInfo.icon = icon;
                displayInfo.html += '<p class="text-muted">' + displayInfo.message + '</p>';

                $scope.displayInfo = displayInfo;

                $('#info-modal').modal({
                    backdrop: true,
                    keyboard: false,
                    show: false})
                    .modal('show');
            };

            /**
             * Function that gets and updates the app's common usage Strings
             * to minimize the number of requests across  modules and improve
             * performance
             */
            function getTranslations(){
                $translate('NOT_AVAILABLE').then(function(translation){
                    $scope.strings.NOT_AVAILABLE = translation;
                });
            }

            function init(){
                $scope.toggles.favorites = Client.isFavoritesFilterActive();
                $scope.$watch('Client.getHasFavorites()', function(){
                    $rootScope.hasFavorites = Client.getHasFavorites();
                });
                getTranslations();
                $rootScope.$on('$translateChangeSuccess', function () {
                    getTranslations();
                });
            }init();
        }
    ]);
