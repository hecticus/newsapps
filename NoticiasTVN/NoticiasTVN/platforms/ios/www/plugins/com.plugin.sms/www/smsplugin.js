cordova.define("com.plugin.sms.SMSPlugin", function(require, exports, module) {function SMSPlugin() {
}

SMSPlugin.prototype.sendSMS = function (message, successCallback, errorCallback) {
  cordova.exec(successCallback, errorCallback, "SMSPlugin", "sendSMS", [message]);
};

SMSPlugin.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.smsPlugin = new SMSPlugin();
  return window.plugins.smsPlugin;
};

cordova.addConstructor(SMSPlugin.install);});

