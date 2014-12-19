function openSocialApp(socialNet,source){
	try{
		//_item.social_network.name
		//_item.source
		switch(socialNet) {
		    case 'instagram': //window.open(source, "_blank", "location=yes");
		    	window.open(source, '_system', 'location=no');
		       break;
		    case 'facebook': window.open( source, '_system', 'location=no');	
		       break;
		    case 'twitter': window.open(source, '_system', 'location=no');	
		       break;
		    default: window.open(source, '_system', 'location=no');	
		       break;
		}
		return true;
	}catch(err){
		console.log("Ocurrio un error al abrir una app de red social: "+err.message)
		return false;
	}
}

//SHARE POSTS
function sharePost(title, fileImage, source){
	//poner loading screen
	_fAlert("Carregamento...");
	var image = new Image();
	image.src = fileImage;
	var dataImage = getBase64Image(image);
	//tratamos de acelerar el plugin enviandole la imagen completa como data
	//window.plugins.socialsharing.share(title, "Memeteca", fileImage, source);
	window.plugins.socialsharing.share(title, "Memeteca", dataImage, source);
}

function getBase64Image(img) {
	// Create an empty canvas element
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	
	// Copy the image contents to the canvas
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	
	// Get the data-URL formatted image
	// Firefox supports PNG and JPEG. You could check img.src to
	// guess the original format, but be aware the using "image/jpg"
	// will re-encode the image.
	//var dataURL = canvas.toDataURL("image/png");
	var dataURL = canvas.toDataURL();
	
	return dataURL;
	//return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
