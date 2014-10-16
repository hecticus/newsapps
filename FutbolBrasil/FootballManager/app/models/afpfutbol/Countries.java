package models.afpfutbol;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

/**
 * Created by karina on 5/13/14.
 */
@Entity
public class Countries extends HecticusModel {

    @Id
    private Long idCountries;
    @Constraints.Required
    private String name;
    @Constraints.Required
    private Long extId;
    @OneToMany(mappedBy = "country")
    private List<Venue> venues;

    private static Model.Finder<Long,Countries> finder = new Model.Finder<Long,Countries>("afp_futbol",Long.class,Countries.class);

    public Long getIdCountries() {
        return idCountries;
    }

    public void setIdCountries(Long idCountries) {
        this.idCountries = idCountries;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getExtId() {
        return extId;
    }

    public void setExtId(Long extId){
        this.extId = extId;
    }

    public List<Venue> getVenues() {
        return venues;
    }

    public void setVenues(List<Venue> venues) {
        this.venues = venues;
    }

    public static  List<Countries> all(){
        return finder.all();
    }

    public static Countries findById(Long id){
        return finder.byId(id);
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode obj = Json.newObject();
        obj.put("id_countries",idCountries);
        obj.put("name",name);
        obj.put("ext_id",extId);

        return obj;
    }
}
