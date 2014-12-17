	var enableCerts = function(all){
		console.log('WebManager! ' + all);
		if(all){
			cordovaHTTP.acceptAllCerts(true, function() {
				return true;
			}, function() {
				return false;
			});
		} else {
			cordovaHTTP.enableSSLPinning(true, function() {
				return true;
			}, function() {
				return false;
			});
		}
	}
	
	