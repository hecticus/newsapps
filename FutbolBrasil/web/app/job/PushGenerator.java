package job;

import akka.actor.Cancellable;
import caches.ClientsCache;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.basic.Action;
import models.basic.Config;
import models.basic.Language;
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
    private int idActionPhaseFinished;
    private int defaultLanguage;

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
        try {
            pmcIdApp = Config.getInt("pmc-id-app");
            idActionPhaseFinished = Integer.parseInt(""+args.get("id_action"));
            defaultLanguage = Integer.parseInt(""+args.get("default_language"));
            getEventsToGenerate();
        } catch (Exception ex) {
            Utils.printToLog(PushGenerator.class, null, "Error generado push", true, ex, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private void sendEventToPmc(ObjectNode event) {
        try {
            F.Promise<WSResponse> result = WS.url("http://" + Config.getPMCHost() + "/events/v1/insert").post(event);
            ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
        } catch (Exception e){
            Utils.printToLog(PushGenerator.class, null, "Error insertando evento en el PMC", true, e, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private void getEventsToGenerate() {
        Map<Integer, ArrayList<Integer>> clientsForEvent = null;
        JsonNode data = null;
        Language language = null;
        try {
            F.Promise<WSResponse> result = WS.url("http://" + Config.getFootballManagerHost() + "/footballapi/v1/pushable/get/" + Config.getInt("football-manager-id-app")).get();
            ObjectNode response = (ObjectNode) result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();

            int error = response.get("error").asInt();
            if(error == 0) {
                data = response.get("response");
                if(data.has("min_to_min")){
                    Iterator<JsonNode> minToMinIterator = data.get("min_to_min").elements();
                    while (isAlive() && minToMinIterator.hasNext()){
                        JsonNode next = minToMinIterator.next();
                        try {
                            if (next.has("match") && next.has("events")) {
                                JsonNode match = next.get("match");
                                Iterator<JsonNode> events = next.get("events").elements();
                                if (events.hasNext()) {
                                    clientsForEvent = getClientsForEvent(match, true);
                                    if(clientsForEvent != null && !clientsForEvent.isEmpty()) {
                                        for(int i : clientsForEvent.keySet()) {
                                            isAlive();
                                            language = Language.finder.byId(i);
                                            sendEvents(match.get("id_game_matches").asInt(), clientsForEvent.get(i), next.get("events").elements(), match.get("home_team").get("name").asText(), match.get("away_team").get("name").asText(), language);
                                        }
                                    }
                                }
                            }
                        } catch (Exception e){
                            Utils.printToLog(PushGenerator.class, null, "Error procesando min a min", false, e, "support-level-1", Config.LOGGER_ERROR);
                        }
                    }
                }

                if(data.has("news")){
                    Iterator<JsonNode> news = data.get("news").elements();
                    clientsForEvent = getClientsForEvent(null, false);
                    if(clientsForEvent != null && !clientsForEvent.isEmpty() && news.hasNext()) {
                        for(int i : clientsForEvent.keySet()) {
                            isAlive();
                            sendEvents(-1, clientsForEvent.get(i), data.get("news").elements(), null, null, null);
                        }
                    }
                }
            }
        } catch (Exception e){
            Utils.printToLog(PushGenerator.class, null, "Error manejando data a enviar", true, e, "support-level-1", Config.LOGGER_ERROR);
        }

        try {
            F.Promise<WSResponse> result = WS.url("http://" + Config.getFootballManagerHost() + "/footballapi/v1/competitions/phases/notify/" + Config.getInt("football-manager-id-app")).get();
            ObjectNode response = (ObjectNode) result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();

            int error = response.get("error").asInt();
            if(error == 0) {
                data = response.get("response");
                Iterator<JsonNode> phasesIterator = data.get("phases").elements();

                while (isAlive() && phasesIterator.hasNext()){
                    JsonNode next = phasesIterator.next();
                    try {
                        clientsForEvent = getClientsForEvent(next, false);
                        if(clientsForEvent != null && !clientsForEvent.isEmpty()) {
                            for(int i : clientsForEvent.keySet()) {
                                isAlive();
                                language = Language.finder.byId(i);
                                sendEvents(-1, clientsForEvent.get(i), next, null, null, language);
                            }
                        }
                    } catch (Exception e){
                        Utils.printToLog(PushGenerator.class, null, "Error procesando final de phase", false, e, "support-level-1", Config.LOGGER_ERROR);
                    }
                }
            }
        } catch (Exception e){
            Utils.printToLog(PushGenerator.class, null, "Error manejando data a enviar", true, e, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private void sendEvents(int idGameMatch, ArrayList<Integer> clientsForEvent, Object events, String home, String away, Language language) {
        ObjectNode event = Json.newObject();
        ObjectNode extraParams = Json.newObject();
        event.put("clients", Json.toJson(clientsForEvent));
        event.put("app", pmcIdApp);
        if(events instanceof Iterator) {
            Iterator<JsonNode> eventsIterator = (Iterator<JsonNode>) events;
            while (isAlive() && eventsIterator.hasNext()) {
                JsonNode next = eventsIterator.next();
                try {
                    if (idGameMatch != -1) {
                        String msg = resolveActionText(next, home, away, language);
                        if(msg == null) {
                            int idAction = next.get("action").get("id_action").asInt();
                            Utils.printToLog(PushGenerator.class, "Accion desconocida", "La accion " + idAction + " no existe en Football Brazil", true, null, "support-level-1", Config.LOGGER_ERROR);
                            continue;
                        }
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
                } catch (Exception e) {
                    Utils.printToLog(PushGenerator.class, null, "Error enviando eventos", false, e, "support-level-1", Config.LOGGER_ERROR);
                }
            }
        } else {
            try {
                JsonNode phase = (JsonNode) events;
                String msg = resolveActionText(phase, home, away, language);
                if(msg == null) {
                    Utils.printToLog(PushGenerator.class, "Accion desconocida", "La accion de finalizacion de phase " + idActionPhaseFinished + " no existe en Football Brazil", true, null, "support-level-1", Config.LOGGER_ERROR);
                    return;
                }
                event.put("msg", URLEncoder.encode(msg, "UTF-8"));
                extraParams.put("is_news", false);
                extraParams.put("is_info", true);
                event.put("extra_params", extraParams);
                sendEventToPmc(event);
            } catch (Exception e) {
                Utils.printToLog(PushGenerator.class, null, "Error enviando eventos", false, e, "support-level-1", Config.LOGGER_ERROR);
            }
        }
    }

    private String resolveActionText(JsonNode event, String home, String away, Language language) {
        Action action = null;
        if(event.has("action")){
            int idAction = event.get("action").get("id_action").asInt();
            action = Action.finder.where().eq("extId", idAction).eq("language.idLanguage", language.getIdLanguage()).findUnique();
            if(action == null){
                action = Action.finder.where().eq("extId", idAction).eq("language.idLanguage", defaultLanguage).findUnique();
            }
        } else {
            action = Action.finder.byId(idActionPhaseFinished);
        }
        if(action == null){
            return null;
        }
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
        if(msg.contains("%TOURNAMENT%")){
            msg = msg.replaceFirst("%TOURNAMENT%", event.get("competition_name").asText());
        }
        if(msg.contains("%PHASE%")){
            msg = msg.replaceFirst("%PHASE%", event.get("name").asText());
        }
        return msg;
    }

    private Map<Integer, ArrayList<Integer>> getClientsForEvent(JsonNode event, boolean minToMin) throws Exception {
        Map<Integer, ArrayList<Integer>> clients = null;
        if(event != null) {
            if(minToMin) {
                int home = event.get("home_team").get("id_teams").asInt();
                int away = event.get("away_team").get("id_teams").asInt();
                clients = ClientsCache.getInstance().getTeamClients(home);
                Map<Integer, ArrayList<Integer>> awayClients = ClientsCache.getInstance().getTeamClients(away);
                mergeClients(clients, awayClients);
            } else {
                int tournament = event.get("competition_id").asInt();
                clients = ClientsCache.getInstance().getTournamentClients(tournament);
            }
        } else {
            clients = ClientsCache.getInstance().getTournamentClients(-1);
        }
        return clients;
    }

    private void mergeClients(Map<Integer, ArrayList<Integer>> home, Map<Integer, ArrayList<Integer>> away){
        for(int i :away.keySet()){
            isAlive();
            if(home.containsKey(i)){
                home.get(i).addAll(away.get(i));
            } else {
                home.put(i, away.get(i));
            }
        }
    }
}


