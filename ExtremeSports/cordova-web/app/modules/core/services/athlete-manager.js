'use strict';

/**
 * @ngdoc service
 * @name core.Services.AthleteManager
 * @description AthleteManager Factory
 */
angular.module('core').factory('AthleteManager', AthleteManager);

AthleteManager.$inject = [];
function AthleteManager(){

    //noinspection UnnecessaryLocalVariableJS
    var service = {

        /**
         * @ngdoc function
         * @name core.Services.AthleteManager#getFavorites
         * @methodOf core.Services.AthleteManager
         * @return {Array} Returns Clients favorites
         */
        getFavorites: function() {
            return [];
        }
    };

    return service;
}
