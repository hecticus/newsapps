package models.football;

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

    @OneToMany(mappedBy="team")
    private List<TeamHasCompetition> competitions;

    private static  Model.Finder<Long,Team> finder = new Model.Finder<Long,Team>(Long.class,Team.class);

    public Team(String name, Long extId, Countries country) {
        this.name = name;
        this.extId = extId;
        this.country = country;
    }

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

    public List<TeamHasCompetition> getCompetitions() {
        return competitions;
    }

    public void setCompetitions(List<TeamHasCompetition> competitions) {
        this.competitions = competitions;
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

    public ObjectNode toJsonSimple() {
        ObjectNode obj = Json.newObject();
        obj.put("id_teams",idTeams);
        obj.put("name",name);
        return obj;
    }

    public static Team findByExtId(long extId){
        return finder.where().eq("ext_id", extId).findUnique();
    }

    /**
     * funcion para validar los equipos
     */
    public void validateTeam(){
        Team toValidate = findByExtId(this.extId);
        if (toValidate != null){
            //exist
            this.idTeams = toValidate.idTeams;
            this.name = toValidate.name;
            this.extId = toValidate.extId;
            this.country = toValidate.country;
        }else {
            //insert in bd
            this.save();
        }
    }
}
