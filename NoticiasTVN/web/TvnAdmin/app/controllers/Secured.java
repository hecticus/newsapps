package controllers;

import play.*;
import play.mvc.*;
import play.mvc.Http.*;

import models.*;

public class Secured extends Security.Authenticator {
    
    @Override
    public String getUsername(Context ctx) {
        return ctx.session().get("logged");
    }
    
    @Override
    public Result onUnauthorized(Context ctx) {
        return redirect(routes.User.login());
    }
    
  
    
}