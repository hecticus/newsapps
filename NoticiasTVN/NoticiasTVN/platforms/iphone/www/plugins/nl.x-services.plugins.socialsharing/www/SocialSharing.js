cordova.define("nl.x-services.plugins.socialsharing.SocialSharing", function(require, exports, module) { function SocialSharing() {
}

SocialSharing.prototype.available = function (callback) {
  cordova.exec(function (avail) {
    callback(avail ? true : false);
  }, null, "SocialSharing", "available", []);
};

SocialSharing.prototype.share = function (message, subject, image, url, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "SocialSharing", "share", [message, subject, image, url]);
};

SocialSharing.prototype.shareViaTwitter = function (message, image, url, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "SocialSharing", "shareViaTwitter", [message, null, image, url]);
};

SocialSharing.prototype.shareViaFacebook = function (message, image, url, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "SocialSharing", "shareViaFacebook", [message, null, image, url]);
};

SocialSharing.prototype.shareViaWhatsApp = function (message, image, url, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "SocialSharing", "shareViaWhatsApp", [message, null, image, url]);
};

SocialSharing.prototype.shareVia = function (via, message, subject, image, url, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "SocialSharing", "shareVia", [message, subject, image, url, via]);
};

SocialSharing.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.socialsharing = new SocialSharing();
  return window.plugins.socialsharing;
};

cordova.addConstructor(SocialSharing.install);
});
