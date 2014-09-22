package controllers;

import java.util.List;
import org.mindrot.jbcrypt.BCrypt;
import models.*;
import models.user.U01_Users;
import play.data.Form;
import play.*;
import play.mvc.*;
import play.mvc.Http.*;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import static play.data.Form.*;
import views.html.user.*;

@SuppressWarnings("unused")
public class User extends Controller {
	
	final static Form<U01_Users> userForm = form(U01_Users.class);
	public static Result GO_HOME = redirect(routes.User.list(0, "u01_Id", "asc", ""));
	public static Result GO_LIST = redirect(routes.Category.list(0, "sort", "asc", ""));
	
	@Security.Authenticated(Secured.class)
	public static Result index() {
		return GO_HOME;
	}	
	
	@Security.Authenticated(Secured.class)
	public static Result blank()  {		
		return ok(form.render(userForm));
	}
		
	public static Result login()  {		
		return ok(login.render(userForm));
	}
	
	public static Result logout() {
	    session().clear();	    
	    flash("success", "Su sesión se ha cerrado.");
	    return ok(login.render(userForm));
	}
	
	public static Result authenticate() {

		Form<U01_Users> filledForm = userForm.bindFromRequest();
		if(filledForm.hasErrors()) {					
			return badRequest(login.render(filledForm));
		 } else {
			 
	    	U01_Users objUser =  U01_Users.getUsers(filledForm.field("u01_Login").value());
	    	
	    	if (objUser != null) {
	    		if (BCrypt.checkpw(filledForm.field("u01_Password").value(), objUser.getU01_Password())) {
					session().clear();	    	
			        session("logged",  objUser.profiles.u02_Id.toString());
					return GO_LIST;
				} else {
					flash("danger", "El usuario o contraseña que has introducido no son correctas");
					 return badRequest(login.render(filledForm));
				}	
	    	}  else {
	    		flash("danger", "El usuario o contraseña que has introducido no son correctas");
	    		return badRequest(login.render(filledForm));
	    	}	    	
	    	
	    }
		 
	}
	
	@Security.Authenticated(Secured.class)
	public static Result edit(Long id) {
        Form<U01_Users> filledForm = userForm.fill(U01_Users.finder.byId(id));
        return ok(edit.render(id, filledForm));
    }
	
	@Security.Authenticated(Secured.class)
	public static Result update(Long id) {
		
		Form<U01_Users> filledForm = userForm.bindFromRequest();

		// Check repeated password
       if(!filledForm.field("u01_Password").valueOr("").isEmpty()) {
           if(!filledForm.field("u01_Password").valueOr("").equals(filledForm.field("u01_Password_Confirmation").value())) {
               filledForm.reject("u01_Password_Confirmation", "La contraseña no coincide");
           }
       }
		
		if(filledForm.hasErrors()) {
			return badRequest(edit.render(id, filledForm));
		}
		
		U01_Users gfilledForm = filledForm.get();
		filledForm.get().u01_Password = BCrypt.hashpw(filledForm.get().u01_Password, BCrypt.gensalt());
	
		filledForm.get().update(id);
		flash("success", "El usuario " + filledForm.get().u01_Login + "  ha sido actualizado");
		return GO_HOME;
		
	}
		
	@Security.Authenticated(Secured.class)
	public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(U01_Users.page(page, 10, sortBy, order, filter),sortBy, order, filter));
    }

	@Security.Authenticated(Secured.class)
	public static Result delete(Long id) {
		U01_Users.finder.ref(id).delete();
		flash("success", "El usuario ha sido eliminado");
	    return GO_HOME;	    
	}
			
	@Security.Authenticated(Secured.class)
	public static Result submit() {

	  Form<U01_Users> filledForm = userForm.bindFromRequest();
	   
	   // Check repeated password
       if(!filledForm.field("u01_Password").valueOr("").isEmpty()) {
           if(!filledForm.field("u01_Password").valueOr("").equals(filledForm.field("u01_Password_Confirmation").value())) {
               filledForm.reject("u01_Password_Confirmation", "La contraseña no coincide");
           }
       }
       
       if(!filledForm.field("u01_Email").valueOr("").isEmpty()) {
           if(!filledForm.field("u01_Email").valueOr("").equals(filledForm.field("u01_Email_Confirmation").value())) {
               filledForm.reject("u01_Email_Confirmation", "La contraseña no coincide");
           }
       }
	   
	   if(filledForm.hasErrors()) {
           return badRequest(form.render(filledForm));
       } else {
    	   
    	  U01_Users gfilledForm = filledForm.get();
    	  filledForm.get().u01_Password = BCrypt.hashpw(filledForm.get().u01_Password, BCrypt.gensalt());

    	  gfilledForm.save();
    	  flash("success", "El usuario " + filledForm.get().u01_Login + " ha sido eliminado");
    	  return GO_HOME;
    	  
       }
	   
	   
	}

	
	
}
