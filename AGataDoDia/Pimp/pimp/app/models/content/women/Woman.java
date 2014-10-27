package models.content.women;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.ClientHasDevices;
import models.clients.ClientHasWoman;
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
@Table(name="women")
public class Woman extends HecticusModel {
    @Id
    private Integer idWoman;
    @Constraints.Required
    private String name;

    @Constraints.Required
    private String defaultPhoto;

    @OneToMany(mappedBy="woman", cascade = CascadeType.ALL)
    private List<Post> posts;

    @OneToMany(mappedBy="woman", cascade = CascadeType.ALL)
    private List<WomanHasSocialNetwork> socialNetworks;

    @OneToMany(mappedBy="woman", cascade = CascadeType.ALL)
    private List<ClientHasWoman> clients;

    @OneToMany(mappedBy="woman", cascade = CascadeType.ALL)
    private List<WomanHasCategory> categories;

    public static Model.Finder<Integer, Woman> finder = new Model.Finder<Integer, Woman>(Integer.class, Woman.class);

    public Woman(String name) {
        this.name = name;
    }

    public void setIdWoman(Integer idWoman) {
        this.idWoman = idWoman;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getIdWoman() {
        return idWoman;
    }

    public String getDefaultPhoto() {
        return defaultPhoto;
    }

    public void setDefaultPhoto(String defaultPhoto) {
        this.defaultPhoto = defaultPhoto;
    }

    public List<WomanHasSocialNetwork> getSocialNetworks() {
        return socialNetworks;
    }

    public void setSocialNetworks(List<WomanHasSocialNetwork> socialNetworks) {
        this.socialNetworks = socialNetworks;
    }

    public List<WomanHasCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<WomanHasCategory> categories) {
        this.categories = categories;
    }

    public List<ClientHasWoman> getClients() {
        return clients;
    }

    public void setClients(List<ClientHasWoman> clients) {
        this.clients = clients;
    }

    public List<Post> getPosts() {
        return posts;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_woman", idWoman);
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
            for(WomanHasSocialNetwork ad : socialNetworks){
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
        if(categories != null && !categories.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(WomanHasCategory ad : categories){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("categories", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_woman", idWoman);
        response.put("name", name);
        response.put("clients", clients == null?0:clients.size());
        response.put("posts", posts == null?0:posts.size());
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
            for(WomanHasSocialNetwork ad : socialNetworks){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("social_networks", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithNetworks() {
        ObjectNode response = Json.newObject();
        response.put("id_woman", idWoman);
        response.put("name", name);
        response.put("clients", clients == null?0:clients.size());
        response.put("posts", posts == null?0:posts.size());
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
            for(WomanHasSocialNetwork ad : socialNetworks){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("social_networks", Json.toJson(apps));
        }
        //se le agrega tambien las categorias de una vez
        if(categories != null && !categories.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(WomanHasCategory ad : categories){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("categories", Json.toJson(apps));
        }
        return response;
    }

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        List<Woman> women = Woman.finder.all();
        for(Woman w: women) {
            options.put(w.getIdWoman().toString(), w.getName());
        }
        return options;
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<Woman> women = Woman.finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(Woman woman : women) {
            Tuple2<String, String> t = new Tuple2<>(woman.getIdWoman().toString(), woman.getName());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> womanBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> womanList = womanBuffer.toList();
        return womanList;
    }

    /**
     * Return a page of women list
     *
     * @param page Page to display
     * @param pageSize Number of women per page
     * @param sortBy Women property used for sorting
     * @param order Sort order (either or asc or desc)
     * @param filter Filter applied on the name column
     */
    public static Page<Woman> page(int page, int pageSize, String sortBy, String order, String filter) {
        return
                finder.where()
                        .ilike("name", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .findPagingList(pageSize)
                        .getPage(page);
    }
}
