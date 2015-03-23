'use strict';

/**
 * @ngdoc directive
 * @name core.Directives.hsDynamicScrollItem
 * @description hsDynamicScrollItem directive
 */
angular
    .module('core')
    .directive('hsDynamicScrollItem', [
        function() {
            return {
                // name: '',
                // priority: 1,
                // terminal: true,
//                scope: {
//                    "onScrollUp": "=",
//                    "onScrollDown": "=",
//                    "$first" : "=",
//                    "$last" : "="
//                },
                // controller: function($scope, $element, $attrs, $transclude) {},
                // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
                restrict: 'E',
                replace: false,
                // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
                link: function(scope, elem, attrs, controller) {

                    if (scope.$first) {
//                        console.log('first!');
//                        console.log(scope);
//                        console.log(attrs);
                        scope.onScrollUp();
                    }

                    if (scope.$last) {
//                        console.log('last!');
//                        console.log(scope);
//                        console.log(attrs);
                        scope.onScrollDown();
                    }
                }
            };
        }
    ]);
