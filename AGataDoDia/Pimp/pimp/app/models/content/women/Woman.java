package models.content.women;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.ClientHasDevices;
import models.clients.ClientHasWoman;
import models.content.posts.Post;
import models.content.posts.PostHasMedia;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

}
