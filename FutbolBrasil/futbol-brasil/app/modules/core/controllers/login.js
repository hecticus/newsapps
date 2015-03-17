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

            //TODO i18n-alizar
            $scope.strings = {
                PASSWORD_LABEL: 'Senha',
                PASSWORD_HELPER: 'Digite a senha recebida por SMS.',
                MSISDN_HOLDER: '# Numero',
                MSISDN_LABEL: 'Username',
                LOGIN_LABEL: 'Login',
                REMIND_LABEL : 'Remind / Get Credentials',
                CHANGE_LANGUAGE_LABEL : 'Change Language',
                TUTORIAL_LABEL : 'How Does It Work?',
                TERMS_LABEL : 'Terms & Conditions',
                ENTER_AS_GUEST_LABEL: 'Enter as Guest'
            };
            $scope.msisdn = '';
            $scope.password = '';

            var remindSuccess = function(){
                console.log('Remind Success! Going to Login');
                $state.go('login', {'msisdn': $scope.msisdn});
            };

            var remindError = function(){
                console.log('showClientSignUpError. Login Error.');
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
                console.log('onLoginError. Login Error.');
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
                    $scope.$emit('unload');
                    alert('Please input your phone number');
                }
            };

            $scope.doMsisdnLogin = function(){
                if($scope.password){
                    ClientManager.createOrUpdateClient(
                        {
                            'msisdn' : $scope.msisdn,
                            'password' : $scope.password
                        }
                        , true, loginSuccess, loginError);
                    Upstream.loginEvent();
                } else {
                    alert('doMsisdnLogin. Please input password');
                }
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
