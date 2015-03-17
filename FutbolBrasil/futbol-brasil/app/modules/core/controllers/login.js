'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LoginCtrl
 * @description LoginCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('LoginCtrl', ['$scope', '$state', '$stateParams', 'ClientManager', 'Client', 'Upstream'
        , function($scope, $state, $stateParams, ClientManager, Client, Upstream) {

            $scope.msisdn = '';
            $scope.password = '';

            var remindSuccess = function(){
                console.log('Remind Success! Going to Login');
                $state.go('login', {'msisdn': $scope.msisdn});
            };

            var remindError = function(){
                $scope.showInfoModal({
                    title: 'Get Credentials',
                    subtitle: 'Network Error',
                    message: 'Could not contact our servers. Please try again in a few moments',
                    type: 'error'
                });
                console.log('showClientSignUpError. Remind Error.');
                $scope.$emit('unload');
            };

            var loginSuccess = function(isNewClient){
                console.log('onLoginSuccess. Login Success.');
                if(isNewClient){
                    console.log('new client. going to settings');
                    $state.go('settings');
                } else {
                    console.log('existing client. going to news');
                    $state.go('news');
                }
            };

            var loginError = function(){
                $scope.showInfoModal({
                    title: 'Login',
                    subtitle: 'Network Error',
                    message: 'Could not contact our servers. Please try again in a few moments',
                    type: 'error'
                });
                console.log('onLoginError. Login Error.');
                $scope.$emit('unload');
            };

            $scope.sendMsisdn = function(){
                $scope.$emit('load');
                if($scope.msisdn){
                    console.log('sendMsisdn. msisdn: ' + $scope.msisdn);
                    Upstream.clickedSubscriptionPromptEvent();
                    Client.setMsisdn($scope.msisdn,
                        function(){
                            ClientManager.createOrUpdateClient(
                                {'msisdn' : $scope.msisdn}
                                , true, remindSuccess, remindError);
                        },
                        function(){
                            $scope.$emit('unload');
                            console.log('Error saving MSISDN');
                        }
                    );
                } else {
                    //TODO i18n-alizar
                    $scope.showInfoModal({
                        title: 'Login process',
                        subtitle: 'Incomplete Registering Info',
                        message: 'Please input your phone number',
                        type: 'warning'
                    });
                }
                $scope.$emit('unload');
            };

            $scope.doMsisdnLogin = function(){
                $scope.$emit('load');
                if($scope.password){
                    ClientManager.createOrUpdateClient(
                        {
                            'msisdn' : $scope.msisdn,
                            'password' : $scope.password
                        }
                        , true, loginSuccess, loginError);
                    Upstream.loginEvent();
                } else {
                    //TODO i18n-alizar
                    $scope.showInfoModal({
                        title: 'Login process',
                        subtitle: 'Incomplete Registering Info',
                        message: 'Please input your password',
                        type: 'warning'
                    });
                }
                $scope.$emit('unload');
            };

            $scope.enterAsGuest = function(){
                ClientManager.createOrUpdateClient({}, true, loginSuccess, loginError);
                Client.setGuest();
            };

            function init(){
                $scope.$emit('unload');
                if($state.current.name === 'remind'){
                    console.log('Remind Upstream call');
                    Upstream.viewSubscriptionPromptEvent();
                }
                if($stateParams.msisdn){
                    $scope.msisdn = $stateParams.msisdn;
                }
            }
            init();
        }
    ]);
