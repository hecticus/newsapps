package controllers;

import models.wap.Domain;
import play.data.Form;
import play.mvc.*;
import views.html.wap.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.*;
import play.libs.ws.*;
import play.libs.F.Promise;
import play.libs.Json;
import java.util.*;
import models.wap.*;
import play.cache.Cache;
import play.api.mvc.Cookie;
import play.api.mvc.DiscardingCookie;
import static play.data.Form.form;

public class Wap extends Controller {

    public static final Domain oDomain = new Domain();
    public static final Integer LIMIT = 5;
    public static Form<Client> form = form(Client.class);

    public static Result getLogin() {
        HandsetDetection HD = new HandsetDetection();
        return ok(login.render(form,HD,0));
    }

    public static Result getPassword() {

        HandsetDetection HD = new HandsetDetection();
        Form<Client> filledForm = form.bindFromRequest();

        ObjectNode jCompetition = Json.newObject();
        jCompetition.put("country", 1);
        jCompetition.put("login", filledForm.field("msisdn").value());
        jCompetition.put("language",300);
        Promise<WSResponse> wsResponse = WS.url(oDomain.createClient()).post(jCompetition);
        JsonNode jResponse = wsResponse.get(10000).asJson();

        Integer iError = jResponse.get("error").asInt();
        String sDescription = jResponse.get("description").asText();

        System.out.println(jResponse.toString());
        if (iError == 0) {
            setAccessControl(filledForm);
            return ok(login.render(filledForm,HD,1));
        } else {
            return ok(sDescription);
        }

    }

    public static Result createClient() {

        HandsetDetection HD = new HandsetDetection();
        Form<Client> filledForm = form.bindFromRequest();

        ObjectNode jCompetition = Json.newObject();
        jCompetition.put("country", 1);
        jCompetition.put("login", filledForm.field("msisdn").value());
        jCompetition.put("password",filledForm.field("password").value());
        jCompetition.put("language",300);

        Promise<WSResponse> wsResponse = WS.url(oDomain.createClient()).post(jCompetition);
        JsonNode jResponse = wsResponse.get(10000).asJson();
        Integer iError = jResponse.get("error").asInt();
        String sDescription = jResponse.get("description").asText();
        System.out.println(jResponse.toString());
        if (iError == 0) {
            setAccessControl(filledForm);
            return redirect(controllers.routes.Wap.index());
        } else {
            return ok(sDescription);
        }

    }


    public static Result index() {

        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        HandsetDetection HD = new HandsetDetection();
        Promise<WSResponse> wsResponse = WS.url(oDomain.news(0)).get();
        JsonNode jResponse = wsResponse.get(10000).asJson();
        JsonNode jNews = jResponse.get("response").get("news");
        return ok(news.render(HD, jNews, "index"));

    }

    public static Result news(Integer idNews) {

        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        HandsetDetection HD = new HandsetDetection();
        Promise<WSResponse> wsResponse = WS.url(oDomain.news(idNews)).get();
        JsonNode jNews = wsResponse.get(10000).asJson().get("response");
        return ok(news.render(HD, jNews, "summary"));

    }

    public static Result competitions(String route) {

        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        HandsetDetection HD = new HandsetDetection();
        JsonNode jCompetitions = getCompetition();
        return ok(competitions.render(HD, jCompetitions, route));

    }

    public static Result matches(Integer idCompetition, Integer page) {

        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        HandsetDetection HD = new HandsetDetection();
        Promise<WSResponse> wsResponse = WS.url(oDomain.matches(idCompetition,LIMIT, page  * LIMIT)).get();

        JsonNode jResponse = wsResponse.get(10000).asJson();
        Integer iError = jResponse.get("error").asInt();
        String sDescription = jResponse.get("description").asText();
        String nameCompetition = getNameCompetition(idCompetition);
        ObjectNode jOCompetition = Json.newObject();
        ObjectNode jCompetition = Json.newObject();
        jCompetition.put("id", new Integer(idCompetition));
        jCompetition.put("name",new String(nameCompetition));
        jOCompetition.put("competition",jCompetition);

        if (iError == 0) {
            return ok(matches.render(HD, jResponse.get("response"), jOCompetition, LIMIT, page));
        } else {
            return ok(sDescription);
        }

    }

    public static Result mtm(Integer idCompetition, Integer idMatch, Integer idEvent) {

        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        HandsetDetection HD = new HandsetDetection();
        Promise<WSResponse> wsResponse = WS.url(oDomain.mtm(idCompetition, idMatch, idEvent)).get();
        JsonNode jResponse = wsResponse.get(10000).asJson();
        Integer iError = jResponse.get("error").asInt();
        String sDescription = jResponse.get("description").asText();
        String nameCompetition = getNameCompetition(idCompetition);

        if (iError == 0) {
            return ok(mtm.render(HD, jResponse.get("response"), idCompetition,nameCompetition, idMatch));
        } else {
            return ok(sDescription);
        }

    }


    public static Result scorers(Integer idCompetition) {

        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        HandsetDetection HD = new HandsetDetection();
        Promise<WSResponse> wsResponse = WS.url(oDomain.scorers(idCompetition)).get();
        JsonNode jResponse = wsResponse.get(10000).asJson();
        Integer iError = jResponse.get("error").asInt();
        String sDescription = jResponse.get("description").asText();
        String nameCompetition = getNameCompetition(idCompetition);

        if (iError == 0) {
            return ok(scorers.render(HD, jResponse.get("response").get("scorers"), nameCompetition));
        } else {
            return ok(sDescription);
        }

    }


    public static JsonNode getCompetition () {

        JsonNode jCompetitions = (JsonNode) Cache.get("competitions");
        if (jCompetitions == null) {
            Promise<WSResponse> wsResponse = WS.url(oDomain.competitions()).get();
            jCompetitions = wsResponse.get(10000).asJson().get("response");
            Cache.set("competitions", jCompetitions, 60 * 60);
        }

        return jCompetitions;
    }

    public static String getNameCompetition (Integer idCompetition) {

        JsonNode jCompetitions = getCompetition();
        Iterator<JsonNode> iJsonCompetitions = jCompetitions.get("competitions").iterator();
        String nameCompetition = "";
        while (iJsonCompetitions.hasNext()) {
            JsonNode jsonCompetition = iJsonCompetitions.next();
             if (idCompetition == jsonCompetition.get("id_competitions").asInt())
                 nameCompetition = jsonCompetition.get("name").asText();
        }

        return nameCompetition;

    }

    public static Boolean setAccessControl (Form<Client> filledForm) {

        if (filledForm.field("id").value() != null) {
            session("id", filledForm.field("id").value());
            response().setCookie("id", filledForm.field("id").value(), 86400);
        }

        if (filledForm.field("msisdn").value() != null) {
            session("msisdn", filledForm.field("msisdn").value());
            response().setCookie("msisdn", filledForm.field("msisdn").value(), 86400);
        }

        if (filledForm.field("password").value() != null) {
            session("password", filledForm.field("password").value());
            response().setCookie("password", filledForm.field("password").value(), 86400);
        }

        return true;
    }

    public static Boolean getAccessControl () {

        if ((session("msisdn") != null)
                && (session("password") != null)) {
            return true;
        } else if ((request().cookie("msisdn") != null)
                && (request().cookie("password") != null)) {
            return true;
        } else {
            return false;
        }

    }

}

