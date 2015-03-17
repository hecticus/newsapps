'use strict';

/**
 * @ngdoc service
 * @name core.Services.WebManager
 * @description WebManager Factory
 */
angular
    .module('core')
    .factory('WebManager',['$http', 'CordovaDevice', 'TeamsManager', 'Domain',
        'App', 'i18n', 'News', 'Upstream', 'Client',
        function($http, CordovaDevice, TeamsManager, Domain, App, i18n, News, Upstream, Client) {

            /**
             * @ngdoc function
             * @name core.Services.WebManager#enableCerts
             * @description Enables Self Signed Certificates for HTTP Protocol
             * @methodOf core.Services.WebManager
             * @return {boolean} Returns certificate activation result
             */
            function enableCerts(all) {
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
            }

            /**
             * @ngdoc function
             * @name core.Services.WebManager#getAppender
             * @description Appender function for Auth Token Generation
             * @param {string} index position of the required character
             * @methodOf core.Services.WebManager
             * @return {string} Returns character value for index
             */
            function getAppender(index) {
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
            }

            function getHeaders() {
                var companyName = App.getCompanyName();
                var buildVersion = App.getBuildVersion();
                var serverVersion = App.getServerVersion();
                var headers = { "Content-Type": "application/json; charset=utf-8" };
                var auth = "";
                try {
                    auth = companyName + getAppender(buildVersion.charAt(0))
                        + buildVersion + getAppender(serverVersion.charAt(0))
                        + serverVersion;
                    headers['HECTICUS-X-AUTH-TOKEN'] = auth;
                } catch (e) {
                    console.log('Error setting HECTICUS-X-AUTH-TOKEN');
                }

                var clientSession = Client.getSession();
                if(clientSession){
                    headers['Authorization'] = 'Bearer ' + clientSession;
                }

                return headers;
            }

            function loadServerConfigs(successCallback, errorCallback){
                var platform = CordovaDevice.getPlatform() === 'Web'? 'Android' : CordovaDevice.getPlatform();
                var url = Domain.loading(CordovaDevice.getRealWidth() , CordovaDevice.getRealHeight()
                    , App.getBundleVersion(), platform);
//                    enableCerts(true);
                $http.get(url)
                    .success(function(_json) {
                        var response = _json.response;

                        Upstream.setUp(response);

                        App.setCompanyName(response.company_name);
                        App.setBuildVersion(response.build_version);
                        App.setServerVersion(response.server_version);
                        App.setUpdateInfo(response.version);

                        i18n.setDefaultLanguage(response.default_language);
                        i18n.setAvailableLanguages($http.get(Domain.languages));
                        News.setMaxNews(response.max_news);

                        successCallback();
                    }).error(function(){
                        errorCallback();
                    });
            }

            function getFavoritesConfig(isFilterActive){
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

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.WebManager#getHeaders
                 * @description Generates Headers like HECTICUS-X-AUTH-TOKEN for Web Requests
                 * @methodOf core.Services.WebManager
                 * @return {object} Returns HTTP Headers
                 */
                getHeaders: getHeaders,

                /**
                 * @ngdoc function
                 * @name core.Services.WebManager#loadServerConfigs
                 * @description Gets App configuration from Server
                 * @methodOf core.Services.WebManager
                 */
                loadServerConfigs : loadServerConfigs,

                /**
                 * @ngdoc function
                 * @name core.Services.WebManager#getFavoritesConfig
                 * @description Generates params for HTTP Requests according to
                 * the Favorites Filter configuration
                 * @methodOf core.Services.WebManager
                 * @return {object} Returns HTTP Params for Favorites
                 */
                getFavoritesConfig : getFavoritesConfig
            }
    }
]);
