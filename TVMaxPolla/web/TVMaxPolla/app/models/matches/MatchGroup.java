package models.matches;

import models.HecticusModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by chrirod on 3/27/14.
 */
@Entity
@Table(name="match_group")
public class MatchGroup extends HecticusModel{
    @Id
    private Integer idGroup;
    private Integer idPhase;
    private String name;
    private String originalName;
    
    public List<GameMatch> lstGameMatch;
   
    
    public MatchGroup(){
        //por defecto
    }

    public Integer getIdGroup() {
        return idGroup;
    }

    public void setIdGroup(Integer idGroup) {
        this.idGroup = idGroup;
    }

    public Integer getIdPhase() {
        return idPhase;
    }

    public void setIdPhase(Integer idPhase) {
        this.idPhase = idPhase;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    
    public List<GameMatch> getGameMatch() {
        return lstGameMatch;
    }

    public void setGameMatch(List<GameMatch> lstGameMatch) {
        this.lstGameMatch = lstGameMatch;
    }
    
    public static Model.Finder<Integer,MatchGroup> finder =
            new Model.Finder<Integer, MatchGroup>(Integer.class, MatchGroup.class);

    public ObjectNode toJson(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idGroup);
        tr.put("id_phase", idPhase);
        tr.put("name",name);
        return tr;
    }

    public ObjectNode toJsonSimple(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idGroup);
        tr.put("name",name);
        return tr;
    }

    public ObjectNode toJsonSimplePrediction(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idGroup);
        tr.put("name",originalName);
        return tr;
    }

    public static MatchGroup getGroup(int idGroup){
        return finder.where().eq("id_group", idGroup).findUnique();
    }

    public static List<MatchGroup> getGroupsWithIDs(ArrayList<Integer> idGroups){
        return finder.where().idIn(idGroups).findList();
    }

    public static List<MatchGroup> getGroupsOfPhase(int idPhase){
        return finder.where().eq("id_phase",idPhase).findList();
    }
}
