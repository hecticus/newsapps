package models.events;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceDelete;
import models.HecticusModel;
import models.basic.Config;
import models.basic.Country;
import mongo.Location;
import org.bson.types.ObjectId;
import org.mongodb.morphia.geo.Point;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by sorcerer on 3/25/15.
 */
@Entity
@Table(name="events")
public class Event extends HecticusModel {

    @Id
    private Integer idEvent;

    @OneToOne
    @JoinColumn(name = "id_country")
    private Country country;

    //status
    private Integer status;

    //date hour
    @Constraints.Required
    @Constraints.MaxLength(value = 14)
    private String date;

    private String image;

    private String objectId;

    @Transient
    private Location location;

    @OneToMany(mappedBy="event", cascade = CascadeType.ALL)
    private List<EventHasCategory> categories;

    @OneToMany(mappedBy="event", cascade = CascadeType.ALL)
    private List<EventHasLocalization> localizations;

    private static Model.Finder<Integer, Event> finder = new Model.Finder<Integer, Event>(Integer.class, Event.class);

    public Integer getIdEvent() {
        return idEvent;
    }

    public void setIdEvent(Integer idEvent) {
        this.idEvent = idEvent;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<EventHasCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<EventHasCategory> categories) {
        this.categories = categories;
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<EventHasLocalization> getLocalizations() {
        return localizations;
    }

    public void setLocalizations(List<EventHasLocalization> localizations) {
        this.localizations = localizations;
    }

    public Location getLocation() {
        if(location == null && objectId != null){
            ObjectId ob = new ObjectId(objectId);
            location = Location.getLocation(ob);
        }
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }


    public void deleteImage(){
        ArrayList<String> files = new ArrayList<>();
        System.out.println(this.image);
        String link = this.getImage();
        link = link.substring(link.lastIndexOf("/") - 1);
        files.add(link);
        if(!files.isEmpty()){
            String containerName = Config.getString("cdn-container");
            String username = Config.getString("rackspace-username");
            String apiKey = Config.getString("rackspace-apiKey");
            String provider = Config.getString("rackspace-provider");
            RackspaceDelete rackspaceDelete = new RackspaceDelete(username, apiKey, provider);
            rackspaceDelete.deleteObjectsFromContainer(containerName, files);
        }
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_event", idEvent);
        response.put("country", country.toJsonSimple());
        response.put("status", status);
        response.put("date", date);
        response.put("image", image);
        response.put("object_id", objectId);
        Point point = this.getLocation().getLoc();
        ObjectNode locationJson = Json.newObject();
        locationJson.put("latitude", point.getLatitude());
        locationJson.put("longitude", point.getLongitude());
        response.put("location", locationJson);
        if(categories != null && !categories.isEmpty()){
            ArrayList<ObjectNode> cats = new ArrayList<>();
            for(EventHasCategory eventHasCategory : categories){
                cats.add(eventHasCategory.getCategory().toJsonWithoutRelations());
            }
            response.put("categories", Json.toJson(cats));
        }

        if(localizations != null && !localizations.isEmpty()){
            ArrayList<ObjectNode> cats = new ArrayList<>();
            for(EventHasLocalization eventHasLocalization : localizations){
                cats.add(eventHasLocalization.toJsonWithoutEvent());
            }
            response.put("localizations", Json.toJson(cats));
        }

        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_event", idEvent);
        return response;
    }

    //Finder Operations

    public static Event getByID(int id){
        return finder.byId(id);
    }

    public static Iterator<Event> getPage(int pageSize, int page){
        Iterator<Event> iterator = null;
        if(pageSize == 0){
            iterator = finder.all().iterator();
        }else{
            iterator = finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
        }
        return  iterator;
    }

    public static Page<Event> page(int page, int pageSize, String sortBy, String order, String filter) {
        return finder.where()/*.ilike("name", "%" + filter + "%")*/.orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
    }

    @Override
    public void delete() {
//        deleteImage();
        getLocation();
        this.location.delete();
        super.delete();
    }
}
