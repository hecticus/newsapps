'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.NewsDetailController
 * @description NewsDetailController
*/
angular.module('core').controller('NewsDetailController', NewsDetailController);

NewsDetailController.$injector = ['$state', '$stateParams', 'News'];
function NewsDetailController($state, $stateParams, News) {

    var vm = this;
    var idPost = null;

    init();

    function init(){
        console.log('news-detail. $stateParams: ');
        console.log($stateParams);
        if($stateParams.newsId){
            idPost = $stateParams.newsId;
            News.get(idPost).then(success, error);
        } else {
            console.log("NewsDetail. No newsId specified. Redirecting to 'news' ");
            $state.go('news');
        }

        function success(newsPost){
            vm.post = newsPost;
            console.log('newsDetail. success.');
            console.log(vm.post);
        }
        function error(){
            console.log('newsDetail. error.');
            vm.posts = {};
        }
    }
}
