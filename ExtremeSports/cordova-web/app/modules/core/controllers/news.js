'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.NewsController
 * @description NewsController
*/
angular.module('core').controller('NewsController', NewsController);

NewsController.$inject = ['$scope', '$state', 'News', 'iScroll'];
function NewsController($scope, $state, News, iScroll) {

    var vm = this;
    var scroll = null;

    vm.posts = [];
    vm.openDetail = openDetail;

    init();

    /*//////// Function Implementations  ////////*/

    function openDetail(post){
        $state.go('news-detail', {'newsId' : post.id_post});
    }

    function getPostsBefore(post){

    }

    function getPostsAfter(post){

    }

    function getPosts(){
        News.get().then(success, error);

        function success(data){
            vm.posts = data;
            console.log('getPosts. success.');
            console.log(vm.posts);
        }

        function error(data){
            vm.posts = [];
            console.log('getPosts. error.');
        }
    }

    function setUpIScroll(){
        scroll = iScroll.vertical('news-wrapper');
        $scope.$on('$destroy', function() {
            scroll.destroy();
            scroll = null;
        });
    }

    function init(){
        setUpIScroll();
        getPosts()
    }
}
