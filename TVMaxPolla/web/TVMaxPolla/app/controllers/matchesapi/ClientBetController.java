package controllers.matchesapi;

import controllers.HecticusController;
import models.matches.*;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;
import play.mvc.Result;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by chrirod on 5/14/14.
 */
public class ClientBetController extends HecticusController {

    public static Result storeClientBet(){
        try {
            ArrayList data = new ArrayList();
            ObjectNode jsonInfo = getJson();
            long idClient;
            long idLeaderboard;
            String predictionString;
            if(jsonInfo.has("idClient") && jsonInfo.has("clientBet") && jsonInfo.has("idLeaderboard")){
                idClient = jsonInfo.get("idClient").asLong();
                idLeaderboard = jsonInfo.get("idLeaderboard").asLong();
                ObjectNode predictionObj = (ObjectNode) jsonInfo.get("clientBet");
                if(predictionObj==null){
                    //error
                    return badRequest(buildBasicResponse(1,"no hay apuesta"));
                }
                /*predictionString = jsonInfo.get("clientBet").toString();
                if(predictionString.isEmpty()){
                    //error
                    return badRequest(buildBasicResponse(1,"no hay apuesta"));
                }
                ObjectNode predictionObj;
                try {
                    //hacemos decode de la data para ver si es un json
                    String predictionStringDecoded = java.net.URLDecoder.decode(predictionString, "UTF-8");
                    predictionObj = (ObjectNode) Json.parse(predictionStringDecoded);
                    if(predictionObj == null){
                        throw new Exception("json vacio");
                    }
                }catch (Exception e){
                    return badRequest(buildBasicResponse(2,"ocurrio un error parseando el json de apuesta: "+e.toString()));
                }*/
                //buscamos todos los matches y los guardamos si no existen
                ArrayNode matches = (ArrayNode)predictionObj.get("matches");
                for(int i=0; i<matches.size();i++){
                    ObjectNode onematch = (ObjectNode) matches.get(i);
                    int matchID = onematch.get("id_match").asInt();
                    ClientBet currentBet = ClientBet.getClientBetForMatch(idClient, matchID);
                    if(currentBet == null){
                        //creamos una nueva
                        currentBet = new ClientBet(idClient,idLeaderboard,onematch);
                        currentBet.save();
                    }else{
                        //modificamos la existente
                        currentBet.initClientBetData(idClient,idLeaderboard,onematch);
                        currentBet.update();
                    }
                    data.add(currentBet.toJson());
                }
                //build response
                ObjectNode response = hecticusResponse(0, "ok", "clientBet", data);
                return ok(response);
            }else{
                return badRequest(buildBasicResponse(1,"parametros incorrectos para la apuesta"));
            }


        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static Result getCurrentPhaseMatches(boolean getScores, long idClient){
        try {
            //se trae la fase actual
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

                        if(getScores == true){
                            matchObjJson.put("score_team_a",0);
                            matchObjJson.put("score_team_b",0);
                            matchObjJson.put("penalties_team_a",0);
                            matchObjJson.put("penalties_team_b",0);
                            ClientBet onebet = ClientBet.getClientBetForMatch(idClient,currentMatch.getIdMatch());
                            if(onebet!=null){
                                int matchID = onebet.getIdMatch();
                                if(currentMatch.getIdMatch() == matchID){
                                    int teamW = onebet.getIdTeamWinner();
                                    int teamL = onebet.getIdTeamLoser();
                                    matchObjJson.put("winner_id",onebet.getIdTeamWinner());
                                    if(teamA.getIdTeam() == teamW){
                                        matchObjJson.put("score_team_a",onebet.getScoreWinner());
                                        matchObjJson.put("score_team_b",onebet.getScoreLoser());
                                    }else{
                                        matchObjJson.put("score_team_a",onebet.getScoreLoser());
                                        matchObjJson.put("score_team_b",onebet.getScoreWinner());
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
            //build response
            ObjectNode response = tvmaxPhaseResponse("phase", currentPhase.toJson(),dataGroup,null);
            return ok(response);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static Result getClientBetForCurrentPhase(){
        try {
            ObjectNode jsonInfo = getJson();
            long idClient = -1;
            long idClientPrediction = -1;
            if(jsonInfo.has("idClient")){
                idClient = jsonInfo.get("idClient").asLong();
                return getCurrentPhaseMatches(true,idClient);
            }else{
                return getCurrentPhaseMatches(false,-1);
            }
        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }
}
