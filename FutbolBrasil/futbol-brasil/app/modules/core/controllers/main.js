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
        , '$timeout', '$window', '$translate', 'Client', 'CordovaApp'
        , function($rootScope, $scope, $state, $localStorage, $timeout, $window, $translate,
                   Client, CordovaApp) {

            $rootScope.$storage = $localStorage;
            $scope.updateInfo = {};

            $scope.toggles = {
                favorites: true
            };

            $scope.strings = {};

            $scope.isFavoritesFilterActive = function(){
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
                CordovaApp.setUpdateCallback(function(updateInfo){
                    //TODO for debugging only
                    updateInfo.mandatory = 0;

                    updateInfo.title = 'Update Info';
                    updateInfo.html = '<p class="text-success">New Update</p><p>- ';
                    if(updateInfo.mandatory === 1){ updateInfo.html += 'Mandatory '; }
                    updateInfo.html += 'Version ' + updateInfo.new_version + ' is now Available</p>';

                    $scope.updateInfo = updateInfo;

                    $('#update-modal').modal({
                        backdrop: !!updateInfo.mandatory? 'static' : true,
                        keyboard: false,
                        show: false})
                        .modal('show');
                });

                $scope.toggles.favorites = Client.isFavoritesFilterActive();
                $scope.$watch('Client.getHasFavorites()', function(){
                    $rootScope.hasFavorites = Client.getHasFavorites();
                });
                $scope.getTranslations();
                $rootScope.$on('$translateChangeSuccess', function () {
                    $scope.getTranslations();
                });
            }();
        }
    ]);
