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
import java.lang.Object;
import java.text.Format;
import java.text.DateFormat;
import java.text.SimpleDateFormat;


public class Wap extends Controller {

    public static Integer LIMIT = 5;
    public static Integer MIN_LENGTH_MSISDN = 9;
    public static Integer MAX_LENGTH_MSISDN = 9;
    public static Integer COUNTRY = 1; //Brasil
    public static Integer LANGUAGE = 405; //Portuguese
    public static String UPSTREAM_CHANNEL = "Web";
    public static Domain oDomain = new Domain();
    public static Form<Client> form = form(Client.class);
    public static HandsetDetection HD = new HandsetDetection();

    public static Result getLogin() {

        getLoading();
        System.out.println(getTimeStampFormat());

        if (HD.getStatus() != 0) return ok("Error");
        return ok(login.render(form,HD,0));
    }

    public static Result getPassword() {

        if (HD.getStatus() != 0) return ok("Error");
        Form<Client> filledForm = form.bindFromRequest();
        String sMsisdn = filledForm.field("msisdn").value();

        if ((sMsisdn.trim().isEmpty())
                || (sMsisdn.length() < MIN_LENGTH_MSISDN)
                || (sMsisdn.length() > MAX_LENGTH_MSISDN)
                || (!isNumeric(sMsisdn))) {
            flash("error_msisdn", "Error msisdn");
            return redirect(controllers.routes.Wap.getLogin());
        }

        /*ObjectNode jCompetition = Json.newObject();
        jCompetition.put("country", COUNTRY);
        jCompetition.put("login", sMsisdn);
        jCompetition.put("language",LANGUAGE);
        jCompetition.put("upstreamChannel",UPSTREAM_CHANNEL);

        Promise<WSResponse> wsResponse = WS.url(oDomain.createClient()).post(jCompetition);
        JsonNode jResponse = wsResponse.get(10000).asJson();

        Integer iError = jResponse.get("error").asInt();
        String sDescription = jResponse.get("description").asText();

        if (iError == 0) {
            setAccessControl(filledForm);
            return ok(login.render(filledForm,HD,1));
        } else {
            return ok(error.render(HD,sDescription));
        }*/

        setAccessControl(filledForm);
        return ok(login.render(filledForm,HD,1));
    }

    public static Result createClient() {

        if (HD.getStatus() != 0) return ok("Error");
        Form<Client> filledForm = form.bindFromRequest();
        String sPassword = filledForm.field("password").value();

        if (sPassword.trim().isEmpty()) {
            flash("error_password", "Error password");
            return ok(login.render(filledForm,HD,1));
        }

        /*ObjectNode jCompetition = Json.newObject();
        jCompetition.put("country",COUNTRY);
        jCompetition.put("login", filledForm.field("msisdn").value());
        jCompetition.put("password",filledForm.field("password").value());
        jCompetition.put("language",LANGUAGE);
        jCompetition.put("upstreamChannel",UPSTREAM_CHANNEL);

        Promise<WSResponse> wsResponse = WS.url(oDomain.createClient()).post(jCompetition);
        JsonNode jResponse = wsResponse.get(10000).asJson();
        Integer iError = jResponse.get("error").asInt();
        String sDescription = jResponse.get("description").asText();
              System.out.println(jResponse.toString());

        if (iError == 0) {
            setAccessControl(filledForm);
            return redirect(controllers.routes.Wap.index());
        } else {
            return ok(error.render(HD,sDescription));
        }*/

        setAccessControl(filledForm);
        return redirect(controllers.routes.Wap.index());
    }


    public static Result index() {

        if (HD.getStatus() != 0) return ok("Error");
        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        Promise<WSResponse> wsResponse = WS.url(oDomain.news(0)).get();
        JsonNode jResponse = wsResponse.get(10000).asJson();
        JsonNode jNews = jResponse.get("response").get("news");
        return ok(news.render(HD, jNews, "index"));

    }

    public static Result news(Integer idNews) {

        if (HD.getStatus() != 0) return ok("Error");
        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        Promise<WSResponse> wsResponse = WS.url(oDomain.news(idNews)).get();
        JsonNode jNews = wsResponse.get(10000).asJson().get("response");
        return ok(news.render(HD, jNews, "summary"));

    }

    public static Result competitions(String route) {

        if (HD.getStatus() != 0) return ok("Error");
        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());


        HandsetDetection HD = new HandsetDetection();
        if (HD.getStatus() != 0) return ok("Error");
        JsonNode jCompetitions = getCompetition();
        return ok(competitions.render(HD, jCompetitions, route));

    }

    public static Result matches(Integer idCompetition, Integer page) {

        if (HD.getStatus() != 0) return ok("Error");
        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        HandsetDetection HD = new HandsetDetection();
        if (HD.getStatus() != 0) return ok("Error");

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
            return ok(error.render(HD,sDescription));
        }

    }

    public static Result mtm(Integer idCompetition, Integer idMatch, Integer idEvent) {

        if (HD.getStatus() != 0) return ok("Error");
        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        Promise<WSResponse> wsResponse = WS.url(oDomain.mtm(idCompetition, idMatch, idEvent)).get();
        JsonNode jResponse = wsResponse.get(10000).asJson();
        Integer iError = jResponse.get("error").asInt();
        String sDescription = jResponse.get("description").asText();
        String nameCompetition = getNameCompetition(idCompetition);

        if (iError == 0) {
            return ok(mtm.render(HD, jResponse.get("response"), idCompetition,nameCompetition, idMatch));
        } else {
            return ok(error.render(HD,sDescription));
        }

    }


    public static Result scorers(Integer idCompetition) {

        if (HD.getStatus() != 0) return ok("Error");
        if (!getAccessControl())
            return redirect(controllers.routes.Wap.getLogin());

        Promise<WSResponse> wsResponse = WS.url(oDomain.scorers(idCompetition)).get();
        JsonNode jResponse = wsResponse.get(10000).asJson();
        Integer iError = jResponse.get("error").asInt();
        String sDescription = jResponse.get("description").asText();
        String nameCompetition = getNameCompetition(idCompetition);

        if (iError == 0) {
            return ok(scorers.render(HD, jResponse.get("response").get("scorers"), nameCompetition));
        } else {
            return ok(error.render(HD,sDescription));
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

    public static boolean isNumeric(String str)
    {
        try
        {
            double d = Double.parseDouble(str);
        }
        catch(NumberFormatException nfe)
        {
            return false;
        }
        return true;
    }

    public static JsonNode getLoading() {
        Promise<WSResponse> wsResponse = WS.url(oDomain.loading()).get();
        JsonNode jResponse = wsResponse.get(10000).asJson();
        Integer iError = jResponse.get("error").asInt();
        String sDescription = jResponse.get("description").asText();
        jResponse = jResponse.get("response");
        System.out.println("jResponse -> " + jResponse.toString());
        return jResponse;
    }

    public static String getTimeStampFormat() {
        return new SimpleDateFormat("dd/MM/yy HH:mm:ss.SSS").format(new Date()) + "UTC";
    }

}

