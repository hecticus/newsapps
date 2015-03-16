'use strict';

/**
 * @ngdoc service
 * @name core.Services.SocialAppsManager
 * @description SocialAppsManager Factory
 */
angular
    .module('core')
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

            function openSocialApp(socialNet, source){
                try{
                    switch(socialNet) {
                        case 'instagram':
                            $window.open(source, '_system', 'location=no');
                            break;
                        case 'facebook':
                            $window.open( source, '_system', 'location=no');
                            break;
                        case 'twitter':
                            $window.open(source, '_system', 'location=no');
                            break;
                        default:
                            $window.open(source, '_system', 'location=no');
                            break;
                    }
                    return true;
                }catch(err){
                    console.log("Ocurrio un error al abrir una app de red social: "+err.message);
                    return false;
                }
            }

            function sharePost(title, fileImage, source){
                console.log('SocialAppsManager. sharePost.');
                //poner loading screen
                Utilities.showAlert("Carregamento...");
                var image = new Image();
                image.src = fileImage;
                var dataImage = this.getBase64Image(image);
                //tratamos de acelerar el plugin enviandole la imagen completa como data
                $window.plugins.socialsharing.share(title, "A Gata Do Dia", dataImage, source);
            }

            function getBase64Image(img) {
                // Create an empty canvas element
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                // Copy the image contents to the canvas
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                return canvas.toDataURL();
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
