/*function VideoPlayer() {
}
;

VideoPlayer.prototype.play = function(message,mode) {
    window.cordova.exec('VideoPlayerCommand.show', message,mode);
};

cordova.addConstructor(function() {
    if (!window.plugins) {
        window.plugins = {};
    }

    window.plugins.videoPlayer = new VideoPlayer();
    return window.plugins.videoPlayer;
});*/

function VideoPlayer() { 
	
	console.log('iniciando video players');
	}
VideoPlayer.prototype.play = function(url,orientation) {
	return window.cordova.exec(null, null, "VideoPlayerCommand", "play", [url,orientation]); };
VideoPlayer.install = function () {
  if (!window.plugins) { window.plugins = {}; }
  window.plugins.VideoPlayer = new VideoPlayer();
  return window.plugins.videoplayer;
};
cordova.addConstructor(VideoPlayer.install);


