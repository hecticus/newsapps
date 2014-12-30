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
                ArrayList<ArrayList<ObjectNode>> groups = new ArrayList<>();
                ArrayList<ObjectNode> rounds = new ArrayList<>();
                if(phases != null && !phases.isEmpty()) {
                    if(competition.getType().getType() == 0){
                        for (Phase phase : phases) {
                            rounds.add(phase.toJson());
                        }
                        groups.add(rounds);
                        ObjectNode temp = Json.newObject();
                        temp.put("groups", Json.toJson(groups));
                        responseData.add(temp);
                    } else if(competition.getType().getType() == 1){//ARBOL
                        Phase pivot = phases.get(0);
                        ArrayList<ObjectNode> subfaces = new ArrayList<>();
                        for (Phase phase : phases) {
                            if(!phase.getGlobalName().equalsIgnoreCase(pivot.getGlobalName())){
                                ObjectNode pivotJson = pivot.toJson();
                                pivotJson.put("phases", Json.toJson(subfaces));
                                rounds.add(pivotJson);
                                pivot = phase;
                                subfaces.clear();
                                ObjectNode obj = Json.newObject();
                                obj.put("id_phases",phase.getIdPhases());
                                obj.put("name", phase.getName());
                                subfaces.add(obj);
                            } else {
                                ObjectNode obj = Json.newObject();
                                obj.put("id_phases",phase.getIdPhases());
                                obj.put("name",phase.getName());
                                subfaces.add(obj);
                            }
                        }
                        ObjectNode pivotJson = pivot.toJson();
                        pivotJson.put("phases", Json.toJson(subfaces));
                        rounds.add(pivotJson);
                        ObjectNode temp = Json.newObject();
                        temp.put("tree", Json.toJson(rounds));
                        responseData.add(temp);
                    } else if(competition.getType().getType() == 2){//MIXTO
                        Phase pivot = phases.get(0);
                        String pivotName = pivot.getName();
                        String pivotGlobalName = pivot.getGlobalName();
                        boolean firstStage = true;
                        ObjectNode treeTemp = null;
                        ArrayList<ObjectNode> treePhases = new ArrayList<>();
                        for (Phase phase : phases) {
                            String name = phase.getName();
                            String globalName = phase.getGlobalName();
                            if(!globalName.equalsIgnoreCase(pivotGlobalName)){
                                if(firstStage) {
                                    groups.add((ArrayList<ObjectNode>) rounds.clone());
                                    rounds.clear();
                                    ObjectNode temp = Json.newObject();
                                    temp.put("groups", Json.toJson(groups));
                                    responseData.add(temp);
                                    groups.clear();
                                }
                                firstStage = false;
                            }
                            if(firstStage) {
                                int indexOfDash = pivotName.indexOf("-");
                                if (indexOfDash > 0 && !name.startsWith(pivotName.substring(0, indexOfDash))) {
                                    System.out.println("cambiando pivot1 " + name);
                                    groups.add((ArrayList<ObjectNode>) rounds.clone());
                                    rounds.clear();
                                    pivot = phase;
                                    pivotName = pivot.getName();
                                    name = phase.getName();
                                }
                                rounds.add(phase.toJson());
                            } else {
                                if(!globalName.equalsIgnoreCase(pivotGlobalName)){
                                    if(treeTemp != null) {
                                        treeTemp.put("phases", Json.toJson(treePhases));
                                        rounds.add(treeTemp);
                                    }
                                    pivot = phase;
                                    pivotName = pivot.getName();
                                    pivotGlobalName = pivot.getGlobalName();
                                    name = phase.getName();
                                    treeTemp = null;
                                    treePhases.clear();
                                }
                                if(treeTemp == null){
                                    treeTemp = phase.toJson();
                                }
                                ObjectNode obj = Json.newObject();
                                obj.put("id_phases",phase.getIdPhases());
                                obj.put("name",phase.getName());
                                treePhases.add(obj);
                            }
                        }
                        treeTemp.put("phases", Json.toJson(treePhases));
                        rounds.add(treeTemp);
                        ObjectNode temp = Json.newObject();
                        temp.put("tree", Json.toJson(rounds));
                        responseData.add(temp);
                        groups.clear();
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

    /*public static Result getCalendarForCompetition(Integer idApp, Integer idCompetition, String date, Long idPhase, String operator){
        try {
            ObjectNode response = null;
            Competition competition = Competition.getCompetitionByApp(idApp, idCompetition);
            if(competition != null){
                List<GameMatch> gameMatches = null;
                if(competition.getType().getType() == 0) {//LIGA
                    if(date != null && !date.isEmpty() && operator != null && !operator.isEmpty()){
                        gameMatches = GameMatch.findAllByIdCompetitionAndDate(competition.getIdCompetitions(), date, operator);
                    } else if(idPhase > 0 && operator != null && !operator.isEmpty()){
                        gameMatches = GameMatch.findAllByIdCompetitionAndPhase(competition.getIdCompetitions(), idPhase, operator);
                    } else {
                        gameMatches = GameMatch.findAllByIdCompetitionOrderedByDate(competition.getIdCompetitions());
                    }
                } else if(competition.getType().getType() == 1){//ARBOL
                    List<Phase> phases = null;
                    Phase phase = null;
                    if(operator.equalsIgnoreCase("gt")){
                        //next
                        phase = Phase.finder.byId(idPhase);
                        phases = Phase.finder.where().eq("comp", competition).eq("nivel", phase.getNivel()+1).findList();
                    } else if(operator.equalsIgnoreCase("lt")){
                        //previous
                        phase = Phase.finder.byId(idPhase);
                        phases = Phase.finder.where().eq("comp", competition).eq("nivel", phase.getNivel()-1).findList();
                    } else {
                        phase = Phase.finder.byId(idPhase);
                        phases = Phase.finder.where().eq("comp", competition).eq("globalName", phase.getGlobalName()).findList();
                    }

                    if(phases != null && !phases.isEmpty()) {
                        gameMatches = GameMatch.finder.where().in("phase", phases).orderBy("phase asc").findList();
                    }

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
//                ObjectNode dataJson = Json.newObject();
//                dataJson.put("tree", competitionByApp.getType().getType() == 1);
//                dataJson.put("days", Json.toJson(calendar));
//                response = hecticusResponse(0, "ok", dataJson);
                response = hecticusResponse(0, "ok", "days", calendar);
            } else {
                response = buildBasicResponse(1, "la competencia " + idCompetition + " no existe, o no esta activa, para el app " + idApp);
            }
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }*/




}
