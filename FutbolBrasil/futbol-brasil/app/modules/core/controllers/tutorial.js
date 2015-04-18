'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.TutorialController
 * @description TutorialController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('TutorialController', [
        '$scope', '$localStorage', 'iScroll',
        function($scope, $localStorage, iScroll) {

            var jLoading = JSON.parse($localStorage['LOADING']);

            function init(){

               $scope.$emit('load');

               $('#load').load(jLoading.wap_help,
                  function(response, status, xhr){

                    $scope.$emit('unload');

                    if(status == "success")
                      alert("Successfully loaded the content!");

                    if(status == "error")
                      alert("An error occurred: " + xhr.status + " - " + xhr.statusText);

                });

                $scope.scroll = iScroll.vertical('wrapper');
                $scope.$on('$destroy', function() {
                    $scope.scroll.destroy();
                    $scope.scroll = null;
                });

            } init();
        }
]);
