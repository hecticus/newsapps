'use strict';

/**
 * @ngdoc service
 * @name core.Services.Gallery
 * @description Gallery Factory
 */
angular.module('core').factory('Gallery', Gallery);

Gallery.$injector = ['$http', '$q', 'Domain'];

function Gallery($http, $q, Domain) {
    //noinspection UnnecessaryLocalVariableJS
    var service = {

        /**
         * @ngdoc function
         * @name core.Services.Gallery#get
         * @description Gets Gallery items from server.
         * @methodOf core.Services.Gallery
         * @return {Array} Returns Gallery items
         */
        get: get,

        /**
         * @ngdoc function
         * @name core.Services.Gallery#getBeforeId
         * @description Gets Gallery items from before (older)
         * indicated id
         * @param {number} id Reference Post id
         * @methodOf core.Services.Gallery
         * @return {Array} Returns Gallery items
         */
        getBeforeId: getBeforeId,

        /**
         * @ngdoc function
         * @name core.Services.Gallery#getAfterId
         * @description Gets Gallery items from after (newer)
         * indicated id
         * @param {number} id Reference Post id
         * @methodOf core.Services.Gallery
         * @return {Array} Returns Gallery items
         */
        getAfterId: getAfterId
    };

    function get(){
        return getGallery();
    }

    function getGallery(){
        return $http.get(Domain.media.list()).then(success, error);

        function success(response){
            if(response.data.error === 0){
                return response.data.response;
            } else{
                console.log('Error retrieving gallery items from server on success callback: '
                    + ' error. code: ' + response.error + ' description: ' + response.description);
                console.log(response.data);
                return $q.reject(response);
            }
        }
        function error(response){
            console.log('Error retrieving gallery items from server: ');
            console.log(response.data);
            return $q.reject(response);
        }
    }

    //TODO Not implemented
    function getBeforeId(id){
        var deferred = $q.defer();
        deferred.resolve([]);
        return deferred.promise;
    }

    //TODO Not implemented
    function getAfterId(id){
        var deferred = $q.defer();
        deferred.resolve([]);
        return deferred.promise;
    }

    return service;
}
