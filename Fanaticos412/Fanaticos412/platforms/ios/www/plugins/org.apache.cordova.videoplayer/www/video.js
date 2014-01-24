cordova.define("org.apache.cordova.videoplayer.VideoPlayer", function(require, exports, module) {var exec = require("cordova/exec");

var VideoPlayer = function () {};

/**
 * Starts the video player intent
 *
 * @param url           The url to play
 */
VideoPlayer.prototype.play = function(url,orientation) {
			   console.log("URL TEST: "+url+", Ori: "+orientation);
    exec(null, null, "VideoPlayer", "play", [url,orientation]);
};

var videoPlayer = new VideoPlayer();
module.exports = videoPlayer;});
