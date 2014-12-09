var upstreamAppKey;
var upstreamAppVersion;
var upstreamServiceID;
var upstreamURL;

/**
 * EVENTS
 * 
 * APP_LAUNCH: Application Launch
 * LOGIN: Login attempt
 * GAME_LAUNCH: Game Launch
 * GAME_END: Game End
 * APP_CLOSE: Application Close
 * UPD_POINTS: Points Update
 * VIEW_SP: View subscription prompt
 * CLICK_SP: Clicked subscription prompt
 * CLICK_PN: Clicked Push Notification
 */

/**
 * Acceso al api de upstream para marcar un evento
 * 
 * timestamp: “dd/MM/yy HH:mm:ss.SSS UTC” (TZ is always UTC)
 * 
 * Ejemplo
 * 
 * Headers:
 * Content-Type: application/json
 * Accept: application/gamingapi.v1+json
 * x-gameapi-app-key: DEcxvzx98533fdsagdsfiou
 * Authorization : Basic OTk5MDAwMDIzMzE1OlNSUTcyRktT
 * 
 * Body: {"timestamp":"01/01/14 00:00:01.001
 * UTC","metadata":{"channel":"Android","result":"win","points":[{"type":"expe
 * rience","value":"100"}],"app_version":"gamingapi.v1","session_id":null},"se
 * rvice_id":"prototype-app -
 * SubscriptionDefault","user_id":8001,"push_notification_id":"wreuoi24lkjfdlk
 * 13jh45kjhfkjqewhrt34jrewh2","event_type":"APP_LAUNCH", "device_id":"user-device-id"}
 * 
 * RESULT:
 * {
 *  "result" : 0
 * }
 *  RESULT CODES:
 *  0 – “Success”
 *  2 – “User cannot be identified”
 *  3 – “User not subscribed”
 */
function sendUpstreamEvent(eventType){
	console.log("PASO POR EVENTS");
	
	var eventsURL = upstreamURL+"/game/user/event";
	var metadata = {"channel":"Android","app_version":upstreamAppVersion,"session_id":null};
	var timestamp = formatDateUpstream();
	var push_notification_id = regID;
	var device_id = regID;
	var authentication;
	var userID;
	//cargamos la info del cliente y si no la tenemos usamos la info de guest
	loadClientID();
	if(clientOBJ != null && !jQuery.isEmptyObject(clientOBJ)){
		authentication = getUpstreamAuthentication();
		userID = clientOBJ.user_id;
	}
	var eventBody = {};
	eventBody.timestamp = timestamp;
	eventBody.metadata = metadata;
	eventBody.service_id = upstreamServiceID;
	eventBody.push_notification_id = push_notification_id;
	eventBody.event_type = eventType;
	eventBody.device_id = device_id;
	eventBody.user_id = parseInt(userID);
	
	console.log("BODY: "+JSON.stringify(eventBody));
	console.log("HEADERS AUTH: "+authentication);
	console.log("URL2: "+eventsURL);
	
	$.ajax({
		url : eventsURL,
		data: JSON.stringify(eventBody),	
		type: 'POST',
		timeout : 60000,
	    headers: {
	        "Authorization":"Basic "+authentication,
	        "Accept":"application/"+upstreamAppVersion+"+json",
	        "x-gameapi-app-key":upstreamAppKey,
	        "Content-Type":"text/json"
	    },
		success : function(data, status) {
			console.log("PASO....");
			try{
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				var code = data.result;
				if(code == 0){
					console.log("event upstream sent: "+eventType);
				}else{
					console.log("error event upstream response: "+code);
				}
			}catch(e){
				console.log("error internal event upstream "+thrownError);
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			console.log("error event upstream "+thrownError+" xhr "+xhr.status);
		}
	});
}

function getUpstreamAuthentication(){
	var base = clientOBJ.login+":"+clientOBJ.password;
	return Base64.encode(base);
}

//COMMONS
//“dd/MM/yy HH:mm:ss.SSS UTC” (TZ is always UTC)
function formatDateUpstream() {
  var m_names = new Array("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
  var d = new Date();
  //var d = new Date(datestring * 1000);
  var curr_date = ""+d.getUTCDate();
  var curr_month = ""+d.getUTCMonth();
  var curr_year = ""+d.getUTCFullYear();
  var hours = ""+d.getUTCHours();
  var minutes = ""+d.getUTCMinutes();
  var seconds = ""+d.getUTCSeconds();
  if(curr_date.length < 2){ curr_date = "0"+curr_date; }
  curr_year = curr_year.substring(2, curr_year.length);
  if(hours.length < 2){ hours = "0"+hours; }
  if(minutes.length < 2){ minutes = "0"+minutes; }
  if(seconds.length < 2){ seconds = "0"+seconds; }
  var result = curr_date + "/" +m_names[curr_month]  + "/" + curr_year+' '+hours+':'+minutes+":"+seconds+".000 UTC";

  return result;
}

//BASE64
//Create Base64 Object
var Base64={
		_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},
		decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},
		_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},
		_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

//// Define the string
//var string = 'Hello World!';
//
//// Encode the String
//var encodedString = Base64.encode(string);
//console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"
//
//// Decode the String
//var decodedString = Base64.decode(encodedString);
//console.log(decodedString); // Outputs: "Hello World!"
