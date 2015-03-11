'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LoginCtrl
 * @description LoginCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('LoginCtrl', ['$scope', '$state', '$stateParams', 'ClientManager', 'Client'
        , function($scope, $state, $stateParams, ClientManager, Client) {

            //TODO i18n-alizar
            $scope.strings = {
                PASSWORD_LABEL: 'Senha',
                PASSWORD_HELPER: 'Digite a senha recebida por SMS.',
                LOADING_MESSAGE: 'Carregando...',
                START_TRIAL_MESSAGE: 'Experimente 7 dias grátis',
                SEND_MESSAGE: 'Enviar',
                RESEND_MESSAGE: 'Enviar novamente a senha',
                MSISDN_HELPER: 'Digite seu numero de celular.',
                MSISDN_HOLDER: '# Numero',
                MSISDN_LABEL: 'Username',
                LOGIN_LABEL: 'Login',
                LOGIN_WELCOME_MESSAGE: 'Registre-se para acessar as notícias de ' +
                    'futebol do dia, todos os dias.',
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
                } else {
                    alert('doMsisdnLogin. Please input password');
                }
            };

            $scope.enterAsGuest = function(){
                ClientManager.createOrUpdateClient({}, true, loginSuccess, loginError);
                Client.setGuest();
            };

            var init = function(){
                $scope.$emit('unload');
                if($stateParams.msisdn){
                    $scope.msisdn = $stateParams.msisdn;
                }
            }();
        }
    ]);
