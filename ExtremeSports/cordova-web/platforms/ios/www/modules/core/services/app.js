'use strict';

/**
 * @ngdoc service
 * @name core.Services.App
 * @description App Service
 */
angular.module('core').service('App', App);

App.$inject = [];
function App() {
    var companyName = '';
    var buildVersion = '';
    var serverVersion = '';
    var bundleVersion = '0.0.2';
    var bundleId = '';
    var updateInfo = {};

    /**
     * @ngdoc function
     * @name core.Services.App#getCompanyName
     * @description companyName getter
     * @methodOf core.Services.App
     * @return {string} companyName
     */
    this.getCompanyName = function(){
        return companyName;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#getCompanyName
     * @description companyName getter
     * @methodOf core.Services.App
     * @return {string} companyName
     */
    this.setCompanyName = function(name){
        companyName = name;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#getBuildVersion
     * @description buildVersion getter
     * @methodOf core.Services.App
     * @return {string} buildVersion
     */
    this.getBuildVersion = function(){
        return buildVersion;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#setBuildVersion
     * @description buildVersion setter
     * @methodOf core.Services.App
     */
    this.setBuildVersion = function(version){
        buildVersion = version;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#getServerVersion
     * @description serverVersion getter
     * @methodOf core.Services.App
     * @return {string} serverVersion
     */
    this.getServerVersion = function(){
        return serverVersion;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#setServerVersion
     * @description serverVersion setter
     * @methodOf core.Services.App
     */
    this.setServerVersion = function(version){
        serverVersion = version;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#getBundleVersion
     * @description bundleVersion getter
     * @methodOf core.Services.App
     * @return {string} bundleVersion
     */
    this.getBundleVersion = function(){
        return bundleVersion;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#setBundleVersion
     * @description bundleVersion setter
     * @methodOf core.Services.App
     */
    this.setBundleVersion = function(version){
        bundleVersion = version;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#getBundleId
     * @description bundleId getter
     * @methodOf core.Services.App
     * @return {string} bundleId
     */
    this.getBundleId = function(){
        return bundleId;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#setBundleId
     * @description bundleId setter
     * @methodOf core.Services.App
     */
    this.setBundleId = function(id){
        bundleId = id;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#getUpdateInfo
     * @description updateInfo getter
     * @methodOf core.Services.App
     * @return {object} updateInfo
     */
    this.getUpdateInfo = function(){
        return updateInfo;
    };

    /**
     * @ngdoc function
     * @name core.Services.App#setUpdateInfo
     * @description aupdateInfo setter
     * @methodOf core.Services.App
     */
    this.setUpdateInfo = function(info){
        updateInfo = info;
    };
}
