package controllers.footballapi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.App;
import controllers.HecticusController;
import models.Apps;
import models.football.Competition;
import models.football.GameMatch;
import models.football.News;
import models.football.Scorer;
import play.libs.Json;
import play.mvc.Result;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by sorcerer on 10/29/14.
 */
public class MatchesController extends HecticusController {

    //retorna el calendario de la competicion
    public static Result getFixtures(Long idCompetition){
        return ok();
    }

    //todays calendar

    //todays result
    public static Result getTodayFinished(Long idCompetition){
        try {
            TimeZone timeZone = TimeZone.getDefault();//Apps.getTimezone(idApp);
            Calendar today = new GregorianCalendar(timeZone);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
            simpleDateFormat.setTimeZone(timeZone);
            String todaysDate = simpleDateFormat.format(today.getTime());
            return getFinishedByDate(idCompetition, todaysDate);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getFinishedByDate(Long idCompetition, String date){
        try {
            List<GameMatch> fullList = GameMatch.getGamematchByDate(idCompetition, date);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()) {
                //i got data
                LinkedHashMap values = new LinkedHashMap();
                for (int i = 0; i < fullList.size(); i++) {
                    String id = fullList.get(i).fixtureJson().get("id_game_matches").asText();
                    String gameResult = fullList.get(i).fixtureJson().get("game_result").asText();
                    values.put(id, gameResult);
                }
                data.add(values);
            }
            //build response
            ObjectNode response;
            response = hecticusResponse(0, "ok", "results", data);
            return ok(response);
        } catch (Exception ex) {
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getAllFixtures(long idCompetition){
        try {
            List<GameMatch> fullList = GameMatch.findAllByIdCompetition(idCompetition);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()) {
                //i got data
                for (int i = 0; i < fullList.size(); i++) {
                    data.add(fullList.get(i).fixtureJson());
                }
            }
            //build response
            ObjectNode response;
            response = hecticusResponse(0, "ok", "results", data);
            return ok(response);
        } catch (Exception ex) {
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getFixturesDate(Integer idApp, String date){
        try {
            ObjectNode response = null;
            if(date == null || date.isEmpty() || date.equalsIgnoreCase("today")){
                TimeZone timeZone = Apps.getTimezone(idApp);
                Calendar today = new GregorianCalendar(timeZone);
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
                simpleDateFormat.setTimeZone(timeZone);
                date = simpleDateFormat.format(today.getTime());
            }
            ArrayList data = new ArrayList();
            ArrayList responseData = new ArrayList();
            List<Competition> competitionsByApp = Competition.getCompetitionsByApp(idApp);
            for(Competition competition : competitionsByApp) {
                List<GameMatch> fullList = GameMatch.getGamematchByDate(competition.getIdCompetitions(), date);
                ObjectNode competitionJson = competition.toJson();
                if (fullList != null && !fullList.isEmpty()){
                    for (int i = 0; i < fullList.size(); i++){
                        data.add(fullList.get(i).toJson());
                    }
                }
                competitionJson.put("fixtures", Json.toJson(data));
                data.clear();
                responseData.add(competitionJson);
            }
            response = hecticusResponse(0, "ok", "leagues", responseData);
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getActiveCompetitions(Integer idApp){
        try {
            ObjectNode response = null;
            ArrayList data = new ArrayList();
            ArrayList responseData = new ArrayList();
            List<Competition> competitionsByApp = Competition.getActiveCompetitionsByApp(idApp);
            ArrayList<Long> competitionIDs = new ArrayList<>(competitionsByApp.size());
            for(Competition competition : competitionsByApp) {
                competitionIDs.add(competition.getIdCompetitions());
            }
            response = hecticusResponse(0, "ok", "ids", competitionIDs);
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getCalendar(Integer idApp, Integer idCompetition, String date, Long phase, String operator){
        try {
            ObjectNode response = null;
            Competition competitionByApp = Competition.getCompetitionByApp(idApp, idCompetition);
            if(competitionByApp != null){
                List<GameMatch> gameMatches = null;
                if(date != null && !date.isEmpty() && operator != null && !operator.isEmpty()){
                    gameMatches = GameMatch.findAllByIdCompetitionAndDate(competitionByApp.getIdCompetitions(), date, operator);
                } else if(phase > 0 && operator != null && !operator.isEmpty()){
                    gameMatches = GameMatch.findAllByIdCompetitionAndPhase(competitionByApp.getIdCompetitions(), phase, operator);
                } else {
                    gameMatches = GameMatch.findAllByIdCompetitionOrderedByDate(competitionByApp.getIdCompetitions());
                }
                ArrayList<JsonNode> calendar = new ArrayList<>();
                if(gameMatches != null && !gameMatches.isEmpty()) {
                    ArrayList<ObjectNode> day = new ArrayList<>();
                    GameMatch pivot = gameMatches.get(0);
                    for (GameMatch gameMatch : gameMatches) {
                        if(gameMatch.getDate().startsWith(pivot.getDate().substring(0, 8))){
                            day.add(gameMatch.toJson());
                        } else {
                            calendar.add(Json.toJson(day));
                            day.clear();
                            pivot = gameMatch;
                            day.add(gameMatch.toJson());
                        }
                    }
                    calendar.add(Json.toJson(day));
                }
                response = hecticusResponse(0, "ok", "days", calendar);
            } else {
                response = buildBasicResponse(1, "la competencia " + idCompetition + " no existe, o no esta activa, para el app " + idApp);
            }
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }


}
