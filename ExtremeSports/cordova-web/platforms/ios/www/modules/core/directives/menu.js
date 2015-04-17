'use strict';

/**
 * @ngdoc directive
 * @name core.Directives.menu
 * @description menu directive
 */
angular
    .module('core')
    .directive('menu', ['iScroll',
        function(iScroll) {
            return {
                restrict: "E",
                templateUrl: 'modules/core/views/templates/menu.html',
                transclude: true,
                link: function($scope) {
                    var menuScroll = null;
                    setUpIScroll();

                    /*//////// Declarations ////////*/
                    function setUpIScroll(){
                        menuScroll = iScroll.vertical('wrapperM');

                        $scope.$on('$destroy', function() {
                            menuScroll.destroy();
                            menuScroll = null;
                        });
                    }
                }
            };
        }
    ]);
