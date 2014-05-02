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

function getPictureFromGallery(){
	navigator.camera.getPicture(successPickImageFromGallery, errorPickImageFromGallery, { quality: 100,
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
	ft.upload(imageURI, encodeURI("http://tvn.news.hecticus.com/newsapi/v1/yoinformo/uploadimage"), successUploadImageToServer, errorUploadImageToServer, options);
}

//WITH FILE TRANSFER
/*var winUploadPictureFromGallery = function (r) {
	alert('OK: ' + r.response);
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

var failUploadPictureFromGallery = function (error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}*/

