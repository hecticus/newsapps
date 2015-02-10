'use strict';

/**
 * @ngdoc service
 * @name core.Services.WebManager
 * @description WebManager Factory
 */
angular
    .module('core')
    .factory('WebManager',['$http', 'CordovaDevice', 'Domain',
        function($http, CordovaDevice, Domain) {
            var that = this;
            var upstreamAppKey = '';
            var upstreamAppVersion = '';
            var upstreamServiceID = '';
            var upstreamURL = '';
            var companyName = '';
            var buildVersion = '';
            var serverVersion = '';

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

                enableCerts: function (all) {
                    console.log('WebManager. all: ' + all);
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
                    var headers = {
                        'Content-Type': 'application/json; charset=utf-8'
                    };
                    var auth = "";
                    try {
                        auth = that.companyName + this.getAppender(that.buildVersion.charAt(0))
                            + that.buildVersion + this.getAppender(that.serverVersion.charAt(0))
                            + that.serverVersion;
                        headers['HECTICUS-X-AUTH-TOKEN'] = auth;
                    } catch (e) {
                        console.log('Error setting HECTICUS-X-AUTH-TOKEN');
                    }
                    return headers;
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
                },

                loadServerConfigs : function (successCallback, errorCallback){
                    var url = Domain.loading(CordovaDevice.getRealWidth() , CordovaDevice.getRealHeight());
//                    this.enableCerts(true);
                    $http.get(url).success(function(_json) {
                            var response = _json.response;
                            that.upstreamAppKey = response.upstreamAppKey;
                            that.upstreamAppVersion = response.upstreamAppVersion;
                            that.upstreamServiceID = response.upstreamServiceID;
                            that.upstreamURL = response.upstreamURL;
                            that.companyName = response.company_name;
                            that.buildVersion = response.build_version;
                            that.serverVersion = response.server_version;
                            successCallback();
                        }).error(function(){
                            errorCallback();
                        });
                }
            }
    }
]);
