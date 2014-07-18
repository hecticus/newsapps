package controllers;


import java.io.Console;
import java.util.ArrayList;
import java.util.Iterator;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import play.*;
import play.libs.WS;
import play.libs.F.Promise;
import play.mvc.*;
import play.libs.Json;
import play.cache.Cache;
import play.data.*;
import static play.data.Form.*;
import models.*;
import models.matches.*;
import views.html.*;

public class ResetPassword extends Controller {
    
    /**
     * Defines a form wrapping the User class.
     */ 
    final static Form<Client> form = form(Client.class);
  
    /**
     * Display a blank form.
     */ 
    public static Result blank() {
        return ok(resetPasswordForm.render(form));
    }
  
    /**
     * Handle the form submission.
     */
    public static Result submit() {
        
        Form<Client> filledForm = form.bindFromRequest();
        Client objClient =  new Client();
        flash("success", "La contraseña se ha restablecido con éxito.");
        return ok(resetPasswordForm.render(filledForm));        

    }
    
    
}
