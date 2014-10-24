package models.afpfutbol;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

/**
 * Created by karina on 5/13/14.
 */
@Entity
@Table(name="teams")
public class Team extends HecticusModel {

    @Id
    private Long idTeams;
    @Constraints.Required
    private String name;
    @ManyToOne
    @JoinColumn(name = "id_countries")
    private Countries country;
    @Constraints.Required
    private Long extId;

    private static  Model.Finder<Long,Team> finder = new Model.Finder<Long,Team>("afp_futbol",Long.class,Team.class);

    public Long getIdTeams() {
        return idTeams;
    }

    public void setIdTeams(Long idTeams) {
        this.idTeams = idTeams;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Countries getCountry() {
        return country;
    }

    public void setCountry(Countries country) {
        this.country = country;
    }

    public Long getExtId() {
        return extId;
    }

    public void setExtId(Long extId) {
        this.extId = extId;
    }

    public static  List<Team> getList(){
        return finder.all();
    }

    public static Team findById(Long id){
        return finder.byId(id);
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode obj = Json.newObject();
        obj.put("id_teams",idTeams);
        obj.put("name",name);
        obj.put("ext_id",extId);
        obj.put("country",country.toJson());

        return obj;
    }
}
