package backend.job;

import akka.actor.Cancellable;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.basic.Config;
import models.clients.Client;
import models.clients.ClientHasAthlete;
import models.content.posts.Post;
import models.content.posts.PostHasLocalization;
import models.content.athletes.Athlete;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;
import utils.Utils;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created by plesse on 10/6/14.
 */
public class PushGenerator extends HecticusThread {

    private ClientHasThemeComparator clientHasThemeComparator;

    public PushGenerator(String name, AtomicBoolean run, Cancellable cancellable) {
        super("PushGenerator-"+name, run, cancellable);
    }

    public PushGenerator(String name, AtomicBoolean run) {
        super("PushGenerator-"+name, run);
    }

    public PushGenerator(AtomicBoolean run) {
        super("PushGenerator",run);
        clientHasThemeComparator = new ClientHasThemeComparator();
    }

    @Override
    public void process(Map args) {
        try {
            getEventsToGenerate();
        } catch (Exception ex) {
            Utils.printToLog(PushGenerator.class, null, "Error generado push", false, ex, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private void sendEventToPmc(ObjectNode event) {
        F.Promise<WSResponse> result = WS.url("http://" + Config.getPMCHost() + "/events/v1/insert").post(event);
        ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
    }

    private void getEventsToGenerate() {
//        int idApp = Config.getInt("pmc-app-id");
//        List<Post> push = Post.finder.where().eq("push", 1).lt("pushDate", System.currentTimeMillis()).findList();
//        ArrayList<Integer> clients = new ArrayList<>();
//        if(push != null && !push.isEmpty()){
//            for (Post post : push){
//                post.setPush(2);
//                post.update();
//                Athlete theme = post.getPosts();
//                List<ClientHasAthlete> clientsList = theme.getClients();
//                Collections.sort(clientsList, clientHasThemeComparator);
//                List<PostHasLocalization> localizations = post.getLocalizations();
//                for (PostHasLocalization postHasLocalization : localizations){
//                    try {
//                        clients.clear();
//                        boolean found = false;
//                        for(ClientHasAthlete clientHasTheme : clientsList){
//                            Client client = clientHasTheme.getClient();
//                            if(client.getAthlete().getLanguage() == postHasLocalization.getLanguage() && client.getDevices() != null && !client.getDevices().isEmpty()){
//                                clients.add(client.getIdClient());
//                                found = true;
//                            } else {
//                                if(found){
//                                    break;
//                                }
//                            }
//                        }
//                        if(!clients.isEmpty()) {
//                            ObjectNode event = Json.newObject();
//                            event.put("app", idApp);
//                            event.put("msg", postHasLocalization.getTitle());
//                            ObjectNode extraParams = Json.newObject();
//                            extraParams.put("id_post", post.getIdPost());
//                            extraParams.put("id_theme", theme.getIdAthlete());
//                            event.put("extra_params", extraParams);
//                            event.put("clients", Json.toJson(clients));
//                            sendEventToPmc(event);
//                        }
//                    } catch (Exception ex) {
//                        Utils.printToLog(PushGenerator.class, null, "Error generando push", false, ex, "support-level-1", Config.LOGGER_ERROR);
//                    }
//                }
//                post.setPush(3);
//                post.update();
//            }
//        }
    }
}

class ClientHasThemeComparator implements Comparator<ClientHasAthlete> {
    @Override
    public int compare(ClientHasAthlete a, ClientHasAthlete b) {
        return a.getClient().getCountry().getLanguage().getIdLanguage() - b.getClient().getCountry().getLanguage().getIdLanguage();
    }
}
