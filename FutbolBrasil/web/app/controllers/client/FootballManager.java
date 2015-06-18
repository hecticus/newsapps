package controllers.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.FootballController;
import models.Config;
import models.clients.Client;
import models.clients.FootballClient;
import models.pushalerts.ClientHasPushAlerts;
import play.libs.F;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;
import play.mvc.Result;
import utils.Utils;

import java.util.concurrent.TimeUnit;

/**
 * Created by plesse on 12/18/14.
 */
public class FootballManager extends FootballController {

    public static Result getScorers(Integer idClient) {

        FootballClient client = (FootballClient) Client.getByID(idClient);
        StringBuilder teams = new StringBuilder();
        teams.append("http://" + Utils.getFootballManagerHost() + "/footballapi/v1/players/topScorers/" + Config.getInt("football-manager-id-app") + "?");
        for(ClientHasPushAlerts clientHasPushAlerts :client.getPushAlerts()){
            Integer idExt = clientHasPushAlerts.getPushAlert().getIdExt();
            if(idExt != null && idExt > 0){
                teams.append("teams[]=").append(idExt).append("&");
            }
        }

        F.Promise<WSResponse> result = WS.url(teams.toString()).get();
        ObjectNode footballResponse = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();

        footballResponse.get("error");
        JsonNode data = footballResponse.get("response");

        ObjectNode response = buildBasicResponse(0, "OK", data.get("data"));
        return ok(response);
    }
}
