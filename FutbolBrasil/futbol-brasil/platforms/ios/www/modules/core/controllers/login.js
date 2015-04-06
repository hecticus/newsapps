'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LoginCtrl
 * @description LoginCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('LoginCtrl', ['$scope', '$state', '$stateParams', 'ClientManager', 'iScroll','Client',
        'Upstream', 'Notification',
        function($scope, $state, $stateParams, ClientManager, iScroll, Client, Upstream, Notification) {

            var scroll = null;

            $scope.msisdn = '';
            $scope.password = '';

            function remindSuccess(){
                console.log('Remind Success! Going to Login');
                $state.go('login', {'msisdn': $scope.msisdn});
            }

            function remindError(){
                //TODO i18n-alizar
                Notification.showInfoAlert({
                    title: 'Get Credentials',
                    subtitle: 'Network Error',
                    message: 'Could not contact our servers. Please try again in a few moments',
                    type: 'error'
                });
                console.log('showClientSignUpError. Remind Error.');
                $scope.$emit('unload');
            }

            function loginSuccess(isNewClient){
                console.log('onLoginSuccess. Login Success.');
                if(isNewClient){
                    //TODO i18n-alizar
                    Notification.showInfoAlert({
                        title: 'Profile Info',
                        subtitle: 'Select your username',
                        message: 'Please set a Username for your account',
                        type: 'success'
                    });
                    console.log('new client. going to settings');
                    $state.go('settings');
                } else {
                    console.log('existing client. going to news');
                    $state.go('prediction');
                }
            }

            function loginError(){
                //TODO i18n-alizar
                Notification.showInfoAlert({
                    title: 'Login',
                    subtitle: 'Network Error',
                    message: 'Could not contact our servers. Please try again in a few moments',
                    type: 'error'
                });
                console.log('onLoginError. Login Error.');
                $scope.$emit('unload');
            }

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
                    Notification.showInfoAlert({
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
                    Notification.showInfoAlert({
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

            function setUpIScroll(){
                scroll = iScroll.vertical('wrapper');
                $scope.$on('$destroy', function() {
                    scroll.destroy();
                    scroll = null;
                });
            }

            function init(){
                $scope.$emit('unload');
                setUpIScroll();
                if($state.current.name === 'remind'){
                    console.log('Remind Upstream call');
                    Upstream.viewSubscriptionPromptEvent();
                }
                if($stateParams.msisdn){
                    $scope.msisdn = $stateParams.msisdn;
                }
            } init();
        }
    ]);
