'use strict';

/**
 * @ngdoc directive
 * @name core.Directives.hcNewsPost
 * @description hcNewsPost directive
 */
angular
    .module('core')
    .directive('hcNewsPost', hcNewsPost);

hcNewsPost.$injector = ['Moment'];
function hcNewsPost(Moment) {
    return {
        scope: {
            post: '=',
            click: '&onClick'
        },
        restrict: 'EA',
        templateUrl: 'modules/core/views/templates/hc-news-post.html',
        transclude: false,
        link: function($scope, elem, attrs, controller) {
            $scope.categoryLimit = 1;
            $scope.tagLimit = 1;
            $scope.fromNow = fromNow;

            function fromNow(date) {
                return Moment.date(date).fromNow();
            }
        }
    };
}
