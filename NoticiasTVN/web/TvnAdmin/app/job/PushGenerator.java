package job;

import backend.HecticusThread;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.Config;
import models.news.News;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;
import utils.Utils;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by plessmann on 04/08/15.
 */
public class PushGenerator extends HecticusThread {
    private int idCountry;
    private int idBusiness;
    private int count;

    public PushGenerator() {
        this.setActTime(System.currentTimeMillis());
        this.setInitTime(System.currentTimeMillis());
        this.setPrevTime(System.currentTimeMillis());
        //set name
        this.setName("PushGenerator-" + System.currentTimeMillis());
    }

    @Override
    public void process(Map args) {
        Utils.printToLog(PushGenerator.class, null, "Iniciando Job", false, null, "support-level-1", Config.LOGGER_INFO);
        try {
            idCountry = (int) args.get("id_country");
            idBusiness = (int) args.get("id_business");
            count = (int) args.get("count");
            List<News> newsToPush = News.getAllNewsByDateAndNotPushed();
            if(newsToPush != null && !newsToPush.isEmpty()) {
                ArrayList<Long> clients = getClients();
                if(clients != null && !clients.isEmpty()) {
                    sendEvents(newsToPush, clients);
                    clients.clear();
                }
                newsToPush.clear();
            }
        } catch (Exception ex) {
            Utils.printToLog(PushGenerator.class,
                    "Error en el PushGenerator",
                    "ocurrio un error generando push",
                    false,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
        Utils.printToLog(PushGenerator.class, null, "finalizando job", false, null, "support-level-1", Config.LOGGER_INFO);
    }

    private void sendEvents(List<News> newsToPush, ArrayList<Long> clients) {
        ObjectNode event = Json.newObject();
        event.put("app", 3);
        event.put("clients_size", clients.size());
        event.put("clients", Json.toJson(clients));
        Calendar today = new GregorianCalendar(Utils.APP_TIMEZONE);
        SimpleDateFormat sf = new SimpleDateFormat("yyyyMMdd");
        long generationTime = Long.parseLong(sf.format(today.getTime()));
        for(News news : newsToPush){
            isAlive();
            try {
                event.put("idEvent", news.getIdNews());
                event.put("msg", news.getTitle());
                event.put("extra_params", news.getExternalId());
                event.put("generationTime", System.currentTimeMillis());
                sendEventToPmc(event);
                news.setGenerated(true);
                news.setGenerationTime(generationTime);
                news.update();
            } catch (Exception ex) {
                Utils.printToLog(PushGenerator.class,
                        "Error en el PushGenerator",
                        "ocurrio un error generando push",
                        false,
                        ex,
                        "support-level-1",
                        Config.LOGGER_ERROR);
            }
        }
    }

    private void sendEventToPmc(ObjectNode event) {
        try {
//            System.out.println("event = [" + event.get("msg").asText() + "]");
            F.Promise<WSResponse> result = WS.url("http://" + Config.getPMCHost() + "/events/v1/insert").post(event);
            ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
        } catch (Exception e){
            Utils.printToLog(PushGenerator.class, null, "Error insertando evento en el PMC", true, e, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private ArrayList<Long> getClients() {
        String url = "http://" + Config.getString("kraken-host") + "/KrakenClients/v1/clients/params/" + idCountry + "/" + idBusiness + "?status[]=1&offset=%d&count=%d";
        F.Promise<WSResponse> result;
        ObjectNode response;
        boolean done = false;
        int error = 0;
        Iterator<JsonNode> clientsIterator;
        ArrayList<Long> clients = new ArrayList<>();
        int offset = 0;
        while(isAlive() && !done){
            try {
                result = WS.url(String.format(url, offset, count)).get();
                response = (ObjectNode) result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
                if (response != null) {
                    if (response.has("error")) {
                        error = response.get("error").asInt();
                        if (error == 0) {
                            if (response.has("response")) {
                                clientsIterator = response.get("response").elements();
                                if (clientsIterator.hasNext()) {
                                    while (isAlive() && clientsIterator.hasNext()) {
                                        clients.add(clientsIterator.next().get("id_client").asLong());
                                    }
                                    offset += count;
                                } else {
                                    done = true;
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                done = true;
                clients.clear();
                clients = null;
            }
        }
        return clients;
    }
}
