'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.GalleryController
 * @description GalleryController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('GalleryController', GalleryController);

GalleryController.$injector = ['$scope', '$state', 'Gallery', 'iScroll'];
function GalleryController($scope, $state, Gallery, iScroll) {
    var vm = this;
    var scroll = null;
    vm.openDetail = openDetail;

    init();

    /*//////// Function Implementations  ////////*/

    function openDetail(post){
        $state.go('news-detail', {'newsId' : post.id_post});
    }

    function getItems(){
        Gallery.get().then(success, error);

        function success(data){
            vm.items = data;
            console.log('getgetItems. success.');
            console.log(vm.items);
        }

        function error(data){
            vm.items = [];
            console.log('getItems. error.');
        }
    }

    function setUpIScroll(){
        scroll = iScroll.vertical('gallery-wrapper');
        $scope.$on('$destroy', function() {
            scroll.destroy();
            scroll = null;
        });
    }

    function init(){
        setUpIScroll();
        getItems()
    }
}
