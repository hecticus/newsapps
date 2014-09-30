var configShortCode ="584169111109" ;
function sendDataSMS(){
	
	console.log('ENVIANDO SMS');
    var IMSI = cordova.plugins.uid.IMSI;
    
    var messageInfo = {
	    phoneNumber: configShortCode,
	    textMessage: IMSI
	};

	sms.sendMessage(messageInfo, function(message) {
	    console.log("success: " + message);
	}, function(error) {
	    console.log("code: " + error.code + ", message: " + error.message);
	});
	console.log('TERMINO ENVIANDO SMS');
}