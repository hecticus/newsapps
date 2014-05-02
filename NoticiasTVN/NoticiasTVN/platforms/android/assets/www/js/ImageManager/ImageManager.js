/**
 * IOS
 */
/*var cameraPopoverHandle = navigator.camera.getPicture(onSuccess, onFail,
		{ 
	destinationType: Camera.DestinationType.FILE_URI,
	sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
		});

//Reposition the popover if the orientation changes.
window.onorientationchange = function() {
	var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
	cameraPopoverHandle.setPosition(cameraPopoverOptions);
}*/

/**
 * Android
 */
/*function getPictureFromGallery(){
	navigator.camera.getPicture(onSuccessGetPictureFromGallery, onFailGetPictureFromGallery, { quality: 100,
	    destinationType: Camera.DestinationType.DATA_URL,
	    sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
	    encodingType: Camera.EncodingType.JPEG
	});
}

function onSuccessGetPictureFromGallery(imageData) {
	//var imageString = "data:image/jpeg;base64," + imageData;
	var imageString = imageData;
	//console.log(imageString);
	var jsonUpload = {};
	jsonUpload["image"] = imageString;
	//console.log("JSON "+JSON.stringify(jsonUpload));
	
	var uploadData = JSON.stringify(jsonUpload);
	
	var urlUpload = "http://10.0.3.142:9007/newsapi/v1/yoinformo/uploadimage";
	$.ajax({
		  type: "POST",
		  url: urlUpload,
		  data: uploadData,
		  success: function(data, status) {
			  	console.log("PICTURE: 0-"+status+" results: "+data);
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				var code = data.error;
				//var results = data.response.categories;
				//console.log("PICTURE: 0-"+code+" results: "+JSON.stringify(results));
				if(code == 0){
					console.log("BIEN");
				}else{
					console.log("MAL");
				}
		  },
		  error: function(xhr, ajaxOptions, thrownError) {
			  console.log("ERROR");
			  console.log("Upload Failed "+JSON.stringify(xhr)+" "+ajaxOptions+" "+thrownError);
		  }
	});
}

function onFailGetPictureFromGallery(message) {
    //alert('Failed because: ' + message);
}*/

function getPictureFromGallery(onSuccessGetPictureFromGallery, onFailGetPictureFromGallery){
	navigator.camera.getPicture(onSuccessGetPictureFromGallery, onFailGetPictureFromGallery, { quality: 100,
	    destinationType: Camera.DestinationType.NATIVE_URI,
	    sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
	    encodingType: Camera.EncodingType.JPEG
	});
}

//funcion para subir una imagen al cloud (NO ESTA LISTA AUN)
function uploadPictureFromGallery(imageURI) {
	var options = new FileUploadOptions();
	options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    options.chunkedMode = false;
    options.headers = {
    		Connection: "close"
    };

	var params = {};

	options.params = params;

	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI("http://10.0.3.127:9000/newsapi/v1/yoinformo/uploadimage"), winUploadPictureFromGallery, failUploadPictureFromGallery, options);
}

//WITH FILE TRANSFER
var winUploadPictureFromGallery = function (r) {
	alert('OK: ' + r.response);
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

var failUploadPictureFromGallery = function (error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}

