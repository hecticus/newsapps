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
	window.plugins.socialsharing.share(title, "A Gata Do Dia", fileImage, source);
}
