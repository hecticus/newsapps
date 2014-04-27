function loadImageFormStorage(idElement, src){
	var key = encodeURIComponent(src);
	// localStorage with image
	var storageFiles = JSON.parse(localStorage.getItem("storageFiles")) || {},
	    imageElement = document.getElementById(idElement),
	    storageFilesDate = storageFiles.date,
	    date = new Date(),
	    todaysDate = (date.getMonth() + 1).toString() + date.getDate().toString();
	//console.log("KEY "+key);
	//console.log("Storage "+storageFiles[key]);
	//console.log("Storage "+JSON.stringify(storageFiles));
	// Compare date and create localStorage if it's not existing/too old   
	if (typeof storageFiles[key] === "undefined" || typeof storageFilesDate === "undefined" || storageFilesDate < todaysDate) {
	    // Take action when the image has loaded
	    imageElement.addEventListener("load", function () {
	        var imgCanvas = document.createElement("canvas"),
	            imgContext = imgCanvas.getContext("2d");
	
	        // Make sure canvas is as big as the picture
	        imgCanvas.width = imageElement.width;
	        imgCanvas.height = imageElement.height;
	
	        // Draw image into canvas element
	        imgContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
	
	        // Save image as a data URL
	        storageFiles[key] = imgCanvas.toDataURL("image/jpeg",1.0);
	
	        // Set date for localStorage
	        storageFiles.date = todaysDate;
	
	        // Save as JSON in localStorage
	        try {
	            localStorage.setItem("storageFiles", JSON.stringify(storageFiles));
	            //console.log("SAVED"+key);
	        }
	        catch (e) {
	            console.log("Storage failed: " + e);
	        }
	    }, false);
	
	    // Set initial image src    
	    setTimeout(function(){imageElement.setAttribute("src", src);},100);
	}
	else {
		//console.log("CARGANDO DE MEMORIA "+storageFiles[key]);
	    // Use image from localStorage
	    setTimeout(function(){imageElement.setAttribute("src", storageFiles[key]);},100);
	}
	//setTimeout(function(){imageElement.setAttribute("src", src);},100);
}