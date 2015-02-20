'use strict';

/**
 * @ngdoc directive
 * @name core.Directives.menuItem
 * @description menuItem directive
 */
angular
    .module('core')
    .directive('menuItem', ['$rootScope', '$state',
        function($rootScope, $state) {
            return {
                restrict: "E",
                templateUrl: 'modules/core/views/templates/menu-item.html',
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



