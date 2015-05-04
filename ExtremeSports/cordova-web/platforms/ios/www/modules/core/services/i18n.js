'use strict';

/**
 * @ngdoc service
 * @name core.Services.i18n
 * @description i18n Factory
 */
angular.module('core').factory('i18n',i18n);
i18n.$inject = ['$q', '$localStorage', '$http', 'Domain'];
function i18n($q, $localStorage, $http, Domain) {
    var FILE_KEY_LANGUAGES = 'APPLANGUAGES';
    var FILE_KEY_LANGUAGE_DEFAULT = 'APPLANGUAGEDEFAULT';
    var availableLanguages = [];
    var defaultLanguage = null;

    //noinspection UnnecessaryLocalVariableJS
    var service = {

        /**
         * @ngdoc function
         * @name core.Services.i18n#init
         * @description Initializes i18n Service
         * @param {object} lang default language to be set
         * @methodOf core.Services.i18n
         */
        init: init,

        /**
         * @ngdoc function
         * @name core.Services.i18n#getAvailableLanguages
         * @methodOf core.Services.i18n
         * @return {Array} Returns available in-app Languages
         */
        getAvailableLanguages: getAvailableLanguages,

        /**
         * @ngdoc function
         * @name core.Services.i18n#setDefaultLanguage
         * @description Sets the app's default language
         * @param {object} lang default language to be set
         * @methodOf core.Services.i18n
         */
        setDefaultLanguage : setDefaultLanguage,

        /**
         * @ngdoc function
         * @name core.Services.i18n#getDefaultLanguage
         * @methodOf core.Services.i18n
         * @return {object} Returns default app language
         */
        getDefaultLanguage : getDefaultLanguage
    };

    function persistLanguages(languages){
        if(languages) {
            availableLanguages = languages;
        }
        $localStorage[FILE_KEY_LANGUAGES] = JSON.stringify(availableLanguages);
    }

    function loadLanguages(){
        availableLanguages = JSON.parse($localStorage[FILE_KEY_LANGUAGES]);
        return availableLanguages;
    }

    function getAvailableLanguages() {
        var deferred = $q.defer();
        if(availableLanguages.length === 0){
            getAvailableLanguagesFromServer().then(success, error);
        } else {
            deferred.resolve(availableLanguages);
        }
        return deferred.promise;

        function success(languages){
            deferred.resolve(languages);
        }
        function error(){
            deferred.reject();
        }
    }

    function getAvailableLanguagesFromServer(){
        return $http.get(Domain.languages).then(success, error);

        function success(response){
            if(response.data.error === 0) {
                persistLanguages(response.data.response.languages);
                return response.data.response.languages;
            } else {
                return $q.reject(response.data);
            }
        }

        function error(response){
            console.log('i18n. setAvailableLanguages. promise error');
            if(!response.data){ response.data = {}; }
            response.data.languages = availableLanguages;
            return $q.reject(response.data);
        }
    }

    function getDefaultLanguage(){
        if(!defaultLanguage && $localStorage[FILE_KEY_LANGUAGE_DEFAULT]){
            defaultLanguage = JSON.parse($localStorage[FILE_KEY_LANGUAGE_DEFAULT]);
        }
        return defaultLanguage;
    }

    function setDefaultLanguage(lang){
        if(lang !== defaultLanguage) {
            defaultLanguage = lang;
            $localStorage[FILE_KEY_LANGUAGE_DEFAULT] = JSON.stringify(defaultLanguage);
        }
    }

    function init(lang){
        setDefaultLanguage(lang);
        getAvailableLanguagesFromServer();
    }

    return service;
}
