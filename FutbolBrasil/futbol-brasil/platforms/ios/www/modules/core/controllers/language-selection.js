'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.LanguageSelectionController
 * @description LanguageSelectionController
 * @requires ng.$scope
*/
angular
    .module('core')
    .controller('LanguageSelectionController', [
        '$scope', '$state', '$translate', 'i18n', 'Client',
        function($scope, $state, $translate, i18n, Client) {
            var scroll = null;
            $scope.languages = [];
            $scope.searchQuery = '';

            $scope.languageSelected = languageSelected;
            $scope.getLanguageClass = getLanguageClass;

            init();

            //////////////////////////////////////////

            function languageSelected(language){
                Client.setLanguage(language, function(){
                    $state.go('settings');
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
                $scope.languages.forEach(function(lang){
                    $translate('LANGUAGE.' + lang.short_name.toUpperCase()).then(function(translation){
                        lang.translation = translation;
                    }, function(){
                        lang.translation = lang.name;
                    });
                });
            }

            function setUpIScroll() {
                scroll = new IScroll('#wrapper'
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
                $scope.languages = i18n.getAvailableLanguages();
                translate();
                $scope.$emit('unload');
            }

            function init(){
                setUpIScroll();
                getLanguages();
            }
        }
]);
