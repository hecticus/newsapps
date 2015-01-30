package job;

import akka.actor.Cancellable;
import caches.ClientsCache;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.basic.Action;
import models.basic.Config;
import models.clients.Client;
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
 * Created by plesse on 10/6/14.
 */
public class PushGenerator extends HecticusThread {

    private int pmcIdApp;

    public PushGenerator() {
        setRun(Utils.run);
        long start = System.currentTimeMillis();
        setName("PushGenerator-"+start);
        setInitTime(start);
        setActTime(start);
        setPrevTime(start);
    }

    public PushGenerator(String name, AtomicBoolean run, Cancellable cancellable) {
        super("PushGenerator-"+name, run, cancellable);
    }

    public PushGenerator(String name, AtomicBoolean run) {
        super("PushGenerator-"+name, run);
    }

    public PushGenerator(AtomicBoolean run) {
        super("PushGenerator",run);
    }

    @Override
    public void process(Map args) {
        Utils.printToLog(PushGenerator.class, null, "Iniciando PushGenerator", false, null, "support-level-1", Config.LOGGER_ERROR);
        try {
            pmcIdApp = Config.getInt("pmc-id-app");
            getEventsToGenerate();
        } catch (Exception ex) {
            Utils.printToLog(PushGenerator.class, null, "Error generado push", false, ex, "support-level-1", Config.LOGGER_ERROR);
        } finally {
            Utils.printToLog(PushGenerator.class, null, "Termianndo PushGenerator", false, null, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private void sendEventToPmc(ObjectNode event) {
        try {
//            System.out.println(" - " + event.toString());
            F.Promise<WSResponse> result = WS.url("http://" + Config.getPMCHost() + "/events/v1/insert").post(event);
            ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
        } catch (Exception e){
            Utils.printToLog(PushGenerator.class, null, "Error insertando evento en el PMC", true, e, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private void getEventsToGenerate() {
        try {
            F.Promise<WSResponse> result = WS.url("http://" + Config.getFootballManagerHost() + "/footballapi/v1/pushable/get/" + Config.getInt("football-manager-id-app")).get();
            ObjectNode response = (ObjectNode) result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();

            int error = response.get("error").asInt();
            if(error == 0) {
                Set<Integer> clientsForEvent = null;
                JsonNode data = response.get("response");
                if(data.has("min_to_min")){
                    System.out.println("MinToMin");
                    Iterator<JsonNode> minToMinIterator = data.get("min_to_min").elements();
                    while (minToMinIterator.hasNext()){
                        JsonNode next = minToMinIterator.next();
                        try {
                            if (next.has("match") && next.has("events")) {
                                JsonNode match = next.get("match");
                                Iterator<JsonNode> events = next.get("events").elements();
                                if (events.hasNext()) {
                                    clientsForEvent = getClientsForEvent(match);
                                    sendEvents(match.get("id_game_matches").asInt() ,clientsForEvent, events, match.get("home_team").get("name").asText(), match.get("away_team").get("name").asText());
                                }
                            }
                        } catch (Exception e){
                            e.printStackTrace();
                        }
                    }
                }

                if(data.has("news")){
                    System.out.println("News");
                    Iterator<JsonNode> news = data.get("news").elements();
                    clientsForEvent = getClientsForEvent(null);
                    if(news.hasNext()) {
                        sendEvents(-1, clientsForEvent, news, null, null);
                    }
                }
            }
        } catch (Exception e){
            Utils.printToLog(PushGenerator.class, null, "Error manejando data a enviar", true, e, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private void sendEvents(int idGameMatch, Set<Integer> clientsForEvent, Iterator<JsonNode> events, String home, String away) {
        ObjectNode event = Json.newObject();
        ObjectNode extraParams = Json.newObject();
        event.put("clients", Json.toJson(clientsForEvent));
        event.put("app", pmcIdApp);
        while(events.hasNext()){
            JsonNode next = events.next();
            try {
                if(idGameMatch != -1){
                    String msg = resolveActionText(next, home, away);
                    event.put("msg", URLEncoder.encode(msg, "UTF-8"));
                    extraParams.put("id_game_match", idGameMatch);
                    extraParams.put("id_action", next.get("action").get("id_action").asInt());
                    extraParams.put("is_news", false);
                    extraParams.put("is_info", false);
                } else {
                    event.put("msg", next.get("title").asText());
                    extraParams.put("is_news", true);
                    extraParams.put("id_news", next.get("id_news").asInt());
                    extraParams.put("is_info", false);
                }
                event.put("extra_params", extraParams);
                sendEventToPmc(event);
            } catch (Exception e){
                e.printStackTrace();
            }
        }
    }

    private String resolveActionText(JsonNode event, String home, String away) {
        int idAction = event.get("action").get("id_action").asInt();
        Action action = Action.finder.where().eq("extId", idAction).findUnique();
        String msg = action.getMsg();
        if(msg.contains("%TEAM%")){
            msg = msg.replaceFirst("%TEAM%", event.get("is_home_team").asBoolean()?home:away);
        }
        if(msg.contains("%PLAYER%")){
            msg = msg.replaceFirst("%PLAYER%", event.get("player_a").asText());
        }
        if(msg.contains("%PLAYER_A%")){
            msg = msg.replaceFirst("%PLAYER_A%", event.get("player_a").asText());
        }
        if(msg.contains("%PLAYER_B%")){
            msg = msg.replaceFirst("%PLAYER_B%", event.get("player_b").asText().equalsIgnoreCase("null")?"":event.get("player_b").asText());
        }
        return msg;
    }

    private Set<Integer> getClientsForEvent(JsonNode event) throws Exception {
        if(event != null) {
            int home = event.get("home_team").get("id_teams").asInt();
            int away = event.get("away_team").get("id_teams").asInt();
            ArrayList<Integer> homeClients = ClientsCache.getInstance().getClients(home);
            ArrayList<Integer> awayClients = ClientsCache.getInstance().getClients(away);
            homeClients.addAll(awayClients);
            return new HashSet(homeClients);
        } else {
            List<Client> clients = Client.finder.where().gt("status", 0).findList();
            Set<Integer> clientIDs = new HashSet();
            for(Client client : clients){
                clientIDs.add(client.getIdClient());
            }
            return clientIDs;
        }
    }
}


