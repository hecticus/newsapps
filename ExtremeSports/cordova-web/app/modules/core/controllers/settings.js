'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.SettingsController
 * @description SettingsController
*/
angular.module('core').controller('SettingsController', SettingsController);

SettingsController.$injector = ['$scope', '$rootScope', '$state', '$timeout', '$translate', 'ClientManager'
            , 'FacebookManager', 'Settings', 'iScroll', 'i18n', 'Client', 'Notification'];

function SettingsController($scope, $rootScope, $state, $timeout, $translate, ClientManager
    , FacebookManager, Settings, iScroll, i18n, Client, Notification) {

    var vm = this;
    var scroll = null;
    var removeEventCallback = null;

    /* Nickname */
    vm.nickname = '';
    vm.isEditing = false;
    vm.saveNickname = saveNickname;
    vm.getEditingButtonClass = getEditingButtonClass;
    vm.getEditingIconClass = getEditingIconClass;

    /* Facebook */
    vm.fbObject = {
        fbStatus: null,
        fbButtonMsg: ''
    };
    vm.onFbButtonClick = onFbButtonClick;
    vm.setFbButtonMsg = setFbButtonMsg;

    /* Language */
    vm.selectLanguage = selectLanguage;
    vm.lang = {};

    /* Toggles */
    vm.toggles = {
        news: false,
        mtm: false
    };
    vm.toggleNews = toggleNews;
    vm.toggleMtm = toggleMtm;

    init();

    /*//////// Function Implementations  ////////*/

    function saveNickname(){
        if(!vm.isEditing){
            vm.isEditing = true;
        } else if (vm.nickname){
            vm.isEditing = false;
            console.log('Saving nickName: ' + vm.nickname);
            ClientManager.createOrUpdateClient({ 'nickname' : vm.nickname });
        } else {
            console.log('Please input a valid nickName');
        }
    }

    function toggleNews(){
        vm.toggles.news = !vm.toggles.news;
        Settings.toggleNewsPush(vm.toggles.news);
    }

    function toggleMtm(){
        vm.toggles.mtm = !vm.toggles.mtm;
        Settings.toggleMtmPush(vm.toggles.mtm);
    }

    function onFbButtonClick(){
        if(!window.facebookConnectPlugin){ return;}
        if(Client.isGuest()){
            Notification.showLockedSectionDialog();
        } else {
            if(vm.fbObject.fbStatus !== 'connected'){
                FacebookManager.login();
            }
            vm.setFbButtonMsg();
        }
    }

    function setFbButtonMsg(){
        $translate(['SETTINGS.FACEBOOK.CONNECT', 'SETTINGS.FACEBOOK.CONNECTED'])
            .then(function(translations){
                if(vm.fbObject.fbStatus === 'connected'){
                    vm.fbObject.fbButtonMsg = translations['SETTINGS.FACEBOOK.CONNECTED'];
                } else{
                    vm.fbObject.fbButtonMsg = translations['SETTINGS.FACEBOOK.CONNECT'];
                }
            }
        );
        $scope.$apply();
    }

    function selectLanguage(){
        $scope.$emit('load');
        $state.go('language-selection');
    }

    function loadSettings(){
        vm.toggles.news = Settings.isNewsPushActive();
        vm.toggles.mtm = Settings.isMtmPushActive();
    }

    function getStatus(){
        if(!!window.facebookConnectPlugin) {
            FacebookManager.getStatus(function (result) {
                if (result) {
                    vm.fbObject.fbStatus = result.status;
                    vm.setFbButtonMsg();
                }
            });
        } else {

            $timeout(function(){
                vm.fbObject.fbStatus = 'connect';
                vm.setFbButtonMsg();
            }, 1000);
        }
    }

    function getClientLanguage(){
        vm.lang = Client.getLanguage();
        if(!vm.lang){
            vm.lang = i18n.getDefaultLanguage();
        }

        vm.lang.short_name = vm.lang.short_name.toUpperCase();

        $translate(['LANGUAGE.' + vm.lang.short_name, 'NOT_AVAILABLE'])
            .then(function(translations){
                vm.lang.translation = translations['LANGUAGE.' + vm.lang.short_name];
                $scope.strings.NOT_AVAILABLE = translations['NOT_AVAILABLE'];
            });
    }

    function getEditingButtonClass(){
        if(vm.isEditing){
            return ' btn btn-success ';
        } else {
            return ' btn btn-danger ';
        }
    }

    function getEditingIconClass(){
        if(vm.isEditing){
            return ' mdi-content-save ';
        } else {
            return ' mdi-content-create ';
        }
    }

    function setUpIScroll() {
        scroll = iScroll.verticalForm('settings-wrapper');
//        scroll.maxHeight = window.innerHeight - 50;

        $scope.$on('$destroy', function() {
            scroll.destroy();
            scroll = null;
        });
    }

    function init(){
        setUpIScroll();
        loadSettings();
        getStatus();
        getClientLanguage();

        removeEventCallback = $rootScope.$on('$translateChangeSuccess', function () {
            getClientLanguage();
        });

        vm.nickname = Client.getNickname();
        $scope.$emit('unload');

        $scope.$on('$destroy', function() {
            typeof removeEventCallback === 'function' && removeEventCallback();
        });
    }
}
