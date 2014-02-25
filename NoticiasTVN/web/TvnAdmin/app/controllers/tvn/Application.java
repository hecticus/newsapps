package controllers.tvn;

import static play.data.Form.form;

import java.util.List;


import models.news.Category;
import play.api.templates.Html;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.tvn.*;


@SuppressWarnings("unused")
public class Application extends Controller {
	
	final static Form<Category> categoryForm = form(Category.class);
	public static Result GO_HOME = redirect(routes.Application.list(0, "sort", "asc", ""));
	
	
	public static Result index() {
		return GO_HOME;
	}	
   
	public static Result blank() {
	   return ok(form.render(categoryForm));
	}

	public static Result edit(Long id) {
        Form<Category> filledForm = categoryForm.fill(
        		Category.finder.byId(id)
        );
        return ok(
            edit.render(id, filledForm)
        );
    }	
	
	public static Result update(Long id) {
		Form<Category> filledForm = categoryForm.bindFromRequest();
		if(filledForm.hasErrors()) {
			return badRequest(edit.render(id, filledForm));
		}
		filledForm.get().update(id);
		flash("success", "Category " + filledForm.get().name + " has been updated");
		return GO_HOME;
	}	

	public static Result sort(String ids) {		
		String[] aids = ids.split(",");
		
		for (int i=0; i<aids.length; i++) {
			Category oCategory = Category.finder.byId(Long.parseLong(aids[i]));
			oCategory.setSort(i);
			oCategory.save();
		}
		
		return ok("Fine!");		
	}
	
	public static Result list(int page, String sortBy, String order, String filter) {
        return ok(
            list.render(
                Category.page(page, 10, sortBy, order, filter),
                sortBy, order, filter
            )
        );
    }

	public static Result delete(Long id) {
		Category.finder.ref(id).delete();
		flash("success", "Category has been deleted");
	    return GO_HOME;	    
	}
	
	public static Result lsort() {
		 return ok(sort.render(Category.page(0, 0,"sort", "asc", "")));
	}
	
	public static Result submit() {
	   Form<Category> filledForm = categoryForm.bindFromRequest();	   
	   if(filledForm.hasErrors()) {
           return badRequest(form.render(filledForm));
       } else {    	   
    	   Category gfilledForm = filledForm.get();     	   
    	   gfilledForm.sort = Category.finder.findRowCount();
    	   gfilledForm.save();
    	   flash("success", "Category " + filledForm.get().name + " has been created");
    	   return GO_HOME;  
       }
	}

	
	
}
