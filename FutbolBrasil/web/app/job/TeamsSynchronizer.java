package job;

import akka.actor.Cancellable;
import com.fasterxml.jackson.databind.JsonNode;
import models.basic.Config;
import models.basic.Language;
import models.pushalerts.PushAlerts;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;
import utils.Utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Created by plesse on 5/4/15.
 */
public class TeamsSynchronizer extends HecticusThread {

    public TeamsSynchronizer() {
        setRun(Utils.run);
        long start = System.currentTimeMillis();
        setName("TeamsSynchronizer-"+start);
        setInitTime(start);
        setActTime(start);
        setPrevTime(start);
    }

    public TeamsSynchronizer(String name, AtomicBoolean run, Cancellable cancellable) {
        super("TeamsSynchronizer-"+name, run, cancellable);
    }

    public TeamsSynchronizer(String name, AtomicBoolean run) {
        super("TeamsSynchronizer-"+name, run);
    }

    public TeamsSynchronizer(AtomicBoolean run) {
        super("TeamsSynchronizer",run);
    }

    @Override
    public void process(Map args) {
        Utils.printToLog(TeamsSynchronizer.class, null, "Iniciando TeamsSynchronizer", false, null, "support-level-1", Config.LOGGER_INFO);
        try {
            PushAlerts lastTeamAlert = PushAlerts.getLastTeamAlert();
            int id = lastTeamAlert != null ? lastTeamAlert.getIdExt() : 0;
            synchTeams(id);
        } catch (Exception ex) {
            Utils.printToLog(TeamsSynchronizer.class, null, "Error sincornizando equipos", true, ex, "support-level-1", Config.LOGGER_ERROR);
        } finally {
            Utils.printToLog(TeamsSynchronizer.class, null, "Terminando TeamsSynchronizer", false, null, "support-level-1", Config.LOGGER_INFO);
        }
    }

    private void synchTeams(int idExt) throws UnsupportedEncodingException {
        F.Promise<WSResponse> result = WS.url("http://" + Config.getFootballManagerHost() + "/footballapi/v2/teams/" + idExt).get();
        ObjectNode response = (ObjectNode) result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
        JsonNode data = null;
        int error = response.get("error").asInt();
        if(error == 0) {
            data = response.get("response");
            if(data.has("teams")){
                Iterator<JsonNode> teams = data.get("teams").elements();
                while (teams.hasNext()){
                    JsonNode next = teams.next();
                    PushAlerts pushAlerts = new PushAlerts(URLEncoder.encode(next.get("name").asText(), "UTF-8"), next.get("id_teams").asInt(), true);
                    pushAlerts.save();
                }
            }
        }
    }

}
