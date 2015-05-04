'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.FavoritesController
 * @description FavoritesController
 * @requires ng.$scope
*/
angular.module('core').controller('FavoritesController', FavoritesController);

FavoritesController.$injector = ['$scope', 'AthleteManager', 'CategoryManager', 'iScroll'];
function FavoritesController($scope, AthleteManager, CategoryManager, iScroll) {
    var vm = this;
    var scrollAthletes = null;
    var scrollCategories = null;

    vm.athletes = [];
    vm.categories = [];

    init();

    /*//////// Function Implementations  ////////*/

    function getAthletes(){
        AthleteManager.get().then(success, error);

        function success(data){
            vm.athletes = data;
            console.log('getAthletes. success.');
            console.log(vm.athletes);
        }

        function error(data){
            vm.athletes = [];
            console.log('getAthletes. error.');
        }
    }

    function getCategories(){
        CategoryManager.get().then(success, error);

        function success(data){
            vm.categories = data;
            console.log('getCategories. success.');
            console.log(vm.categories);
        }

        function error(data){
            vm.categories = [];
            console.log('getCategories. error.');
        }
    }

    function setUpIScroll(){
        scrollAthletes = iScroll.vertical('athletes-wrapper');
        scrollCategories = iScroll.vertical('categories-wrapper');

        $scope.$on('$destroy', function() {
            scrollAthletes.destroy();
            scrollAthletes = null;

            scrollCategories.destroy();
            scrollCategories = null;
        });
    }

    function init(){
        setUpIScroll();
        getAthletes();
        getCategories();
    }

}
