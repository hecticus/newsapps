'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LoginCtrl
 * @description LoginCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'ClientManager', 'FacebookManager', 'PushManager'
        , function($rootScope, $scope, $state, ClientManager, FacebookManager, PushManager) {

            $scope.msisdn = '';
            $scope.password = '';
            $scope.isPasswordScreenVisible = false;

            $scope.sendMsisdn = function(){
                if($scope.msisdn){
                    console.log('sendMsisdn. msisdn: ' + $scope.msisdn);
                    ClientManager.saveClientMSISDN($scope.msisdn,
                    function(){
                        ClientManager.createOrUpdateClient($scope.msisdn, null, true
                                , $scope.showPasswordScreen(), $scope.showClientSignUpError());
//                        $scope.showPasswordScreen();
                        console.log('ClientManager.clientMSISDN: ');
                        console.log(ClientManager.getClientMSISDN());
                    },
                    function(){
                        console.log('Error saving MSISDN');
                        console.log('ClientManager.clientMSISDN: ');
                        console.log(ClientManager.getClientMSISDN());
                    });
                } else {
                    alert('Please input your phone number');
                }
            };

            $scope.showPasswordScreen = function(){
                $scope.isPasswordScreenVisible = true;
            };

            $scope.showClientSignUpError = function(){
                console.log('showClientSignUpError. Login Error.');
            };

            $scope.onLoginSuccess = function(){
                $state.go('news');
            };

            $scope.onLoginError = function(){
                console.log('showClientSignUpError. Login Error.');
            };

            $scope.doMsisdnLogin = function(){
                if($scope.password){
//                    FacebookManager.getFBLoginStatus();
                    ClientManager.createOrUpdateClient($scope.msisdn, $scope.password, true
                        , $scope.onLoginSuccess, $scope.onLoginError);
                } else {
                    alert('doMsisdnLogin. Please input password');
                }
            };

            $scope.init = function(){
                $rootScope.error = false;
                $rootScope.loading = false;
                $scope.isPasswordScreenVisible = false;
            }();
        }
    ]);
