'use strict';

/**
 * @ngdoc object
 * @name core.Constants.Domain
 * @description Define a constant
 */
angular.module('core').factory('Domain', Domain);

Domain.$inject = ['Client'];
function Domain(Client){

    var server = 'http://extreme.hecticus.com/';
    var serverApi = 'http://extreme.hecticus.com/api/';
    var apiVersion = 'v1';
    var debug = true;

    //noinspection UnnecessaryLocalVariableJS
    var service = {

        /**
         * @ngdoc function
         * @name core.Services.Domain#loading
         * @description Renders "/api/loading/:width/:height/:version/:platform"
         * @param {number} width Device Screen Width
         * @param {number} height Device Screen Height
         * @param {string} appVersion Installed Application Version
         * @param {string} platform Device Platform
         * @return {string} Rendered URL
         * @methodOf core.Services.Domain
         */
        loading: function (width, height, appVersion, platform) {
            return renderUrl('/loading/', [width, height, appVersion, platform]);
        },

        /**
         * @ngdoc function
         * @name core.Services.Domain#languages
         * @description Renders "/api/v1/languages" Available
         * Languages URL
         * @return {string} Rendered URL
         * @methodOf core.Services.Domain
         */
        languages: renderUrl('/languages', null),

        client: {
            /**
             * @ngdoc function
             * @name core.Services.Domain#client.create
             * @description Renders "/api/v1/client" Client
             * creation URL
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            'create': function(){
                return renderUrl('/client', null);
            },
            /**
             * @ngdoc function
             * @name core.Services.Domain#client.update
             * @description Renders "/api/v1/client/:id" Client Update/Delete/Get URL
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            'client': function () {
                return renderUrl('/client/', [getClientId()]);
            },
            /**
             * @ngdoc function
             * @name core.Services.Domain#client.reset-password
             * @description Renders "/api/v1/client/upstream/resetpass" Client
             * Password Reset URL
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            'reset-password' : function () {
                return renderUrl('/client/', ['upstream', 'resetpass']);
            },
            /**
             * @ngdoc function
             * @name core.Services.Domain#client.events
             * @description Renders "/api/v1/client/upstream/events/send"
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            'events': function () {
                return renderUrl('/client/', ['upstream', 'events', 'send']);
            },
            /**
             * @ngdoc function
             * @name core.Services.Domain#client.athletes
             * @description Renders "/api/v1/client/:id/favorite/athletes"
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            'athletes': function () {
                return renderUrl('/client/', [getClientId(),'favorite', 'athletes']);
            },
            /**
             * @ngdoc function
             * @name core.Services.Domain#client.categories
             * @description Renders "/api/v1/client/:id/favorite/categories"
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            'categories': function () {
                return renderUrl('/client/', [getClientId(),'favorite', 'categories']);
            }
        },

        posts: {
            /**
             * @ngdoc function
             * @name core.Services.Domain#posts.list
             * @description Renders "/api/v1/post/get/client/:id" endpoint URL
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            list: function () {
                return renderUrl('/post/get/client/', [getClientId()]);
            },

            /**
             * @ngdoc function
             * @name core.Services.Domain#posts.post
             * @description Renders "/api/v1/post/:id" endpoint URL
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            post: function (id) {
                return renderUrl('/post/', [id]);
            },

            /**
             * @ngdoc function
             * @name core.Services.Domain#posts.up
             * @description Renders "/api/v1/post/get/client/:id/up/:postId" endpoint URL
             * @param {number} postId Post Id from where to get posts "above" (or newer than) it
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            up: function (postId) {
                return renderUrl('/post/get/client/', [getClientId(), 'up', postId]);
            },

            /**
             * @ngdoc function
             * @name core.Services.Domain#posts.down
             * @description Renders "/api/v1/post/get/client/:id/down/:postId" endpoint URL
             * @param {number} postId Post Id from where to get posts "below" (or older than) it
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            down: function (postId) {
                return renderUrl('/post/get/client/', [getClientId(), 'down', postId]);
            }
        },

        media : {
            /**
             * @ngdoc function
             * @name core.Services.Domain#media.list
             * @description Renders "/api/v1/media/client/:id" endpoint URL
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            list: function () {
                return renderUrl('/media/client/', [getClientId()]);
            },

            /**
             * @ngdoc function
             * @name core.Services.Domain#media.up
             * @description Renders "/api/v1/media/client/:id/up/:postId" endpoint URL
             * @param {number} postId Post Id from where to get media "above" (or newer than) it
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            up: function (postId) {
                return renderUrl('/media/client/', [getClientId(), 'up', postId]);
            },

            /**
             * @ngdoc function
             * @name core.Services.Domain#down
             * @description Renders "/api/v1/media/client/:id/down/:postId" endpoint URL
             * @param {number} postId Post Id from where to get media "below" (or older than) it
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            down: function (postId) {
                return renderUrl('/media/client/', [getClientId(), 'down', postId]);
            }
        },

        athletes : {
            /**
             * @ngdoc function
             * @name core.Services.Domain#athletes.list
             * @description Renders "/api/v1/athletes" endpoint URL
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            list: function () {
                return renderUrl('/athletes', null);
            }
        },

        categories : {
            /**
             * @ngdoc function
             * @name core.Services.Domain#categories.list
             * @description Renders "/api/v1/categories" endpoint URL
             * @return {string} Rendered URL
             * @methodOf core.Services.Domain
             */
            list: function () {
                return renderUrl('/categories', null);
            }
        }
    };

    /**
     * @ngdoc function
     * @name core.Services.Domain#getClientId
     * @description Wrapper for ClientId
     * @return {number} Client Id
     * @methodOf core.Services.Domain
     */
    function getClientId(){
        return Client.getClientId();
    }

    /**
     * @ngdoc function
     * @name core.Services.Domain#renderUrl
     * @description URL Renderer, takes multiple parameters
     * @param {string} endpoint server endpoint, must start and end with '/'
     * @param {Array} urlParams (Optional) Array with URL params. Are rendered in the same order they come
     * rendered through console output.
     * @methodOf core.Services.Domain
     */
    function renderUrl(endpoint, urlParams){
        var hostArr = [serverApi, apiVersion, endpoint];
        var result = urlParams? hostArr.concat(urlParams.join('/')) : hostArr;
        result = result.join('');
        if(debug){
            console.log('Domain.renderUrl:');
            console.log(result);
        }
        return result;
    }

    return service;
}
