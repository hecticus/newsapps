'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LoginController
 * @description LoginController
*/
angular.module('core').controller('LoginController', LoginController);

LoginController.$injector = ['$scope', '$state', '$stateParams'
    , 'ClientManager', 'iScroll','Client', 'Upstream', 'Notification'];

function LoginController($scope, $state, $stateParams, ClientManager, iScroll, Client, Upstream, Notification) {

    var vm = this;
    var scroll = null;
    var newClientState = 'settings';
    var existingClientState = 'news';
    vm.msisdn = '';
    vm.password = '';
    vm.enterAsGuest = enterAsGuest;
    vm.sendMsisdn = sendMsisdn;
    vm.doMsisdnLogin = doMsisdnLogin;

    init();

    /*//////// Function Implementations  ////////*/

    function doMsisdnLogin(){
        console.log('doMsisdnLogin');
        Client.logout();
        $scope.$emit('load');
        if(vm.password){
            var client = {
                'msisdn' : vm.msisdn,
                'password' : vm.password
            };

            ClientManager.createOrUpdateClient(client, true).then(loginSuccess, loginError);

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
    }

    function enterAsGuest(){
        ClientManager.createOrUpdateClient({}, true).then(loginSuccess, loginError);
        Client.setGuest();
    }

    /* Remind section */

    function sendMsisdn(){
        $scope.$emit('load');
        if(vm.msisdn){
            console.log('sendMsisdn. msisdn: ' + vm.msisdn);
            Upstream.clickedSubscriptionPromptEvent();
            Client.setMsisdn(vm.msisdn, success, error);
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

        function success(){
            ClientManager.createOrUpdateClient({'msisdn' : vm.msisdn}, true)
                .then(remindSuccess, remindError);
        }
        function error(){
            $scope.$emit('unload');
            console.log('Error saving MSISDN');
        }
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
            $state.go(newClientState);
        } else {
            console.log('existing client. going to news');
            $state.go(existingClientState);
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

    function remindSuccess(){
        console.log('Remind Success! Going to Login');
        $state.go('login', {'msisdn': vm.msisdn});
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

    function setUpIScroll(){
        scroll = iScroll.vertical('login-wrapper');
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
            vm.msisdn = $stateParams.msisdn;
        }
    }
}
