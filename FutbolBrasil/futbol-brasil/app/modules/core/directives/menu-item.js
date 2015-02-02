'use strict';

/**
 * @ngdoc directive
 * @name core.Directives.menuItem
 * @description menuItem directive
 */
angular
    .module('core')
    .directive('menuItem', ['$rootScope',
        function($rootScope) {
            return {
               restrict: "E",
               template: function() {
                    var _html = '<div  ng-click="navigate(\'{{section}}\')" class="row content-menu">';
                        _html += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"  >';
                        _html += '<span class="icon {{icon}}" ></span>';
                        _html += '<span ng-transclude></span>';
                        _html += '</div>';
                    return _html;
               },
               transclude: true,
               scope: {
                  section: "@",
                  icon: "@"
               },
               link: function($scope) {
                   $scope.navigate = function(_section) {
                      $rootScope.showSection(_section);
                   }
               }
            };
        }
    ]);



