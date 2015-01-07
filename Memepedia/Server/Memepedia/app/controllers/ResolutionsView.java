package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import models.content.feature.Resolution;
import play.data.Form;
import play.data.format.Formatters;
import play.i18n.Messages;
import play.mvc.Result;

import java.io.IOException;
import java.text.ParseException;
import java.util.Locale;

import static play.data.Form.form;

import views.html.resolutions.*;

/**
 * Created by plesse on 11/11/14.
 */
public class ResolutionsView extends HecticusController {
    final static Form<Resolution> ResolutionViewForm = form(Resolution.class);
    public static Result GO_HOME = redirect(routes.ResolutionsView.list(0, "width", "asc", ""));

    @Restrict(@Group(Application.USER_ROLE))
    public static Result index() {
        return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result blank() {
        return ok(form.render(ResolutionViewForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(Resolution.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result edit(Integer id) {
        Form<Resolution> filledForm = ResolutionViewForm.fill(Resolution.finder.byId(id));
        return ok(edit.render(id, filledForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result update(Integer id) {
        Form<Resolution> filledForm = ResolutionViewForm.bindFromRequest();
        if(filledForm.hasErrors()) {
            System.out.println(filledForm.toString());
            return badRequest(edit.render(id, filledForm));
        }
        Resolution gfilledForm = filledForm.get();
        gfilledForm.update(id);
        flash("success", Messages.get("resolutions.java.updated", gfilledForm.getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Resolution oPost = Resolution.finder.byId(Integer.parseInt(aids[i]));
            //oWoman.setSort(i);
            oPost.save();
        }

        return ok("Fine!");
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result lsort() {
        return ok(list.render(Resolution.page(0, 0,"width", "asc", ""),"date", "asc", "",true));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result delete(Integer id) {
        Resolution resolution = Resolution.finder.byId(id);
        resolution.delete();
        flash("success", Messages.get("resolutions.java.deleted", resolution.getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result submit() throws IOException {
        Form<Resolution> filledForm = ResolutionViewForm.bindFromRequest();

        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        Resolution gfilledForm = filledForm.get();
        gfilledForm.save();
        flash("success", Messages.get("resolutions.java.created", gfilledForm.getName()));
        return GO_HOME;

    }
}
