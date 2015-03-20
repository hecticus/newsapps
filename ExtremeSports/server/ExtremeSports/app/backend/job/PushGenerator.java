package backend.job;

import akka.actor.Cancellable;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Predicate;
import models.basic.Config;
import models.basic.Language;
import models.clients.Client;
import models.clients.ClientHasAthlete;
import models.clients.ClientHasCategory;
import models.content.posts.Category;
import models.content.posts.Post;
import models.content.athletes.Athlete;
import models.content.posts.PostHasLocalization;
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

    private ClientComparator clientComparator;

    public PushGenerator(String name, AtomicBoolean run, Cancellable cancellable) {
        super("PushGenerator-"+name, run, cancellable);
    }

    public PushGenerator(String name, AtomicBoolean run) {
        super("PushGenerator-"+name, run);
    }

    public PushGenerator(AtomicBoolean run) {
        super("PushGenerator",run);
        clientComparator = new ClientComparator();
    }

    public PushGenerator() {
        this.setActTime(System.currentTimeMillis());
        this.setInitTime(System.currentTimeMillis());
        this.setPrevTime(System.currentTimeMillis());
        //set name
        this.setName("PushGenerator-" + System.currentTimeMillis());
        clientComparator = new ClientComparator();
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
        int idApp = Config.getInt("pmc-app-id");
        List<Post> posts = Post.getPostsToPush();
        Set<Client> receivers = new HashSet<>();
        if(posts != null && !posts.isEmpty()){
            for (Post post : posts){
                post.setPush(2);
                post.update();

                List<Athlete> athletes = post.getRealAthletes();
                for(Athlete athlete : athletes){
                    for(ClientHasAthlete clientHasAthlete : athlete.getClients()) {
                        receivers.add(clientHasAthlete.getClient());
                    }
                }

                List<Category> categories = post.getPushableCategories();
                for(Category category : categories){
                    for(ClientHasCategory clientHasCategory : category.getClients()) {
                        receivers.add(clientHasCategory.getClient());
                    }
                }

                List<Client> clients = new ArrayList<>(receivers);
                Collections.sort(clients, clientComparator);

                List<PostHasLocalization> localizations = post.getLocalizations();
                for (PostHasLocalization postHasLocalization : localizations){
                    try {
                        final Language language = postHasLocalization.getLanguage();
                        Predicate<Client> validObjs = new Predicate<Client>() {
                            public boolean apply(Client obj) {
                               return obj.getLanguage().getIdLanguage().intValue() == language.getIdLanguage().intValue();
                            }
                        };
                        List<Client> clientsToPush = (List<Client>) Utils.filterCollection(clients, validObjs);
                        if(!clientsToPush.isEmpty()) {
                            ObjectNode event = createPMCEvent(idApp, clientsToPush, postHasLocalization);
                            sendEventToPmc(event);
                        }
                    } catch (Exception ex) {
                        Utils.printToLog(PushGenerator.class, null, "Error generando push", false, ex, "support-level-1", Config.LOGGER_ERROR);
                    }
                }
                post.setPush(3);
                post.update();
            }
        }
    }

    private ObjectNode createPMCEvent(int idApp, List<Client> clientsToPush, PostHasLocalization localization) {
        ArrayList<Integer> clients = new ArrayList<>();
        for(Client client : clientsToPush){
            clients.add(client.getIdClient());
        }
        ObjectNode event = Json.newObject();
        event.put("app", idApp);
        event.put("msg", localization.getTitle());
        ObjectNode extraParams = Json.newObject();
        extraParams.put("id_post", localization.getPost().getIdPost());
        event.put("extra_params", extraParams);
        event.put("clientsToPush", Json.toJson(clients));
        return event;
    }
}

class ClientComparator implements Comparator<Client> {
    @Override
    public int compare(Client a, Client b) {
        return a.getCountry().getLanguage().getIdLanguage() - b.getCountry().getLanguage().getIdLanguage();
    }
}
