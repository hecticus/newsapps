package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import models.basic.Country;
import models.basic.Language;
import play.data.Form;
import play.data.format.Formatters;
import play.i18n.Messages;
import play.mvc.Result;

import java.io.IOException;
import java.text.ParseException;
import java.util.Locale;

import static play.data.Form.form;

import views.html.countries.*;

/**
 * Created by plesse on 10/24/14.
 */
public class CountriesView extends HecticusController {
    private static final int TTL = 900;

    final static Form<Country> CountryViewForm = form(Country.class);
    public static Result GO_HOME = redirect(routes.CountriesView.list(0, "name", "asc", ""));

    @Restrict(@Group(Application.USER_ROLE))
    public static Result index() {
        return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result blank() {
        return ok(form.render(CountryViewForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(Country.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result edit(Integer id) {
        Country objBanner = Country.finder.byId(id);
        Form<Country> filledForm = CountryViewForm.fill(Country.finder.byId(id));
        return ok(edit.render(id, filledForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result update(Integer id) {
        Formatters.register(Language.class, new Formatters.SimpleFormatter<Language>() {
            @Override
            public Language parse(String input, Locale arg1) throws ParseException {
                Language language = Language.finder.byId(new Integer(input));
                return language;
            }

            @Override
            public String print(Language language, Locale arg1) {
                return ""+language.getIdLanguage();
            }
        });

        Form<Country> filledForm = CountryViewForm.bindFromRequest();
        if(filledForm.hasErrors()) {
            System.out.println(filledForm.toString());
            return badRequest(edit.render(id, filledForm));
        }
        Country gfilledForm = filledForm.get();
        gfilledForm.update(id);
        flash("success", Messages.get("countries.java.updated", gfilledForm.getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Country oPost = Country.finder.byId(Integer.parseInt(aids[i]));
            //oWoman.setSort(i);
            oPost.save();
        }

        return ok("Fine!");
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result lsort() {
        return ok(list.render(Country.page(0, 0,"name", "asc", ""),"date", "asc", "",true));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result delete(Integer id) {
        Country country = Country.finder.byId(id);
        country.delete();
        flash("success", Messages.get("countries.java.deleted", country.getName()));
		return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result submit() throws IOException {
        Formatters.register(Language.class, new Formatters.SimpleFormatter<Language>() {
            @Override
            public Language parse(String input, Locale arg1) throws ParseException {
                Language language = Language.finder.byId(new Integer(input));
                return language;
            }

            @Override
            public String print(Language language, Locale arg1) {
                return ""+language.getIdLanguage();
            }
        });

        Form<Country> filledForm = CountryViewForm.bindFromRequest();

        if(filledForm.hasErrors()) {
            System.out.println(filledForm.toString());
            return badRequest(form.render(filledForm));
        }

        Country gfilledForm = filledForm.get();
        gfilledForm.save();
        flash("success", Messages.get("countries.java.created", gfilledForm.getName()));
        return GO_HOME;

    }
}
