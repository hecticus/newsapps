package controllers.matchesapi;

import controllers.HecticusController;
import models.matches.*;
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
            data.add(Phase.getCurrentActivePhase().toJson());
            //build response
            ObjectNode response = hecticusResponse(0, "ok", "phase", data);
            return ok(response);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static Result getCurrentPhaseMatches(){
        try {
            //se trae la fase actual
            ArrayList data = new ArrayList();
            Phase currentPhase = Phase.getCurrentActivePhase();
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

                        matchObjJson.put("team_a",teamA.toJson());
                        matchObjJson.put("team_b",teamB.toJson());
                        matchObjJson.put("venue",venue.toJson());

                        allGroupMatchesArray.add(matchObjJson);
                    }
                    groupObjJson.put("games",Json.toJson(allGroupMatchesArray));
                    dataGroup.add(groupObjJson);
                }
            }
            //build response
            ObjectNode response = tvmaxPhaseResponse("phase", currentPhase.toJson(),dataGroup,null);
            return ok(response);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }
}
