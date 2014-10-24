package models.afpfutbol;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

/**
 * Created by karina on 5/20/14.
 */
@Entity
@Table(name="periods",
       uniqueConstraints = @UniqueConstraint(columnNames = {"name","short_name"}))
public class Period extends HecticusModel {
    @Id
    private Integer idPeriods;
    private String name;
    private String shortName;
    private Long extId;
    @OneToMany(mappedBy = "period")
    private List<GameMatchEvent> events;

    private static Model.Finder<Integer,Period> finder = new Model.Finder<Integer,Period>("afp_futbol",Integer.class,Period.class);
    public Period(){}

    public Integer getIdPeriods() {
        return idPeriods;
    }

    public void setIdPeriods(Integer idPeriods) {
        this.idPeriods = idPeriods;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public Long getExtId() {
        return extId;
    }

    public void setExtId(Long extId) {
        this.extId = extId;
    }

    public static Period findById(Integer id){
        return finder.byId(id);
    }

    public static Period findByShotName(String sn){
        return finder.where().eq("shortName",sn).findUnique();
    }

    @Override
    public ObjectNode toJson() {

        ObjectNode node = Json.newObject();
        node.put("id_periods",idPeriods);
        node.put("name",name);
        node.put("short_name",shortName);
        return node;
    }
}
