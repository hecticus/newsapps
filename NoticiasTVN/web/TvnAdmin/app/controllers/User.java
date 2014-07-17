package controllers;

import static play.data.Form.form;

import java.util.List;

import org.mindrot.jbcrypt.BCrypt;

import models.user.*;
import play.twirl.api.Html;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.helper.form;
import views.html.user.*;
import scala.Option;


@SuppressWarnings("unused")
public class User extends Controller {
	
	final static Form<U01_Users> userForm = form(U01_Users.class);
	public static Result GO_HOME = redirect(routes.User.list(0, "u01_Id", "asc", ""));
	
	
	public static Result index() {
		return GO_HOME;
	}	
	
	
	public static Result blank()  {		
		return ok(views.html.user.form.render(userForm));
	}
	
	
	public static Result edit(Long id) {
        Form<U01_Users> filledForm = userForm.fill(
        		U01_Users.finder.byId(id)
        );
        return ok(
        		views.html.user.edit.render(id, filledForm)
        );
    }
	
	
	public static Result update(Long id) {
		
		Form<U01_Users> filledForm = userForm.bindFromRequest();
		
		
		// Check repeated password
       if(!filledForm.field("u01_Password").valueOr("").isEmpty()) {
           if(!filledForm.field("u01_Password").valueOr("").equals(filledForm.field("u01_Password_Confirmation").value())) {
               filledForm.reject("u01_Password_Confirmation", "Password don't match");
           }
       }
		
		if(filledForm.hasErrors()) {
			return badRequest(views.html.user.edit.render(id, filledForm));
		}
		
		
		
		U01_Users gfilledForm = filledForm.get();
		filledForm.get().u01_Password = BCrypt.hashpw(filledForm.get().u01_Password, BCrypt.gensalt());
		
		/*Option<PasswordInfo> opf = filledForm.get().passwordInfo();
		PasswordInfo pinfo = opf.get();
		if(pinfo.hasher().equals(BCryptPasswordHasher.BCryptHasher())){
			Option<String> optSalt = pinfo.salt();
			String salt="";
			if(optSalt != null && optSalt.nonEmpty()){
				salt=optSalt.get();
				filledForm.get().u01_Password = BCrypt.hashpw(filledForm.get().u01_Password, salt);
				
			}
		}*/
		
		
		filledForm.get().update(id);
		flash("success", "User " + filledForm.get().u01_Login + " has been updated");
		return GO_HOME;
		
	}
	
	
	
	public static Result list(int page, String sortBy, String order, String filter) {
        return ok(
        		views.html.user.list.render(
            	U01_Users.page(page, 10, sortBy, order, filter),
                sortBy, order, filter
            )
        );
    }

	
	public static Result delete(Long id) {
		U01_Users.finder.ref(id).delete();
		flash("success", "User has been deleted");
	    return GO_HOME;	    
	}
	
		
	
	public static Result submit() {

		
		
	  Form<U01_Users> filledForm = userForm.bindFromRequest();
	   
	   // Check repeated password
       if(!filledForm.field("u01_Password").valueOr("").isEmpty()) {
           if(!filledForm.field("u01_Password").valueOr("").equals(filledForm.field("u01_Password_Confirmation").value())) {
               filledForm.reject("u01_Password_Confirmation", "Password don't match");
           }
       }
       
       if(!filledForm.field("u01_Email").valueOr("").isEmpty()) {
           if(!filledForm.field("u01_Email").valueOr("").equals(filledForm.field("u01_Email_Confirmation").value())) {
               filledForm.reject("u01_Email_Confirmation", "Password don't match");
           }
       }
	   
	   if(filledForm.hasErrors()) {
           return badRequest(views.html.user.form.render(filledForm));
       } else {
    	   
    	  U01_Users gfilledForm = filledForm.get();
    	  filledForm.get().u01_Password = BCrypt.hashpw(filledForm.get().u01_Password, BCrypt.gensalt());
    	  
    	  /*Option<PasswordInfo> opf = filledForm.get().passwordInfo();
		  PasswordInfo pinfo = opf.get();
		  if(pinfo.hasher().equals(BCryptPasswordHasher.BCryptHasher())){
			  Option<String> optSalt = pinfo.salt();
			  String salt="";
			  if(optSalt != null && optSalt.nonEmpty()){
				  salt=optSalt.get();
				  filledForm.get().u01_Password = BCrypt.hashpw(filledForm.get().u01_Password, salt);
			  }
			  
		  }*/
    	   

    	   gfilledForm.save();
    	   flash("success", "User " + filledForm.get().u01_Login + " has been created");
    	   return GO_HOME;  
       }
	   
	   
	}

	
	
}