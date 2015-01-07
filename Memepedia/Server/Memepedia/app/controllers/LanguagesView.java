package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import models.basic.Language;
import play.data.Form;
import play.i18n.Messages;
import play.mvc.Result;

import static play.data.Form.form;

import views.html.languages.*;

import java.io.IOException;

/**
 * Created by plesse on 10/24/14.
 */
public class LanguagesView extends HecticusController {

    private static final int TTL = 900;

    final static Form<Language> LanguageViewForm = form(Language.class);
    public static Result GO_HOME = redirect(routes.LanguagesView.list(0, "name", "asc", ""));

    @Restrict(@Group(Application.USER_ROLE))
    public static Result index() {
        return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result blank() {
        return ok(form.render(LanguageViewForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(Language.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result edit(Integer id) {
        Language objBanner = Language.finder.byId(id);
        Form<Language> filledForm = LanguageViewForm.fill(Language.finder.byId(id));
        return ok(edit.render(id, filledForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result update(Integer id) {

        Language objBanner = Language.finder.byId(id);

        Form<Language> filledForm = LanguageViewForm.bindFromRequest();
        if(filledForm.hasErrors()) {
            System.out.println(filledForm.toString());
            return badRequest(edit.render(id, filledForm));
            //return badRequest();
        }

        Language gfilledForm = filledForm.get();
        gfilledForm.update(id);

        flash("success", Messages.get("languages.java.updated", gfilledForm.getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Language oPost = Language.finder.byId(Integer.parseInt(aids[i]));
            //oWoman.setSort(i);
            oPost.save();
        }

        return ok("Fine!");
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result lsort() {
        return ok(list.render(Language.page(0, 0,"name", "asc", ""),"date", "asc", "",true));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result delete(Integer id) {

        Language language = Language.finder.byId(id);
        language.delete();
        flash("success", Messages.get("languages.java.deleted", language.getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result submit() throws IOException {

        Form<Language> filledForm = LanguageViewForm.bindFromRequest();

        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        Language gfilledForm = filledForm.get();
        gfilledForm.save();
        flash("success", Messages.get("languages.java.created", gfilledForm.getName()));
        return GO_HOME;

    }
}
