'use strict';

/**
 * @ngdoc service
 * @name core.Services.Analytics
 * @description Analytics Factory
 */
angular
    .module('core')
    .factory('Analytics',['$window',
        function($window) {

            function init(){
                console.log('Analytics.init');
                console.log(!!$window.analytics);
                if(!!$window.analytics) {
                    $window.analytics.startTrackerWithId('UA-60700423-1');
                }
            }

            function trackView(title){
                if(!!$window.analytics){
                    $window.analytics.trackView(title);
                } else {
                    console.log('$window.analytics Plugin not available. Are you directly on a browser?');
                }
            }

            function trackEvent(event){
                if(!!$window.analytics){
                    if(event.category && event.action){
                        $window.analytics.trackEvent(event.category, event.action, event.label, event.value)
                    } else {
                        console.log('No Category and Action defined for Event');
                    }
                } else {
                    console.log('$window.analytics Plugin not available. Are you directly on a browser?');
                }
            }

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.Analytics#init
                 * @description set up Analytics tracker
                 * @methodOf core.Services.Analytics
                 */
                init: init,

                /**
                 * @ngdoc function
                 * @name core.Services.Analytics#trackEvent
                 * @description
                 * @param {object} event Event information. must have keys:
                 * @param {string} event.title (Optional) The name of the screen.
                 * @methodOf core.Services.Analytics
                 */
                trackView : trackView,

                /**
                 * @ngdoc function
                 * @name core.Services.Analytics#trackEvent
                 * @description
                 * @param {object} event Event information. must have keys:
                 * @param {string} category (Required) Typically the object that was interacted with (e.g. button)
                 * @param {string} action (Required) The type of interaction (e.g. click)
                 * @param {string} label Useful for categorizing events (e.g. nav buttons)
                 * @param {string} value Values must be non-negative. Useful to pass counts (e.g. 4 times)
                 * @methodOf core.Services.Analytics
                 */
                trackEvent: trackEvent
            };
        }
    ]);
