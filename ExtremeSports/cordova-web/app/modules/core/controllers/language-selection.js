'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LanguageSelectionController
 * @description LanguageSelectionController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('LanguageSelectionController', LanguageSelectionController);

LanguageSelectionController.$injector = ['$scope', '$state', '$stateParams','$translate', 'i18n', 'Client','ClientManager'];
function LanguageSelectionController($scope, $state, $stateParams, $translate, i18n, Client, ClientManager) {
    var scroll = null;
    var vm = this;
    var isLogin = false;
    vm.languages = [];
    vm.searchQuery = '';

    vm.languageSelected = languageSelected;
    vm.getLanguageClass = getLanguageClass;

    init();

    //////////////////////////////////////////

    function languageSelected(language){
        Client.setLanguage(language).then(function(){
            var state = isLogin? 'login' : 'settings';
            console.log('language set: ' + language.name + '. navigating to: ' + state+ ' id : '+language.id_language);
            ClientManager.createOrUpdateClient({ 'language' : language.id_language });
            $state.go(state);
        });
    }

    function getLanguageClass(lang){
        if(lang.selected){
            return 'mdi-action-favorite mdi-material-lime';
        }else{
            return 'mdi-action-favorite-outline';
        }
    }

    function translate(){
        vm.languages.forEach(function(lang){
            $translate('LANGUAGE.' + lang.short_name.toUpperCase()).then(function(translation){
                lang.translation = translation;
            }, function(){
                lang.translation = lang.name;
            });
        });
    }

    function setUpIScroll() {
        scroll = new IScroll('#languages-wrapper'
            , {click: true, preventDefault: true, bounce: true, probeType: 2});
        scroll.on('beforeScrollStart', function () {
            this.refresh();
        });
        $scope.$on('$destroy', function() {
            scroll.destroy();
            scroll = null;
        });
    }

    function getLanguages(){
        i18n.getAvailableLanguages().then(success, error);

        function success(languages){
            vm.languages = languages;
            console.log('getAvailableLanguagesFromServer i18n');
            console.log(vm.languages);
            translate();
            $scope.$emit('unload');
        }
        function error(){
            $scope.$emit('unload');
        }

    }

    function init(){
        setUpIScroll();
        getLanguages();
        isLogin = $stateParams.isLogin;
    }
}
