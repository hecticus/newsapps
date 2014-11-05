package models.football;

import com.avaje.ebean.ExpressionList;
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
@Table(name="phases")
public class Phase extends HecticusModel {

    @Id
    private Long idPhases;
    @ManyToOne
    @JoinColumn(name = "id_competitions")
    private Competition comp;
    @Constraints.Required
    private String globalName;
    @Constraints.Required
    private String name;
    @Constraints.Required
    @Constraints.MaxLength(8)
    private String startDate;
    @Constraints.Required
    @Constraints.MaxLength(8)
    private String endDate;
    private Long extId;

    @OneToMany(mappedBy = "phase")
    private List<GameMatch> matches;

    private static Model.Finder<Long,Phase> finder = new Model.Finder<Long,Phase>(Long.class,Phase.class);

    public Long getIdPhases() {
        return idPhases;
    }

    public void setIdPhases(Long idPhases) {
        this.idPhases = idPhases;
    }

    public Competition getComp() {
        return comp;
    }

    public void setComp(Competition comp) {
        this.comp = comp;
    }

    public String getGlobalName() {
        return globalName;
    }

    public void setGlobalName(String globalName) {
        this.globalName = globalName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Long getExtId() {
        return extId;
    }

    public void setExtId(Long extId) {
        this.extId = extId;
    }

    public List<GameMatch> getMatches() {
        return matches;
    }

    public void setMatches(List<GameMatch> matches) {
        this.matches = matches;
    }

    public static Phase findById(Long id){
        return finder.byId(id);
    }

    public static Phase findByExtId(Long idExt){
        return finder.where().eq("extId",idExt).findUnique();
    }

    public static List<Phase> getList(Long idCompetition,String sd, String end){
        //System.out.println("Phase idCompetition:"+idCompetition);
        //if(sd.isEmpty() && end.isEmpty()) return finder.all();
        ExpressionList<Phase> phases = finder.where().eq("id_competitions",idCompetition);
        if(!sd.isEmpty()){
            if(sd.contains("-")){
                String[] range = sd.split("-");
                phases.ge("startDate", range[0]);
                phases.le("startDate", range[1]);
            }else{
                phases.eq("startDate", sd);
            }
        }

        if(!end.isEmpty()){
            if(end.contains("-")){
                String[] range = end.split("-");
                phases.ge("endDate", range[0]);
                phases.le("endDate", range[1]);
            }else{
                phases.eq("endDate", end);
            }
        }

        return phases.findList();
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode obj = Json.newObject();
        obj.put("id_phases",idPhases);
        obj.put("global_name",globalName);
        obj.put("name",name);
        obj.put("start_date",startDate);
        obj.put("end_date",endDate);
        obj.put("ext_id",extId);
        return obj;
    }
}
