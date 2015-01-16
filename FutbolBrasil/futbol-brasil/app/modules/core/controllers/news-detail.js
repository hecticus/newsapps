'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.NewsDetailCtrl
 * @description NewsDetailCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('NewsDetailCtrl', ['$scope','$state','$stateParams',
        function($scope, $state, $stateParams) {
            //No usado temporalmente
            $scope.details = {};
            $scope.setUpIScroll = function(){


            };
            $scope.init = function (){
                console.log($scope.contentNews);
            }();

        }
    ]);
