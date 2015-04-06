package models.content.posts;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.ClientHasCategory;
import models.events.EventHasCategory;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;
import scala.Tuple2;
import scala.collection.JavaConversions;
import scala.collection.mutable.Buffer;

import javax.persistence.*;
import java.util.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="categories")
public class Category extends HecticusModel {

    @Id
    private Integer idCategory;
    @Constraints.Required
    private String name;

    private Boolean followable;

    @OneToMany(mappedBy="category", cascade = CascadeType.ALL)
    private List<PostHasCategory> posts;

    @OneToMany(mappedBy="category", cascade = CascadeType.ALL)
    private List<CategoryHasLocalization> localizations;

    @OneToMany(mappedBy="category", cascade = CascadeType.ALL)
    private List<ClientHasCategory> clients;

    @OneToMany(mappedBy="category", cascade = CascadeType.ALL)
    private List<EventHasCategory> events;

    private static Model.Finder<Integer, Category> finder = new Model.Finder<Integer, Category>(Integer.class, Category.class);

    public Category(String name) {
        this.name = name;
    }

    public Integer getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Integer idCategory) {
        this.idCategory = idCategory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<PostHasCategory> getPosts() {
        return posts;
    }

    public void setPosts(List<PostHasCategory> posts) {
        this.posts = posts;
    }

    public List<CategoryHasLocalization> getLocalizations() {
        return localizations;
    }

    public void setLocalizations(List<CategoryHasLocalization> localizations) {
        this.localizations = localizations;
    }

    public Boolean getFollowable() {
        return followable;
    }

    public void setFollowable(Boolean followable) {
        this.followable = followable;
    }

    public List<ClientHasCategory> getClients() {
        return clients;
    }

    public void setClients(List<ClientHasCategory> clients) {
        this.clients = clients;
    }

    public List<EventHasCategory> getEvents() {
        return events;
    }

    public void setEvents(List<EventHasCategory> events) {
        this.events = events;
    }

    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_category", idCategory);
        response.put("name", name);
        response.put("followable", followable);
        if(posts != null && !posts.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(PostHasCategory ad : posts){
                apps.add(ad.toJson());
            }
            response.put("posts", Json.toJson(apps));
        }

        if(localizations != null && !localizations.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(CategoryHasLocalization ad : localizations){
                apps.add(ad.toJson());
            }
            response.put("localizations", Json.toJson(apps));
        }

        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_category", idCategory);
        response.put("name", name);
        response.put("followable", followable);
        return response;
    }

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        List<Category> categories = finder.where().findList();
        for(Category c: categories) {
            options.put(c.getIdCategory().toString(), c.getName());
        }
        return options;
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<Category> categories = Category.finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(Category category : categories) {
            Tuple2<String, String> t = new Tuple2<>(category.getIdCategory().toString(), category.getName());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> sportBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> sportList = sportBuffer.toList();
        return sportList;
    }

    public static Page<Category> page(int page, int pageSize, String sortBy, String order, String filter, boolean followable) {
        return finder.where().ilike("name", "%" + filter + "%").eq("followable", followable).orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
    }

    //Finder Operations

    public static Category getByID(int id){
        return finder.byId(id);
    }

    public static Iterator<Category> getPage(int pageSize, int page){
        Iterator<Category> iterator = null;
        if(pageSize == 0){
            iterator = finder.all().iterator();
        }else{
            iterator = finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
        }
        return  iterator;
    }


}
