'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LoginCtrl
 * @description LoginCtrl
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('LoginCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {

          $scope.msisdn = '';
          $scope.password = '';
          $scope.isPasswordScreenVisible = false;

          $scope.sendMsisdn = function(){
            if($scope.msisdn){
              console.log('sendMsisdn. msisdn: ' + $scope.msisdn);
              if(saveClientMSISDN($scope.msisdn)){
      //					createOrUpdateClient($scope.msisdn, null, true
      //							, $scope.showSetPasswordScreen(), $scope.showClientSignUpError());
      //					alert('MSISDN Saved');
                $scope.showPasswordScreen();
              } else {
                console.log('Error saving MSISDN');
                alert('Error saving MSISDN');
              }
            } else {
              alert('Please input your phone number');
            }
          };

          $scope.showPasswordScreen = function(){
            $scope.isPasswordScreenVisible = true;
          };

          $scope.showClientSignUpError = function(){
            alert('LogIn Error.');
          };

          $scope.doMsisdnLogin = function(){
            if($scope.password){
              console.log("doMsidnLogin. Init FB Manager.");
              getFBLoginStatus();
            } else {
              alert('doMsidnLogin. Please input password');
            }
          };

          $scope.init = function(){
            $rootScope.error = false;
            $rootScope.loading = false;
            $scope.isPasswordScreenVisible = false;
            console.log('Inside loginCtrl');
          }();
        }
    ]);
