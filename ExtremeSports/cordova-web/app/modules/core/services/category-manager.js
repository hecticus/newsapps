'use strict';

/**
 * @ngdoc service
 * @name core.Services.CategoryManager
 * @description CategoryManager Factory
 */
angular.module('core').factory('CategoryManager', CategoryManager);

CategoryManager.$inject = [];
function CategoryManager() {

    //noinspection UnnecessaryLocalVariableJS
    var service = {

        /**
         * @ngdoc function
         * @name core.Services.CategoryManager#getFavorites
         * @methodOf core.Services.CategoryManager
         * @return {Array} Returns Client favorites
         */
        getFavorites: function() {
            return [];
        }
    };

    return service;
}
