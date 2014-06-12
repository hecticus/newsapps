package controllers.matchesapi;

import controllers.HecticusController;
import models.matches.*;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.F;
import play.libs.Json;
import play.libs.WS;
import play.mvc.Result;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
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
                boolean isCurrent = false;
                for(int i=0; i<matches.size();i++){
                    ObjectNode onematch = (ObjectNode) matches.get(i);
                    int matchID = onematch.get("id_match").asInt();
                    if(GameMatch.getMatchIfActiveForBet(matchID) != null){
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
                    }else{
                        isCurrent = true;
                    }
                }

                //build response
                if(isCurrent){
                    ObjectNode response = hecticusMessageResponse(0, "ok", "clientBet", data, "Ya no se pueden realizar más cambios hasta la próxima fase");
                    return ok(response);
                }else{
                    ObjectNode response = hecticusResponse(0, "ok", "clientBet", data);
                    return ok(response);
                }
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
                                int matchID = onebet.getGameMatch().getIdMatch();
                                if(currentMatch.getIdMatch() == matchID){
                                    int teamW = onebet.getTeamWinner().getIdTeam();
                                    int teamL = onebet.getTeamLoser().getIdTeam();
                                    matchObjJson.put("winner_id",teamW);
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

    /**
     * Created by karina on 5/19/14.
     */

    public static Result calculateBets(){
        ObjectNode result = Json.newObject();

        try{
            JsonNode post = request().body().asJson();
            String errors = "";
            if(post.get("response").isArray()){
                Iterator<JsonNode> matches = post.get("response").getElements();

                while (matches.hasNext()){
                    JsonNode match = matches.next();
                    Long winner = match.get("winner").asLong();
                    Integer scoreWinner = match.get("score_winner").asInt();
                    Integer scoreLoser = match.get("score_loser").asInt();
                    Integer idMatch = match.get("id_match").asInt();
                    GameMatch gm = GameMatch.getMatch(idMatch);
                    if(gm == null ){
                        errors+="- The match "+idMatch+" doesn't exists\n";
                        continue;
                    }
                    Iterator<ClientBet> betIt = ClientBet.getList(idMatch).iterator();
                    while(betIt.hasNext()){
                        ClientBet cbet = betIt.next();
                        //System.out.println("res "+winner+", "+scoreWinner+", "+scoreLoser);
                        int points = cbet.resultBet(winner,scoreWinner,scoreLoser);
                        //System.out.println(gm.getIdPhase()+": points "+points);
                        //System.out.println();
                        //Llamar a web service para los puntos del leaderboard
                        try{
                            String url = "http://localhost:9000/KrakenSocialLeaderboards/v1/leaderboard/item/add/"
                                    +cbet.getIdClient()+"/"+cbet.getIdLeaderboard()+"/"+points;
                            F.Promise<WS.Response> add = WS.url(url).post("content");
                            JsonNode node = Json.parse(add.get().getBody());
                            int error = node.get("error").asInt();
                            if(error == 0){
                                //update client calculated
                                cbet.setCalculated(ClientBet.CALCULATED);
                                ClientBet.update(cbet);
                            }else{
                                throw new Exception("- The web services "+url+" falló, reportando el error "+node.get("description").asText());
                            }
                        }catch(Exception ex){
                            errors+="- "+ex.getMessage()+"\n";
                        }
                    }
                }
            }
            if(!errors.isEmpty()){
                throw new Exception("Ocurrieron los siguientes errores: "+errors);
            }
            result = buildBasicResponse(0,"OK");
        }catch (Exception ex){
            //log and email about fail
            result = buildBasicResponse(-1, ex.getMessage());
        }

        return ok(result);
    }

    public static Result callTest(){
        String json_str = "{\"response\":[{\"id_match\":1,\"winner\":2235,\"loser\":4354,\"score_winner\":2,\"score_loser\":1}," +
                "{\"id_match\":2,\"winner\":4351,\"loser\":2228,\"score_winner\":1,\"score_loser\":1}," +
                "{\"id_match\":49,\"winner\":1111,\"loser\":1112,\"score_winner\":4,\"score_loser\":2}," +
                "{\"id_match\":58,\"winner\":1113,\"loser\":1114,\"score_winner\":3,\"score_loser\":3}," +
                "{\"id_match\":59,\"winner\":1115,\"loser\":1116,\"score_winner\":3,\"score_loser\":2}," +
                "{\"id_match\":61,\"winner\":1117,\"loser\":1118,\"score_winner\":1,\"score_loser\":0}," +
                "{\"id_match\":63,\"winner\":1119,\"loser\":1110,\"score_winner\":0,\"score_loser\":0}," +
                "{\"id_match\":64,\"winner\":11101,\"loser\":11101,\"score_winner\":2,\"score_loser\":1}]}";
        System.out.println(json_str);
        JsonNode node = Json.parse(json_str);
        F.Promise<WS.Response> calculate = WS.url("http://localhost:8000/matchesapi/v1/bet/calculate").post(node);
        JsonNode result = Json.parse(calculate.get().getBody());
        return ok(result);
    }
}
