'use strict';

/**
 * @ngdoc service
 * @name core.Services.News
 * @description News Factory
 */
angular
    .module('core')
    .factory('News',
        function() {
            return {

                /**
                 * @ngdoc function
                 * @name core.Services.News#method1
                 * @methodOf core.Services.News
                 * @return {boolean} Returns a boolean value
                 */
                method1: function() {
                    return true;
                },

                /**
                 * @ngdoc function
                 * @name core.Services.News#method2
                 * @methodOf core.Services.News
                 * @return {boolean} Returns a boolean value
                 */
                method2: function() {
                    return false
                }
            };
    });
