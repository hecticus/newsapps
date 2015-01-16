'use strict';

/**
 * @ngdoc service
 * @name core.Services.WebManager
 * @description WebManager Factory
 */
angular
    .module('core')
    .factory('WebManager',
        function() {
            return {

                /**
                 * @ngdoc function
                 * @name core.Services.WebManager#method1
                 * @methodOf core.Services.WebManager
                 * @return {boolean} Returns a boolean value
                 */
                method1: function () {
                    return true;
                },

                companyName: '',
                buildVersion: '',
                serverVersion: '',

                //TODO revisar uso de CordovaHttpPlugin
                enableCerts: function (all) {
                    console.log('WebManager! ' + all);
                    if (all) {
                        plugins.CordovaHttpPlugin.acceptAllCerts(true, function () {
                            return true;
                        }, function () {
                            return false;
                        });
                    } else {
                        plugins.CordovaHttpPlugin.enableSSLPinning(true, function () {
                            return true;
                        }, function () {
                            return false;
                        });
                    }
                },

                getHeaders: function () {
                    var auth = "";
                    try {
                        auth = this.companyName + this.getAppender(this.buildVersion.charAt(0))
                            + this.buildVersion + this.getAppender(this.serverVersion.charAt(0)) + this.serverVersion;
                    } catch (e) {
                        auth = this.companyName + " " + this.buildVersion + " " + this.serverVersion;
                    }
                    console.log(auth);
                    return { 'HECTICUS-X-AUTH-TOKEN': auth };
                },

                getAppender: function (index) {
                    switch (index) {
                        case '1':
                            return '|';
                        case '2':
                            return '@';
                        case '3':
                            return '#';
                        case '4':
                            return '$';
                        case '5':
                            return '%';
                        case '6':
                            return '&';
                        case '7':
                            return '/';
                        case '8':
                            return '(';
                        case '9':
                            return ')';
                        case '0':
                            return '=';
                        default:
                            return '-';
                    }
                }
            }
    });
