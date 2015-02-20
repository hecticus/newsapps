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
        '$scope', '$state', 'i18n', 'Client',
        function($scope, $state, i18n, Client) {
            $scope.languages = [];
            $scope.searchQuery = '';

            $scope.languageSelected = function(language){
                Client.setLanguage(language, function(){
                    console.log(language);
                    $state.go('settings');
                });
            };

            $scope.getLanguages = function(){
                i18n.getAvailableLanguages().then(function(languages){
                    $scope.languages = languages;
                },function(response){
                    console.log('getLanguages. Error getting languages from server. ' +
                        'Falling back to persisted data');
                    if(response.languages){
                        $scope.languages = response.languages;
                    }
                });
                $scope.$emit('unload');
            };

            $scope.getLanguageClass = function(Language){
                if(Language.selected){
                    return 'mdi-action-favorite mdi-material-lime';
                }else{
                    return 'mdi-action-favorite-outline';
                }
            };

            $scope.setUpIScroll = function() {
                $scope._scroll = new IScroll('#wrapper'
                    , {click: true, preventDefault: true, bounce: true, probeType: 2});
                $scope._scroll.on('beforeScrollStart', function () {
                    this.refresh();
                });
            };

            $scope.init = function(){
                $scope.setUpIScroll();
                $scope.getLanguages();
            }();
        }
]);
