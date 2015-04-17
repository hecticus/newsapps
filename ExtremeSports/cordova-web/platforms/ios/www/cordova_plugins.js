cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.danielcwilson.plugins.googleanalytics/www/analytics.js",
        "id": "com.danielcwilson.plugins.googleanalytics.UniversalAnalytics",
        "clobbers": [
            "analytics"
        ]
    },
    {
        "file": "plugins/com.hecticus.cordova.plugins.sharedconfigurations/www/sharedConfigurations.js",
        "id": "com.hecticus.cordova.plugins.sharedconfigurations.SharedConfigurations",
        "clobbers": [
            "SharedConfigurations"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.PushPlugin/www/PushNotification.js",
        "id": "com.phonegap.plugins.PushPlugin.PushNotification",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.facebookconnect/facebookConnectPlugin.js",
        "id": "com.phonegap.plugins.facebookconnect.FacebookConnectPlugin",
        "clobbers": [
            "facebookConnectPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.danielcwilson.plugins.googleanalytics": "0.7.0",
    "com.google.playservices": "19.0.0",
    "com.hecticus.cordova.plugins.sharedconfigurations": "1.0.0",
    "com.phonegap.plugins.PushPlugin": "2.4.0",
    "com.phonegap.plugins.facebookconnect": "0.11.0"
}
// BOTTOM OF METADATA
});