package job;

import akka.actor.Cancellable;
import com.avaje.ebean.Page;
import com.avaje.ebean.PagingList;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.basic.Config;
import models.clients.Client;
import models.leaderboard.ClientBets;
import models.leaderboard.Leaderboard;
import models.leaderboard.LeaderboardGlobal;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;
import utils.Utils;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created by plesse on 10/30/14.
 */
public class Leaderboardnator extends HecticusThread {

    public Leaderboardnator() {
        setRun(Utils.run);
        long start = System.currentTimeMillis();
        setName("Leaderboardnator-"+start);
        setInitTime(start);
        setActTime(start);
        setPrevTime(start);
    }

    public Leaderboardnator(String name, AtomicBoolean run, Cancellable cancellable) {
        super("Leaderboardnator-"+name, run, cancellable);
    }

    public Leaderboardnator(String name, AtomicBoolean run) {
        super("Leaderboardnator-"+name, run);
    }

    public Leaderboardnator(AtomicBoolean run) {
        super("Leaderboardnator",run);
    }

    @Override
    public void process(Map args) {
        try {
            int winnerPoints = Integer.parseInt(""+args.get("winner"));
            int loserPoints = Integer.parseInt(""+args.get("loser"));
            ArrayList<Integer> activeTournaments = getActiveTournaments();
            if(activeTournaments != null && !activeTournaments.isEmpty()){
                ObjectNode results = getTodayResults(activeTournaments);
                if(results != null) {
                    ArrayList<Client> clients = calculateBets(activeTournaments, results, winnerPoints, loserPoints);
                    if(!clients.isEmpty()) {
                        calculateGlobalLeaderboard(clients);
                    }
                }
            }
        } catch (Exception ex) {
            Utils.printToLog(PushGenerator.class, null, "Error calculando leadeboards", false, ex, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private void calculateGlobalLeaderboard(ArrayList<Client> clients) {
        for(Client client : clients){
            int points = 0;
            for(Leaderboard leaderboard : client.getLeaderboards()) {
                points += leaderboard.getScore();
            }
            if(client.getLeaderboardGlobal() == null){
                LeaderboardGlobal leaderboardGlobal = new LeaderboardGlobal(client, points);
                client.setLeaderboardGlobal(leaderboardGlobal);
            } else {
                client.getLeaderboardGlobal().setScore(points);
            }
            client.update();
        }
    }

    private ObjectNode getTodayResults(ArrayList<Integer> activeTournaments) {
        ObjectNode results = Json.newObject();
        for(int idTournament : activeTournaments){
            F.Promise<WSResponse> result = WS.url("http://" + Config.getFootballManagerHost() + "/nombre/del/ws").get();
            ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
            results.put(""+idTournament, response.get("response"));
        }
        //fake results
//        ObjectNode fakeResponse = Json.newObject();
//        fakeResponse.put("1", 1);
//        fakeResponse.put("2", 2);
//        fakeResponse.put("3", 3);
//        results.put("1", fakeResponse);
//        fakeResponse.put("1", 3);
//        results.put("2", fakeResponse);
        //fake results
        return results;
    }

    private ArrayList<Client> calculateBets(ArrayList<Integer> activeTournaments, ObjectNode results, int winnerPoints, int loserPoints) {
        ArrayList<Client> calculated = new ArrayList<>();
        for(int idTournament : activeTournaments){
            JsonNode tournametResults = results.get("" + idTournament);
            PagingList<ClientBets> pagingList = ClientBets.finder.where().eq("idTournament", idTournament).eq("status", 1).orderBy("client.idClient").findPagingList(100);
            int totalPageCount = pagingList.getTotalPageCount();
            for(int i = 0; i < totalPageCount; i++){
                List<ClientBets> bets = pagingList.getPage(i).getList();
                for(ClientBets clientBets : bets){
                    Client client = clientBets.getClient();
                    if(tournametResults.has(""+clientBets.getIdGameMatch())){
                        int result = tournametResults.get("" + clientBets.getIdGameMatch()).asInt();
                        int points = result == clientBets.getClientBet()? winnerPoints : loserPoints;
                        Leaderboard leaderboard = Leaderboard.finder.where().eq("client.idClient", client.getIdClient()).eq("idTournament", idTournament).findUnique();
                        if(leaderboard != null){
                            points += leaderboard.getScore();
                            leaderboard.setScore(points);
                            leaderboard.update();
                        } else {
                            leaderboard =  new Leaderboard(client, idTournament, points);
                            leaderboard.save();
                        }
                        clientBets.setStatus(3);
                        clientBets.update();
                        if(!calculated.contains(client)){
                            calculated.add(client);
                        }
                    }
                }
            }
        }
        return calculated;
    }

    private ArrayList<Integer> getActiveTournaments() {
        ArrayList<Integer> activeTournaments = new ArrayList<>();
        F.Promise<WSResponse> result = WS.url("http://" + Config.getFootballManagerHost() + "/nombre/del/ws").get();
        ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
        Iterator<JsonNode> elements = response.get("response").elements();
        while (elements.hasNext()) {
            activeTournaments.add(elements.next().asInt());
        }
        //fake results
//        activeTournaments.add(1);
//        activeTournaments.add(2);
        //fake results
        return activeTournaments;
    }
}
