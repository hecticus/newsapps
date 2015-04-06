package mongo;


import models.events.Event;
import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Indexed;
import org.mongodb.morphia.annotations.Transient;
import org.mongodb.morphia.geo.Point;
import org.mongodb.morphia.geo.PointBuilder;
import org.mongodb.morphia.query.Query;
import org.mongodb.morphia.query.UpdateOperations;
import org.mongodb.morphia.utils.IndexDirection;

import java.util.List;

/**
 * Created by sorcerer on 3/25/15.
 */
public class Location {

    private static final String INDEX_NAME = "loc_2dsphere";
    //REMINDER: es 111.12 porque http://stackoverflow.com/questions/7926182/finding-geo-spatial-with-morphia-mongodb-using-java
    private static final double DISTANCE_FACTOR = 111.12;

    @Id
    private ObjectId id;

    private int idEvent;

    @Indexed(IndexDirection.GEO2DSPHERE)
    private Point loc;

    @Transient
    private Event event;

    public Location() {
    }

    public Location(int idEvent, Point loc) {
        this.idEvent = idEvent;
        this.loc = loc;

    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public Point getLoc() {
        return loc;
    }

    public void setLoc(Point loc) {
        this.loc = loc;
    }

    public Integer getIdEvent() {
        return idEvent;
    }

    public void setIdEvent(Integer idEvent) {
        this.idEvent = idEvent;
    }

    public Event getEvent(){
        if(event == null){
            event = Event.getByID(idEvent);
        }
        return event;
    }

    public void delete(){
        MorphiaObject.datastore.delete(this);
    }

    public Location update(Point point) {
        UpdateOperations<Location> updateOps = MorphiaObject.datastore.createUpdateOperations(Location.class).set("loc", point);
        Query<Location> filter = MorphiaObject.datastore.createQuery(Location.class).filter("id =", id);
        Location moded = MorphiaObject.datastore.findAndModify(filter, updateOps);
        return moded;
    }


    public static Location getLocation(int idEvent) {
        return MorphiaObject.datastore.createQuery(Location.class).filter("idEvent =", idEvent).get();
    }

    public static Location getLocation(ObjectId idLocation) {
        return MorphiaObject.datastore.createQuery(Location.class).filter("id =", idLocation).get();
    }

    public static List<Location> getNearEvents(double latitude, double longitude, double distance, int maxEvents){
        //REMINDER: se divide entre 111.12 porque http://stackoverflow.com/questions/7926182/finding-geo-spatial-with-morphia-mongodb-using-java
        return MorphiaObject.datastore.find(Location.class).hintIndex(INDEX_NAME).field("loc").near(latitude, longitude, distance/DISTANCE_FACTOR, true).limit(maxEvents).asList();
    }

    public static Location createLocation(int idEvent, double latitude, double longitude){
        PointBuilder p = new PointBuilder();
        p.latitude(latitude);
        p.longitude(longitude);
        Point build = p.build();
        Location location = new Location(idEvent, build);
        MorphiaObject.datastore.save(location);
        return location;
    }



}
