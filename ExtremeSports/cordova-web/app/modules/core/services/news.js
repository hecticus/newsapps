'use strict';

/**
 * @ngdoc service
 * @name core.Services.News
 * @description News Factory
 */
angular.module('core').factory('News', News);

News.$injector = ['$http', '$q', 'Domain', 'Client'];
function News($http, $q, Domain, Client) {

    //noinspection UnnecessaryLocalVariableJS
    var service = {

        /**
         * @ngdoc function
         * @name core.Services.News#get
         * @description Gets News posts from server.
         * If id is specified gets post from server
         * @param {number} id Post id
         * @methodOf core.Services.News
         * @return {Array} Returns News posts
         */
        get: get,

        /**
         * @ngdoc function
         * @name core.Services.News#getBeforeId
         * @description Gets News posts from before (older)
         * indicated id
         * @param {number} id Reference Post id
         * @methodOf core.Services.News
         * @return {Array} Returns News posts
         */
        getBeforeId: getBeforeId,

        /**
         * @ngdoc function
         * @name core.Services.News#getAfterId
         * @description Gets News posts from after (newer)
         * indicated id
         * @param {number} id Reference Post id
         * @methodOf core.Services.News
         * @return {Array} Returns News posts
         */
        getAfterId: getAfterId
    };

    function get(id){
        if(id){
            return getNewsPost(id);
        }else{
            return getNews();
        }
    }

    function getNews(){
        return $http.get(Domain.posts.list()).then(success, error);

        function success(response){
            if(response.data.error === 0){
                return response.data.response;
            } else{
                console.log('Error retrieving news post from server on success callback: '
                    + ' error. code: ' + response.error + ' description: ' + response.description);
                console.log(response.data);
                return $q.reject(response);
            }
        }
        function error(response){
            console.log('Error retrieving news post from server: ');
            console.log(response.data);
            return $q.reject(response);
        }
    }

    function getNewsPost(id){
        return $http.get(Domain.posts.post(id),{"params": {"idClient": Client.getClientId()}})
            .then(success, error);

        function success(response){
            if(response.data.error === 0){
                return response.data.response;
            } else{
                console.log('Error retrieving news post from server on success callback: '
                    + ' error. code: ' + response.error + ' description: ' + response.description);
                console.log(response.data);
                return $q.reject(response);
            }
        }
        function error(response){
            console.log('Error retrieving news post from server: ');
            console.log(response.data);
            return $q.reject(response);
        }
    }
    function getBeforeId(id){}
    function getAfterId(id){}


    return service;
}
