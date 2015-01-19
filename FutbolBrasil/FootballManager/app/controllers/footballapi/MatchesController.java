package controllers.footballapi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.App;
import controllers.HecticusController;
import models.Apps;
import models.football.*;
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
                ObjectNode competitionJson = competition.toJsonNoPhases();
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

    public static Result getFixturesDatePaged(Integer idApp, String date, Integer pageSize,Integer page){
        try {
            ObjectNode response = null;
            if(date == null || date.isEmpty() || date.equalsIgnoreCase("today")){
                TimeZone timeZone = Apps.getTimezone(idApp);
                Calendar today = new GregorianCalendar(timeZone);
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
                simpleDateFormat.setTimeZone(timeZone);
                date = simpleDateFormat.format(today.getTime());
            }
            ArrayList responseData = new ArrayList();
            List<Competition> competitions = Competition.getCompetitionsPage(idApp, page, pageSize, date);
            if(competitions != null && !competitions.isEmpty()) {
                ArrayList data = new ArrayList();
                for(Competition competition : competitions) {
                    List<GameMatch> fullList = GameMatch.getGamematchByDate(competition.getIdCompetitions(), date);
                    if(fullList != null && !fullList.isEmpty()) {
                        ObjectNode competitionJson = competition.toJsonNoPhases();
                        for (int i = 0; i < fullList.size(); i++){
                            data.add(fullList.get(i).toJson());
                        }
                        competitionJson.put("fixtures", Json.toJson(data));
                        data.clear();
                        responseData.add(competitionJson);
                    }
                }
            }
            response = hecticusResponse(0, "ok", "leagues", responseData);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getFixturesByIDs(Integer idApp){
        try {
            Map<String, String[]> queryString = request().queryString();
            String[] matches = queryString.get("match[]");
            ArrayList<Long> matchesIDs = new ArrayList<>();
            ArrayList responseData = new ArrayList();
            ObjectNode response = null;
            for(String match : matches){
                matchesIDs.add(Long.parseLong(match));
            }
            List<GameMatch> gameMatches = GameMatch.finder.where().in("idGameMatches", matchesIDs).findList();
            for(GameMatch gameMatch : gameMatches){
                responseData.add(gameMatch.toJson());
            }
            response = hecticusResponse(0, "ok", "matches", responseData);
            return ok(response);
        }catch (Exception ex){
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }


    public static Result getActiveCompetitions(Integer idApp, Boolean ids){
        try {
            ObjectNode response = null;
            ArrayList data = new ArrayList();
            ArrayList responseData = new ArrayList();
            List<Competition> competitionsByApp = Competition.getActiveCompetitionsByApp(idApp);
            ArrayList competitions = null;
            if(ids){
                competitions = new ArrayList<Long>(competitionsByApp.size());
            } else {
                competitions = new ArrayList<ObjectNode>(competitionsByApp.size());
            }
            for(Competition competition : competitionsByApp) {
                competitions.add(ids ? competition.getIdCompetitions() : competition.toJsonNoPhases());
            }
            response = hecticusResponse(0, "ok", ids?"ids":"competitions", competitions);
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getPhasesForCompetition(Integer idApp, Integer idCompetition){
        try {
            ObjectNode response = null;
            ArrayList<ObjectNode> responseData = new ArrayList();
            Competition competition = Competition.getCompetitionByApp(idApp, idCompetition);
            if(competition != null) {
                List<Phase> phases = competition.getPhases();
                if(phases != null && !phases.isEmpty()) {
                    if(competition.getType().getType() == 0){
                        responseData.add(phases.get(0).toJson());
                    } else {
                        Phase pivot = phases.get(0);
                        for (Phase phase : phases) {
                            if(!phase.getGlobalName().equalsIgnoreCase(pivot.getGlobalName())){
                                ObjectNode pivotJson = pivot.toJson();
                                responseData.add(pivotJson);
                                pivot = phase;
                            }
                        }
                        ObjectNode pivotJson = pivot.toJson();
                        responseData.add(pivotJson);
                    }
                    ObjectNode data = Json.newObject();
                    data.put("phases", Json.toJson(responseData));
                    response = hecticusResponse(0, "ok", data);
                } else {
                    response = buildBasicResponse(0, "La competition " + idCompetition + " no tiene phases");
                }
            } else {
                response = buildBasicResponse(0, "La competition " + idCompetition + " no existe");
            }
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

    public static Result getMinuteToMinuteForCompetition(Integer idApp, Integer idCompetition, Long idMatch, Long idEvent, Boolean forward){
        try {
            ObjectNode response = null;
            ObjectNode resp = Json.newObject();
            ArrayList<ObjectNode> responseData = new ArrayList();
            Competition competition = Competition.getCompetitionByApp(idApp, idCompetition);
            if(competition != null){
                GameMatch gameMatch = GameMatch.findById(idMatch);
                if(gameMatch != null){
                    List<GameMatchEvent> events = null;
                    if(idEvent == 0){
                        events = GameMatchEvent.finder.where().eq("gameMatch", gameMatch).orderBy("_sort desc").findList();
                    } else {
                        if(forward){
                            events = GameMatchEvent.finder.where().eq("gameMatch", gameMatch).gt("idGameMatchEvents", idEvent).orderBy("_sort desc").findList();
                        } else {
                            events = GameMatchEvent.finder.where().eq("gameMatch", gameMatch).lt("idGameMatchEvents", idEvent).orderBy("_sort asc").findList();
                        }
                    }
                    resp.put("home_team", gameMatch.getHomeTeam().toJson());
                    resp.put("home_team_goals", gameMatch.getHomeTeamGoals());
                    resp.put("away_team", gameMatch.getAwayTeam().toJson());
                    resp.put("away_team_goals", gameMatch.getAwayTeamGoals());
                    if(events != null & !events.isEmpty()) {
                        GameMatchEvent pivot = events.get(0);
                        ArrayList<ObjectNode> periodData = new ArrayList<>();
                        for (GameMatchEvent gameMatchEvent : events) {
                            if(gameMatchEvent.getPeriod().getIdPeriods() == pivot.getPeriod().getIdPeriods()){
                                periodData.add(gameMatchEvent.toJsonNoPeriod());
                            } else {
                                ObjectNode period = Json.newObject();
                                period.put("period", pivot.getPeriod().toJson());
                                period.put("events", Json.toJson(periodData));
                                periodData.clear();
                                periodData.add(gameMatchEvent.toJsonNoPeriod());
                                pivot = gameMatchEvent;
                                responseData.add(period);
                            }
                        }
                        if(!periodData.isEmpty()){
                            ObjectNode period = Json.newObject();
                            period.put("period", pivot.getPeriod().toJson());
                            period.put("events", Json.toJson(periodData));
                            periodData.clear();
                            responseData.add(period);
                        }
                        resp.put("actions", Json.toJson(responseData));
                        response = hecticusResponse(0, "ok", resp);
                    } else {
                        response = buildBasicResponse(1, "No hay eventos para el partido " + idMatch);
                    }
                } else {
                    response = buildBasicResponse(2, "El partido " + idMatch + " no existe");
                }
            } else {
                response = buildBasicResponse(3, "La competencia " + idCompetition + " no existe, o no esta activa, para el app " + idApp);
            }
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }


}
