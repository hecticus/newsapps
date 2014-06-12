package models.matches;

import models.HecticusModel;

import org.codehaus.jackson.node.ObjectNode;

import play.db.ebean.Model;
import play.libs.Json;
import utils.Utils;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by chrirod on 3/27/14.
 */
@Entity
@Table(name="phase")
public class Phase extends HecticusModel {
    @Id
    private Integer idPhase;
    private String name;
    private Long dateStart;
    private Long dateEnd;

    public List<MatchGroup> lstMatchGroup;
    
    public Phase(){
        //por defecto
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

    public Long getDateStart() {
        return dateStart;
    }

    public void setDateStart(Long dateStart) {
        this.dateStart = dateStart;
    }

    public Long getDateEnd() {
        return dateEnd;
    }

    public void setDateEnd(Long dateEnd) {
        this.dateEnd = dateEnd;
    }

    public List<MatchGroup> getMatchGroup() {
        return lstMatchGroup;
    }

    public void setMatchGroup(List<MatchGroup> lstMatchGroup) {
        this.lstMatchGroup = lstMatchGroup;
    }
    
    
    public static Model.Finder<Integer,Phase> finder =
            new Model.Finder<Integer, Phase>(Integer.class, Phase.class);

    public ObjectNode toJson(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idPhase);
        tr.put("name",name);
        tr.put("date_start",dateStart);
        tr.put("date_end",dateEnd);
        return tr;
    }

    public static Phase getPhase(long idPhase){
        return finder.where().eq("id_phase", idPhase).findUnique();
    }

    public static Phase getCurrentActivePhase(){
        long currentTime = Utils.currentTimeStamp(Utils.APP_TIMEZONE);
        return finder.where().gt("date_end", currentTime).orderBy("date_end").setMaxRows(1).findUnique();
    }

    public static Phase getRunningPhase(){
        long currentTime = Utils.currentTimeStamp(Utils.APP_TIMEZONE);
        return finder.where().ge("date_end", currentTime).le("date_start", currentTime).orderBy("date_end").setMaxRows(1).findUnique();
    }

    public static List<Phase> getAllActivePhases(){
        long currentTime = Utils.currentTimeStamp(Utils.APP_TIMEZONE);
        return finder.where().gt("date_start", currentTime).orderBy("date_start").findList();
    }

    public static List<Phase> getAllPhases(){
        return finder.all();
    }
}
