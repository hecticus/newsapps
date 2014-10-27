package controllers;

import models.basic.Country;
import models.basic.Language;
import play.data.Form;
import play.data.format.Formatters;
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

    //@Security.Authenticated(Secured.class)
    public static Result index() {
        return GO_HOME;
    }

    //@Security.Authenticated(Secured.class)
    public static Result blank() {
        return ok(form.render(CountryViewForm));
    }

    //@Security.Authenticated(Secured.class)
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(Country.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    //@Security.Authenticated(Secured.class)
    public static Result edit(Integer id) {
        Country objBanner = Country.finder.byId(id);
        Form<Country> filledForm = CountryViewForm.fill(Country.finder.byId(id));
        return ok(edit.render(id, filledForm));
    }

    //@Security.Authenticated(Secured.class)
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
        flash("success", "El country " + gfilledForm.getName() + " se ha actualizado");
        return GO_HOME;

    }

    //@Security.Authenticated(Secured.class)
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Country oPost = Country.finder.byId(Integer.parseInt(aids[i]));
            //oWoman.setSort(i);
            oPost.save();
        }

        return ok("Fine!");
    }

    //@Security.Authenticated(Secured.class)
    public static Result lsort() {
        return ok(list.render(Country.page(0, 0,"name", "asc", ""),"date", "asc", "",true));
    }

    //@Security.Authenticated(Secured.class)
    public static Result delete(Integer id) {
        Country country = Country.finder.byId(id);
        country.delete();
		flash("success", "El country " + country.getName() + " se ha eliminado");
        return GO_HOME;

    }

    //@Security.Authenticated(Secured.class)
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
        flash("success", "El Country " + gfilledForm.getName() + " ha sido creado");
        return GO_HOME;

    }
}
