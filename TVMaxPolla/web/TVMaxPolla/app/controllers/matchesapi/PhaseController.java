package controllers.matchesapi;

import controllers.HecticusController;
import models.matches.*;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.List;

import play.libs.Json;

/**
 * Created by chrirod on 3/27/14.
 */
public class PhaseController extends HecticusController {

    public static Result getActivePhases(){
        try {
            List<Phase> fullList = Phase.getAllActivePhases();
            //List<Phase> fullList = toGet.getAllPhases();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()) {
                //recorrer lista
                for (int i = 0; i < fullList.size(); i++) {
                    data.add(fullList.get(i).toJson());
                }
            }
            fullList.clear();
            //build response
            ObjectNode response = hecticusResponse(0, "ok", "phase", data);
            return ok(response);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static Result getCurrentPhase(){
        try {
            ArrayList data = new ArrayList();
            Phase phase = Phase.getCurrentActivePhase();
            if(phase!=null){
                data.add(phase.toJson());
            }
            //build response
            ObjectNode response = hecticusResponse(0, "ok", "phase", data);
            return ok(response);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static Result getAllPhasesMatches(){
        try {
            //se trae todas las fases
            ArrayList data = getAllPhasesMatchesObj(false, null);
            //build response
            ObjectNode response = tvmaxResponseSimple("phases", data);
            return ok(response);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static ArrayList getAllPhasesMatchesObj(boolean setScores, ArrayNode matchesResults){
        ArrayList data = new ArrayList();
        List<Phase> allPhases = Phase.getAllPhases();
        for(int x=0;x<allPhases.size();x++){
            Phase currentPhase = allPhases.get(x);
            int currentPhaseID = currentPhase.getIdPhase();

            //Se traen los grupos pertenecientes a esa fase
            ArrayList dataGroup = new ArrayList();
            List<MatchGroup> allGroups = MatchGroup.getGroupsOfPhase(currentPhaseID);
            if (allGroups != null && !allGroups.isEmpty()) {
                //Para cada grupo traemos los equipos que lo conforman
                for (int i = 0; i < allGroups.size(); i++) {
                    MatchGroup groupObj = allGroups.get(i);
                    ObjectNode groupObjJson = groupObj.toJsonSimple();
                    List<GameMatch> allGroupMatches = GameMatch.getMatchesForGroupAndPhase(groupObj.getIdGroup(), currentPhaseID);
                    ArrayList allGroupMatchesArray = new ArrayList();
                    //Por cada equipo perteneciente a un grupo buscamos los partidos de esa fase
                    for(int j=0; j < allGroupMatches.size(); j++){
                        GameMatch currentMatch = allGroupMatches.get(j);
                        ObjectNode matchObjJson = currentMatch.toJsonOnlyDate();

                        //obtenemos los equipos y la data del venue
                        Team teamA = Team.getTeam(currentMatch.getIdTeamA());
                        Team teamB = Team.getTeam(currentMatch.getIdTeamB());
                        Venue venue = Venue.getVenue(currentMatch.getIdVenue());

                        if(teamA!=null) matchObjJson.put("team_a",teamA.toJson());
                        if(teamB!=null) matchObjJson.put("team_b",teamB.toJson());
                        if(venue!=null) matchObjJson.put("venue",venue.toJson());

                        if(setScores){
                            matchObjJson.put("score_team_a",0);
                            matchObjJson.put("score_team_b",0);
                            matchObjJson.put("penalties_team_a",0);
                            matchObjJson.put("penalties_team_b",0);
                            if(matchesResults != null){
                                for(int y=0;y<matchesResults.size();y++){
                                    ObjectNode obj = (ObjectNode) matchesResults.get(y);
                                    int matchID = obj.get("id_match").asInt();
                                    if(currentMatch.getIdMatch() == matchID){
                                        matchObjJson.put("score_team_a",obj.get("score_team_a").asInt());
                                        matchObjJson.put("score_team_b",obj.get("score_team_b").asInt());
                                        if(obj.has("penalties_team_a"))matchObjJson.put("penalties_team_a",obj.get("penalties_team_a").asInt());
                                        if(obj.has("penalties_team_b"))matchObjJson.put("penalties_team_b",obj.get("penalties_team_b").asInt());
                                        break;
                                    }
                                }
                            }
                        }

                        allGroupMatchesArray.add(matchObjJson);
                    }
                    groupObjJson.put("games",Json.toJson(allGroupMatchesArray));
                    dataGroup.add(groupObjJson);
                }
            }
            ObjectNode currentPhaseJson = currentPhase.toJson();
            currentPhaseJson.put("groups",Json.toJson(dataGroup));
            data.add(currentPhaseJson);
        }
        return data;
    }

    public static ArrayList getAllPhasesMatchesObjPrediction(boolean setScores, ArrayNode matchesResults){
        ArrayList data = new ArrayList();
        List<Phase> allPhases = Phase.getAllPhases();
        for(int x=0;x<allPhases.size();x++){
            Phase currentPhase = allPhases.get(x);
            int currentPhaseID = currentPhase.getIdPhase();

            //Se traen los grupos pertenecientes a esa fase
            ArrayList dataGroup = new ArrayList();
            List<MatchGroup> allGroups = MatchGroup.getGroupsOfPhase(currentPhaseID);
            if (allGroups != null && !allGroups.isEmpty()) {
                //Para cada grupo traemos los equipos que lo conforman
                for (int i = 0; i < allGroups.size(); i++) {
                    MatchGroup groupObj = allGroups.get(i);
                    ObjectNode groupObjJson = groupObj.toJsonSimple();
                    List<GameMatch> allGroupMatches = GameMatch.getMatchesForGroupAndPhase(groupObj.getIdGroup(), currentPhaseID);
                    ArrayList allGroupMatchesArray = new ArrayList();
                    //Por cada equipo perteneciente a un grupo buscamos los partidos de esa fase
                    for(int j=0; j < allGroupMatches.size(); j++){
                        GameMatch currentMatch = allGroupMatches.get(j);
                        ObjectNode matchObjJson = currentMatch.toJsonOnlyDate();

                        //obtenemos los equipos y la data del venue
                        Team teamA = Team.getTeam(currentMatch.getIdTeamA());
                        Team teamB = Team.getTeam(currentMatch.getIdTeamB());
                        Venue venue = Venue.getVenue(currentMatch.getIdVenue());

                        if(teamA!=null) matchObjJson.put("team_a",teamA.toJsonPrediction());
                        if(teamB!=null) matchObjJson.put("team_b",teamB.toJsonPrediction());
                        if(venue!=null) matchObjJson.put("venue",venue.toJson());

                        if(setScores){
                            matchObjJson.put("score_team_a",0);
                            matchObjJson.put("score_team_b",0);
                            matchObjJson.put("penalties_team_a",0);
                            matchObjJson.put("penalties_team_b",0);
                            if(matchesResults != null){
                                for(int y=0;y<matchesResults.size();y++){
                                    ObjectNode obj = (ObjectNode) matchesResults.get(y);
                                    int matchID = obj.get("id_match").asInt();
                                    if(currentMatch.getIdMatch() == matchID){
                                        matchObjJson.put("score_team_a",obj.get("score_team_a").asInt());
                                        matchObjJson.put("score_team_b",obj.get("score_team_b").asInt());
                                        if(obj.has("penalties_team_a"))matchObjJson.put("penalties_team_a",obj.get("penalties_team_a").asInt());
                                        if(obj.has("penalties_team_b"))matchObjJson.put("penalties_team_b",obj.get("penalties_team_b").asInt());
                                        break;
                                    }
                                }
                            }
                        }

                        allGroupMatchesArray.add(matchObjJson);
                    }
                    groupObjJson.put("games",Json.toJson(allGroupMatchesArray));
                    dataGroup.add(groupObjJson);
                }
            }
            ObjectNode currentPhaseJson = currentPhase.toJson();
            currentPhaseJson.put("groups",Json.toJson(dataGroup));
            data.add(currentPhaseJson);
        }
        return data;
    }
}
