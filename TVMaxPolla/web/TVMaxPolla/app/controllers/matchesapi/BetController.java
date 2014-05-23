package controllers.matchesapi;

import controllers.HecticusController;
import models.matches.ClientBet;
import models.matches.GameMatch;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.F;
import play.libs.WS;
import play.mvc.Result;
import play.libs.Json;
import scala.Array;
import views.html.defaultpages.error;
import views.html.defaultpages.error$;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by karina on 5/19/14.
 */
public class BetController  extends HecticusController{

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
