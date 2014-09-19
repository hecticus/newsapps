package controllers;

import java.io.Console;
import java.util.ArrayList;
import java.util.Iterator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.*;
///import play.libs.ws.*;
import play.api.libs.ws.*;
import play.libs.F.Function;
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
