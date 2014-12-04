package models.content.themes;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.ClientHasTheme;
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
@Table(name="themes")
public class Theme extends HecticusModel {
    @Id
    private Integer idTheme;
    @Constraints.Required
    private String name;

    @Constraints.Required
    private String defaultPhoto;

    @OneToMany(mappedBy="theme", cascade = CascadeType.ALL)
    private List<Post> posts;

    @OneToMany(mappedBy="theme", cascade = CascadeType.ALL)
    private List<ThemeHasSocialNetwork> socialNetworks;

    @OneToMany(mappedBy="theme", cascade = CascadeType.ALL)
    private List<ClientHasTheme> clients;

    @OneToMany(mappedBy="theme", cascade = CascadeType.ALL)
    private List<ThemeHasCategory> categories;

    public static Model.Finder<Integer, Theme> finder = new Model.Finder<Integer, Theme>(Integer.class, Theme.class);

    public Theme(String name) {
        this.name = name;
    }

    public void setIdTheme(Integer idTheme) {
        this.idTheme = idTheme;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getIdTheme() {
        return idTheme;
    }

    public String getDefaultPhoto() {
        return defaultPhoto;
    }

    public void setDefaultPhoto(String defaultPhoto) {
        this.defaultPhoto = defaultPhoto;
    }

    public List<ThemeHasSocialNetwork> getSocialNetworks() {
        return socialNetworks;
    }

    public void setSocialNetworks(List<ThemeHasSocialNetwork> socialNetworks) {
        this.socialNetworks = socialNetworks;
    }

    public List<ThemeHasCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<ThemeHasCategory> categories) {
        this.categories = categories;
    }

    public List<ClientHasTheme> getClients() {
        return clients;
    }

    public void setClients(List<ClientHasTheme> clients) {
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
        response.put("id_theme", idTheme);
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
            for(ThemeHasSocialNetwork ad : socialNetworks){
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
            for(ThemeHasCategory ad : categories){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("categories", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithLastPost() {
        ObjectNode response = Json.newObject();
        response.put("id_theme", idTheme);
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
            for(ThemeHasSocialNetwork ad : socialNetworks){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("social_networks", Json.toJson(apps));
        }
        response.put("clients", clients == null?0:clients.size());
        response.put("posts", posts == null?0:posts.size());
        if(posts != null && !posts.isEmpty()){
            response.put("latest_post", posts.get(posts.size()-1).toJson());
        }
        if(categories != null && !categories.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(ThemeHasCategory ad : categories){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("categories", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_theme", idTheme);
        response.put("name", name);
        response.put("clients", clients == null?0:clients.size());
        response.put("posts", posts == null?0:posts.size());
        response.put("default_photo", defaultPhoto);
        if(socialNetworks != null && !socialNetworks.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(ThemeHasSocialNetwork ad : socialNetworks){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("social_networks", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithNetworks() {
        ObjectNode response = Json.newObject();
        response.put("id_theme", idTheme);
        response.put("name", name);
        response.put("clients", clients == null?0:clients.size());
        response.put("posts", posts == null?0:posts.size());
        response.put("default_photo", defaultPhoto);
        if(socialNetworks != null && !socialNetworks.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(ThemeHasSocialNetwork ad : socialNetworks){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("social_networks", Json.toJson(apps));
        }
        //se le agrega tambien las categorias de una vez
        if(categories != null && !categories.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(ThemeHasCategory ad : categories){
                apps.add(ad.toJsonWithoutWoman());
            }
            response.put("categories", Json.toJson(apps));
        }
        return response;
    }

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        List<Theme> themes = Theme.finder.all();
        for(Theme theme: themes) {
            options.put(theme.getIdTheme().toString(), theme.getName());
        }
        return options;
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<Theme> themes = Theme.finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(Theme theme : themes) {
            Tuple2<String, String> t = new Tuple2<>(theme.getIdTheme().toString(), theme.getName());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> themesBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> themesList = themesBuffer.toList();
        return themesList;
    }

    /**
     * Return a page of themes list
     *
     * @param page Page to display
     * @param pageSize Number of themes per page
     * @param sortBy Women property used for sorting
     * @param order Sort order (either or asc or desc)
     * @param filter Filter applied on the name column
     */
    public static Page<Theme> page(int page, int pageSize, String sortBy, String order, String filter) {
        return
                finder.where()
                        .ilike("name", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .findPagingList(pageSize)
                        .getPage(page);
    }
}
