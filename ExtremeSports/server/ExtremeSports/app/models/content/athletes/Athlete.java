package models.content.athletes;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.ClientHasAthlete;
import models.content.posts.Post;
import models.content.posts.PostHasMedia;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;
import scala.Tuple2;
import scala.collection.JavaConversions;
import scala.collection.mutable.Buffer;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="athletes")
public class Athlete extends HecticusModel {
    @Id
    private Integer idAthlete;
    @Constraints.Required
    private String name;

    @Constraints.Required
    private String defaultPhoto;

    @OneToMany(mappedBy="athlete", cascade = CascadeType.ALL)
    private List<Post> posts;

    @OneToMany(mappedBy="athlete", cascade = CascadeType.ALL)
    private List<AthleteHasSocialNetwork> socialNetworks;

    @OneToMany(mappedBy="athlete", cascade = CascadeType.ALL)
    private List<ClientHasAthlete> clients;//eliminar???

    public static Model.Finder<Integer, Athlete> finder = new Model.Finder<Integer, Athlete>(Integer.class, Athlete.class);

    public Athlete(String name) {
        this.name = name;
    }

    public void setIdAthlete(Integer idAthlete) {
        this.idAthlete = idAthlete;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getIdAthlete() {
        return idAthlete;
    }

    public String getDefaultPhoto() {
        return defaultPhoto;
    }

    public void setDefaultPhoto(String defaultPhoto) {
        this.defaultPhoto = defaultPhoto;
    }

    public List<AthleteHasSocialNetwork> getSocialNetworks() {
        return socialNetworks;
    }

    public void setSocialNetworks(List<AthleteHasSocialNetwork> socialNetworks) {
        this.socialNetworks = socialNetworks;
    }

    public List<ClientHasAthlete> getClients() {
        return clients;
    }

    public void setClients(List<ClientHasAthlete> clients) {
        this.clients = clients;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_theme", idAthlete);
        response.put("name", name);
        /*if(!posts.isEmpty()){
            List<PostHasMedia> media = posts.get(posts.size() - 1).getMedia();
            if(!media.isEmpty()){
                response.put("default_photo", media.get(0).getLink());
            } else {
                response.put("default_photo", defaultPhoto);
            }
        } else {
            response.put("default_photo", defaultPhoto);
        }*/
        response.put("default_photo", defaultPhoto);
        if(socialNetworks != null && !socialNetworks.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(AthleteHasSocialNetwork ad : socialNetworks){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("social_networks", Json.toJson(apps));
        }
//        if(clients != null && !clients.isEmpty()){
//            ArrayList<ObjectNode> apps = new ArrayList<>();
//            for(ClientHasWoman ad : clients){
//                apps.add(ad.toJsonWithoutWoman());
//            }
//            response.put("clients", Json.toJson(apps));
//        }
        response.put("clients", clients == null?0:clients.size());
        response.put("posts", posts == null?0:posts.size());
        return response;
    }

    public ObjectNode toJsonWithLastPost() {
        ObjectNode response = Json.newObject();
        response.put("id_theme", idAthlete);
        response.put("name", name);
        if(!posts.isEmpty()){
            List<PostHasMedia> media = posts.get(posts.size() - 1).getMedia();
            if(!media.isEmpty()){
                response.put("default_photo", media.get(0).getLink());
            } else {
                response.put("default_photo", defaultPhoto);
            }
        } else {
            response.put("default_photo", defaultPhoto);
        }
        if(socialNetworks != null && !socialNetworks.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(AthleteHasSocialNetwork ad : socialNetworks){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("social_networks", Json.toJson(apps));
        }
        response.put("clients", clients == null?0:clients.size());
        response.put("posts", posts == null?0:posts.size());
        if(posts != null && !posts.isEmpty()){
            response.put("latest_post", posts.get(posts.size()-1).toJson());
        }

        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_theme", idAthlete);
        response.put("name", name);
        response.put("clients", clients == null?0:clients.size());
        response.put("posts", posts == null?0:posts.size());
        response.put("default_photo", defaultPhoto);
        if(socialNetworks != null && !socialNetworks.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(AthleteHasSocialNetwork ad : socialNetworks){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("social_networks", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithNetworks() {
        ObjectNode response = Json.newObject();
        response.put("id_theme", idAthlete);
        response.put("name", name);
        response.put("clients", clients == null?0:clients.size());
        response.put("posts", posts == null?0:posts.size());
        response.put("default_photo", defaultPhoto);
        if(socialNetworks != null && !socialNetworks.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(AthleteHasSocialNetwork ad : socialNetworks){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("social_networks", Json.toJson(apps));
        }

        return response;
    }

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        List<Athlete> themes = Athlete.finder.all();
        for(Athlete theme: themes) {
            options.put(theme.getIdAthlete().toString(), theme.getName());
        }
        return options;
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<Athlete> themes = Athlete.finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(Athlete theme : themes) {
            Tuple2<String, String> t = new Tuple2<>(theme.getIdAthlete().toString(), theme.getName());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> themesBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> themesList = themesBuffer.toList();
        return themesList;
    }

    /**
     * Return a page of athletes list
     *
     * @param page Page to display
     * @param pageSize Number of athletes per page
     * @param sortBy Women property used for sorting
     * @param order Sort order (either or asc or desc)
     * @param filter Filter applied on the name column
     */
    public static Page<Athlete> page(int page, int pageSize, String sortBy, String order, String filter) {
        return
                finder.where()
                        .ilike("name", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .findPagingList(pageSize)
                        .getPage(page);
    }
}
