package controllers;


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

public class SignUp extends Controller {
    
    /**
     * Defines a form wrapping the User class.
     */ 
    final static Form<Client> form = form(Client.class);
  
    /**
     * Display a blank form.
     */ 
    public static Result blank() {
        return ok(signUpForm.render(form));
    }
     
    /**
     * Handle the form submission.
     */
    public static Result submit() {
    	
    	
        Form<Client> filledForm = form.bindFromRequest();
        Client objClient =  new Client();

        
    	if(filledForm.field("socialid").value().isEmpty()) {
    		
    		// Check required name
            if(filledForm.field("name").valueOr("").isEmpty()) {
            	filledForm.reject("name", "Este campo es requerido");
            }
                  
            // Check required surname
            if(filledForm.field("surname").valueOr("").isEmpty()) {
            	filledForm.reject("surname", "Este campo es requerido");
            }
            
            // Check repeated email
            if(!filledForm.field("email").valueOr("").isEmpty()) {
            	
                if(!filledForm.field("email").valueOr("").equals(filledForm.field("repeatEmail").value())) {
                    filledForm.reject("repeatEmail", "El email no coincide");
                }
            	
            	if (objClient.getCheckLogin(filledForm.field("email").value())) {
            		filledForm.reject("email", "El email ya existe");
            	} 

            }
            
            // Check repeated password
            if(!filledForm.field("password").valueOr("").isEmpty()) {
                if(!filledForm.field("password").valueOr("").equals(filledForm.field("repeatPassword").value())) {
                    filledForm.reject("repeatPassword", "La contraseña no coincide");
                }
            }

            
            System.out.println("hola!");
        	if(filledForm.hasErrors()) {
                return badRequest(signUpForm.render(filledForm));
            }
        	
        }
    	        
    	JsonNode jsonResponse = objClient.getLoginPass(filledForm);
    	if (jsonResponse == null) {
    		flash("danger", "Error");
    		return ok(signUpForm.render(filledForm));
    	} else {
    	  	session("connected", jsonResponse.get("id_social_clients").asText());
    	  	session("nick", jsonResponse.get("nick").asText());
        	//return redirect("/");
        	return redirect(controllers.routes.Application.index()); 
    	}

    }
  
    
    
    public static Result jsRoutes()
    {
        response().setContentType("text/javascript");
        return ok(Routes.javascriptRouter("jsRoutes", //jsRoutes will be the JS object available in our view
        		 							routes.javascript.SignUp.isEmailExist()));
    }
    
    
    public static Result isEmailExist(String email)
    {
    	Client objClient = new Client();    
    	return ok(objClient.getCheckLogin(email).toString());
    	
    }
    
    
    
}  
