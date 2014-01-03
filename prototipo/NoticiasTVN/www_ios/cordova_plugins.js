cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.videoplayer/www/video.js",
        "id": "org.apache.cordova.videoplayer.VideoPlayer",
        "clobbers": [
            "window.videoPlayer"
        ]
    },
	{
		"file": "plugins/cordova-plugin-console-master/console-via-logger.js",
		"id": "org.apache.cordova.console.Console",
		"clobbers": [
			"console"
		]
	},
	{
		"file": "plugins/cordova-plugin-console-master/logger.js",
		"id": "org.apache.cordova.console.ConsoleLogger",
		"clobbers": [
			"cordova.logger"
		]
	}/*,
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    }*/
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.videoplayer": "1.0",
    "org.apache.cordova.network-information": "0.2.5"
}
// BOTTOM OF METADATA
});