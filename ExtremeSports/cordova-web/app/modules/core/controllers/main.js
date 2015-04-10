'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.MainController
 * @description MainController
 * @requires ng.$scope
*/
angular.module('core').controller('MainController', MainController);

MainController.$injector = ['$rootScope', '$scope', '$state', '$timeout', '$window'
    , '$localStorage', '$translate', 'Client', 'CordovaApp'];

function MainController($rootScope, $scope, $state, $timeout, $window
    , $localStorage, $translate, Client, CordovaApp) {

    var vm = this;

    $rootScope.$storage = $localStorage;
    $rootScope.hasFavorites = false;
    $rootScope.isFavoritesFilterActive = isFavoritesFilterActive;
    $rootScope.showMenu = showMenu;
    $rootScope.hideMenu = hideMenu;
    $rootScope.onMenuButtonPressed = onMenuButtonPressed;
    $rootScope.showSection = showSection;
    $rootScope.executeAction = executeAction;
    $rootScope.transitionPage = transitionPage;
    $rootScope.transitionPageBack = transitionPageBack;
    $rootScope.nextPage = nextPage;
    $rootScope.prevPage = prevPage;
    $rootScope.direction = 'left';

    $scope.toggles = {
        favorites: true
    };
    $scope.strings = {};
    $scope.updateInfo = {};
    $scope.displayInfo = {};
    $scope.getFavoritesClass = getFavoritesClass;
    $scope.toggleFavorites = toggleFavorites;
    $scope.isOnUtilitySection = CordovaApp.isOnUtilitySection;
    $scope.getSection = getSection;
    $scope.isGuest = isGuest;
    $scope.getDrawerIcon = getDrawerIcon;
    $scope.goToStore = goToStore;

    init();

    ////////////// Root Scope //////////////////////////

    function isFavoritesFilterActive(){
        return $scope.toggles.favorites;
    }

    function showMenu() {
        if (!CordovaApp.isOnUtilitySection() && $('#wrapperM').hasClass('left')) {
            $window.addEventListener('touchmove', function(){
                $scope.hideMenu();
                $window.removeEventListener('touchmove');
            });
            $rootScope.transitionPage('#wrapperM', 'right');
        }
    }

    function hideMenu() {
        if ($('#wrapperM').hasClass('right')) {
            $rootScope.transitionPage('#wrapperM', 'left');
        }
    }

    function onMenuButtonPressed(){
        console.log('onMenuButtonPressed');
        var menuWrapper = $('#wrapperM');
        var hasPreviousSubsection = angular.element('.page.back.left:last').hasClass('left');
        if(hasPreviousSubsection || CordovaApp.isOnUtilitySection()) {
            CordovaApp.onBackButtonPressed();
        } else if (menuWrapper.hasClass('left')) {
            $scope.showMenu();
        } else if (menuWrapper.hasClass('right')) {
            $scope.hideMenu();
        }
    }

    function showSection(_section) {
        if ($('#wrapperM').hasClass('right')) {
            $scope.hideMenu();
        }
        $state.go(_section);
    }

    function executeAction(action){
        switch(action){
            case 'logout':
                Client.logout();
                $state.go('login');
                break;
            default:
        }
    }

    function transitionPage(_wrapper, _direction, _class) {
//        if (!_class) _class = '';
//        angular.element(_wrapper).attr('class', _class + ' page transition ' + _direction);
        $rootScope.direction = _direction;
    }

    function transitionPageBack(_wrapper, _direction) {
        $rootScope.transitionPage(_wrapper, _direction, 'back')
    }

    function nextPage() {
        $scope.hideMenu();
    }

    function prevPage() {
        $scope.hideMenu();
    }

    ////////////// Scope //////////////////////////

    function isGuest(){
        return Client.isGuest();
    }

    function getFavoritesClass(){
        if($scope.toggles.favorites){
            return 'mdi-action-favorite';
        } else {
            return 'mdi-action-favorite-outline';
        }
    }

    function toggleFavorites(){
        $scope.toggles.favorites =! $scope.toggles.favorites;
        Client.enableFavoritesFilter($scope.toggles.favorites);
        $state.reload();
    }

    function getSection(){
        return CordovaApp.getCurrentSection();
    }

    function getDrawerIcon(){
        var hasPreviousSubsection = angular.element('.page.back.left:last').hasClass('left');
        if(hasPreviousSubsection || CordovaApp.isOnUtilitySection()){
            return 'icon mdi-navigation-arrow-back ';
        } else {
            return 'icon mdi-navigation-menu';
        }
    }

    function goToStore(){
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
    }

    /**
     * Function that gets and updates the app's common usage Strings
     * to minimize the number of requests across modules and improve
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

        $scope.$on('load', function(){
            $scope.loading = true;
            $scope.error = false;
        });

        $scope.$on('unload', function(){
                $rootScope.LOADING_TEXT = '';
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
    }
}
