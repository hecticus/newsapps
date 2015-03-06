'use strict';

/**
 * @ngdoc service
 * @name core.Services.WebManager
 * @description WebManager Factory
 */
angular
    .module('core')
    .factory('WebManager',['$http', 'CordovaDevice', 'TeamsManager', 'Domain', 'App', 'i18n',
        function($http, CordovaDevice, TeamsManager, Domain, App, i18n) {
            return {

                /**
                 * @ngdoc function
                 * @name core.Services.WebManager#enableCerts
                 * @description Enables Self Signed Certificates for HTTP Protocol
                 * @methodOf core.Services.WebManager
                 * @return {boolean} Returns certificate activation result
                 */
                enableCerts: function (all) {
                    console.log('WebManager. all: ' + all);
                    if(!!plugins.CordovaHttpPlugin) {
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
                    } else {
                        console.log('plugins.CordovaHttpPlugin Object not available. Are you directly on a browser?');
                    }
                },

                /**
                 * @ngdoc function
                 * @name core.Services.WebManager#getHeaders
                 * @description Generates Headers like HECTICUS-X-AUTH-TOKEN for Web Requests
                 * @methodOf core.Services.WebManager
                 * @return {object} Returns HTTP Headers
                 */
                getHeaders: function () {
                    var companyName = App.getCompanyName();
                    var buildVersion = App.getBuildVersion();
                    var serverVersion = App.getServerVersion();
                    var headers = { "Content-Type": "application/json; charset=utf-8" };
                    var auth = "";
                    try {
                        auth = companyName + this.getAppender(buildVersion.charAt(0))
                            + buildVersion + this.getAppender(serverVersion.charAt(0))
                            + serverVersion;
                        headers['HECTICUS-X-AUTH-TOKEN'] = auth;
                    } catch (e) {
                        console.log('Error setting HECTICUS-X-AUTH-TOKEN');
                    }
                    return headers;
                },

                /**
                 * @ngdoc function
                 * @name core.Services.WebManager#getAppender
                 * @description Appender function for Auth Token Generation
                 * @methodOf core.Services.WebManager
                 * @return {string} Returns character value for position
                 */
                getAppender : function (index) {
                    switch (index) {
                        case '1': return '|';
                        case '2': return '@';
                        case '3': return '#';
                        case '4': return '$';
                        case '5': return '%';
                        case '6': return '&';
                        case '7': return '/';
                        case '8': return '(';
                        case '9': return ')';
                        case '0': return '=';
                        default: return '-';
                    }
                },

                /**
                 * @ngdoc function
                 * @name core.Services.WebManager#loadServerConfigs
                 * @description Gets App configuration from Server
                 * @methodOf core.Services.WebManager
                 */
                loadServerConfigs : function (successCallback, errorCallback){
                    var url = Domain.loading(CordovaDevice.getRealWidth() , CordovaDevice.getRealHeight()
                        , App.getBundleVersion(), CordovaDevice.getPlatform());
//                    this.enableCerts(true);
                    $http.get(url)
                    .success(function(_json) {
                        var response = _json.response;
                        App.setUpstreamAppKey(response.upstreamAppKey);
                        App.setUpstreamAppVersion(response.upstreamAppVersion);
                        App.setUpstreamServiceId(response.upstreamServiceID);
                        App.setUpstreamUrl(response.upstreamURL);
                        App.setCompanyName(response.company_name);
                        App.setBuildVersion(response.build_version);
                        App.setServerVersion(response.server_version);
                        App.setUpdateInfo(response.version);
                        i18n.setDefaultLanguage(response.default_language);
                        i18n.setAvailableLanguages($http.get(Domain.languages));
                        successCallback();
                    }).error(function(){
                        errorCallback();
                    });
                },

                /**
                 * @ngdoc function
                 * @name core.Services.WebManager#enableCerts
                 * @description Enables Self Signed Certificates for HTTP Protocol
                 * @methodOf core.Services.WebManager
                 * @return {boolean} Returns certificate activation result
                 */
                getFavoritesConfig : function(isFilterActive){
                    var httpConfig = {params:{}};
                    if(isFilterActive){
                        httpConfig.params.teams = TeamsManager.getFavoriteTeams().map(function(elem){
                            return elem.id_teams;
                        });
                        console.log('httpConfig.params.teams: ');
                        console.log(httpConfig.params.teams);
                    }
                    return httpConfig;
                }
            }
    }
]);
