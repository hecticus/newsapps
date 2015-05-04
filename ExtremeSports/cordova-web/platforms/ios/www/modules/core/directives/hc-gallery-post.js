'use strict';

/**
 * @ngdoc directive
 * @name core.Directives.hcGalleryPost
 * @description hcGalleryPost directive
 */
angular
    .module('core')
    .directive('hcGalleryPost', hcGalleryPost);

hcGalleryPost.$injetctor = [];

function hcGalleryPost() {
    return {
        // name: '',
        scope: {
            item: '=',
            click: '&onClick'
        },
        restrict: 'EA',
        templateUrl: 'modules/core/views/templates/hc-gallery-post.html',
        transclude: false,
        link: function($scope, elem, attrs, controller) {
        }
    };
}
