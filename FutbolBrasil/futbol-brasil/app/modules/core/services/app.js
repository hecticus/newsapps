'use strict';

/**
 * @ngdoc service
 * @name core.Services.App
 * @description App Factory
 */
angular
    .module('core')
    .factory('App',
        function() {
            var companyName = '';
            var buildVersion = '';
            var serverVersion = '';
            var bundleVersion = '0.0.2';
            var bundleId = '';
            var updateInfo = {};

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.App#method1
                 * @methodOf core.Services.App
                 * @return {boolean} Returns a boolean value
                 */
                method1: function() {
                    return true;
                },

                getCompanyName: function(){
                    return companyName;
                },

                setCompanyName: function(name){
                    companyName = name;
                },

                getBuildVersion: function(){
                    return buildVersion;
                },

                setBuildVersion: function(version){
                    buildVersion = version;
                },

                getServerVersion: function(){
                    return serverVersion;
                },

                setServerVersion: function(version){
                    serverVersion = version;
                },

                getBundleVersion: function(){
                    return bundleVersion;
                },

                setBundleVersion: function(version){
                    bundleVersion = version;
                },

                getBundleId: function(){
                    return bundleId;
                },

                setBundleId: function(id){
                    bundleId = id;
                },

                getUpdateInfo: function(){
                    return updateInfo;
                },

                setUpdateInfo: function(info){
                    updateInfo = info;
                }
            };
    });
