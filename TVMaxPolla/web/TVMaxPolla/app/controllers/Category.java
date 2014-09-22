package controllers;

import static play.data.Form.form;

import java.util.List;

//import java.util.Locale.Category;

import models.pushevents.Action;
import models.pushevents.ClientAction;
import models.tvmaxfeeds.TvmaxNewsCategory;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import views.html.category.*;

@SuppressWarnings("unused")
public class Category extends Controller {
	
	final static Form<TvmaxNewsCategory> categoryForm = form(TvmaxNewsCategory.class);
	public static Result GO_HOME = redirect(routes.Category.list(0, "sort", "asc", ""));
	
	@Security.Authenticated(Secured.class)
	public static Result index() {
		return GO_HOME;
	}	
	
	@Security.Authenticated(Secured.class)
	public static Result blank() {
	   return ok(form.render(categoryForm));
	}
	
	@Security.Authenticated(Secured.class)
	public static Result edit(int id) {
        Form<TvmaxNewsCategory> filledForm = categoryForm.fill(
        		TvmaxNewsCategory.finder.byId(id)
        );
        return ok(
            edit.render(id, filledForm)
        );
    }
	
	@Security.Authenticated(Secured.class)
	public static Result update(int id) {
		Form<TvmaxNewsCategory> filledForm = categoryForm.bindFromRequest();
		if(filledForm.hasErrors()) {
			return badRequest(edit.render(id, filledForm));
		}
		filledForm.get().update(id);
		flash("success", "La categoría " + filledForm.get().getDisplayName() + " ha sido actializada");
		return GO_HOME;
	}	

	@Security.Authenticated(Secured.class)
	public static Result sort(String ids) {		
		String[] aids = ids.split(",");
		
		for (int i=0; i<aids.length; i++) {
			TvmaxNewsCategory oCategory = TvmaxNewsCategory.finder.byId(Integer.parseInt(aids[i]));
			oCategory.setSort(i);
			oCategory.save();
		}
		
		return ok("Fine!");		
	}
	
	@Security.Authenticated(Secured.class)
	public static Result list(int page, String sortBy, String order, String filter) {
        return ok(
            list.render(
            	TvmaxNewsCategory.page(page, 10, sortBy, order, filter),
                sortBy, order, filter,false
            )
        );
    }

	@Security.Authenticated(Secured.class)
	public static Result delete(int id) {

		TvmaxNewsCategory objNewsCategory = TvmaxNewsCategory.getTvmaxNewsCategory(id);
		TvmaxNewsCategory.finder.ref(id).delete();				
		models.pushevents.Category.finder.ref(Long.parseLong(objNewsCategory.getIdCategory().toString())).delete();		
		Action.finder.ref(Long.parseLong(objNewsCategory.getIdAction().toString())).delete();
		
		flash("success", "La categoría se ha eliminado");
	    return GO_HOME;
	    
	}
	
	@Security.Authenticated(Secured.class)
	public static Result lsort() {
		 //return ok(sort.render(Category.page(0, 0,"sort", "asc", "")));
		return ok(
	            list.render(
	            		TvmaxNewsCategory.page(0, 0,"sort", "asc", ""),
	                "sort", "asc", "",true
	            )
	        );
	}
	
	@Security.Authenticated(Secured.class)
	public static Result submit() {

		
	   Form<TvmaxNewsCategory> filledForm = categoryForm.bindFromRequest();	   
	   if(filledForm.hasErrors()) {
           return badRequest(form.render(filledForm));
       } else {
    	   
    	   models.pushevents.Category objCategory = new models.pushevents.Category();
    	   objCategory.setName(filledForm.get().getDisplayName());
    	   objCategory.setIdTeam("0");
    	   objCategory.save();

    	   Action objAction = new Action();    	       	   
    	   objAction.setName(filledForm.get().getDisplayName());
    	   objAction.setTemplate(filledForm.get().getDisplayName());
    	   objAction.setPushable(0);
    	   objAction.save();
    	   
    	   TvmaxNewsCategory gfilledForm = filledForm.get();
    	   gfilledForm.setIdCategory(Integer.parseInt(objCategory.getIdCategory().toString()));
    	   gfilledForm.setMain(false);
    	   gfilledForm.setIdAction(Integer.parseInt(objAction.getIdAction().toString()));    	   
    	   gfilledForm.setSort(TvmaxNewsCategory.finder.findRowCount());    	       	   
    	   gfilledForm.save();
    	   
    	   flash("success", "La categoría " + filledForm.get().getDisplayName() + " ha sido creada");
    	   return GO_HOME;
    	   
       }
		
		
	}

	
	
}
