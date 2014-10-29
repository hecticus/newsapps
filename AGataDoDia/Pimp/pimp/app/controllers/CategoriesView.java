package controllers;

import models.content.women.Category;
import play.data.Form;
import play.data.format.Formatters;
import play.mvc.Result;

import java.io.IOException;
import java.text.ParseException;
import java.util.Locale;

import static play.data.Form.form;

import views.html.categories.*;

/**
 * Created by plesse on 10/29/14.
 */
public class CategoriesView extends HecticusController {

    final static Form<Category> CategoryViewForm = form(Category.class);
    public static Result GO_HOME = redirect(routes.CategoriesView.list(0, "name", "asc", ""));

    //@Security.Authenticated(Secured.class)
    public static Result index() {
        return GO_HOME;
    }

    //@Security.Authenticated(Secured.class)
    public static Result blank() {
        return ok(form.render(CategoryViewForm));
    }

    //@Security.Authenticated(Secured.class)
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(Category.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    //@Security.Authenticated(Secured.class)
    public static Result edit(Integer id) {
        Category objBanner = Category.finder.byId(id);
        Form<Category> filledForm = CategoryViewForm.fill(Category.finder.byId(id));
        return ok(edit.render(id, filledForm));
    }

    //@Security.Authenticated(Secured.class)
    public static Result update(Integer id) {
        Form<Category> filledForm = CategoryViewForm.bindFromRequest();
        if(filledForm.hasErrors()) {
            System.out.println(filledForm.toString());
            return badRequest(edit.render(id, filledForm));
        }
        Category gfilledForm = filledForm.get();
        gfilledForm.update(id);
        flash("success", "La categoria " + gfilledForm.getName() + " se ha actualizado");
        return GO_HOME;

    }

    //@Security.Authenticated(Secured.class)
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Category oPost = Category.finder.byId(Integer.parseInt(aids[i]));
            //oWoman.setSort(i);
            oPost.save();
        }

        return ok("Fine!");
    }

    //@Security.Authenticated(Secured.class)
    public static Result lsort() {
        return ok(list.render(Category.page(0, 0,"name", "asc", ""),"date", "asc", "",true));
    }

    //@Security.Authenticated(Secured.class)
    public static Result delete(Integer id) {
        Category category = Category.finder.byId(id);
        category.delete();
        flash("success", "La categoria " + category.getName() + " se ha eliminado");
        return GO_HOME;

    }

    //@Security.Authenticated(Secured.class)
    public static Result submit() throws IOException {
        Form<Category> filledForm = CategoryViewForm.bindFromRequest();

        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        Category gfilledForm = filledForm.get();
        gfilledForm.save();
        flash("success", "La categoria " + gfilledForm.getName() + " ha sido creado");
        return GO_HOME;

    }
}
