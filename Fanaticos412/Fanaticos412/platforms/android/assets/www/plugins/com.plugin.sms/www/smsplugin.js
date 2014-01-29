cordova.define("com.plugin.sms.SMSPlugin", function(require, exports, module) {var exec = require("cordova/exec");

var SMSPlugin = function () {};

/**
 * Starts the video player intent
 *
 * @param url           The url to play
 */
SMSPlugin.prototype.sendSMS = function(message) {
			   console.log("SMS TEST JS: "+message);
    exec(null, null, "SMSPlugin", "sendSMS", [message]);
};

var smsPlugin = new SMSPlugin();
module.exports = smsPlugin;});
