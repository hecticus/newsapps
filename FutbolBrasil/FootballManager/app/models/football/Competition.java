package models.football;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

/**
 * Created by karina on 5/13/14.
 */
@Entity
@Table(name="competitions")
public class Competition  extends HecticusModel {
    @Id
    private Long idCompetitions;
    @Constraints.Required
    private String name;
    @Constraints.Required
    private Long extId;

    //folderName
    //folderLocation

    private Integer idApp;
    private Integer status;

    @OneToMany(mappedBy="comp")
    public List<Phase> phases;

    public Competition(String name, Long extId, Integer idApp) {
        this.name = name;
        this.extId = extId;
        this.idApp = idApp;
        this.status = 0;
    }

    private static Model.Finder<Long,Competition> finder = new
            Model.Finder<Long, Competition>(Long.class, Competition.class);

    public Long getIdCompetitions() {
        return idCompetitions;
    }

    public void setIdCompetitions(Long idCompetitions) {
        this.idCompetitions = idCompetitions;
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

    public void setExtId(Long extId) {
        this.extId = extId;
    }

    public Integer getIdApp() {
        return idApp;
    }

    public void setIdApp(Integer idApp) {
        this.idApp = idApp;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public static Competition findById(Long id){
        return finder.byId(id);
    }

    public static List<Competition> getCompetitionsByApp(int idApp){
        return finder.where().eq("id_app", idApp).findList();
    }

    public static Competition findByExtId(long id){
        return finder.where().eq("ext_id", id).findUnique();
    }

    public static Competition findByCompExt(int idApp, long extId ){
        return finder.where().eq("id_app", idApp).eq("ext_id", extId).findUnique();
    }

    public void validateCompetition(){
        //check if exist
        Competition fromDb = findByCompExt(this.idApp, this.extId);
        if ( fromDb != null){
            //existe
            this.name = fromDb.name;
            this.extId = fromDb.extId;
            this.status = fromDb.status;
            this.idApp = fromDb.idApp;
            this.idCompetitions = fromDb.idCompetitions;
        }else {
            //insertar
            this.save();
        }
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode obj = Json.newObject();
        obj.put("id_competitions",idCompetitions);
        obj.put("name",name);
        obj.put("ext_id",extId);
        return obj;
    }
}
