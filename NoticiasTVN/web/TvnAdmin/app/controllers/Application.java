package controllers;

import login.authorization.WithProfile;
import controllers.routes;
import play.*;
import play.mvc.*;
import securesocial.core.java.SecureSocial.SecuredAction;
import views.html.*;

public class Application extends Controller {
		
	@SecuredAction
    public static Result index() {
        //return ok(index.render("Your new application is ready."));
		return redirect(routes.Tvn.list(0, "sort", "asc", ""));
    }
  
}
