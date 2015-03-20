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

            $scope.languageSelected = function(language){
                Client.setLanguage(language, function(){
                    console.log(language);
                    $state.go('settings');
                });
            };

            $scope.getLanguages = function(){
                $scope.languages = i18n.getAvailableLanguages();
                $scope.translate();
                $scope.$emit('unload');
            };

            $scope.getLanguageClass = function(Language){
                if(Language.selected){
                    return 'mdi-action-favorite mdi-material-lime';
                }else{
                    return 'mdi-action-favorite-outline';
                }
            };

            $scope.translate = function(){
                $scope.languages.forEach(function(lang){
                    $translate('LANGUAGE.' + lang.short_name.toUpperCase()).then(function(translation){
                        lang.translation = translation;
                        console.log($scope.languages);
                    }, function(){
                        lang.translation = lang.name;
                    });
                });
            };

            $scope.setUpIScroll = function() {
                scroll = new IScroll('#wrapper'
                    , {click: true, preventDefault: true, bounce: true, probeType: 2});
                scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });
                $scope.$on('$destroy', function() {
                    scroll.destroy();
                    scroll = null;
                });
            };

            $scope.init = function(){
                $scope.setUpIScroll();
                $scope.getLanguages();
            }();
        }
]);
