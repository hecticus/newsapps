	var companyName;
	var buildVersion;
	var serverVersion;

	var enableCerts = function(all){
		console.log('WebManager! ' + all);
		if(all){
			plugins.CordovaHttpPlugin.acceptAllCerts(true, function() {
				return true;
			}, function() {
				return false;
			});
		} else {
			plugins.CordovaHttpPlugin.enableSSLPinning(true, function() {
				return true;
			}, function() {
				return false;
			});
		}
	}
	
	var getHeaders = function(){
		var auth = "";
		try {
			auth = companyName + getAppender(buildVersion.charAt(0)) + buildVersion + getAppender(serverVersion.charAt(0)) + serverVersion;
		} catch (e) {
			auth = companyName + " " + buildVersion + " " + serverVersion;
		}
		console.log(auth);
		return { 'HECTICUS-X-AUTH-TOKEN': auth };
	}
	
	var getAppender = function(index){
  	   switch (index){
           case '1':
               return '|';
           case '2':
               return '@';
           case '3':
               return '#';
           case '4':
               return '$';
           case '5':
               return '%';
           case '6':
               return '&';
           case '7':
               return '/';
           case '8':
               return '(';
           case '9':
               return ')';
           case '0':
               return '=';
           default:
               return '-';
       }
  }
	
	