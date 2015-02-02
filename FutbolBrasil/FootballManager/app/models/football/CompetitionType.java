package models.football;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

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

    @OneToMany(mappedBy="type", cascade = CascadeType.ALL)
    private List<Competition> competitions;

    private static Model.Finder<Long,CompetitionType> finder = new Model.Finder<Long, CompetitionType>(Long.class, CompetitionType.class);

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

    public Integer getIdCompType() {
        return idCompType;
    }

    public void setIdCompType(Integer idCompType) {
        this.idCompType = idCompType;
    }

    public List<Competition> getCompetitions() {
        return competitions;
    }

    public void setCompetitions(List<Competition> competitions) {
        this.competitions = competitions;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode obj = Json.newObject();
        obj.put("id_competition_type",idCompType);
        obj.put("status",status);
        obj.put("name",name);
        obj.put("type", type);
        obj.put("ext_id", extId);
        return obj;
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

    public static List<CompetitionType> getAll(){
        return finder.all();
    }
}
