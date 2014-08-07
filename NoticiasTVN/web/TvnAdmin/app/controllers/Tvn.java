package controllers;

import static play.data.Form.form;

import java.util.List;

import models.news.Category;
//import play.twirl.api.Html;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import views.html.tvn.*;

@SuppressWarnings("unused")
public class Tvn extends Controller {
	
	final static Form<Category> categoryForm = form(Category.class);
	public static Result GO_HOME = redirect(routes.Tvn.list(0, "sort", "asc", ""));
	
	@Security.Authenticated(Secured.class)
	public static Result index() {
		return GO_HOME;
	}	
	
	@Security.Authenticated(Secured.class)
	public static Result blank() {
	   return ok(form.render(categoryForm));
	}
	
	@Security.Authenticated(Secured.class)
	public static Result edit(Long id) {
        Form<Category> filledForm = categoryForm.fill(
        		Category.finder.byId(id)
        );
        return ok(
            edit.render(id, filledForm)
        );
    }
	
	@Security.Authenticated(Secured.class)
	public static Result update(Long id) {
		Form<Category> filledForm = categoryForm.bindFromRequest();
		if(filledForm.hasErrors()) {
			return badRequest(edit.render(id, filledForm));
		}
		filledForm.get().update(id);
		flash("success", "La categoría " + filledForm.get().name + " ha sido actializada");
		return GO_HOME;
	}	

	@Security.Authenticated(Secured.class)
	public static Result sort(String ids) {		
		String[] aids = ids.split(",");
		
		for (int i=0; i<aids.length; i++) {
			Category oCategory = Category.finder.byId(Long.parseLong(aids[i]));
			oCategory.setSort(i);
			oCategory.save();
		}
		
		return ok("Fine!");		
	}
	
	@Security.Authenticated(Secured.class)
	public static Result list(int page, String sortBy, String order, String filter) {
        return ok(
            list.render(
                Category.page(page, 10, sortBy, order, filter),
                sortBy, order, filter,false
            )
        );
    }

	@Security.Authenticated(Secured.class)
	public static Result delete(Long id) {
		Category.finder.ref(id).delete();
		flash("success", "La categoría se ha eliminado");
	    return GO_HOME;	    
	}
	
	@Security.Authenticated(Secured.class)
	public static Result lsort() {
		 //return ok(sort.render(Category.page(0, 0,"sort", "asc", "")));
		return ok(
	            list.render(
	                Category.page(0, 0,"sort", "asc", ""),
	                "sort", "asc", "",true
	            )
	        );
	}
	
	@Security.Authenticated(Secured.class)
	public static Result submit() {
	   Form<Category> filledForm = categoryForm.bindFromRequest();	   
	   if(filledForm.hasErrors()) {
           return badRequest(form.render(filledForm));
       } else {    	   
    	   Category gfilledForm = filledForm.get();     	   
    	   gfilledForm.sort = Category.finder.findRowCount();
    	   gfilledForm.save();
    	   flash("success", "La categoría " + filledForm.get().name + " ha sido creada");
    	   return GO_HOME;  
       }
	}

	
	
}
