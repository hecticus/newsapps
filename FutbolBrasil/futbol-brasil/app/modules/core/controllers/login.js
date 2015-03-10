'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LoginCtrl
 * @description LoginCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'ClientManager', 'Client'
        , function($rootScope, $scope, $state, ClientManager, Client) {

            //TODO i18n-alizar
            $scope.strings = {
                PASSWORD_HOLDER: 'Senha',
                PASSWORD_LABEL: 'Digite a senha recebida por SMS.',
                LOADING_MESSAGE: 'Carregando...',
                START_TRIAL_MESSAGE: 'Experimente 7 dias grátis',
                SEND_MESSAGE: 'Enviar',
                RESEND_MESSAGE: 'Enviar novamente a senha',
                MSISDN_HELPER: 'Digite seu numero de celular.',
                MSISDN_HOLDER: '# Numero',
                LOGIN_WELCOME_MESSAGE: 'Registre-se para acessar as notícias de futebol do dia, todos os dias.'
            };
            $scope.msisdn = '';
            $scope.password = '';
            $scope.isPasswordScreenVisible = true;

            $scope.sendMsisdn = function(){
                $scope.$emit('load');
                if($scope.msisdn){
                    console.log('sendMsisdn. msisdn: ' + $scope.msisdn);
                    Client.setMsisdn($scope.msisdn,
                        function(){
                            ClientManager.createOrUpdateClient({'msisdn' : $scope.msisdn}, true
                                    , $scope.showPasswordScreen, $scope.showClientSignUpError);
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

            $scope.showPasswordScreen = function(){
                $scope.$emit('unload');
                $scope.isPasswordScreenVisible = true;
            };

            $scope.showClientSignUpError = function(){
                console.log('showClientSignUpError. Login Error.');
            };

            $scope.onLoginSuccess = function(isNewClient){
                console.log('onLoginSuccess. Login Success.');
                if(isNewClient){
                    console.log('new client. going to settings');
                    $state.go('settings');
                } else {
                    console.log('existing client. going to news');
                    $state.go('news');
                }
            };

            $scope.onLoginError = function(){
                console.log('onLoginError. Login Error.');
            };

            $scope.doMsisdnLogin = function(){
                if($scope.password){
                    var client = {
                        'msisdn' : $scope.msisdn,
                        'password' : $scope.password
                    };

                    ClientManager.createOrUpdateClient(client, true
                        , $scope.onLoginSuccess(), $scope.onLoginError());
                } else {
                    alert('doMsisdnLogin. Please input password');
                }
            };

            $scope.init = function(){
                $scope.$emit('unload');
                $scope.isPasswordScreenVisible = false;
            }();
        }
    ]);
