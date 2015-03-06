'use strict';

/**
 * @ngdoc service
 * @name core.Services.i18n
 * @description i18n Factory
 */
angular
    .module('core')
    .factory('i18n',['$q', '$localStorage',
        function($q, $localStorage) {
            var FILE_KEY_LANGUAGES = 'APPLANGUAGES';
            var FILE_KEY_LANGUAGE_DEFAULT = 'APPLANGUAGEDEFAULT';
            var availableLanguages = [];
            var defaultLanguage = null;

            var persistLanguages = function(languages){
                if(languages) {
                    availableLanguages = languages;
                }
                $localStorage[FILE_KEY_LANGUAGES] = JSON.stringify(availableLanguages);
            };

            var loadLanguages = function(){
                availableLanguages = JSON.parse($localStorage[FILE_KEY_LANGUAGES]);
                return availableLanguages;
            };

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.i18n#getAvailableLanguages
                 * @methodOf core.Services.i18n
                 * @return {Array} Returns available in-app Languages
                 */
                getAvailableLanguages: function() {
                    if(!availableLanguages){ loadLanguages(); }
                    return availableLanguages;
                },

                setAvailableLanguages : function(http){
//                    console.log('i18n. setAvailableLanguages.');
                    http.then(
                        function(response){
                            response = response.data;
//                            console.log(response);
                            if(response.error) {
//                                console.log('i18n. setAvailableLanguages. error');
                                return $q.reject(response.data);
                            } else {
//                                console.log('i18n. setAvailableLanguages. success');
                                response = response.response;
                                persistLanguages(response.languages);
                                return availableLanguages;
                            }
                        },
                        function(response){
                            console.log('i18n. setAvailableLanguages. promise error');
                            response.data.languages = availableLanguages;
                            return $q.reject(response.data);
                        }
                    );
                },

                setDefaultLanguage : function(lang){
                    if(lang !== defaultLanguage) {
                        defaultLanguage = lang;
                        $localStorage[FILE_KEY_LANGUAGE_DEFAULT] = JSON.stringify(defaultLanguage);
                    }
                },

                getDefaultLanguage : function(){
                    if(!defaultLanguage && $localStorage[FILE_KEY_LANGUAGE_DEFAULT]){
                        defaultLanguage = JSON.parse($localStorage[FILE_KEY_LANGUAGE_DEFAULT]);
                    }
                    return defaultLanguage;
                }
            };
        }
    ]);
