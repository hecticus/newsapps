package controllers.footballapi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.App;
import controllers.HecticusController;
import models.Apps;
import models.Config;
import models.Language;
import models.football.*;
import play.libs.Json;
import play.mvc.Result;
import utils.DateAndTime;

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

    public static Result getFixturesDate(Integer idApp, String date, Integer idLanguage, String timezoneName){
        try {
            if(timezoneName.isEmpty()){
                return badRequest(buildBasicResponse(1, "Es necesario pasar un timezone"));
            }
            timezoneName = timezoneName.replaceAll(" ", "").trim();
            Apps app = Apps.findId(idApp);
            if(app != null) {
                TimeZone timeZone = DateAndTime.getTimezoneFromID(timezoneName);
                if(timeZone == null){
                    return badRequest(buildBasicResponse(1, "Es necesario pasar un timezone"));
                }
                Calendar today = new GregorianCalendar(timeZone);
                if(date != null && !date.isEmpty() && !date.equalsIgnoreCase("today")){
                    today.set(Calendar.YEAR, Integer.parseInt(date.substring(0, 4)));
                    today.set(Calendar.MONTH, Integer.parseInt(date.substring(4, 6)) - 1);
                    today.set(Calendar.DAY_OF_MONTH, Integer.parseInt(date.substring(6)));
                }
                String minimumDate = DateAndTime.getMinimumDate(today, timezoneName, "yyyMMddHHmmss");
                String maximumDate = DateAndTime.getMaximumDate(today, timezoneName, "yyyMMddHHmmss");
                Language requestLanguage = null;
                if(idLanguage > 0) {
                    requestLanguage = Language.getByID(idLanguage);
                }
                if (idLanguage <= 0 || requestLanguage == null){
                    requestLanguage = app.getLanguage();
                }
                ArrayList data = new ArrayList();
                ArrayList responseData = new ArrayList();
                List<Team> teams = null;
                String[] favorites = getFromQueryString("teams");
                if (favorites != null && favorites.length > 0) {
                    teams = Team.finder.where().in("idTeams", favorites).findList();
                }
                List<Competition> competitionsByApp = null;
                if (teams != null && !teams.isEmpty()) {
                    competitionsByApp = Competition.getActiveCompetitionsByAppAndTeams(app, teams);
                } else {
                    competitionsByApp = app.getCompetitions();
                }
                for (Competition competition : competitionsByApp) {
                    List<GameMatch> fullList = GameMatch.getGamematchBetweenDates(competition.getIdCompetitions(), minimumDate, maximumDate);
                    ObjectNode competitionJson = competition.toJsonNoPhases(requestLanguage, app.getLanguage());
                    if (fullList != null && !fullList.isEmpty()) {
                        for (GameMatch gameMatch : fullList) {
                            data.add(gameMatch.toJson());
                        }
                    }
                    competitionJson.put("fixtures", Json.toJson(data));
                    data.clear();
                    responseData.add(competitionJson);
                }
                return ok(hecticusResponse(0, "ok", "leagues", responseData));
            } else {
                return notFound(buildBasicResponse(4, "La aplicacion  " + idApp + " no existe"));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return internalServerError(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getFixturesGroupByDate(Integer idApp, String timezoneName){
        try {
            if(timezoneName.isEmpty()){
                return badRequest(buildBasicResponse(1, "Es necesario pasar un timezone"));
            }
            timezoneName = timezoneName.replaceAll(" ", "").trim();
            Apps app = Apps.findId(idApp);
            if(app != null) {
                TimeZone timeZone = DateAndTime.getTimezoneFromID(timezoneName);
                if(timeZone == null){
                    return badRequest(buildBasicResponse(1, "Es necesario pasar un timezone"));
                }
                Calendar today = new GregorianCalendar(timeZone);
                String minimumDate = DateAndTime.getMinimumDate(today, timezoneName, "yyyMMdd");
                ArrayList<ObjectNode> data = new ArrayList();
                ArrayList responseData = new ArrayList();
                List<Team> teams = null;
                String[] favorites = getFromQueryString("teams");
                if (favorites != null && favorites.length > 0) {
                    teams = Team.finder.where().in("idTeams", favorites).findList();
                }
                List<Competition> competitionsByApp = null;
                if (teams != null && !teams.isEmpty()) {
                    competitionsByApp = Competition.getActiveCompetitionsByAppAndTeams(app, teams);
                } else {
                    competitionsByApp = app.getCompetitions();
                }
                for (Competition competition : competitionsByApp) {
                    List<Phase> phases = Phase.getPhasesFromDate(competition, minimumDate);
                    if (phases == null || phases.isEmpty()) {
                        phases = Phase.getLatestPhasesPaged(competition, 0, 1);
                    }
                    if (phases != null & !phases.isEmpty()) {
                        List<GameMatch> gameMatches = GameMatch.finder.where().eq("competition", competition).in("phase", phases).orderBy("date asc").findList();
                        if (gameMatches != null && !gameMatches.isEmpty()) {
                            ArrayList<ObjectNode> fixtures = new ArrayList<>();
                            String pivot = gameMatches.get(0).getDate().substring(0, 8);
                            for (GameMatch gameMatch : gameMatches) {
                                if (gameMatch.getDate().startsWith(pivot)) {
                                    fixtures.add(gameMatch.toJsonSimple());
                                } else {
                                    ObjectNode round = Json.newObject();
                                    round.put("date", pivot);
                                    round.put("matches", Json.toJson(fixtures));
                                    data.add(round);
                                    fixtures.clear();
                                    fixtures.add(gameMatch.toJsonSimple());
                                    pivot = gameMatch.getDate().substring(0, 8);
                                }
                            }
                            if (!fixtures.isEmpty()) {
                                ObjectNode round = Json.newObject();
                                round.put("date", pivot);
                                round.put("matches", Json.toJson(fixtures));
                                data.add(round);
                                fixtures.clear();
                            }
                        }
                    }
                    if (!data.isEmpty()) {
                        ObjectNode competitionJson = competition.toJsonSimple();
                        competitionJson.put("fixtures", Json.toJson(data));
                        data.clear();
                        responseData.add(competitionJson);
                    }
                }
                return ok(hecticusResponse(0, "OK", "leagues", responseData));
            } else {
                return notFound(buildBasicResponse(1, "El app " + idApp + " no existe"));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return internalServerError(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getFixturesForCompetitionGroupByDate(Integer idApp, Long idCompetition, String timezoneName){
        try {
            if(timezoneName.isEmpty()){
                return badRequest(buildBasicResponse(1, "Es necesario pasar un timezone"));
            }
            timezoneName = timezoneName.replaceAll(" ", "").trim();
            Apps app = Apps.findId(idApp);
            if(app != null) {
                TimeZone timeZone = DateAndTime.getTimezoneFromID(timezoneName);
                if(timeZone == null){
                    return badRequest(buildBasicResponse(1, "Es necesario pasar un timezone"));
                }
                Calendar today = new GregorianCalendar(timeZone);
                String date = DateAndTime.getMinimumDate(today, timezoneName, "yyyMMdd");
                ArrayList<ObjectNode> data = new ArrayList();

                Competition competition = app.getCompetition(idCompetition);
                if (competition != null) {
                    List<Phase> phases = Phase.getPhasesFromDate(competition, date);
                    if (phases == null || phases.isEmpty()) {
                        phases = Phase.getLatestPhasesPaged(competition, 0, 1);
                    }
                    if (phases != null & !phases.isEmpty()) {
                        List<GameMatch> gameMatches = GameMatch.finder.where().eq("competition", competition).in("phase", phases).orderBy("date asc").findList();
                        if (gameMatches != null && !gameMatches.isEmpty()) {
                            ArrayList<ObjectNode> fixtures = new ArrayList<>();
                            String pivot = gameMatches.get(0).getDate().substring(0, 8);
                            for (GameMatch gameMatch : gameMatches) {
                                if (gameMatch.getDate().startsWith(pivot)) {
                                    fixtures.add(gameMatch.toJsonSimple());
                                } else {
                                    ObjectNode round = Json.newObject();
                                    round.put("date", pivot);
                                    round.put("matches", Json.toJson(fixtures));
                                    data.add(round);
                                    fixtures.clear();
                                    fixtures.add(gameMatch.toJsonSimple());
                                    pivot = gameMatch.getDate().substring(0, 8);
                                }
                            }
                            if (!fixtures.isEmpty()) {
                                ObjectNode round = Json.newObject();
                                round.put("date", pivot);
                                round.put("matches", Json.toJson(fixtures));
                                data.add(round);
                                fixtures.clear();
                            }
                        }
                    }
                    ObjectNode competitionJson = competition.toJsonSimple();
                    competitionJson.put("fixtures", Json.toJson(data));
                    data.clear();
                    return ok(hecticusResponse(0, "OK", competitionJson));
                } else {
                    return notFound(buildBasicResponse(1, "La competencia " + idCompetition + " no existe"));
                }
            } else {
                return notFound(buildBasicResponse(1, "El app " + idApp + " no existe"));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return internalServerError(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getFixturesDatePaged(Integer idApp, Integer idLanguage, String date, Integer pageSize,Integer page, String timezoneName){
        try {
            if(timezoneName.isEmpty()){
                return badRequest(buildBasicResponse(1, "Es necesario pasar un timezone"));
            }
            timezoneName = timezoneName.replaceAll(" ", "").trim();
            Apps app = Apps.findId(idApp);
            if(app != null) {
                TimeZone timeZone = DateAndTime.getTimezoneFromID(timezoneName);
                if(timeZone == null){
                    return badRequest(buildBasicResponse(1, "Es necesario pasar un timezone"));
                }
                Calendar today = new GregorianCalendar(timeZone);
                if(date != null && !date.isEmpty() && !date.equalsIgnoreCase("today")){
                    today.set(Calendar.YEAR, Integer.parseInt(date.substring(0, 4)));
                    today.set(Calendar.MONTH, Integer.parseInt(date.substring(4, 6)) - 1);
                    today.set(Calendar.DAY_OF_MONTH, Integer.parseInt(date.substring(6)));
                }
                Calendar minimumDate = DateAndTime.getMinimumDate(today, timezoneName);
                Calendar maximumDate = DateAndTime.getMaximumDate(today, timezoneName);

                SimpleDateFormat sdf = new SimpleDateFormat("yyyMMddHHmmss");
                sdf.setTimeZone(TimeZone.getDefault());

                ArrayList responseData = new ArrayList();
                List<Team> teams = null;
                String[] favorites = getFromQueryString("teams");
                if (favorites != null && favorites.length > 0) {
                    teams = Team.finder.where().in("idTeams", favorites).findList();
                }
                List<Competition> competitions = null;
                if (teams != null && !teams.isEmpty()) {
                    competitions = Competition.getCompetitionsPage(app, page, pageSize, sdf.format(minimumDate.getTime()), sdf.format(maximumDate.getTime()), teams);
                } else {
                    competitions = Competition.getCompetitionsPage(app, page, pageSize, sdf.format(minimumDate.getTime()), sdf.format(maximumDate.getTime()));
                }
                if (competitions != null && !competitions.isEmpty()) {
                    Language requestLanguage = null;
                    if(idLanguage > 0) {
                        requestLanguage = Language.getByID(idLanguage);
                    }
                    if (idLanguage <= 0 || requestLanguage == null){
                        requestLanguage = app.getLanguage();
                    }
                    ArrayList data = new ArrayList();
                    for (Competition competition : competitions) {
                        List<GameMatch> fullList = competition.getMatchesByDate(minimumDate, maximumDate);
                        if (fullList != null && !fullList.isEmpty()) {
                            ObjectNode competitionJson = competition.toJsonNoPhases(requestLanguage, app.getLanguage());
                            for (int i = 0; i < fullList.size(); i++) {
                                data.add(fullList.get(i).toJson(requestLanguage, app.getLanguage()));
                            }
                            competitionJson.put("fixtures", Json.toJson(data));
                            data.clear();
                            responseData.add(competitionJson);
                        }
                    }
                }
                return ok(hecticusResponse(0, "ok", "leagues", responseData));
            } else {
                return notFound(buildBasicResponse(1, "El app " + idApp + " no existe"));
            }
        }catch (Exception ex){
            return internalServerError(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getFixturesCompetitionDatePaged(Integer idApp, Integer idCompetition, String date, Integer pageSize, Integer page, String timezoneName){
        try {
            if(timezoneName.isEmpty()){
                return badRequest(buildBasicResponse(1, "Es necesario pasar un timezone"));
            }
            timezoneName = timezoneName.replaceAll(" ", "").trim();
            Apps app = Apps.findId(idApp);
            if(app != null) {
                TimeZone timeZone = DateAndTime.getTimezoneFromID(timezoneName);
                if(timeZone == null){
                    return badRequest(buildBasicResponse(1, "Es necesario pasar un timezone"));
                }
                Calendar today = new GregorianCalendar(timeZone);
                if(date != null && !date.isEmpty() && !date.equalsIgnoreCase("today")){
                    today.set(Calendar.YEAR, Integer.parseInt(date.substring(0, 4)));
                    today.set(Calendar.MONTH, Integer.parseInt(date.substring(4, 6)) - 1);
                    today.set(Calendar.DAY_OF_MONTH, Integer.parseInt(date.substring(6)));
                }
                Calendar minimumDate = DateAndTime.getMinimumDate(today, timezoneName);
                Calendar maximumDate = DateAndTime.getMaximumDate(today, timezoneName);
                ArrayList responseData = new ArrayList();
                Competition competition = app.getCompetition(idCompetition);
                if(competition != null){
                    List<GameMatch> matchesByDate = competition.getMatchesByDate(minimumDate, maximumDate, page, pageSize);
                    if (matchesByDate != null && !matchesByDate.isEmpty()) {
                        ArrayList data = new ArrayList();
                        for (int i = 0; i < matchesByDate.size(); i++) {
                            data.add(matchesByDate.get(i).toJson());
                        }
                        int totalMatches = competition.countMatchesByDate(date);
                        ObjectNode matches = Json.newObject();
                        matches.put("total", totalMatches);
                        matches.put("fixtures", Json.toJson(data));
                        data.clear();
                        responseData.add(matches);
                        return ok(hecticusResponse(0, "ok", matches));
                    } else {
                        return ok(buildBasicResponse(3, "No hay partidos para la fecha " + date));
                    }
                } else {
                    return notFound(buildBasicResponse(2, "La competencia " + idCompetition + " no existe"));
                }
            } else {
                return notFound(buildBasicResponse(1, "El app " + idApp + " no existe"));
            }
        }catch (Exception ex){
            return internalServerError(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getFixturesByIDs(Integer idApp){
        try {
            String[] matches = getFromQueryString("match[]");
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

    public static Result getFixturesByID(Integer idApp, Integer idGameMatch){
        try {
            Apps app = Apps.findId(idApp);
            if(app != null){
                GameMatch gameMatch = GameMatch.finder.where().eq("idGameMatches", idGameMatch).findUnique();
                if(gameMatch != null) {
                    return ok(hecticusResponse(0, "ok", gameMatch.toJson()));
                } else {
                    return notFound(buildBasicResponse(1, "El match " + idGameMatch + " no existe"));
                }
            } else {
                return notFound(buildBasicResponse(1, "El app " + idApp + " no existe"));
            }
        }catch (Exception ex){
            ex.printStackTrace();
            return internalServerError(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }


    public static Result getActiveCompetitions(Integer idApp, Integer idLanguage, Boolean ids){
        try {
            Apps app = Apps.findId(idApp);
            ObjectNode response = null;
            if(app != null) {
                ArrayList data = new ArrayList();
                ArrayList responseData = new ArrayList();
                List<Team> teams = null;
                Language requestLanguage = null;
                if(idLanguage > 0) {
                    requestLanguage = Language.getByID(idLanguage);
                }
                if (idLanguage <= 0 || requestLanguage == null){
                    requestLanguage = app.getLanguage();
                }
                String[] favorites = getFromQueryString("teams");
                if (favorites != null && favorites.length > 0) {
                    teams = Team.finder.where().in("idTeams", favorites).findList();
                }
                List<Competition> competitionsByApp = null;
                if (teams != null && !teams.isEmpty()) {
                    competitionsByApp = Competition.getActiveCompetitionsByAppAndTeams(app, teams);
                } else {
                    competitionsByApp = app.getCompetitions();
                }
                ArrayList competitions = null;
                if (ids) {
                    competitions = new ArrayList<Long>(competitionsByApp.size());
                } else {
                    competitions = new ArrayList<ObjectNode>(competitionsByApp.size());
                }
                for (Competition competition : competitionsByApp) {
                    competitions.add(ids ? competition.getIdCompetitions() : competition.toJsonNoPhases(requestLanguage, app.getLanguage()));
                }
                response = hecticusResponse(0, "ok", ids ? "ids" : "competitions", competitions);
            } else {
                response = buildBasicResponse(1, "El app " + idApp + " no existe");
            }
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getPhasesForCompetition(Integer idApp, Integer idCompetition, Integer idLanguage){
        try {
            ObjectNode response = null;
            Apps app = Apps.findId(idApp);
            if(app != null) {
                ArrayList<ObjectNode> responseData = new ArrayList();
                Competition competition = app.getCompetition(idCompetition);
                if (competition != null) {
                    TimeZone timeZone = app.getTimezone().getTimezone();
                    Calendar today = new GregorianCalendar(timeZone);
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
                    simpleDateFormat.setTimeZone(timeZone);
                    List<Phase> phases = competition.getPhases(today);
                    if (phases != null && !phases.isEmpty()) {
                        Language requestLanguage = null;
                        if(idLanguage > 0) {
                            requestLanguage = Language.getByID(idLanguage);
                        }
                        if (idLanguage <= 0 || requestLanguage == null){
                            requestLanguage = app.getLanguage();
                        }
                        if (competition.getType().getType() == 0) {
                            responseData.add(phases.get(0).toJson(requestLanguage, app.getLanguage()));
                        } else {
                            Phase pivot = phases.get(0);
                            for (Phase phase : phases) {
                                if (phase.getNivel() != pivot.getNivel()) {
                                    ObjectNode pivotJson = pivot.toJson(requestLanguage, app.getLanguage());
                                    responseData.add(pivotJson);
                                }
                                pivot = phase;
                            }
                            ObjectNode pivotJson = pivot.toJson(requestLanguage, app.getLanguage());
                            responseData.add(pivotJson);
                        }
                        ObjectNode data = Json.newObject();
                        data.put("phases", Json.toJson(responseData));
                        response = hecticusResponse(0, "ok", data);
                    } else {
                        response = buildBasicResponse(2, "La competition " + idCompetition + " no tiene phases");
                    }
                } else {
                    response = buildBasicResponse(1, "La competition " + idCompetition + " no existe");
                }
            } else {
                response = buildBasicResponse(1, "El app " + idApp + " no existe");
            }
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getCurrentAndLastPhaseForCompetition(Integer idApp, Integer idCompetition, String date, Integer idLanguage){
        try {
            ObjectNode response = null;
            Apps app = Apps.findId(idApp);
            if(app != null) {
                ArrayList<ObjectNode> responseData = new ArrayList();
                Competition competition = app.getCompetition(idCompetition);
                if (competition != null) {
                    Language requestLanguage = null;
                    if(idLanguage > 0) {
                        requestLanguage = Language.getByID(idLanguage);
                    }
                    if (idLanguage <= 0 || requestLanguage == null){
                        requestLanguage = app.getLanguage();
                    }
                    Calendar dateCalendar = new GregorianCalendar(app.getTimezone().getTimezone());
                    Date dateDate = DateAndTime.getDate(date, "yyyyMMdd");
                    dateCalendar.setTime(dateDate);
                    Phase activePhase = competition.getActivePhase(dateCalendar, app.getTimezone().getTimezone());
                    List<Phase> latestPhases = competition.getLatestPhases(dateCalendar, app.getTimezone().getTimezone());
                    ObjectNode data = Json.newObject();
                    if(activePhase != null) {
                        data.put("active_phase", activePhase.toJson(requestLanguage, app.getLanguage()));
                    }
                    if(latestPhases != null && !latestPhases.isEmpty()){
                        Phase phase = latestPhases.get(latestPhases.size() - 1);
                        data.put("last_phase", phase.toJson(requestLanguage, app.getLanguage()));
                    }
                    response = hecticusResponse(0, "ok", data);
                } else {
                    response = buildBasicResponse(1, "La competition " + idCompetition + " no existe");
                }
            } else {
                response = buildBasicResponse(1, "El app " + idApp + " no existe");
            }
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getPhasesToNotify(Integer idApp){
        try {
            ObjectNode response = null;
            Apps app = Apps.findId(idApp);
            ArrayList<ObjectNode> responseData = new ArrayList();
            List<Competition> competitions = Competition.getActiveCompetitionsByApp(app);
            if(competitions != null && !competitions.isEmpty()) {
                TimeZone timeZone = Apps.getTimezone(idApp);
                Calendar today = new GregorianCalendar(timeZone);
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
                simpleDateFormat.setTimeZone(timeZone);
                String date = simpleDateFormat.format(today.getTime());
                for(Competition competition : competitions) {
                    List<Phase> phases = Phase.getPhasesToPush(competition, date);
                    if (phases != null && !phases.isEmpty()) {
                        responseData.add(phases.get(0).toJsonToPush());
                        for(Phase phase : phases){
                            phase.setPushed(true);
                            phase.update();
                        }
                    }
                }
                ObjectNode data = Json.newObject();
                data.put("phases", Json.toJson(responseData));
                response = hecticusResponse(0, "ok", data);
            } else {
                response = buildBasicResponse(0, "La app " + idApp + " no tiene competencia");
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
            Apps app = Apps.findId(idApp);
            if(app != null) {
                Competition competition = app.getCompetition(idCompetition);
                if (competition != null) {
                    List<GameMatch> gameMatches = null;
                    if (date != null && !date.isEmpty() && operator != null && !operator.isEmpty()) {
                        gameMatches = GameMatch.findAllByIdCompetitionAndDate(competition.getIdCompetitions(), date, operator);
                    } else if (phase > 0 && operator != null && !operator.isEmpty()) {
                        gameMatches = GameMatch.findAllByIdCompetitionAndPhase(competition.getIdCompetitions(), phase, operator);
                    } else {
                        gameMatches = GameMatch.findAllByIdCompetitionOrderedByDate(competition.getIdCompetitions());
                    }
                    ArrayList<JsonNode> calendar = new ArrayList<>();
                    if (gameMatches != null && !gameMatches.isEmpty()) {
                        ArrayList<ObjectNode> day = new ArrayList<>();
                        GameMatch pivot = gameMatches.get(0);
                        for (GameMatch gameMatch : gameMatches) {
                            if (gameMatch.getDate().startsWith(pivot.getDate().substring(0, 8))) {
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
            } else {
                response = buildBasicResponse(0, "La app " + idApp + " no tiene competencia");
            }
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getMinuteToMinuteForCompetition(Integer idApp, Integer idCompetition, Long idMatch, Integer idLanguage, Long idEvent, Boolean forward){
        try {
            ObjectNode response = null;
            ArrayList<ObjectNode> responseData = new ArrayList();
            Apps app = Apps.findId(idApp);
            if(app != null) {
                Competition competition = app.getCompetition(idCompetition);
                if (competition != null) {
                    GameMatch gameMatch = competition.getMatch(idMatch);
                    if (gameMatch != null) {
                        List<GameMatchEvent> events = gameMatch.getEventsNoDB(idEvent, forward);
                        if (events != null & !events.isEmpty()) {
                            ObjectNode resp = Json.newObject();
                            Language requestLanguage = Language.getByID(idLanguage);
                            if(requestLanguage == null){
                                requestLanguage = app.getLanguage();
                            }
                            resp.put("home_team", gameMatch.getHomeTeam().toJsonSimple());
                            resp.put("home_team_goals", gameMatch.getHomeTeamGoals());
                            resp.put("away_team", gameMatch.getAwayTeam().toJsonSimple());
                            resp.put("away_team_goals", gameMatch.getAwayTeamGoals());
                            GameMatchEvent pivot = events.get(0);
                            ArrayList<ObjectNode> periodData = new ArrayList<>();
                            for (GameMatchEvent gameMatchEvent : events) {
                                if (gameMatchEvent.getPeriod().getIdPeriods() == pivot.getPeriod().getIdPeriods()) {
                                    periodData.add(gameMatchEvent.toJsonNoPeriod(requestLanguage, app.getLanguage()));
                                } else {
                                    ObjectNode period = Json.newObject();
                                    period.put("period", pivot.getPeriod().toJson());
                                    period.put("events", Json.toJson(periodData));
                                    periodData.clear();
                                    periodData.add(gameMatchEvent.toJsonNoPeriod(requestLanguage, app.getLanguage()));
                                    pivot = gameMatchEvent;
                                    responseData.add(period);
                                }
                            }
                            if (!periodData.isEmpty()) {
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
            } else {
                response = buildBasicResponse(4, "La aplicacion  " + idApp + " no existe");
            }
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getPushableEventsForApp(Integer idApp){
        try {
            Apps app = Apps.findId(idApp);
            ObjectNode response = null;
            if(app != null) {
                ObjectNode responseData = Json.newObject();
                List<Competition> competitions = app.getCompetitions();
                TimeZone timeZone = TimeZone.getDefault();//Apps.getTimezone(idApp);
                Calendar today = new GregorianCalendar(timeZone);
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
                simpleDateFormat.setTimeZone(timeZone);
                String todaysDate = simpleDateFormat.format(today.getTime());
                ArrayList<GameMatch> matches = new ArrayList<>();
                if (competitions != null && !competitions.isEmpty()) {
                    for (Competition competition : competitions) {
                        List<GameMatch> todayMatches = GameMatch.findAllByIdCompetitionAndDate(competition.getIdCompetitions(), todaysDate, "eq");
                        if (todayMatches != null && !todayMatches.isEmpty()) {
                            matches.addAll(todayMatches);
                        }
                    }
                    if (!matches.isEmpty()) {
                        ArrayList<ObjectNode> minToMin = new ArrayList<>();
                        ArrayList<ObjectNode> match = new ArrayList<>();
                        List<GameMatchEvent> eventsToPush = GameMatchEvent.finder.where().in("gameMatch", matches).eq("generated", false).orderBy("gameMatch.idGameMatches asc, _sort asc").findList();
                        if (eventsToPush != null && !eventsToPush.isEmpty()) {
                            GameMatchEvent pivot = eventsToPush.get(0);
                            for (GameMatchEvent gameMatchEvent : eventsToPush) {
                                if (gameMatchEvent.getGameMatch().getIdGameMatches() == pivot.getGameMatch().getIdGameMatches()) {
                                    match.add(gameMatchEvent.toJsonForPush());
                                } else {
                                    ObjectNode data = Json.newObject();
                                    data.put("match", pivot.getGameMatch().toJsonPush());
                                    data.put("events", Json.toJson(match));
                                    minToMin.add(data);
                                    match.clear();
                                    match.add(gameMatchEvent.toJsonForPush());
                                    pivot = gameMatchEvent;
                                }
                                gameMatchEvent.setGenerated(true);
                                gameMatchEvent.update();
                            }
                            if (!match.isEmpty()) {
                                ObjectNode data = Json.newObject();
                                data.put("match", pivot.getGameMatch().toJsonPush());
                                data.put("events", Json.toJson(match));
                                minToMin.add(data);
                                match.clear();
                            }
                            if (!minToMin.isEmpty()) {
                                responseData.put("min_to_min", Json.toJson(minToMin));
                            }
                        }
                    }

                }

                List<News> ungeneratedNews = null;
                if (Config.getInt("push-all-news") == 1) {
                    ungeneratedNews = News.finder.where().eq("id_app", idApp).eq("generated", false).ilike("publicationDate", todaysDate + "%").eq("featured", true).findList();
                } else {
                    ungeneratedNews = News.finder.where().eq("id_app", idApp).eq("generated", false).ilike("publicationDate", todaysDate + "%").findList();
                }

                if (ungeneratedNews != null && !ungeneratedNews.isEmpty()) {
                    ArrayList<ObjectNode> newsToPush = new ArrayList<>();
                    for (News news : ungeneratedNews) {
                        newsToPush.add(news.toJsonPush());
                        news.setGenerated(true);
                        news.update();
                    }
                    if (!newsToPush.isEmpty()) {
                        responseData.put("news", Json.toJson(newsToPush));
                    }
                }

                response = hecticusResponse(0, "ok", responseData);
            } else {
                response = buildBasicResponse(4, "La aplicacion  " + idApp + " no existe");
            }
            return ok(response);
        } catch (Exception ex) {
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }


}
