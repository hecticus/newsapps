package job;

import akka.actor.Cancellable;
import com.avaje.ebean.ExpressionList;
import com.avaje.ebean.PagingList;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.basic.Action;
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

import java.net.URLEncoder;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created by plesse on 10/30/14.
 */
public class Leaderboardnator extends HecticusThread {
    private Map<Integer, Integer> clientsPoints = null;
    private int pmcIdApp;
    private int idAction;

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
            Utils.printToLog(Leaderboardnator.class, null, "Iniciando Leaderboardnator", false, null, "support-level-1", Config.LOGGER_INFO);
            clientsPoints = new HashMap<>();
            pmcIdApp = Config.getInt("pmc-id-app");
            idAction = Integer.parseInt(""+args.get("id_action"));
            int winnerPoints = Integer.parseInt(""+args.get("winner"));
            int loserPoints = Integer.parseInt(""+args.get("loser"));
            ArrayList<Integer> activeTournaments = getActiveTournaments();
            if(activeTournaments != null && !activeTournaments.isEmpty()){
                ObjectNode results = getTodayResults(activeTournaments);
                if(results != null) {
                    Set<Integer> clients = calculateBets(activeTournaments, results, winnerPoints, loserPoints);
                    if(!clients.isEmpty()) {
                        calculateGlobalLeaderboard(clients);
                        clients.clear();
                    }
                    if(!clientsPoints.isEmpty()){
                        processPushData();
                        clientsPoints.clear();
                    }
                }
            }
            Utils.printToLog(Leaderboardnator.class, null, "Terminando Leaderboardnator", false, null, "support-level-1", Config.LOGGER_INFO);
        } catch (Exception ex) {
            Utils.printToLog(Leaderboardnator.class, null, "Error calculando leadeboards", false, ex, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private void processPushData() {
        Map<Integer, ArrayList<Integer>> pointClients = new HashMap<>();
        Set<Integer> clients = clientsPoints.keySet();
        for(int client : clients){
            int points = clientsPoints.get(client);
            if(pointClients.containsKey(points)){
                pointClients.get(points).add(client);
            } else {
                ArrayList<Integer> temp = new ArrayList<Integer>();
                temp.add(client);
                pointClients.put(points, temp);
            }
        }
        ObjectNode event = Json.newObject();
        ObjectNode extraParams = Json.newObject();
        Set<Integer> points = pointClients.keySet();
        for(int point : points){
            try {
                String msg = resolvePointsMessage(point);
                event.put("msg", URLEncoder.encode(msg, "UTF-8"));
                event.put("clients", Json.toJson(pointClients.get(point)));
                event.put("app", pmcIdApp);
                extraParams.put("is_news", false);
                extraParams.put("is_info", true);
                event.put("extra_params", extraParams);
                sendPush(event);
            } catch (Exception e){
                e.printStackTrace();
            } finally {
                event.removeAll();
                extraParams.removeAll();
            }
        }
        pointClients.clear();
    }

    private String resolvePointsMessage(int point) {
        Action action = Action.finder.where().eq("idAction", idAction).findUnique();
        String msg = action.getMsg();
        msg = msg.replaceFirst("%POINTS%", ""+point);
        return msg;
    }

    private void sendPush(ObjectNode event) {
        F.Promise<WSResponse> result = WS.url("http://" + Config.getPMCHost() + "/events/v1/insert").post(event);
        ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
    }

    private void calculateGlobalLeaderboard(Set<Integer> clientIDs) {
        List<Client> clients = Client.finder.where().in("idClient", clientIDs).findList();
        for(Client client : clients){
            int points = 0;
            List<Leaderboard> clientLeaderboards = client.getLeaderboards();
            if(clientLeaderboards != null && !clientLeaderboards.isEmpty()) {
                int pivot = clientLeaderboards.get(0).getIdTournament();
                for (Leaderboard leaderboard : clientLeaderboards) {
                    if(leaderboard.getIdTournament() == pivot) {
                        points += leaderboard.getScore();
                    } else {
                        LeaderboardGlobal leaderboardGlobal = client.getLeaderboardGlobal(pivot);
                        if (leaderboardGlobal == null) {
                            leaderboardGlobal = new LeaderboardGlobal(client, pivot, points);
                            client.addLeaderboardGlobal(leaderboardGlobal);
                        } else {
                            leaderboardGlobal.setScore(points);
                        }
                        pivot = leaderboard.getIdTournament();
                        points = leaderboard.getScore();
                    }
                }
                if(pivot > 0){
                    LeaderboardGlobal leaderboardGlobal = client.getLeaderboardGlobal(pivot);
                    if (leaderboardGlobal == null) {
                        leaderboardGlobal = new LeaderboardGlobal(client, pivot, points);
                        client.addLeaderboardGlobal(leaderboardGlobal);
                    } else {
                        leaderboardGlobal.setScore(points);
                    }
                }
                client.update();
            }
        }
    }

    private ObjectNode getTodayResults(ArrayList<Integer> activeTournaments) {
        ObjectNode results = Json.newObject();
        for(int idTournament : activeTournaments){
            try {
                F.Promise<WSResponse> result = WS.url("http://" + Config.getFootballManagerHost() + "/footballapi/v1/matches/finished/get/" + idTournament).get();
                ObjectNode response = (ObjectNode) result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
                if(response.get("error").asInt() == 0) {
                    results.put("" + idTournament, response.get("response").get("results").get(0));
                }
            } catch (Exception e){

            }
        }
        return results;
    }

    private Set<Integer> calculateBets(ArrayList<Integer> activeTournaments, ObjectNode results, int winnerPoints, int loserPoints) {
        Collection<Integer> calculated =  new HashSet<>();
        int idPhase = -1;
        for(int idTournament : activeTournaments){
            JsonNode tournametResults = results.get("" + idTournament);
            PagingList<ClientBets> pagingList = ClientBets.finder.where().eq("idTournament", idTournament).eq("status", 1).orderBy("client.idClient asc, idPhase asc").findPagingList(100);
            int totalPageCount = pagingList.getTotalPageCount();
            for(int i = 0; i < totalPageCount; i++){
                List<ClientBets> bets = pagingList.getPage(i).getList();
                if(bets !=  null && !bets.isEmpty()) {
                    for (ClientBets clientBets : bets) {
                        Client client = clientBets.getClient();
                        if (tournametResults.has("" + clientBets.getIdGameMatch())) {
                            idPhase = clientBets.getIdPhase();
                            int result = tournametResults.get("" + clientBets.getIdGameMatch()).asInt();
                            int points = result == clientBets.getClientBet() ? winnerPoints : loserPoints;

                            if(clientsPoints.containsKey(client.getIdClient())){
                                int temp = points + clientsPoints.get(client.getIdClient());
                                clientsPoints.put(client.getIdClient(), temp);
                            } else {
                                clientsPoints.put(client.getIdClient(), points);
                            }
                            Leaderboard leaderboard = client.getLeaderboard(idTournament, idPhase);
                            if (leaderboard != null) {
                                points += leaderboard.getScore();
                                leaderboard.setScore(points);
                            } else {
                                leaderboard = new Leaderboard(client, idTournament, idPhase, points);
                            }
                            client.addLeaderboard(leaderboard);
                            client.update();
                            clientBets.setStatus(3);
                            clientBets.update();
                            calculated.add(client.getIdClient());
                        }
                    }
                }
            }
        }
        return (Set)calculated;
    }

    private ArrayList<Integer> getActiveTournaments() {
        ArrayList<Integer> activeTournaments = new ArrayList<>();
        try {
            F.Promise<WSResponse> result = WS.url("http://" + Config.getFootballManagerHost() + "/footballapi/v1/competitions/list/ids/" + getIdApp()).get();
            ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
            if(response.get("error").asInt() == 0) {
                Iterator<JsonNode> elements = response.get("response").get("ids").elements();
                while (elements.hasNext()) {
                    activeTournaments.add(elements.next().asInt());
                }
            }
        } catch (Exception e){

        }
        return activeTournaments;
    }
}
