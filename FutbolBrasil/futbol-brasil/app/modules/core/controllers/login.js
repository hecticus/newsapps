'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LoginCtrl
 * @description LoginCtrl
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('LoginCtrl', ['$scope', '$state', '$stateParams', '$translate', 'ClientManager', 'iScroll','Client',
        'Upstream', 'Notification',
        function($scope, $state, $stateParams, $translate, ClientManager, iScroll, Client, Upstream, Notification) {

            var scroll = null;
            var strings = {};

            $scope.msisdn = '';
            $scope.password = '';


            function getTranslations(){

              $translate(['ALERT.SET_USERNAME.TITLE',
                          'ALERT.SET_USERNAME.SUBTITLE',
                          'ALERT.SET_USERNAME.MSG',
                          'ALERT.GET_CREDENTIALS.TITLE',
                          'ALERT.GET_CREDENTIALS.SUBTITLE',
                          'ALERT.GET_CREDENTIALS.MSG',
                          'ALERT.GET_LOGIN.TITLE',
                          'ALERT.GET_LOGIN.SUBTITLE',
                          'ALERT.GET_LOGIN.MSG',
                          'ALERT.SET_MSISDN.TITLE',
                          'ALERT.SET_MSISDN.SUBTITLE',
                          'ALERT.SET_MSISDN.MSG',
                          'ALERT.SET_PASSWORD.TITLE',
                          'ALERT.SET_PASSWORD.SUBTITLE',
                          'ALERT.SET_PASSWORD.MSG'])
              .then(function(translation){

                  strings['SET_USERNAME_TITLE'] = translation['ALERT.SET_USERNAME.TITLE'];
                  strings['SET_USERNAME_SUBTITLE'] = translation['ALERT.SET_USERNAME.SUBTITLE'];
                  strings['SET_USERNAME_MSG'] = translation['ALERT.SET_USERNAME.MSG'];

                  strings['GET_CREDENTIALS_TITLE'] = translation['ALERT.GET_CREDENTIALS.TITLE'];
                  strings['GET_CREDENTIALS_SUBTITLE'] = translation['ALERT.GET_CREDENTIALS.SUBTITLE'];
                  strings['GET_CREDENTIALS_MSG'] = translation['ALERT.GET_CREDENTIALS.MSG'];

                  strings['GET_LOGIN_TITLE'] = translation['ALERT.GET_LOGIN.TITLE'];
                  strings['GET_LOGIN_SUBTITLE'] = translation['ALERT.GET_LOGIN.SUBTITLE'];
                  strings['GET_LOGIN_MSG'] = translation['ALERT.GET_LOGIN.MSG'];

                  strings['SET_MSISDN_TITLE'] = translation['ALERT.SET_MSISDN.TITLE'];
                  strings['SET_MSISDN_SUBTITLE'] = translation['ALERT.SET_MSISDN.SUBTITLE'];
                  strings['SET_MSISDN_MSG'] = translation['ALERT.SET_MSISDN.MSG'];

                  strings['SET_PASSWORD_TITLE'] = translation['ALERT.SET_PASSWORD.TITLE'];
                  strings['SET_PASSWORD_SUBTITLE'] = translation['ALERT.SET_PASSWORD.SUBTITLE'];
                  strings['SET_PASSWORD_MSG'] = translation['ALERT.SET_PASSWORD.MSG'];

              });



            };


            function remindSuccess(){
                console.log('Remind Success! Going to Login');
                $state.go('login', {'msisdn': $scope.msisdn});
            }

            function remindError(){
                //TODO i18n-alizar

                Notification.showInfoAlert({
                    title: strings['GET_CREDENTIALS_TITLE'],
                    subtitle: strings['GET_CREDENTIALS_SUBTITLE'],
                    message: strings['GET_CREDENTIALS_MSG'],
                    type: 'error'
                });

                $scope.$emit('unload');
            }


            function loginSuccess(isNewClient){
                console.log('onLoginSuccess. Login Success.');
                if(isNewClient){
                    //TODO i18n-alizar

                    Notification.showInfoAlert({
                        title: strings['SET_USERNAME_TITLE'],
                        subtitle: strings['SET_USERNAME_SUBTITLE'],
                        message: strings['SET_USERNAME_MSG'],
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
                Notification.showInfoAlert({
                    title:  strings['GET_LOGIN_TITLE'],
                    subtitle: strings['GET_LOGIN_SUBTITLE'],
                    message: strings['GET_LOGIN_MSG'],
                    type: 'error'
                });

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
                    Notification.showInfoAlert({
                        title: strings['SET_MSISDN_TITLE'],
                        subtitle: strings['SET_MSISDN_SUBTITLE'],
                        message: strings['SET_MSISDN_MSG'],
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
                    Notification.showInfoAlert({
                        title: strings['SET_PASSWORD_TITLE'],
                        subtitle: strings['SET_PASSWORD_SUBTITLE'],
                        message: strings['SET_PASSWORD_MSG'],
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
                getTranslations();
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
