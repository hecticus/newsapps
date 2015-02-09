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
                    template: function() {

                      var _html = '<div id="wrapperM" class="page left" style="z-index:2; left: -100%; height: 100%;"  >';
                          _html += '<div class="scroller">';
                          _html += '<div class="container" ng-transclude>';

                          _html += '</div>';
                          _html += '</div>';
                          _html += '</div>';

                      return _html;

                    },
                    transclude: true
                };
        }
    ]);
