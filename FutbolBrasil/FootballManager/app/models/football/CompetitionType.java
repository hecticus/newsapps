package models.football;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by sorcerer on 12/1/14.
 */
@Entity
@Table(name="competition_type")
public class CompetitionType extends HecticusModel {

    //constantes de type

    private static final int TYPE_TABLA = 0;
    private static final int TYPE_LLAVE = 1;

    //atributos
    @Id
    private Integer idCompType;
    private Integer status;
    private String name;
    private Integer type;
    private Long extId;

    private static Model.Finder<Long,CompetitionType> finder = new
            Model.Finder<Long, CompetitionType>(Long.class, CompetitionType.class);

    public CompetitionType(String name, Long extId) {
        this.status = status; //1
        this.name = name;
        this.type = TYPE_TABLA;
        this.extId = extId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getExtId() {
        return extId;
    }

    public void setExtId(Long extId) {
        this.extId = extId;
    }

    @Override
    public ObjectNode toJson() {
        return null;
    }

    public static CompetitionType getCompType(long extId){
        return finder.where().eq("ext_id",extId).findUnique();
    }

    public void validate(){
        CompetitionType tr = getCompType(this.extId);
        if (tr != null){
            this.idCompType = tr.idCompType;
            this.status = tr.status;
            this.name = tr.name;
            this.type = tr.type;
            this.extId = tr.extId;
        }else {
            this.save();
        }
    }
}
