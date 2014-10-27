package controllers;

import models.basic.Language;
import play.data.Form;
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

    //@Security.Authenticated(Secured.class)
    public static Result index() {
        return GO_HOME;
    }

    //@Security.Authenticated(Secured.class)
    public static Result blank() {
        return ok(form.render(LanguageViewForm));
    }

    //@Security.Authenticated(Secured.class)
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(Language.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    //@Security.Authenticated(Secured.class)
    public static Result edit(Integer id) {
        Language objBanner = Language.finder.byId(id);
        Form<Language> filledForm = LanguageViewForm.fill(Language.finder.byId(id));
//        System.out.println(filledForm.value().get().toJson().toString());
        return ok(edit.render(id, filledForm));
    }

    //@Security.Authenticated(Secured.class)
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

//        System.out.println("update " + gfilledForm.toJson().toString());

        flash("success", "El language " + gfilledForm.getName() + " se ha actualizado");
        return GO_HOME;

    }

    //@Security.Authenticated(Secured.class)
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Language oPost = Language.finder.byId(Integer.parseInt(aids[i]));
            //oWoman.setSort(i);
            oPost.save();
        }

        return ok("Fine!");
    }

    //@Security.Authenticated(Secured.class)
    public static Result lsort() {
        return ok(list.render(Language.page(0, 0,"name", "asc", ""),"date", "asc", "",true));
    }

    //@Security.Authenticated(Secured.class)
    public static Result delete(Integer id) {

		/*models.content.women.Woman objBanner = models.content.women.Woman.finder.byId(id);

		models.content.women.Woman.finder.ref(id).delete();
		flash("success", "La mujer se ha eliminado");*/
        return GO_HOME;

    }

    //@Security.Authenticated(Secured.class)
    public static Result submit() throws IOException {

        Form<Language> filledForm = LanguageViewForm.bindFromRequest();

        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        Language gfilledForm = filledForm.get();
        //gfilledForm.setSort(models.content.women.Woman.finder.findRowCount());
        gfilledForm.save();

        flash("success", "El Language " + gfilledForm.getName() + " ha sido creado");
        return GO_HOME;

    }
}
