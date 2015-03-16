package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import models.content.posts.Category;
import play.data.Form;
import play.i18n.Messages;
import play.mvc.Result;
import views.html.categories.*;

import java.io.IOException;

import static play.data.Form.form;

/**
 * Created by plesse on 10/29/14.
 */
public class CategoriesView extends HecticusController {

    final static Form<Category> CategoryViewForm = form(Category.class);
    public static Result GO_HOME = redirect(routes.CategoriesView.list(0, "name", "asc", ""));

    @Restrict(@Group(Application.USER_ROLE))
    public static Result index() {
        return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result blank() {
        return ok(form.render(CategoryViewForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(Category.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result edit(Integer id) {
        Category category = Category.getByID(id);
        Form<Category> filledForm = CategoryViewForm.fill(category);
        return ok(edit.render(id, filledForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result update(Integer id) {
        Form<Category> filledForm = CategoryViewForm.bindFromRequest();
        if(filledForm.hasErrors()) {
            System.out.println(filledForm.toString());
            return badRequest(edit.render(id, filledForm));
        }
        Category gfilledForm = filledForm.get();
        gfilledForm.update(id);

        flash("success", Messages.get("categories.java.updated", gfilledForm.getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Category category = Category.getByID(Integer.parseInt(aids[i]));
            //oWoman.setSort(i);
            category.save();
        }

        return ok("Fine!");
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result lsort() {
        return ok(list.render(Category.page(0, 0,"name", "asc", ""),"date", "asc", "",true));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result delete(Integer id) {
        Category category = Category.getByID(id);
        category.delete();
        flash("success", Messages.get("categories.java.deleted", category.getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result submit() throws IOException {
        Form<Category> filledForm = CategoryViewForm.bindFromRequest();

        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        Category category = filledForm.get();
        if(category.getFollowable() == null){
            category.setFollowable(false);
        }
        category.save();
        flash("success", Messages.get("categories.java.created", category.getName()));
        return GO_HOME;

    }
}
