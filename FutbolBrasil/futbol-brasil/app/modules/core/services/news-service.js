'use strict';

/**
 * @ngdoc service
 * @name core.Services.NewsService
 * @description NewsService Factory
 */
angular
    .module('core')
    .factory('NewsService',
        function() {
            return {

                /**
                 * @ngdoc function
                 * @name core.Services.NewsService#method1
                 * @methodOf core.Services.NewsService
                 * @return {boolean} Returns a boolean value
                 */
                method1: function() {
                    return true;
                },

                /**
                 * @ngdoc function
                 * @name core.Services.NewsService#method2
                 * @methodOf core.Services.NewsService
                 * @return {boolean} Returns a boolean value
                 */
                method2: function() {
                    return false
                }
            };
    });
