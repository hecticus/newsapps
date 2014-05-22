package models.matches;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import models.HecticusModel;

import org.codehaus.jackson.node.ObjectNode;

import play.db.ebean.Model;
import play.libs.Json;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chrirod on 3/27/14.
 */
@Entity
@Table(name="team")
public class Team extends HecticusModel{

    @Id
    private Integer idTeam;
    private String name;
    private String shortname;
    private String flagFile;
    private Long afpId;

    public Team(){
        //por defecto
    }

    public Integer getIdTeam() {
        return idTeam;
    }

    public void setIdTeam(Integer idTeam) {
        this.idTeam = idTeam;
    }    

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public String getShortName() {
        return shortname;
    }

    public void setShortName(String shortname) {
        this.shortname = shortname;
    }
    
    public String getFlagFile() {
        return flagFile;
    }

    public void setFlagFile(String flagFile) {
        this.flagFile = flagFile;
    }

    public Long getAfp_id() {
        return afpId;
    }

    public void setAfp_id(Long afp_id) {
        this.afpId = afp_id;
    }

    public static Model.Finder<Integer,Team> finder =
            new Model.Finder<Integer, Team>(Integer.class, Team.class);

    public ObjectNode toJson(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idTeam);
        tr.put("name",name);
        tr.put("shortName",shortname);
        tr.put("flag_file",flagFile);
        tr.put("afp_id",afpId);
        return tr;
    }

    public static Team getTeam(int idTeam){
        return finder.where().eq("id_team", idTeam).findUnique();
    }

    public static List<Team> getAllTeams(){
        return finder.all();
    }
}
