'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.TermsController
 * @description TermsController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('TermsController', [
        '$scope', '$localStorage', '$timeout', 'iScroll',
        function($scope, $localStorage, $timeout, iScroll) {

            //var jLoading = JSON.parse($localStorage['LOADING']);
            $scope.load = '';
            function init(){

              $scope.$emit('load');
              $timeout(function() {
                $scope.$emit('unload');
              }, 3000);

              //$('#load').load(jLoading.wap_terms,
              $('#load').load('http://www.tim.com.br',
                function(response, status, xhr){



                  /*if(status == "success")
                    alert("Successfully loaded the content!");

                  if(status == "error")
                    alert("An error occurred: " + xhr.status + " - " + xhr.statusText);*/

              });
                  $timeout(function() {
                      $scope.$emit('unload');
                  }, 5000);

              $scope.scroll = iScroll.vertical('wrapper');
              $scope.$on('$destroy', function() {
                  $scope.scroll.destroy();
                  $scope.scroll = null;
              });

            } init();

        }
]);
