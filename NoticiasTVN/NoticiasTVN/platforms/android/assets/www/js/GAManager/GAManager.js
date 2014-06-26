var gaPlugin;//google analytics

function initGA(){
	try 
	{ 
    	gaPlugin = window.plugins.gaPlugin;
		gaPlugin.init(successGAHandler, errorGAHandler, "UA-52052028-1", 10);
    }
	catch(err) 
	{ 
		txt="There was an error on this page.\n\n"; 
		txt+="Error description: " + err.message + "\n\n"; 
		alert(txt); 
	} 
}

function successGAHandler (result) {
    //console.log('successGAHandler '+ result);
}

function errorGAHandler (error) {
    //console.log('errorGAHandler '+ error);
}
