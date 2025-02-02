package controllers;


import java.io.Console;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import play.*;
//import play.libs.ws.*;
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

public class SignIn extends Controller {
    
    /**
     * Defines a form wrapping the User class.
     */ 
    final static Form<Client> form = form(Client.class);
  
    /**
     * Display a blank form.
     */ 
    public static Result blank() {
        return ok(signInForm.render(form));
    }
  
    /**
     * Handle the form submission.
     */
    public static Result submit() {
        
        Form<Client> filledForm = form.bindFromRequest();
        Client objClient =  new Client();

        if(filledForm.field("socialid").value().isEmpty()) {
        	if(filledForm.hasErrors()) {
                return badRequest(signInForm.render(filledForm));
            }
        }

        JsonNode jsonResponse = objClient.getLogin(filledForm);
        if (jsonResponse == null){
        	flash("danger", "La dirección de correo electrónico o la contraseña que has introducido no son correctas.");
    		return ok(signInForm.render(filledForm));
        } else {

        	session("connected", jsonResponse.get("id_social_clients").asText());
        	session("id_social", jsonResponse.get("id_social").asText());
        	session("nick", jsonResponse.get("nick").asText());        	
        	return redirect(controllers.routes.Application.index());
        	
        	
        	/*java.util.List<Phase> lstPhase = new ArrayList<Phase>();
        	lstPhase = objClient.getPrediction(jsonResponse.get("id_social_clients").asText());    	
        	return ok(index.render(lstPhase));*/
        	
        	
        }

    }
    
    
}
