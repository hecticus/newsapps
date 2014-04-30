function VideoPlayer() { 
	
	//console.log('iniciando video players');
	}
VideoPlayer.prototype.play = function(url) { return window.cordova.exec(null, null, "VideoPlayer", "playVideo", [url]); };
VideoPlayer.install = function () {
  if (!window.plugins) { window.plugins = {}; }
  window.plugins.VideoPlayer = new VideoPlayer();
  return window.plugins.videoplayer;
};
cordova.addConstructor(VideoPlayer.install);
