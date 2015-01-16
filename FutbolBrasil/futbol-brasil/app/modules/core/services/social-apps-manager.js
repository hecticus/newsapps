'use strict';

/**
 * @ngdoc service
 * @name core.Services.SocialAppsManager
 * @description SocialAppsManager Factory
 */
angular
    .module('core')
    .factory('SocialAppsManager', ['$window', 'Utilities',
        function($window, Utilities) {
            return {

                /**
                 * @ngdoc function
                 * @name core.Services.SocialAppsManager#method1
                 * @methodOf core.Services.SocialAppsManager
                 * @return {boolean} Returns a boolean value
                 */
                method1: function() {
                    return true;
                },

                openSocialApp : function (socialNet, source){
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
                },

                sharePost : function (title, fileImage, source){
                    console.log('SocialAppsManager. sharePost.');
                    //poner loading screen
                    Utilities.showAlert("Carregamento...");
                    var image = new Image();
                    image.src = fileImage;
                    var dataImage = this.getBase64Image(image);
                    //tratamos de acelerar el plugin enviandole la imagen completa como data
                    $window.plugins.socialsharing.share(title, "A Gata Do Dia", dataImage, source);
                },

                getBase64Image : function (img) {
                    // Create an empty canvas element
                    var canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Copy the image contents to the canvas
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    return canvas.toDataURL();
                }

            };
        }
    ]);
