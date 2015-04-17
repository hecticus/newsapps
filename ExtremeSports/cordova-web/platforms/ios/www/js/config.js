'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
    // Init module configuration options
    var applicationModuleName = 'ExtremeSports';
    var applicationModuleVendorDependencies = ['ngResource', 'ngCookies', 'ngStorage', 'ngAnimate'
        , 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils', 'pascalprecht.translate', 'socialsharing'];

    // Add a new vertical module
    var registerModule = function(moduleName) {
        // Create angular module
        angular
            .module(moduleName, []);

        // Add the module to the AngularJS configuration file
        angular
            .module(applicationModuleName)
            .requires
            .push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();
