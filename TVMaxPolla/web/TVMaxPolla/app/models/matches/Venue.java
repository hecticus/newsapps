package models.matches;

import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by chrirod on 3/27/14.
 */
@Entity
@Table(name="venue")
public class Venue {
    @Id
    private Integer idVenue;
    private String name;

    public Venue(){
        //por defecto
    }

    public static Model.Finder<Integer,Venue> finder =
            new Model.Finder<Integer, Venue>(Integer.class, Venue.class);

    public ObjectNode toJson(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idVenue);
        tr.put("name",name);
        return tr;
    }

    public static Venue getVenue(long idVenue){
        return finder.where().eq("id_venue", idVenue).findUnique();
    }
}
