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
        '$scope', '$localStorage', '$timeout', 'iScroll',
        function($scope, $localStorage, $timeout, iScroll) {

            //var jLoading = JSON.parse($localStorage['LOADING']);

            function init(){

                      $scope.$emit('load');
                             $timeout(function() {
                               $scope.$emit('unload');
                             }, 3000);

               //$('#load').load(jLoading.wap_help,
               $('#load').load('http://www.tim.com.br',
                  function(response, status, xhr){


                    /*if(status == "success")
                      alert("Successfully loaded the content!");

                    if(status == "error")
                      alert("An error occurred: " + xhr.status + " - " + xhr.statusText);*/

                });




                $scope.scroll = iScroll.vertical('wrapper');
                $scope.$on('$destroy', function() {
                    $scope.scroll.destroy();
                    $scope.scroll = null;
                });

            } init();
        }
]);
