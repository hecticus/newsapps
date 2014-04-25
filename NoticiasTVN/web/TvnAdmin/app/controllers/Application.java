package controllers;


import actions.HttpsAction;
import login.authorization.WithProfile;
import controllers.routes;
import play.*;
import play.mvc.*;
import securesocial.core.java.SecureSocial.SecuredAction;
import views.html.*;

import java.io.File;

public class Application extends Controller {
	
	@With(HttpsAction.class)
	@SecuredAction
    public static Result index() {
        //return ok(index.render("Your new application is ready."));
		return redirect(routes.Tvn.list(0, "sort", "asc", ""));				
    }

    public static Result checkFile(String name){
        File file = new File(name);
        //Logger.info("nameFile "+name+", path "+file.getAbsolutePath());
        if(file.exists()){
            return ok("OK");
        }else{
            return badRequest("file not found");
        }
    }
  
}
