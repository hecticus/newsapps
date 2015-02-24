'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
    // Init module configuration options
    var applicationModuleName = 'FutbolBrasil';
    var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngStorage', 'ngAnimate'
        , 'ngTouch', 'ngSanitize', 'pascalprecht.translate', 'ui.router', 'ui.bootstrap', 'ui.utils'];

    // Add a new vertical module
    var registerModule = function(moduleName) {
        angular.module(moduleName, []);

        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();
