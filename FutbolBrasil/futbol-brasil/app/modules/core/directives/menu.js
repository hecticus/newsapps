'use strict';

/**
 * @ngdoc directive
 * @name core.Directives.menu
 * @description menu directive
 */
angular
    .module('core')
    .directive('menu', [
        function() {
            return {
                    restrict: "E",
                    templateUrl: 'modules/core/views/templates/menu.html',
                    transclude: true
                };
        }
    ]);
