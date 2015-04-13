'use strict';

/**
 * @ngdoc service
 * @name core.Services.AthleteManager
 * @description AthleteManager Factory
 */
angular.module('core').factory('AthleteManager', AthleteManager);

AthleteManager.$inject = ['$http', '$q', 'Domain'];
function AthleteManager($http, $q, Domain){

    var page = 0;
    var pageSize = 100;

    //noinspection UnnecessaryLocalVariableJS
    var service = {

        /**
         * @ngdoc function
         * @name core.Services.AthleteManager#get
         * @description gets Athletes list from server
         * @methodOf core.Services.AthleteManager
         * @return {Array} Returns Athletes
         */
        get: get
    };

    function get(){

        var config = {
            params: {
                page: page,
                pageSize: pageSize
            }
        };

        return $http.get(Domain.athletes.list(), config).then(success, error);

        function success(response){
            if(response.data.error === 0){
                return response.data.response;
            } else{
                console.log('Error retrieving athletes from server on success callback: '
                    + ' error. code: ' + response.error + ' description: ' + response.description);
                console.log(response.data);
                return $q.reject(response);
            }
        }
        function error(response){
            console.log('Error retrieving athletes from server: ');
            console.log(response.data);
            return $q.reject(response);
        }
    }

    return service;
}
