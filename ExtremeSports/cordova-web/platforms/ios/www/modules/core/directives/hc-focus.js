'use strict';

/**
 * @ngdoc directive
 * @name core.Directives.hcFocus
 * @description hcFocus directive
 */
angular.module('core').directive('hcFocus', hcFocus);

hcFocus.$injector = ['$timeout'];
function hcFocus($timeout) {
    return {
        restrict: 'A',
        link: function($scope, elem, attrs) {
            $scope.$watch(attrs.hcFocus
                , function (newValue) {
                    $timeout(function(){
                        if(newValue){
                            elem.focus();
                        } else {
                            elem.blur();
                        }
                    }, 0);
                }
            ,true);
        }
    };
}
