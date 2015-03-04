package controllers;

import play.*;
import play.mvc.*;
import views.html.wap.*;
import play.cache.Cache.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.ws.*;
import play.libs.F.Function;
import play.libs.F.Promise;
import play.libs.Json;
import java.util.*;
import models.*;
import java.text.*;
import play.cache.Cache;

public class Wap extends HandsetDetection {

    public static final Domain oDomain = new Domain();
    public static final Integer LIMIT = 5;

    public static Result index() {
        HandsetDetection HD = new HandsetDetection();
        Promise<WSResponse> wsResponse = WS.url(oDomain.news(0)).get();
        JsonNode jResponse = wsResponse.get(10000).asJson();
        JsonNode jNews = jResponse.get("response").get("news");
        return ok(news.render(HD, jNews, "index"));
    }

    public static Result news(Integer idNews) {
        HandsetDetection HD = new HandsetDetection();
        Promise<WSResponse> wsResponse = WS.url(oDomain.news(idNews)).get();
        JsonNode jNews = wsResponse.get(10000).asJson().get("response");
        return ok(news.render(HD, jNews, "summary"));
    }

    public static Result competitions(String route) {
        HandsetDetection HD = new HandsetDetection();
        JsonNode jCompetitions = getCompetition();
        return ok(competitions.render(HD, jCompetitions, route));
    }

    public static Result matches(Integer idCompetition, Integer page) {

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
            return ok(matches.render(HD, jResponse.get("response"), jCompetition, LIMIT, page));
        } else {
            return ok(sDescription);
        }

    }

    public static Result mtm(Integer idCompetition, Integer idMatch, Integer idEvent) {

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

}

