'use strict';

/**
 * @ngdoc service
 * @name core.Services.SocialAppsManager
 * @description SocialAppsManager Factory
 */
angular
    .module('core')
//    .factory('SocialAppsManager', ['$window', 'Utilities',
//        function($window, Utilities) {
    .factory('SocialAppsManager', ['$window', 'Utilities','$fb','$twt',
        function($window, Utilities, $fb, $twt) {

            function share(message, subject){
                if($window.plugins && $window.plugins.socialsharing) {
                    $window.plugins.socialsharing.share(message, subject);
                } else {
                    console.log('$window.plugins.socialsharing Plugin not available. Are you directly on a browser?');
                }
            }

            function fbShare(message, subject) {
                $fb.feed({
                    name: subject,
                    description: message,
                    caption: subject/*,
                    link: "http://www.phaninder.com",
                    picture: "https://rawgit.com/pasupulaphani/angular-socialsharing/gh-pages-gen/app/images/Thirsty-Planet.png"*/
                });
            }

            function twitterShare(message, subject) {
                $twt.intent('tweet', {
                    text: subject + ' - ' + message/*,
                    url: 'http://www.phaninder.com/posts/adventures-at-nodecoptor/',
                    hashtags: 'phaninder.com'*/
                });
            }

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.SocialAppsManager#share
                 * @description Share post depending on platform
                 * @param {string} title Shared content title
                 * @param {string} message Shared content Message
                 * @methodOf core.Services.SocialAppsManager
                 */
                share : share,

                /**
                 * @ngdoc function
                 * @name core.Services.SocialAppsManager#fbShare
                 * @description Share post on Facebook via Web
                 * @param {string} title Shared content title
                 * @param {string} message Shared content Message
                 * @methodOf core.Services.SocialAppsManager
                 */
                fbShare : fbShare,

                /**
                 * @ngdoc function
                 * @name core.Services.SocialAppsManager#twitterShare
                 * @description Share post on Twitter via Web
                 * @param {string} title Shared content title
                 * @param {string} message Shared content Message
                 * @methodOf core.Services.SocialAppsManager
                 */
                twitterShare : twitterShare
            };
        }
    ]);
